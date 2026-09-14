insert into public.investment_plans (name, "minAmount", "maxAmount", roi, duration, description, features, "displayOrder", "isActive")
values
  ('Starter', 100, 9999, 8.5, 90, 'A steady entry point for building your first portfolio.', '["Quarterly payouts", "Low starting amount", "Capital preservation focus"]'::jsonb, 1, true),
  ('Growth', 10000, 49999, 14.75, 180, 'Balanced exposure for investors seeking stronger compounding.', '["Biannual payouts", "Diversified strategy", "Dedicated portfolio review"]'::jsonb, 2, true),
  ('Private Wealth', 50000, null, 22.0, 365, 'Our highest-conviction strategy for long-term capital partners.', '["Annual payouts", "Priority support", "Institutional-grade allocation"]'::jsonb, 3, true)
on conflict (name) do update set
  "minAmount" = excluded."minAmount",
  "maxAmount" = excluded."maxAmount",
  roi = excluded.roi,
  duration = excluded.duration,
  description = excluded.description,
  features = excluded.features,
  "displayOrder" = excluded."displayOrder",
  "isActive" = excluded."isActive";

insert into public.investment_categories (name, description, "expectedYield", "riskLevel", "displayOrder", "isActive")
values
  ('Private Credit', 'Asset-backed lending and structured credit opportunities.', '8–12%', 'low', 1, true),
  ('Global Equities', 'A diversified portfolio of established public companies.', '12–20%', 'medium', 2, true),
  ('Innovation Ventures', 'Selective exposure to emerging technology and private markets.', '18–30%', 'high', 3, true)
on conflict (name) do update set
  description = excluded.description,
  "expectedYield" = excluded."expectedYield",
  "riskLevel" = excluded."riskLevel",
  "displayOrder" = excluded."displayOrder",
  "isActive" = excluded."isActive";

-- The service role is used by the server-side tRPC layer; browser clients remain RLS-protected.
grant usage on schema public to anon, authenticated, service_role;
grant select on public.investment_plans, public.investment_categories to anon, authenticated;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;

-- Explicit policies make ownership boundaries clear when the publishable Supabase client is used.
drop policy if exists "users can read own profile" on public.users;
create policy "users can read own profile" on public.users for select to authenticated
  using ("openId" = (select auth.uid()::text));

drop policy if exists "users can read own investments" on public.user_investments;
create policy "users can read own investments" on public.user_investments for select to authenticated
  using (exists (select 1 from public.users u where u.id = "userId" and u."openId" = (select auth.uid()::text)));

drop policy if exists "users can read own withdrawals" on public.withdrawal_requests;
create policy "users can read own withdrawals" on public.withdrawal_requests for select to authenticated
  using (exists (select 1 from public.users u where u.id = "userId" and u."openId" = (select auth.uid()::text)));

drop policy if exists "users can create own withdrawals" on public.withdrawal_requests;
create policy "users can create own withdrawals" on public.withdrawal_requests for insert to authenticated
  with check (exists (select 1 from public.users u where u.id = "userId" and u."openId" = (select auth.uid()::text)));

drop policy if exists "admins can manage investment data" on public.investment_plans;
create policy "admins can manage investment data" on public.investment_plans for all to authenticated
  using (exists (select 1 from public.users where "openId" = (select auth.uid()::text) and role = 'admin'))
  with check (exists (select 1 from public.users where "openId" = (select auth.uid()::text) and role = 'admin'));

drop policy if exists "admins can manage categories" on public.investment_categories;
create policy "admins can manage categories" on public.investment_categories for all to authenticated
  using (exists (select 1 from public.users where "openId" = (select auth.uid()::text) and role = 'admin'))
  with check (exists (select 1 from public.users where "openId" = (select auth.uid()::text) and role = 'admin'));

notify pgrst, 'reload schema';
