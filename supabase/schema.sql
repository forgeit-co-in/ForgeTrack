-- ForgeTrack — CEO Monitoring System
-- Supabase / PostgreSQL schema with row-level security.
-- Run this in the Supabase SQL editor on a fresh project.

-- ========== EXTENSIONS ==========
create extension if not exists "pgcrypto";

-- ========== ENUMS ==========
create type role_type as enum ('CEO', 'CVO', 'CMO', 'CTO', 'CDO');
create type status_type as enum ('green', 'yellow', 'red');
create type issue_priority as enum ('Low', 'Medium', 'High', 'Critical');
create type issue_status as enum ('Open', 'In Progress', 'Resolved');
create type notification_type as enum
  ('daily_report', 'weekly_report', 'issue', 'critical_issue', 'feedback', 'missed_report', 'status_change');

-- ========== DEPARTMENTS ==========
create table departments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  focus_area text not null,
  official_name text not null,
  official_role role_type not null,
  created_at timestamptz not null default now()
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references departments(id) on delete cascade,
  name text not null,
  role_title text not null,
  created_at timestamptz not null default now()
);

-- ========== PROFILES (extends auth.users) ==========
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role role_type not null,
  department_id uuid references departments(id),
  created_at timestamptz not null default now()
);

-- ========== DAILY UPDATES ==========
create table daily_updates (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references departments(id) on delete cascade,
  created_by uuid not null references profiles(id),
  date date not null default current_date,
  overall_status status_type not null default 'green',
  work_completed text default '',
  work_in_progress text default '',
  leads_generated int default 0,
  calls_completed int default 0,
  meetings int default 0,
  projects_started int default 0,
  projects_completed int default 0,
  tasks_completed int default 0,
  revenue numeric default 0,
  blockers text default '',
  support_needed text default '',
  tomorrow_priorities text default '',
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== WEEKLY REPORTS ==========
create table weekly_reports (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references departments(id) on delete cascade,
  created_by uuid not null references profiles(id),
  week_start date not null,
  week_end date not null,
  achievements text default '',
  leads int default 0,
  sales numeric default 0,
  projects_completed int default 0,
  team_productivity_notes text default '',
  completed_work text default '',
  pending_work text default '',
  problems text default '',
  next_week_priorities text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== ISSUES ==========
create table issues (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references departments(id) on delete cascade,
  created_by uuid not null references profiles(id),
  title text not null,
  priority issue_priority not null default 'Medium',
  description text default '',
  expected_resolution_date date,
  status issue_status not null default 'Open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== FEEDBACK (CEO -> official) ==========
create table feedback (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references departments(id) on delete cascade,
  from_ceo uuid not null references profiles(id),
  to_official text not null,
  related_report_id uuid,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ========== NOTIFICATIONS ==========
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ========== OPTIONAL: PROJECTS / LEADS (extend as needed) ==========
create table projects (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references departments(id) on delete cascade,
  name text not null,
  status text default 'active',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ========== INDEXES ==========
create index idx_daily_updates_dept_date on daily_updates(department_id, date desc);
create index idx_weekly_reports_dept_week on weekly_reports(department_id, week_start desc);
create index idx_issues_dept_status on issues(department_id, status);
create index idx_notifications_user on notifications(user_id, created_at desc);

-- ========== HELPER: current user's role/department ==========
create or replace function current_profile()
returns profiles
language sql stable
security definer
set search_path = public
as $$
  select * from profiles where id = auth.uid();
$$;

create or replace function is_ceo()
returns boolean
language sql stable
security definer
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'CEO');
$$;

-- ========== ROW LEVEL SECURITY ==========
alter table departments enable row level security;
alter table team_members enable row level security;
alter table profiles enable row level security;
alter table daily_updates enable row level security;
alter table weekly_reports enable row level security;
alter table issues enable row level security;
alter table feedback enable row level security;
alter table notifications enable row level security;
alter table projects enable row level security;

-- Departments: everyone signed in can read (needed for dropdowns, own-dept lookups)
create policy "departments readable by authenticated" on departments
  for select using (auth.role() = 'authenticated');

create policy "team_members readable by authenticated" on team_members
  for select using (auth.role() = 'authenticated');

-- Profiles: users see their own profile; CEO sees all
create policy "profiles self or ceo" on profiles
  for select using (id = auth.uid() or is_ceo());

create policy "profiles self update" on profiles
  for update using (id = auth.uid());

-- Daily updates: CEO sees all; official sees/writes only their own department
create policy "daily_updates select" on daily_updates
  for select using (is_ceo() or department_id = (select department_id from profiles where id = auth.uid()));

create policy "daily_updates insert" on daily_updates
  for insert with check (department_id = (select department_id from profiles where id = auth.uid()));

create policy "daily_updates update own dept" on daily_updates
  for update using (department_id = (select department_id from profiles where id = auth.uid()));

-- Weekly reports: same pattern
create policy "weekly_reports select" on weekly_reports
  for select using (is_ceo() or department_id = (select department_id from profiles where id = auth.uid()));

create policy "weekly_reports insert" on weekly_reports
  for insert with check (department_id = (select department_id from profiles where id = auth.uid()));

-- Issues: same pattern, plus CEO can update status
create policy "issues select" on issues
  for select using (is_ceo() or department_id = (select department_id from profiles where id = auth.uid()));

create policy "issues insert" on issues
  for insert with check (department_id = (select department_id from profiles where id = auth.uid()));

create policy "issues update" on issues
  for update using (is_ceo() or department_id = (select department_id from profiles where id = auth.uid()));

-- Feedback: CEO writes; both CEO and the receiving department can read
create policy "feedback select" on feedback
  for select using (is_ceo() or department_id = (select department_id from profiles where id = auth.uid()));

create policy "feedback insert ceo only" on feedback
  for insert with check (is_ceo());

-- Notifications: a user only sees their own
create policy "notifications select own" on notifications
  for select using (user_id = auth.uid());

create policy "notifications update own" on notifications
  for update using (user_id = auth.uid());

-- Projects: same department pattern
create policy "projects select" on projects
  for select using (is_ceo() or department_id = (select department_id from profiles where id = auth.uid()));

create policy "projects insert" on projects
  for insert with check (department_id = (select department_id from profiles where id = auth.uid()));

-- ========== SEED: the four departments ==========
insert into departments (slug, name, focus_area, official_name, official_role) values
  ('news-channel', 'News Channel', 'News Channel project', 'Sriram', 'CVO'),
  ('marketing', 'Marketing', 'Forgeit marketing & other marketing projects', 'Karthik', 'CMO'),
  ('business-acquisition', 'Business Acquisition', 'Restaurants, boutiques, beauty, fitness, Chennai-wide lead gen, websites & marketing', 'Tharun V', 'CTO'),
  ('institutional-solutions', 'Business & Institutional Solutions', 'Salons, govt schools, hardware units, hospitals, websites, marketing & software', 'Manobala C', 'CDO');

-- ========== NEXT STEPS ==========
-- 1. Create 5 users in Supabase Auth (Manish, Sriram, Karthik, Tharun, Manobala).
-- 2. Insert a matching row into `profiles` for each, setting role and department_id
--    (CEO gets department_id = null; each official gets their department's id).
-- 3. Optionally insert rows into `team_members` per department for a richer Team view.
