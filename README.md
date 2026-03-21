# LeadFlow AI

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
