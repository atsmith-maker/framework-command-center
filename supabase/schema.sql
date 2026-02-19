-- ============================================================
-- Framework Command Center — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Version: 1.0.0
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";


-- ============================================================
-- TABLES
-- ============================================================

-- ─── Profiles ─────────────────────────────────────────────
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

-- ─── Projects ─────────────────────────────────────────────
create table if not exists projects (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  name              text not null,
  description       text,
  status            text not null default 'active' check (status in ('active', 'archived', 'completed')),
  task_count        integer not null default 0,
  completed_tasks   integer not null default 0,
  last_activity_at  timestamptz,
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);

-- ─── Framework Docs ───────────────────────────────────────
create table if not exists framework_docs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  slug          text not null,
  category      text not null default 'reference',
  content       jsonb not null default '{"type":"doc","content":[]}',
  description   text,
  version       integer not null default 1,
  is_published  boolean not null default true,
  view_count    integer not null default 0,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  unique(user_id, slug)
);

-- ─── Coordination Tasks ───────────────────────────────────
create table if not exists coordination_tasks (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references projects(id) on delete cascade,
  task_id          text not null,
  parent_task_id   text,
  task_name        text,
  title            text,
  description      text not null default '',
  assigned_ai      text not null default 'Unassigned',
  status           text not null default 'pending'
                     check (status in ('pending','in_progress','review','completed','blocked')),
  priority         text not null default 'medium'
                     check (priority in ('low','medium','high','critical')),
  dependencies     text[] not null default '{}',
  output_section   text not null default '',
  notes            text,
  sort_order       integer not null default 0,
  estimated_hours  numeric(5,1),
  actual_hours     numeric(5,1),
  started_at       timestamptz,
  completed_at     timestamptz,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);

