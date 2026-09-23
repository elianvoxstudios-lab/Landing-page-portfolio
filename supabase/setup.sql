-- Run in Supabase: SQL Editor > New query

create table public.enquiries (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320 and email ~* '^\S+@\S+\.\S+$'),
  needs text[] not null default '{}' check (cardinality(needs) <= 10),
  message text not null default '' check (char_length(message) <= 5000),
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

-- The website (anon key) can only INSERT. Nobody can read rows with the public key.
create policy "public can submit enquiries"
  on public.enquiries for insert
  to anon
  with check (true);

-- The anon role needs table-level insert permission too
grant insert on public.enquiries to anon;
