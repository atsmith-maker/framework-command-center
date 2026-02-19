# Setup & Deployment Guide

Complete guide for getting Framework Command Center running — locally, on Vercel, and as a Windows desktop app.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development](#local-development)
4. [Vercel Deployment](#vercel-deployment)
5. [Environment Variables Reference](#environment-variables-reference)
6. [Post-Deployment Checklist](#post-deployment-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, you'll need:

- **Node.js 18 or higher** — [nodejs.org](https://nodejs.org)
- **npm** (comes with Node) or **yarn**
- **A Supabase account** — [supabase.com](https://supabase.com) — free tier is sufficient
- **A Vercel account** (for deployment) — [vercel.com](https://vercel.com) — free tier is sufficient
- **A GitHub account** (for Vercel continuous deployment)

---

## Supabase Setup

### Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose your organization, give it a name (e.g. `framework-command-center`), and set a strong database password — **save this password, you'll need it**
4. Select the region closest to you
5. Click **Create new project** and wait ~2 minutes for it to initialize

### Step 2: Run the database schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` from this repo
4. Copy the entire contents and paste it into the SQL editor
5. Click **Run** (or press `Ctrl+Enter`)

You should see success messages for each table, index, policy, and trigger. If you see any errors, check the [Troubleshooting](#troubleshooting) section.

### Step 3: Enable email auth

1. In Supabase dashboard, go to **Authentication → Providers**
2. Ensure **Email** is enabled (it is by default)
3. Under **Email Templates**, you can customize the magic link email if desired
4. Go to **Authentication → URL Configuration**
5. Set **Site URL** to your production URL (e.g. `https://your-app.vercel.app`) — or `http://localhost:3000` for local dev
6. Add `http://localhost:3000/api/auth/callback` to **Redirect URLs** for local development
7. Add `https://your-app.vercel.app/api/auth/callback` once you have your Vercel URL

### Step 4: Get your API credentials

1. In Supabase dashboard, go to **Project Settings → API**
2. Copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon / public** key (long JWT string)
   - **service_role** key (optional — needed for admin backup operations only, keep this secret)

---

## Local Development

### Step 1: Clone and install

```bash
git clone https://github.com/your-username/framework-command-center.git
cd framework-command-center
npm install
```

### Step 2: Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional — only needed for backup API route
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Step 4: Create your account

1. Click **Sign up** and create an account with your email
2. Check your email for a confirmation link (or disable email confirmation in Supabase → Authentication → Settings → "Disable email confirmations" for local dev)
3. After confirming, you'll be routed through the onboarding wizard
4. The framework docs (16 documents) are auto-seeded on your first visit to the Library

---

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git init  # if not already a git repo
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/framework-command-center.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Vercel will auto-detect Next.js — leave the build settings as-is
4. **Before clicking Deploy**, add the environment variables (Step 3)

### Step 3: Add environment variables in Vercel

In the Vercel project setup screen (or **Settings → Environment Variables** after import):

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Production only |

### Step 4: Deploy

Click **Deploy**. Vercel builds and deploys in ~2 minutes. You'll get a URL like `https://framework-command-center-xyz.vercel.app`.

### Step 5: Update Supabase redirect URLs

Back in Supabase → **Authentication → URL Configuration**:

1. Update **Site URL** to your Vercel production URL
2. Add your Vercel URL + `/api/auth/callback` to **Redirect URLs**

```
https://your-app.vercel.app
https://your-app.vercel.app/api/auth/callback
```

### Step 6: Set a custom domain (optional)

In Vercel → **Settings → Domains**, add your custom domain and follow the DNS instructions.

---

## Environment Variables Reference

### `.env.local` (local development)

```env
# ─── Supabase ──────────────────────────────────────────────────────────────────
# Required — your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Required — public anon key (safe to expose in the browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional — service role key (never expose to browser, server-side only)
# Needed for: automated backups, admin operations
# Get from: Supabase → Project Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Where to find these values

**Supabase Dashboard → Project Settings → API:**
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` / `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Post-Deployment Checklist

After deploying, verify everything works:

- [ ] Visit your app URL and sign up for a new account
- [ ] Confirm email (check spam if not received)
- [ ] Complete the onboarding wizard and create a first project
- [ ] Visit the Framework Library — 16 docs should auto-seed on first visit
- [ ] Create a task in the Coordination Table
- [ ] Add a section in the Assembly Editor and try the formatting toolbar
- [ ] Add a prompt in the Prompt Library and test the copy button
- [ ] Open Project Settings → Share, generate a share link, and visit it
- [ ] Test the Testing Lab with an HTML snippet
- [ ] Export a project as JSON from Project Settings

---

## Troubleshooting

### "relation does not exist" errors

The schema hasn't been run. Go to Supabase → SQL Editor and run `supabase/schema.sql`.

### Can't log in after signup

Check Supabase → Authentication → URL Configuration. The **Redirect URLs** list must include your app's `/api/auth/callback` URL.

### Magic link not arriving

1. Check spam folder
2. In Supabase → Authentication → Settings, check if email confirmations are enabled
3. For local dev, disable email confirmations: Supabase → Authentication → Settings → uncheck "Enable email confirmations"

### Framework docs not appearing in Library

They auto-seed on first Library visit. If they don't appear, check your Supabase connection (verify env vars are correct) and check browser console for errors.

### Build fails on Vercel

Common causes:
- Missing environment variables — ensure all three are set in Vercel
- TypeScript errors — run `npm run build` locally first to catch them
- Node version mismatch — set Node.js 18.x in Vercel → Settings → General → Node.js Version

### RLS errors (403 in Supabase logs)

Row Level Security policies restrict data to the authenticated user. If you see RLS errors:
1. Ensure you're logged in (check `supabase.auth.getUser()` returns a user)
2. Re-run the RLS section of `supabase/schema.sql` to ensure all policies are applied
3. Check Supabase → Authentication → Policies for the affected table

### Shared links not working

The share link route is public (no auth required). If it's returning 404:
1. Verify the token exists in `project_shares` table in Supabase
2. Check that the share hasn't expired (`expires_at` in the past)
3. Check that `view_count < max_views` (if max views was set)
