# WEducation.live — Antigravity

B2B SaaS admissions platform for higher-ed institutions. The corporate site
sells to university management; the actual admission experience is delivered
inside white-labeled WhatsApp conversations. See
`Antigravity_WEducation_Project_Specification.md` for the full spec — this
README covers running what's scaffolded so far.

## Stack

Next.js (App Router) + TypeScript + Tailwind, Supabase (Postgres/Auth/RLS),
Cloudinary (documents/photos), Razorpay (fees), Brevo (email), Interakt
(WhatsApp BSP, abstracted behind `src/lib/integrations/interakt.ts` — never
exposed directly).

## Layout

```
src/app/(marketing)/     weducation.live B2B site — landing, product, case studies, request-demo
src/app/(dashboard)/     staff/admin portals, role-gated via Supabase Auth + RLS
src/app/api/webhooks/    Interakt / Razorpay / Cloudinary webhook receivers
src/lib/integrations/    thin abstraction layer per third-party service (spec §5)
src/lib/supabase/        browser / server / service-role Supabase clients
supabase/migrations/     schema + RLS policies (spec §7)
```

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in your Supabase, Cloudinary,
   Razorpay, Brevo, and Interakt credentials.
2. Create a Supabase project and run `supabase/migrations/0001_init.sql`
   against it (via the SQL editor or the Supabase CLI).
3. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the marketing site,
`/login` for staff sign-in, and `/staff` / `/admin` for the portals.

## Status

This is the initial scaffold: marketing pages, dashboard shells with
role-gated layouts, the Supabase schema, and stub integration clients for
Cloudinary/Razorpay/Brevo/Interakt. Webhook handlers have `TODO`s marking
where provider-specific payload parsing and signature verification still
need to be filled in against real credentials (see spec §10 integration
checklist). The AI Admission Assistant (Core Engine, spec §9) is not yet
implemented.