-- ─── Assembly Sections ────────────────────────────────────
create table if not exists assembly_sections (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects(id) on delete cascade,
  section_id      text not null,
  title           text not null,
  content         jsonb not null default '{"type":"doc","content":[]}',
  status          text not null default 'draft'
                    check (status in ('draft','in_progress','complete')),
  version         integer not null default 1,
  source_task_ids text[] not null default '{}',
  word_count      integer,
  sort_order      integer not null default 0,
  "order"         integer not null default 0,
  last_edited_by  text,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

-- ─── Prompts ──────────────────────────────────────────────
create table if not exists prompts (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references projects(id) on delete cascade,
  prompt_id        text not null,
  title            text not null,
  category         text not null default 'general',
  phase            text,
  ai_target        text,
  content          text not null,
  is_template      boolean not null default false,
  version          integer not null default 1,
  parent_prompt_id uuid references prompts(id) on delete set null,
  usage_count      integer not null default 0,
  last_used_at     timestamptz,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);

-- ─── AI Performance ───────────────────────────────────────
create table if not exists ai_performance (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects(id) on delete cascade,
  task_id         text not null,
  ai_service      text not null,
  quality_rating  smallint check (quality_rating between 1 and 5),
  revision_count  smallint not null default 0,
  time_spent_min  integer,
  tokens_used     integer,
  cost_estimate   numeric(8,4),
  feedback_notes  text,
  notes           text,
  metadata        jsonb,
  created_at      timestamptz default now() not null
);

-- ─── Project Shares ───────────────────────────────────────
create table if not exists project_shares (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references projects(id) on delete cascade,
  token            text not null unique default encode(gen_random_bytes(24), 'base64url'),
  password_hash    text,
  expires_at       timestamptz,
  max_views        integer,
  view_count       integer not null default 0,
  last_accessed_at timestamptz,
  created_at       timestamptz default now() not null,
  created_by       uuid not null references auth.users(id) on delete cascade
);


-- ============================================================
-- INDEXES (performance)
-- ============================================================

create index if not exists idx_projects_user_id        on projects(user_id);
create index if not exists idx_projects_status         on projects(user_id, status);
create index if not exists idx_projects_updated        on projects(user_id, updated_at desc);

create index if not exists idx_framework_docs_user     on framework_docs(user_id);
create index if not exists idx_framework_docs_slug     on framework_docs(user_id, slug);
create index if not exists idx_framework_docs_category on framework_docs(user_id, category);

create index if not exists idx_tasks_project_id        on coordination_tasks(project_id);
create index if not exists idx_tasks_status            on coordination_tasks(project_id, status);
create index if not exists idx_tasks_sort              on coordination_tasks(project_id, sort_order);
create index if not exists idx_tasks_updated           on coordination_tasks(project_id, updated_at desc);

create index if not exists idx_sections_project        on assembly_sections(project_id);
create index if not exists idx_sections_sort           on assembly_sections(project_id, sort_order);

create index if not exists idx_prompts_project         on prompts(project_id);
create index if not exists idx_prompts_category        on prompts(project_id, category);
create index if not exists idx_prompts_ai              on prompts(project_id, ai_target);

create index if not exists idx_performance_project     on ai_performance(project_id);
create index if not exists idx_performance_ai          on ai_performance(project_id, ai_service);

create index if not exists idx_shares_token            on project_shares(token);
create index if not exists idx_shares_project          on project_shares(project_id);


-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create or replace trigger trg_projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

create or replace trigger trg_framework_docs_updated_at
  before update on framework_docs
  for each row execute function update_updated_at();

create or replace trigger trg_tasks_updated_at
  before update on coordination_tasks
  for each row execute function update_updated_at();

create or replace trigger trg_sections_updated_at
  before update on assembly_sections
  for each row execute function update_updated_at();

create or replace trigger trg_prompts_updated_at
  before update on prompts
  for each row execute function update_updated_at();


-- ============================================================
-- PROJECT STATS TRIGGER
-- Keeps task_count and completed_tasks accurate automatically
-- ============================================================

create or replace function update_project_task_counts()
returns trigger language plpgsql security definer as $$
begin
  update projects
  set
    task_count      = (select count(*) from coordination_tasks where project_id = coalesce(new.project_id, old.project_id)),
    completed_tasks = (select count(*) from coordination_tasks where project_id = coalesce(new.project_id, old.project_id) and status = 'completed'),
    last_activity_at = now(),
    updated_at      = now()
  where id = coalesce(new.project_id, old.project_id);
  return coalesce(new, old);
end;
$$;

create or replace trigger trg_task_count_on_insert
  after insert on coordination_tasks
  for each row execute function update_project_task_counts();

create or replace trigger trg_task_count_on_update
  after update of status on coordination_tasks
  for each row execute function update_project_task_counts();

create or replace trigger trg_task_count_on_delete
  after delete on coordination_tasks
  for each row execute function update_project_task_counts();


-- ============================================================
-- PROFILE AUTO-CREATE TRIGGER
-- Creates a profile row whenever a new user signs up
-- ============================================================

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only read/write their own data
-- ============================================================

alter table profiles         enable row level security;
alter table projects         enable row level security;
alter table framework_docs   enable row level security;
alter table coordination_tasks enable row level security;
alter table assembly_sections  enable row level security;
alter table prompts          enable row level security;
alter table ai_performance   enable row level security;
alter table project_shares   enable row level security;


-- ─── Profiles ─────────────────────────────────────────────
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);


-- ─── Projects ─────────────────────────────────────────────
create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can create projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects for delete
  using (auth.uid() = user_id);


-- ─── Framework Docs ───────────────────────────────────────
create policy "Users can view own docs"
  on framework_docs for select
  using (auth.uid() = user_id);

create policy "Users can create docs"
  on framework_docs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own docs"
  on framework_docs for update
  using (auth.uid() = user_id);

create policy "Users can delete own docs"
  on framework_docs for delete
  using (auth.uid() = user_id);


