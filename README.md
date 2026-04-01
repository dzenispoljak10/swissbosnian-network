# Swiss Bosnian Network — Web-App

Next.js 16 App-Router Web-App mit zweisprachigem Interface (DE/BS), Admin-Dashboard, Blog, Newsletter und Stripe-Zahlungen.

## Setup (Localhost)

### 1. Dependencies installieren
```bash
npm install
```

### 2. Datenbank einrichten

**Lokal (SQLite — kein Setup nötig):**
```bash
DATABASE_URL="file:./dev.db"  # bereits in .env gesetzt
npm run db:push
npm run db:seed
```

**Produktion (PostgreSQL / Supabase):**
1. Erstelle ein Projekt auf [supabase.com](https://supabase.com)
2. Gehe zu: Settings → Database → Connection string → URI
3. Ersetze in `.env.local`: `DATABASE_URL="postgresql://..."`
4. Ändere in `prisma/schema.prisma`: `provider = "postgresql"`

### 3. Umgebungsvariablen (.env.local)

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generiere-mit-openssl-rand-base64-32"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_GOENNER="price_..."
STRIPE_PRICE_PARTNER="price_..."
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="newsletter@deine-domain.ch"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 4. Dev-Server starten
```bash
npm run dev
# → http://localhost:3000 (leitet zu /de weiter)
```

## Admin-Login

- URL: http://localhost:3000/admin/login
- E-Mail: `dzenispoljak@gmail.com`
- Passwort: `Bosna123!`

## Stripe Setup

1. Produkte in [Stripe Dashboard](https://dashboard.stripe.com) erstellen:
   - "Gönnerschaft" — CHF 50/Jahr → Price-ID → `STRIPE_PRICE_GOENNER`
   - "Partnerschaft" — CHF 500/Jahr → Price-ID → `STRIPE_PRICE_PARTNER`
2. Webhook: `https://domain.ch/api/stripe/webhook`, Event: `checkout.session.completed`

## Deployment (Vercel)

```bash
npm i -g vercel && vercel
# Alle Env-Vars in Vercel Dashboard setzen
```

**Datenbank:** [Supabase](https://supabase.com) oder [Neon](https://neon.tech) (beide mit Gratis-Tier)

## Nützliche Befehle

```bash
npm run dev          # Dev-Server
npm run build        # Produktion bauen
npm run db:push      # Schema in DB pushen
npm run db:seed      # Test-Daten einfügen
npm run db:studio    # Prisma Studio (DB-Browser)
```

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Prisma 5** (SQLite lokal / PostgreSQL Produktion)
- **NextAuth v5** (JWT)
- **next-intl 4** (DE/BS)
- **Tiptap** (Rich-Text Editor)
- **Stripe** + **Resend** + **Framer Motion**
