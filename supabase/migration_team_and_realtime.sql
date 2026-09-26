-- Run this in Supabase SQL editor after the original schema.sql.
-- Adds insert/update/delete policies for team_members (previously read-only),
-- and enables realtime so CEO feedback / notifications appear live for officials.

-- ===== team_members: allow each department to manage their own roster =====
create policy "team_members insert own dept" on team_members
  for insert with check (
    department_id = (select department_id from profiles where id = auth.uid()) or is_ceo()
  );

create policy "team_members update own dept" on team_members
  for update using (
    department_id = (select department_id from profiles where id = auth.uid()) or is_ceo()
  );

create policy "team_members delete own dept" on team_members
  for delete using (
    department_id = (select department_id from profiles where id = auth.uid()) or is_ceo()
  );

-- ===== Realtime: let clients subscribe to changes on these tables =====
alter publication supabase_realtime add table feedback;
alter publication supabase_realtime add table notifications;
