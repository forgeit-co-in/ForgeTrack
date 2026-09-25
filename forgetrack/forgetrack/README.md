# ForgeTrack — CEO Monitoring System

A standalone PWA where four Board officials submit daily/weekly updates and issues,
and the CEO gets a single command-center dashboard with daily/weekly/monthly analytics.
This is a separate product from Forgeit Hub — nothing here touches that codebase.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Supabase (Postgres + Auth) with row-level security
- Recharts for charts
- vite-plugin-pwa for installability/offline support

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

## Setting up Supabase

1. Create a new Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`. This creates all tables,
   enables row-level security, adds policies, and seeds the four departments
   (Sriram/CVO, Karthik/CMO, Tharun V/CTO, Manobala C/CDO).
3. In Authentication → Users, create 5 users: Manish (CEO) and the four officials.
4. For each user, insert a row into `profiles`:
   - `id` = the auth user's UUID
   - `role` = `CEO` / `CVO` / `CMO` / `CTO` / `CDO`
   - `department_id` = `null` for the CEO, or the matching department's `id` for officials
5. Copy your project URL and anon key into `.env`.

## Access model

- **CEO** (role `CEO`): reads every department's data across all tables. Row-level
  security policies use an `is_ceo()` helper so this is enforced at the database
  layer, not just hidden in the UI.
- **Board officials** (`CVO`/`CMO`/`CTO`/`CDO`): every insert/select policy scopes
  rows to `department_id = their own department`. An official's Supabase session
  simply cannot read another department's rows, even if they inspect network requests.

## Project structure

```
src/
  components/   shared UI (KpiCard, StatusBadge, DepartmentCard)
  layouts/      CeoLayout (sidebar + bottom nav), OfficialLayout
  pages/ceo/    CEO dashboard, departments, analytics, reports, issues, feedback
  pages/official/  department dashboard, team, daily update, weekly report, issues, feedback
  services/     Supabase queries, grouped by resource
  hooks/        useDepartmentSummaries — aggregates updates+issues into CEO cards
  utils/        analytics.ts — daily/weekly/monthly filtering & rollups
  context/      AuthContext — session + profile + role
  routes/       ProtectedRoute (role guard), RoleRouter (post-login redirect)
supabase/
  schema.sql    tables, RLS policies, seed data
```

## PWA

`vite-plugin-pwa` is already wired up in `vite.config.ts` (manifest, service worker,
Supabase API runtime caching). Before your first production build, drop real
`icon-192.png` and `icon-512.png` into `public/icons/` (see the README there) —
`npm run build` will fail PWA asset checks without them present, and installability
depends on real icons.

## What's included vs. what to extend next

Included: auth + role-based routing, CEO dashboard with KPI + department cards,
CEO/department analytics with daily/weekly/monthly toggle and line/bar charts,
daily update form, weekly report form, issue raising + status updates, CEO feedback,
notifications list, full RLS-backed schema, PWA config.

Natural next additions: a Postgres trigger that writes to `notifications` whenever
a report/issue is inserted (so the in-app list populates automatically), a
`meetings`/`sales`/`leads` detail table if you outgrow the rollup fields on
`daily_updates`, and a monthly PDF/summary export for the CEO reporting view.
