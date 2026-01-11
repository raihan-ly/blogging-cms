/* ============================================================
    MULTI-USER BLOGGING & CMS — FULL DATABASE SETUP
    This file creates:
    - User profiles
    - Blog posts
    - Secure Row Level Security
    - Public author name exposure via a safe view
   ============================================================ */


/* ============================
    1. PROFILES TABLE
    Stores application-level user data
    Linked 1-to-1 with Supabase auth.users
   ============================ */
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamp with time zone default now()
);


/* ============================
    2. POSTS TABLE
    Stores all blog posts
    Each post belongs to exactly one user
   ============================ */
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_id uuid references profiles(id) on delete cascade,
  published boolean default false, -- controls public visibility
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


/* ============================
    3. ENABLE ROW LEVEL SECURITY
    Without this, Supabase ignores policies
   ============================ */
alter table profiles enable row level security;
alter table posts enable row level security;


/* ============================================================
    4. PROFILES SECURITY POLICIES
    Users can only see and modify their own profile
   ============================================================ */

-- Users can read only their own profile
create policy "Users can read their own profile"
on profiles
for select
using (auth.uid() = id);

-- Users can create their own profile row
create policy "Users can insert their own profile"
on profiles
for insert
with check (auth.uid() = id);

-- Users can update their own profile (needed for full_name updates)
create policy "Users can update their own profile"
on profiles
for update
using (auth.uid() = id);


/* ============================================================
    5. POSTS SECURITY POLICIES
    Handles public feed + private dashboard
   ============================================================ */

-- Anyone (even logged out users) can read published posts
create policy "Public read access to published posts"
on posts
for select
using (published = true);

-- Logged in users can read their own posts (drafts + published)
create policy "Users can read their own posts"
on posts
for select
using (auth.uid() = author_id);

-- Users can create posts only for themselves
create policy "Users can create posts"
on posts
for insert
with check (auth.uid() = author_id);

-- Users can update only their own posts
create policy "Users can update their own posts"
on posts
for update
using (auth.uid() = author_id);

-- Users can delete only their own posts
create policy "Users can delete their own posts"
on posts
for delete
using (auth.uid() = author_id);


/* ============================================================
    6. PUBLIC AUTHOR NAME VIEW
    Because RLS is row-level (not column-level), we expose only
    id + full_name via a safe view for public usage.
   ============================================================ */

create view public_profiles as
select
  id,
  full_name
from profiles;


/* ============================================================
    7. ALLOW PUBLIC READ ACCESS TO VIEW
    Enables:
    - Logged-out users to see author names
    - Without exposing private profile data
   ============================================================ */
grant select on public_profiles to anon, authenticated;


/* ============================================================
    END OF FILE
    This setup gives you:
    - Multi-user blog system
    - Secure data ownership
    - Public feed with author names
    - Zero backend code required
   ============================================================ */
