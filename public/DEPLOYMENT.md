# Calvin & Querida — Deployment & Hosting Procedure

## Stack Overview

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Hosting | Vercel (free tier) |
| Database | Supabase (PostgreSQL via `postgres` npm package) |
| Email | Nodemailer via Gmail SMTP |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animations | Motion (motion/react) |

---

## Environment Variables

These must be set in **Vercel Dashboard → Project → Settings → Environment Variables** before deploying.

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string | `postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres` |
| `GMAIL_USER` | Gmail address used to send RSVP notifications | `you@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not your account password) | `abcd efgh ijkl mnop` |
| `EMAIL_TO` | Email address that receives RSVP notifications | `you@gmail.com` |
| `ADMIN_TOKEN` | Secret token to access `GET /api/rsvp` | any long random string |

### Getting a Gmail App Password
1. Go to [myaccount.google.com](https://myaccount.google.com) → Security
2. Enable **2-Step Verification** (required)
3. Search for **App passwords** → create one → name it "RSVP"
4. Copy the 16-character password — use this as `GMAIL_APP_PASSWORD`

---

## Local Development

```bash
# Install dependencies
npm install

# Create local env file
cp .env.local.example .env.local
# Fill in all variables in .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

### First-time setup
1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import the GitHub repository
4. Set all environment variables (see table above)
5. Click **Deploy**

### Subsequent deployments
Every push to the `main` branch triggers an automatic deployment on Vercel.

To deploy manually:
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy to production
vercel --prod
```

---

## Region Configuration

The API function is pinned to **Cape Town (`cpt1`)** for low latency from Zimbabwe and Southern Africa. This is configured in `vercel.json`:

```json
{
  "functions": {
    "app/api/rsvp/route.ts": {
      "regions": ["cpt1"]
    }
  }
}
```

**Available Southern Africa regions:**
- `cpt1` — Cape Town (recommended for Zimbabwe)
- `jnb1` — Johannesburg

To change region: update `vercel.json` and redeploy.

---

## Keeping Functions Warm (Cold Start Prevention)

Vercel free tier serverless functions spin down after inactivity, causing slow first loads on mobile data. To prevent this:

1. Create a free account at [cron-job.org](https://cron-job.org)
2. Add a new cron job:
   - **URL:** `https://<your-app>.vercel.app/api/ping`
   - **Interval:** Every 5 minutes
3. Save — this pings the function every 5 minutes keeping it warm 24/7

The `/api/ping` endpoint runs on Vercel's **edge runtime** (zero cold start) and is separate from the main RSVP function.

---

## Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) → create a new project
2. Go to **SQL Editor** and run:

```sql
CREATE TABLE rsvps (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  attendance TEXT NOT NULL,
  partner_name TEXT,
  contact TEXT NOT NULL,
  dietary TEXT,
  song TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. Go to **Project Settings → Database → Connection string → URI**
4. Copy the connection string and set it as `DATABASE_URL` in Vercel

---

## Viewing RSVP Responses

Hit the admin endpoint with your token:

```
GET https://<your-app>.vercel.app/api/rsvp?token=<ADMIN_TOKEN>
```

Returns a JSON array of all RSVP submissions ordered by most recent first.

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/rsvp` | `POST` | Submit an RSVP |
| `/api/rsvp?token=<ADMIN_TOKEN>` | `GET` | View all RSVPs (protected) |
| `/api/ping` | `GET` | Health check / keep-alive (edge) |

---

## Build & Type Check

```bash
# Full production build
npm run build

# Lint
npm run lint
```

Build must pass with zero TypeScript errors before deploying.

---

## Known Issues & Fixes Applied

| Issue | Fix |
|---|---|
| PostCSS build error on Vercel | Added `tw-animate-css` to dependencies |
| `@/assets/` imports failing | Moved all static assets to `/public` and referenced by path string |
| `lib/utils.ts` missing | Created standard shadcn/ui utils file, installed `clsx` + `tailwind-merge` |
| `hooks/use-mobile.ts` missing | Created standard shadcn/ui hook |
| Resend domain not verified | Switched to Nodemailer + Gmail SMTP (no domain required) |
| `motion/react` not found | Installed `motion` package |
| Cold starts on mobile data | Pinned function region to `cpt1` (Cape Town) |
| Page failing to load first visit | Added `preload="none"` to video and audio elements |

---

## File Structure (Key Files)

```
├── app/
│   ├── api/
│   │   ├── ping/route.ts       # Edge keep-alive endpoint
│   │   └── rsvp/route.ts       # RSVP POST + admin GET
│   ├── globals.css             # Tailwind v4 + theme tokens
│   ├── layout.tsx              # Fonts + metadata
│   └── page.tsx                # Entry point
├── components/
│   ├── HomePage.tsx            # Main page content
│   ├── Envelope.tsx            # Opening envelope animation
│   ├── LoadingScreen.tsx       # Initial loading screen
│   ├── FloatingCupid.tsx       # Bouncing cupid animation
│   ├── RsvpForm.tsx            # RSVP form with validation
│   ├── Countdown.tsx           # Wedding countdown timer
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── db.ts                   # Supabase PostgreSQL queries
│   ├── email.ts                # Nodemailer Gmail email sender
│   └── utils.ts                # shadcn/ui cn() utility
├── hooks/
│   └── use-mobile.ts           # Mobile breakpoint hook
├── public/                     # Static assets (images, video, audio)
├── vercel.json                 # Region config
└── next.config.ts              # HSTS headers + Turbopack root
```

---

*Last updated: 2025 — Calvin & Querida Wedding Invitation App*
