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

## Implemented (2026-07-13, update 1)
- Admin Command Center at /admin: admin-only JWT login (no public registration, bcrypt hashing, 12h Bearer tokens, 5-attempt/15-min brute-force lockout), dashboard with stats cards (total/quiz/contact/unread), demand-by-service gold bar chart, filters (all/quiz/contact), live search, unread-only toggle, expandable lead details (message + all 10 quiz answers), mark read/unread, delete, logout. Admin credentials seeded from env.
- Scroll experience rework: tighter section rhythm (py-16/24), animated gold hairline dividers with diamond markers between sections, parallax gold glow field drifting across the matte-black background while scrolling.
- (Base build, 2026-07-13) Kinetic hero with masked line reveal + parallax, bilingual SQ/EN, services bento, manifesto About, contact form + owner email, 10-question Choose Your Vanguard quiz with lead email.

## Backlog
- P0: Set real OWNER_EMAIL (currently test address delivered@resend.dev)
- P0: Real contact details (phone/email/address) — currently placeholder content
- P1: Change admin password for production; consider forced password change flow
- P1: Favicon + social OG image with brand mark
- P2: Google Maps embed in Contact section
- P2: Testimonials / client logos strip
- P2: Export leads to CSV from admin panel
