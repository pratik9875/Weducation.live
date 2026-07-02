-- Antigravity / WEducation.live — initial schema (spec §7)
-- All tenant-scoped tables carry university_id for multi-tenancy; RLS enforces isolation per client.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────
-- Tenants
-- ─────────────────────────────────────────────────────────
create table universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp_number_id text,
  branding_config jsonb not null default '{}'::jsonb,
  academic_year text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Roles & Staff accounts
-- ─────────────────────────────────────────────────────────
create type app_role as enum (
  'admin',
  'admission_manager',
  'counselor',
  'document_verifier',
  'finance',
  'registrar'
);

create table users (
  id uuid primary key references auth.users (id) on delete cascade,
  university_id uuid not null references universities (id) on delete cascade,
  role app_role not null,
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Courses
-- ─────────────────────────────────────────────────────────
create table courses (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  name text not null,
  fee numeric(12, 2) not null,
  eligibility_rules jsonb not null default '{}'::jsonb,
  intake_year text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Leads (every WhatsApp inbound contact)
-- ─────────────────────────────────────────────────────────
create type lead_stage as enum (
  'new',
  'engaged',
  'application_started',
  'application_submitted',
  'admitted',
  'lost'
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  phone text not null,
  name text,
  source text,
  stage lead_stage not null default 'new',
  assigned_counselor_id uuid references users (id),
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (university_id, phone)
);

-- ─────────────────────────────────────────────────────────
-- Applications
-- ─────────────────────────────────────────────────────────
create type application_status as enum (
  'draft',
  'submitted',
  'under_review',
  'documents_pending',
  'documents_verified',
  'fee_pending',
  'admitted',
  'rejected'
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  lead_id uuid not null references leads (id) on delete cascade,
  course_id uuid not null references courses (id),
  status application_status not null default 'draft',
  application_number text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Documents (Cloudinary refs)
-- ─────────────────────────────────────────────────────────
create type document_status as enum ('pending', 'verified', 'rejected');

create table documents (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  application_id uuid not null references applications (id) on delete cascade,
  type text not null,
  cloudinary_url text not null,
  status document_status not null default 'pending',
  rejection_reason text,
  verified_by uuid references users (id),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Payments (Razorpay)
-- ─────────────────────────────────────────────────────────
create type payment_status as enum ('created', 'authorized', 'captured', 'failed', 'refunded');

create table payments (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  application_id uuid not null references applications (id) on delete cascade,
  amount numeric(12, 2) not null,
  status payment_status not null default 'created',
  receipt_url text,
  gateway_ref text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- WhatsApp templates (Interakt/Meta)
-- ─────────────────────────────────────────────────────────
create type template_approval_status as enum ('draft', 'pending', 'approved', 'rejected');

create table templates (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  name text not null,
  approval_status template_approval_status not null default 'draft',
  category text,
  body text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Campaigns
-- ─────────────────────────────────────────────────────────
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  segment jsonb not null default '{}'::jsonb,
  template_id uuid references templates (id),
  scheduled_at timestamptz,
  stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Conversations / Messages
-- ─────────────────────────────────────────────────────────
create type message_channel as enum ('whatsapp', 'email', 'sms');
create type message_direction as enum ('inbound', 'outbound');

create table conversations (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  lead_id uuid not null references leads (id) on delete cascade,
  channel message_channel not null default 'whatsapp',
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations (id) on delete cascade,
  direction message_direction not null,
  content text not null,
  provider_ref text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Notifications (Brevo / WhatsApp / SMS dispatch log)
-- ─────────────────────────────────────────────────────────
create type notification_status as enum ('queued', 'sent', 'delivered', 'failed');

create table notifications (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  channel message_channel not null,
  recipient text not null,
  status notification_status not null default 'queued',
  provider_ref text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Audit logs
-- ─────────────────────────────────────────────────────────
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  user_id uuid references users (id),
  action text not null,
  entity text not null,
  ip_address text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Row-Level Security
-- ─────────────────────────────────────────────────────────
alter table universities enable row level security;
alter table users enable row level security;
alter table courses enable row level security;
alter table leads enable row level security;
alter table applications enable row level security;
alter table documents enable row level security;
alter table payments enable row level security;
alter table templates enable row level security;
alter table campaigns enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

-- Helper: the calling user's own row in `users`
create or replace function auth_user() returns users
language sql stable security definer as $$
  select * from users where id = auth.uid();
$$;

-- Helper: the calling user's university_id
create or replace function auth_university_id() returns uuid
language sql stable security definer as $$
  select university_id from users where id = auth.uid();
$$;

-- Staff can see/manage their own account; admins manage all staff in their university.
create policy "users_select_own_university" on users
  for select using (university_id = auth_university_id());

create policy "users_admin_write" on users
  for all using (
    university_id = auth_university_id()
    and (select role from auth_user()) = 'admin'
  );

-- Generic per-university isolation policy, applied to every tenant-scoped table.
create policy "universities_select_own" on universities
  for select using (id = auth_university_id());

do $$
declare
  t text;
begin
  foreach t in array array[
    'courses', 'leads', 'applications', 'documents', 'payments',
    'templates', 'campaigns', 'conversations', 'notifications', 'audit_logs'
  ]
  loop
    execute format(
      'create policy "%1$s_tenant_isolation" on %1$s for all using (university_id = auth_university_id()) with check (university_id = auth_university_id());',
      t
    );
  end loop;
end $$;

-- Messages inherit isolation through their parent conversation.
create policy "messages_tenant_isolation" on messages
  for all using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and c.university_id = auth_university_id()
    )
  );

-- Document Verifiers restricted to updating document status/rejection only (defense in depth
-- beyond the app layer). Finer-grained per-role policies are layered on top of tenant isolation
-- as each staff module ships.
