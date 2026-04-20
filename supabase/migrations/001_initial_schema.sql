-- Articles table: stores every scraped article
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text unique not null,
  source_name text,
  source_url text,
  category text,
  published_at timestamptz,
  scraped_at timestamptz default now(),
  content text,
  summary text,
  image_url text,
  digest_date date
);

create index if not exists articles_digest_date_idx on articles(digest_date);
create index if not exists articles_category_idx on articles(category);
create index if not exists articles_published_at_idx on articles(published_at desc);

-- Digests table: one row per day
create table if not exists digests (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  summary text,
  top_article_ids uuid[],
  article_count integer default 0,
  storage_path text,
  created_at timestamptz default now()
);

create index if not exists digests_date_idx on digests(date desc);

-- Chat sessions
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text,
  created_at timestamptz default now()
);

-- Chat messages
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table articles enable row level security;
alter table digests enable row level security;
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- Articles & digests: readable by all authenticated users
create policy "Authenticated users can read articles"
  on articles for select to authenticated using (true);

create policy "Service role can insert/update articles"
  on articles for all to service_role using (true);

create policy "Authenticated users can read digests"
  on digests for select to authenticated using (true);

create policy "Service role can insert/update digests"
  on digests for all to service_role using (true);

-- Chat: users can only see their own sessions
create policy "Users can manage own chat sessions"
  on chat_sessions for all to authenticated
  using (auth.uid() = user_id);

create policy "Users can manage own chat messages"
  on chat_messages for all to authenticated
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

-- Supabase Storage bucket for archives
insert into storage.buckets (id, name, public)
values ('pulse-archives', 'pulse-archives', false)
on conflict (id) do nothing;

create policy "Service role can manage archives"
  on storage.objects for all to service_role using (true);

create policy "Authenticated users can read archives"
  on storage.objects for select to authenticated
  using (bucket_id = 'pulse-archives');
