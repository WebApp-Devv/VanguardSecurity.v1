# PRD — Vanguard Security

## Original Problem Statement (Albanian)
Website with a catchy, Apple-iOS-ad-style entry vibe, fused with liquid glass and rounded edges, for "Vanguard Security" — a private security company. Services: Physical Security of Objects/Businesses, Alarm & Camera Security, Close Protection, Event Security (football, boxing, basketball, handball matches, concerts, private business events), Patrol & Intervention. A "Choose Your Vanguard" button opens a ~10-question quiz (4 options each), followed by a loading sequence, then recommends the best-fit service. Brand colors: Gold + Matte Black.

## User Choices
- Bilingual: Albanian (SQ) + English (EN) with language toggle
- Quiz result: recommendation + "Kontakto Na" button + email notification to owner with client data
- Sections: Hero, Services, About Us, Contact
- No logo/assets provided — brand mark created from scratch (typographic "VANGUARD" + gold diamond)

## Architecture
- Frontend: React 19 + Tailwind + framer-motion (kinetic reveals, scroll animations) + lenis (smooth momentum scroll) + sonner toasts. i18n via React context (`/app/frontend/src/i18n.js`).
- Backend: FastAPI + MongoDB (motor). Routes (all `/api` prefixed):
  - `POST /api/contact` — contact form → save lead + email owner
  - `POST /api/quiz-lead` — quiz result + client details → save lead + email owner
- Email: Emergent managed Resend proxy (`EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME=Vanguard Security`, `OWNER_EMAIL` in backend/.env), with guardrail gate on every send.
- Quiz scoring: 10 questions × 4 options, weighted points across 5 services, highest score wins with deterministic tie-break order.

## Implemented (2026-07-13)
- Kinetic hero: masked line-by-line headline reveal, parallax golden-city background, gold radial glow, stats row, scroll indicator
- Sticky liquid-glass header with typographic brand mark, nav, SQ/EN toggle, CTA
- Slow editorial marquee (gold/black)
- Services bento grid: featured Event Security card (stadium/concert/sports focus) + 4 services, hover motion, scroll reveals
- About: numbered manifesto chapters (01 Discipline, 02 Vigilance, 03 Discretion), sticky title column
- Contact: manifesto + glass form (name/email/phone/service/message) → API + owner email
- "Choose Your Vanguard" full-screen quiz: intro → 10 questions (auto-advance, progress bar) → animated analysis loading → personalized result → lead capture form (emails owner) → "Contact Us" prefills contact form
- Footer with tagline/location
- Noise grain overlay, gold-on-matte-black palette, Clash Display + Manrope typography

## Implemented (2026-07-13, update 5)
- Event Security sub-pages: /services/event/:type for football, boxing, concert, business — each with its own photo, bilingual benefit bullets, and Rezervo booking form (service tagged "Event Security — <Type>"). Event types grid added to the Event Security page.
- Weekly stats chart in admin panel: backend computes ISO-week lead counts (last 8 weeks), dashboard renders animated gold bars in Albanian.

## Implemented (2026-07-13, update 4)
- CSV export: GET /api/admin/leads/export (admin-only, BOM for Excel UTF-8) + gold "Shkarko CSV (Excel)" button in the admin panel that downloads vanguard-leads.csv
- Admin panel forced fully Albanian (login + dashboard + dates in sq-AL), independent of the site's language toggle

## Implemented (2026-07-13, update 3)
- Dedicated page per service at /services/:id (event, close_protection, physical, surveillance, patrol): hero with service image, short & clear bilingual benefits list, and a "Rezervo" booking section with the same lead form as the quiz result (shared LeadForm component). New POST /api/booking endpoint saves type "booking" leads and emails the owner. Landing service cards are clickable and route to their pages. Admin panel: "REZERVIM" badge + Bookings/Rezervime filter tab. Language choice now persists across pages (localStorage).
- (Update 2) OWNER_EMAIL = vanguard.ks@outlook.com; "Na Kontakto" wording; scroll performance fix (141ms → 17.5ms avg frame).
- SQ wording: "Kontakto Na" corrected to "Na Kontakto"
- Scroll performance fix: removed scroll-linked parallax on blurred glow fields, reduced backdrop-blur radii (24/28px → 14/18px), large panels use blur-free glass-panel, tag chips de-blurred. Measured: 141ms → 17.5ms average frame time during scroll (steady state ~57fps).
- (Update 1) Admin Command Center at /admin: admin-only JWT login (no public registration, bcrypt hashing, 12h Bearer tokens, 5-attempt/15-min brute-force lockout), dashboard with stats cards (total/quiz/contact/unread), demand-by-service gold bar chart, filters (all/quiz/contact), live search, unread-only toggle, expandable lead details (message + all 10 quiz answers), mark read/unread, delete, logout. Admin credentials seeded from env.
- Scroll experience rework: tighter section rhythm (py-16/24), animated gold hairline dividers with diamond markers between sections, parallax gold glow field drifting across the matte-black background while scrolling.
- (Base build, 2026-07-13) Kinetic hero with masked line reveal + parallax, bilingual SQ/EN, services bento, manifesto About, contact form + owner email, 10-question Choose Your Vanguard quiz with lead email.

## Backlog
- P0: Real contact details (phone/email/address) — currently placeholder content
- P1: Change admin password for production; consider forced password change flow
- P1: Favicon + social OG image with brand mark
- P2: Google Maps embed in Contact section
- P2: Testimonials / client logos strip
- P2: Export leads to CSV from admin panel
