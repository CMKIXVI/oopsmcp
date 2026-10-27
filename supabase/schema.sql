-- Personal MCP Server / Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.mcp_content (
  id text primary key,
  type text not null check (type in ('tool','resource','prompt','workflow','agent')),
  name text not null,
  description text not null,
  status text not null default 'draft' check (status in ('published','draft')),
  category text not null default 'Personal',
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.mcp_memory (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, title text not null, content text not null, tags text[] not null default '{}', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.mcp_workflows (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, name text not null, description text not null default '', definition jsonb not null default '{}'::jsonb, status text not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.mcp_connections (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, provider text not null, name text not null, status text not null default 'disconnected', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.mcp_activity (
  id bigint generated always as identity primary key, user_id uuid references auth.users(id) on delete set null, event_type text not null, tool_name text, status text not null default 'success', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

alter table public.mcp_content enable row level security;
alter table public.mcp_memory enable row level security;
alter table public.mcp_workflows enable row level security;
alter table public.mcp_connections enable row level security;
alter table public.mcp_activity enable row level security;

drop policy if exists "authenticated read content" on public.mcp_content;
create policy "authenticated read content" on public.mcp_content for select to authenticated using (true);
drop policy if exists "authenticated write content" on public.mcp_content;
create policy "authenticated write content" on public.mcp_content for all to authenticated using (true) with check (true);
drop policy if exists "users own memory" on public.mcp_memory;
create policy "users own memory" on public.mcp_memory for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users own workflows" on public.mcp_workflows;
create policy "users own workflows" on public.mcp_workflows for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users own connections" on public.mcp_connections;
create policy "users own connections" on public.mcp_connections for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users own activity" on public.mcp_activity;
create policy "users own activity" on public.mcp_activity for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists mcp_content_type_idx on public.mcp_content(type);
create index if not exists mcp_memory_user_idx on public.mcp_memory(user_id);
create index if not exists mcp_workflows_user_idx on public.mcp_workflows(user_id);
create index if not exists mcp_activity_created_idx on public.mcp_activity(created_at desc);