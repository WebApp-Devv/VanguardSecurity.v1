from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import ipaddress
import logging
import uuid
import httpx
import bcrypt
import jwt
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ.get("OWNER_EMAIL")
logger = logging.getLogger(__name__)

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    try:
        async with httpx.AsyncClient(timeout=30) as http:
            resp = await http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


def _email_shell(title: str, rows_html: str) -> str:
    return (
        '<table role="presentation" width="100%" style="background:#0a0a0a;padding:32px 0">'
        '<tr><td align="center">'
        '<table role="presentation" width="560" style="background:#141414;border-radius:16px;'
        'border:1px solid #2a2a2a;font-family:Arial,sans-serif">'
        f'<tr><td style="padding:28px 32px;border-bottom:1px solid #2a2a2a">'
        f'<span style="color:#D4AF37;font-size:18px;font-weight:bold;letter-spacing:2px">VANGUARD SECURITY</span>'
        f'</td></tr>'
        f'<tr><td style="padding:28px 32px">'
        f'<p style="color:#ffffff;font-size:16px;margin:0 0 20px">{escape(title)}</p>'
        f'{rows_html}'
        '</td></tr>'
        f'<tr><td style="padding:20px 32px;border-top:1px solid #2a2a2a">'
        f'<p style="color:#777;font-size:12px;margin:0">Sent by {escape(EMAIL_FROM_NAME)}. '
        'We never ask for passwords or card details by email.</p>'
        '</td></tr></table></td></tr></table>'
    )


def _row(label: str, value: str) -> str:
    return (
        f'<p style="margin:0 0 12px"><span style="color:#D4AF37;font-size:12px;'
        f'text-transform:uppercase;letter-spacing:1px">{escape(label)}</span><br>'
        f'<span style="color:#e5e5e5;font-size:14px">{escape(value) if value else "-"}</span></p>'
    )


class ContactRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(default="", max_length=40)
    service: str = Field(default="", max_length=80)
    message: str = Field(default="", max_length=4000)


class QuizLeadRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(default="", max_length=40)
    recommended_service: str = Field(max_length=120)
    answers: List[str] = Field(default_factory=list, max_length=20)


JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
LOCKOUT_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_admin_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request):
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"id": payload["sub"], "role": "admin"}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Admin not found")
    return user


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


async def seed_admin():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "Vanguard Admin",
            "role": "admin",
            "password_hash": hash_password(admin_password),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )


@api_router.get("/")
async def root():
    return {"message": "Vanguard Security API"}


@api_router.post("/contact")
async def create_contact(payload: ContactRequest):
    doc = {
        "id": str(uuid.uuid4()),
        "type": "contact",
        **payload.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.leads.insert_one(doc)
    if OWNER_EMAIL:
        html = _email_shell(
            f"New contact request from {payload.name}",
            _row("Name", payload.name)
            + _row("Email", payload.email)
            + _row("Phone", payload.phone)
            + _row("Service of interest", payload.service)
            + _row("Message", payload.message),
        )
        await send_email(to=OWNER_EMAIL, subject=f"Vanguard Security - New contact: {payload.name}", html=html)
    return {"status": "success", "id": doc["id"]}


@api_router.post("/quiz-lead")
async def create_quiz_lead(payload: QuizLeadRequest):
    doc = {
        "id": str(uuid.uuid4()),
        "type": "quiz_lead",
        **payload.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.leads.insert_one(doc)
    if OWNER_EMAIL:
        answers_html = "".join(_row(f"Q{i + 1}", a) for i, a in enumerate(payload.answers[:10]))
        html = _email_shell(
            f"New quiz lead - recommended: {payload.recommended_service}",
            _row("Name", payload.name)
            + _row("Email", payload.email)
            + _row("Phone", payload.phone)
            + _row("Recommended service", payload.recommended_service)
            + answers_html,
        )
        await send_email(
            to=OWNER_EMAIL,
            subject=f"Vanguard Security - Quiz lead: {payload.recommended_service}",
            html=html,
        )
    return {"status": "success", "id": doc["id"]}


class BookingRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(default="", max_length=40)
    service: str = Field(min_length=1, max_length=120)


@api_router.post("/booking")
async def create_booking(payload: BookingRequest):
    doc = {
        "id": str(uuid.uuid4()),
        "type": "booking",
        **payload.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.leads.insert_one(doc)
    if OWNER_EMAIL:
        html = _email_shell(
            f"New booking request - {payload.service}",
            _row("Name", payload.name)
            + _row("Email", payload.email)
            + _row("Phone", payload.phone)
            + _row("Service booked", payload.service),
        )
        await send_email(
            to=OWNER_EMAIL,
            subject=f"Vanguard Security - Rezervim: {payload.service}",
            html=html,
        )
    return {"status": "success", "id": doc["id"]}


@api_router.post("/admin/login")
async def admin_login(payload: AdminLoginRequest, request: Request):
    email = payload.email.lower()
    client_ip = request.client.host if request.client else "unknown"
    identifier = f"{client_ip}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= LOCKOUT_ATTEMPTS:
        last = datetime.fromisoformat(attempt["last_attempt"])
        if datetime.now(timezone.utc) - last < timedelta(minutes=LOCKOUT_MINUTES):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})

    user = await db.users.find_one({"email": email, "role": "admin"})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid credentials")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_admin_token(user["id"], email)
    return {"token": token, "user": {"email": user["email"], "name": user.get("name", "Admin"), "role": "admin"}}


@api_router.get("/admin/me")
async def admin_me(admin=Depends(get_current_admin)):
    return admin


@api_router.get("/admin/leads")
async def admin_list_leads(
    type: Optional[str] = None,
    q: Optional[str] = None,
    unread: bool = False,
    admin=Depends(get_current_admin),
):
    query = {}
    if type in ("contact", "quiz_lead", "booking"):
        query["type"] = type
    if unread:
        query["read"] = {"$ne": True}
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"email": {"$regex": q, "$options": "i"}},
        ]
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"leads": leads, "total": len(leads)}