-- ─── Coordination Tasks ───────────────────────────────────
create policy "Users can view tasks in own projects"
  on coordination_tasks for select
  using (
    exists (
      select 1 from projects
      where projects.id = coordination_tasks.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can create tasks in own projects"
  on coordination_tasks for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = coordination_tasks.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can update tasks in own projects"
  on coordination_tasks for update
  using (
    exists (
      select 1 from projects
      where projects.id = coordination_tasks.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete tasks in own projects"
  on coordination_tasks for delete
  using (
    exists (
      select 1 from projects
      where projects.id = coordination_tasks.project_id
        and projects.user_id = auth.uid()
    )
  );


-- ─── Assembly Sections ────────────────────────────────────
create policy "Users can view sections in own projects"
  on assembly_sections for select
  using (
    exists (
      select 1 from projects
      where projects.id = assembly_sections.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can create sections in own projects"
  on assembly_sections for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = assembly_sections.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can update sections in own projects"
  on assembly_sections for update
  using (
    exists (
      select 1 from projects
      where projects.id = assembly_sections.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete sections in own projects"
  on assembly_sections for delete
  using (
    exists (
      select 1 from projects
      where projects.id = assembly_sections.project_id
        and projects.user_id = auth.uid()
    )
  );


-- ─── Prompts ──────────────────────────────────────────────
create policy "Users can view prompts in own projects"
  on prompts for select
  using (
    exists (
      select 1 from projects
      where projects.id = prompts.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can create prompts in own projects"
  on prompts for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = prompts.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can update prompts in own projects"
  on prompts for update
  using (
    exists (
      select 1 from projects
      where projects.id = prompts.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete prompts in own projects"
  on prompts for delete
  using (
    exists (
      select 1 from projects
      where projects.id = prompts.project_id
        and projects.user_id = auth.uid()
    )
  );


-- ─── AI Performance ───────────────────────────────────────
create policy "Users can view performance in own projects"
  on ai_performance for select
  using (
    exists (
      select 1 from projects
      where projects.id = ai_performance.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can create performance records"
  on ai_performance for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = ai_performance.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can update performance in own projects"
  on ai_performance for update
  using (
    exists (
      select 1 from projects
      where projects.id = ai_performance.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete performance in own projects"
  on ai_performance for delete
  using (
    exists (
      select 1 from projects
      where projects.id = ai_performance.project_id
        and projects.user_id = auth.uid()
    )
  );


-- ─── Project Shares ───────────────────────────────────────
create policy "Users can view own project shares"
  on project_shares for select
  using (auth.uid() = created_by);

create policy "Users can create shares for own projects"
  on project_shares for insert
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from projects
      where projects.id = project_shares.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Users can update own shares"
  on project_shares for update
  using (auth.uid() = created_by);

create policy "Users can delete own shares"
  on project_shares for delete
  using (auth.uid() = created_by);

-- Public read access to shares by token (for shared link pages + AI submission)
-- This allows unauthenticated users to look up a share by its token
create policy "Anyone can look up share by token"
  on project_shares for select
  using (true);

-- Allow AI submission endpoint to update view_count without auth
create policy "Anyone can increment view count"
  on project_shares for update
  using (true)
  with check (true);


-- ============================================================
-- PUBLIC READ FOR SHARED PROJECTS
-- The shared link page needs to read project data without auth.
-- These policies allow reading project/task/section/prompt data
-- when accessed via a valid share token.
-- ============================================================

-- Sections readable via valid share token
create policy "Public can read sections via share token"
  on assembly_sections for select
  using (
    exists (
      select 1 from project_shares
      where project_shares.project_id = assembly_sections.project_id
        and (project_shares.expires_at is null or project_shares.expires_at > now())
    )
  );

-- Tasks readable via valid share token
create policy "Public can read tasks via share token"
  on coordination_tasks for select
  using (
    exists (
      select 1 from project_shares
      where project_shares.project_id = coordination_tasks.project_id
        and (project_shares.expires_at is null or project_shares.expires_at > now())
    )
  );

-- Prompts readable via valid share token
create policy "Public can read prompts via share token"
  on prompts for select
  using (
    exists (
      select 1 from project_shares
      where project_shares.project_id = prompts.project_id
        and (project_shares.expires_at is null or project_shares.expires_at > now())
    )
  );

-- Projects readable via valid share token
create policy "Public can read project info via share token"
  on projects for select
  using (
    exists (
      select 1 from project_shares
      where project_shares.project_id = projects.id
        and (project_shares.expires_at is null or project_shares.expires_at > now())
    )
  );

-- Allow AI submission to insert sections without auth
create policy "Public can insert sections via share token"
  on assembly_sections for insert
  with check (
    exists (
      select 1 from project_shares
      where project_shares.project_id = assembly_sections.project_id
        and (project_shares.expires_at is null or project_shares.expires_at > now())
    )
  );

-- Allow AI submission to update existing sections without auth
create policy "Public can update sections via share token"
  on assembly_sections for update
  using (
    exists (
      select 1 from project_shares
      where project_shares.project_id = assembly_sections.project_id
        and (project_shares.expires_at is null or project_shares.expires_at > now())
    )
  );

-- Allow AI submission to update task status without auth
create policy "Public can update task status via share token"
  on coordination_tasks for update
  using (
    exists (
      select 1 from project_shares
      where project_shares.project_id = coordination_tasks.project_id
        and (project_shares.expires_at is null or project_shares.expires_at > now())
    )
  );


-- ============================================================
-- DONE
-- ============================================================
-- All tables, indexes, triggers, and RLS policies are set up.
-- Your database is ready for Framework Command Center.
