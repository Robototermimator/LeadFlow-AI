# LeadFlow AI

LeadFlow AI is a complete, sellable AI Lead Generation web app for freelancers, agencies, consultants, and small businesses.

It includes:
- Register/login/logout authentication
- Lead generation from niche/location/offer inputs
- AI mode (OpenAI) + full demo mode (no API key needed)
- Lead scoring and personalized outreach copy
- Dashboard, leads page, run history, billing, settings
- CSV export and contacted lead tracking
- Plan gating (Free / Pro / Agency)

## Prerequisites
- Node.js 18+ (or newer)
- npm

No Docker, no WSL, no migrations, no extra tooling.

## Local Install & Run (Windows-friendly)
1. Open terminal in project folder.
2. Run:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`.
4. Run:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`.

## Demo Mode
If `OPENAI_API_KEY` is empty, app runs in **Demo Mode** automatically.

Demo Mode still:
- Generates realistic mock leads
- Generates outreach subject + email + follow-up
- Saves runs and leads to SQLite
- Supports export/filter/sort/contacted toggles

## Environment Variables
Only these are required:
- `PORT` (default 3000)
- `SESSION_SECRET` (required for secure sessions)
- `OPENAI_API_KEY` (optional; leave blank for demo mode)

## Data Storage
- SQLite database auto-creates at: `data/leadflow.db`
- Tables auto-initialize on startup
- No migration commands needed

## Plan Limits
- Free: 3 runs/month, 20 leads/run
- Pro: 50 runs/month, 200 leads/run
- Agency: 300 runs/month, 1000 leads/run

Change plan in **Billing** page instantly (payment placeholder buttons included for future integration).

## Create Demo Account
1. Open `/register`
2. Create account
3. Generate leads from `/app/generate`

## Manual Plan Testing
To test limits fast:
1. Open **Billing** page
2. Switch between Free / Pro / Agency
3. Generate lead runs and verify limits in Dashboard + Generate page validation

## Render Deployment (Single Web Service)
Create a new **Web Service** on Render with this repo.

Use:
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Set Environment Variables in Render:
- `PORT` = `10000` (or leave default; Render injects port)
- `SESSION_SECRET` = long random value
- `OPENAI_API_KEY` = optional

After deploy, open your Render URL and register a user.

## Troubleshooting
### `npm install` fails
- Update Node.js to latest LTS
- Clear npm cache: `npm cache clean --force`
- Retry install

### App starts but login/session fails
- Ensure `SESSION_SECRET` is set in `.env`
- Restart app after editing `.env`

### AI output not using OpenAI
- Confirm `OPENAI_API_KEY` is set correctly
- If key missing/invalid, app safely falls back to demo mode

### Port already in use
- Set another port in `.env`, e.g. `PORT=3001`

## Commercial Assets
See `/sales-assets` for:
- Gumroad product description
- Fiverr gig description
- Upwork proposal template
- Landing page sales copy
- Simple pricing copy
- Demo script
LeadFlow AI is a production-ready lead generation product that can be sold as:
1. SaaS Web App (Next.js)
2. CLI Tool (Gumroad)
3. API Product (developer integration)
4. Freelance Service System (Fiverr/Upwork)

## Tech Stack
- Next.js 15 (App Router)
- TypeScript + Tailwind CSS + shadcn-style UI components
- Supabase Auth
- PostgreSQL + Prisma ORM
- Stripe subscriptions
- OpenAI API + mock fallback

## Features
- Generate business leads from structured input
- Lead scoring
- Personalized outreach + follow-up generation
- Lead table, run history, CSV export
- REST endpoints: `/api/generate-leads`, `/api/runs`, `/api/leads`
- CLI command for local generation

## Pricing Plans
- **Free:** 10 leads/run, mock mode, CSV export
- **Pro:** 500 leads/month, AI personalization, API access
- **Agency:** 5000 leads/month, team workflows, priority support

## Setup
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## CLI Usage
```bash
node ./cli/leadflow.js generate --niche "dentists" --location "Cape Town" --service "website redesign" --count 20 --output leads.csv
```

## API Usage
### POST /api/generate-leads
```json
{
  "niche": "Dentists",
  "location": "Cape Town",
  "serviceOffer": "Website redesign",
  "businessType": "Dental clinic",
  "keywords": "seo, bookings",
  "tone": "professional",
  "count": 10
}
```

### GET /api/runs
Returns run history with lead counts.

### GET /api/leads
Returns latest generated leads.

## Selling Assets Included
- `content/gumroad-copy.md`
- `content/fiverr-gig.md`
- `content/upwork-proposal.md`
- `content/landing-page-copy.md`
- `content/freelance-service-kit.md`

## Suggested Product Packaging
- **Gumroad:** source code + CLI + templates
- **Fiverr/Upwork:** done-for-you lead delivery using templates
- **Website SaaS:** subscription plans via Stripe
- **AI marketplaces:** expose API workflow as single-agent offering