@api_router.get("/admin/leads/export")
async def admin_export_leads(admin=Depends(get_current_admin)):
    import csv
    import io

    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["ID", "Type", "Name", "Email", "Phone", "Service", "Message", "Answers", "Read", "Created At"])
    for lead in leads:
        writer.writerow([
            lead.get("id", ""),
            lead.get("type", ""),
            lead.get("name", ""),
            lead.get("email", ""),
            lead.get("phone", ""),
            lead.get("recommended_service") or lead.get("service", ""),
            lead.get("message", ""),
            " | ".join(lead.get("answers", [])),
            "yes" if lead.get("read") else "no",
            lead.get("created_at", ""),
        ])
    return Response(
        content="﻿" + buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=vanguard-leads.csv"},
    )


class LeadReadUpdate(BaseModel):
    read: bool


@api_router.patch("/admin/leads/{lead_id}")
async def admin_update_lead(lead_id: str, payload: LeadReadUpdate, admin=Depends(get_current_admin)):
    result = await db.leads.update_one({"id": lead_id}, {"$set": {"read": payload.read}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"status": "success"}


@api_router.delete("/admin/leads/{lead_id}")
async def admin_delete_lead(lead_id: str, admin=Depends(get_current_admin)):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"status": "success"}


@api_router.get("/admin/stats")
async def admin_stats(admin=Depends(get_current_admin)):
    leads = await db.leads.find({}, {"_id": 0}).to_list(5000)
    by_service = {}
    for lead in leads:
        service = lead.get("recommended_service") or lead.get("service")
        if service:
            by_service[service] = by_service.get(service, 0) + 1
    weekly_counts = {}
    for lead in leads:
        try:
            dt = datetime.fromisoformat(lead["created_at"])
            iso_year, iso_week, _ = dt.isocalendar()
            key = f"{iso_year}-W{iso_week:02d}"
            weekly_counts[key] = weekly_counts.get(key, 0) + 1
        except Exception:
            continue
    weeks_sorted = sorted(weekly_counts.keys())[-8:]
    weekly = [{"week": w, "count": weekly_counts[w]} for w in weeks_sorted]
    return {
        "total": len(leads),
        "quiz_leads": sum(1 for l in leads if l.get("type") == "quiz_lead"),
        "contact_requests": sum(1 for l in leads if l.get("type") == "contact"),
        "unread": sum(1 for l in leads if not l.get("read")),
        "by_service": by_service,
        "weekly": weekly,
    }


@app.on_event("startup")
async def startup():
    await seed_admin()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
