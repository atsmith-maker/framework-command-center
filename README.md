# Framework Command Center

**Central workspace for the AI Project Framework v3.0**

A full-stack web and desktop application for coordinating multi-AI projects — assign tasks across AI models, assemble deliverables, track performance, and collaborate through shareable links.

![Framework Command Center](docs/screenshot-placeholder.png)

---

## What It Does

When you're running a complex project with ChatGPT, Claude, Grok, Gemini, Perplexity, and DeepSeek all working in parallel, keeping it organized is the hard part. Framework Command Center is the coordination layer:

- **Master Coordination Table** — Assign tasks to specific AI models, track dependencies, monitor status across the whole project
- **Central Assembly Editor** — Paste AI outputs into structured sections, format with a rich text editor, auto-save as you go
- **Prompt Library** — Store, organize, and copy the prompts for each task and AI — no more hunting through chat history
- **Performance Tracker** — Rate AI outputs 1–5 stars, log revisions and time spent, generate reports to find which AI performs best
- **Testing Lab** — Preview HTML, render Markdown, validate JSON before you finalize anything
- **Framework Library** — All 16 framework docs editable in-app, searchable, always accessible
- **Shareable Links** — Generate a link for any project; AIs can view context and submit their outputs directly
- **Export & Backup** — Download everything as JSON, Markdown, or CSV; automated weekly backups

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn/UI |
| Rich Text | Tiptap |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + magic link) |
| State | TanStack Query v5 |
| Desktop | Tauri (Rust) |
| Hosting | Vercel |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/your-username/framework-command-center.git
cd framework-command-center
npm install
```

### 2. Set up Supabase

See **[SETUP.md](./SETUP.md)** for the complete step-by-step guide. The short version:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Copy your project URL and anon key

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and you're in.

---

## Project Structure

```
framework-command-center/
├── app/                        # Next.js App Router pages
│   ├── (app)/                  # Authenticated app routes
│   │   ├── dashboard/          # Dashboard overview
│   │   ├── projects/           # Project list + individual workspaces
│   │   │   └── [projectId]/
│   │   │       ├── tasks/      # Coordination table
│   │   │       ├── assembly/   # Assembly editor
│   │   │       ├── prompts/    # Prompt library
│   │   │       ├── performance/# Performance tracker
│   │   │       └── settings/   # Project settings, export, share
│   │   ├── library/            # Framework docs browser + editor
│   │   ├── testing/            # Testing lab
│   │   └── settings/           # App-wide settings
│   ├── (auth)/                 # Login, signup, reset password
│   ├── api/                    # API routes
│   │   ├── auth/post-login/    # Smart post-login router
│   │   ├── projects/[id]/backup/
│   │   └── shared/[token]/     # Public share + AI submission endpoints
│   └── shared/[token]/         # Public shared project view
├── components/
│   ├── assembly/               # Tiptap-based section editor
│   ├── coordination/           # Coordination table with inline editing
│   ├── docs/                   # Framework library browser + editor
│   ├── export/                 # JSON/Markdown/CSV export
│   ├── layout/                 # AppShell, Sidebar, Header, MobileNav
│   ├── onboarding/             # 4-step onboarding wizard
│   ├── performance/            # Star ratings, charts, CSV export
│   ├── prompts/                # Prompt cards, modal, copy
│   ├── search/                 # Global Cmd+K search modal
│   ├── share/                  # Share link management
│   ├── shared-view/            # Public read-only view for AIs
│   ├── testing/                # HTML/Markdown/JSON preview lab
│   └── ui/                     # Shadcn component library
├── lib/
│   ├── actions/                # Server actions (mutations)
│   ├── hooks/                  # React Query hooks
│   ├── queries/                # Data fetching functions
│   └── supabase/               # Client/server Supabase instances
├── supabase/
│   └── schema.sql              # Complete database schema + RLS
├── src-tauri/                  # Tauri desktop app wrapper
├── types/
│   └── database.ts             # TypeScript types from Supabase schema
└── docs/                       # Additional documentation
```

---

## Key Features In Depth

### Coordination Table
The backbone of every project. Inline-edit any field, assign tasks to AI models (Claude, GPT-4, Gemini, Grok, Copilot, Perplexity), set priority and status, track dependencies with automatic conflict warnings. Tasks group by assigned AI.

### Assembly Editor (Tiptap)
Each section has a full rich text editor: bold, italic, headings, lists, code blocks, blockquotes, horizontal rules. Content auto-saves with a 1.5s debounce. Per-section word counts. Sections can be reordered, duplicated, or deleted.

### Shared Links for AI Collaboration
Generate a share link for any project with optional password protection and expiry. The linked page shows the full project context (tasks, prompts, assembly state) in a clean read-only view. A **Submit Output** tab lets AIs paste their completed work directly into the project's assembly sections — no copy-pasting into your app.

### Performance Tracking
Log quality ratings (1–5 stars), revision count, and time spent for every AI task. The tracker auto-calculates per-AI averages, identifies top performers, and exports a full CSV report.

### Framework Library
All 16 framework documents are pre-seeded on first use. Every doc is fully editable using the same Tiptap editor. New documents can be created from scratch. Full-text search across all content.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open global search |
| `⌘/` | Toggle sidebar |
| `⌘N` | New project |
| `⌘S` | Save (in editors) |
| `⌘Enter` | Run (in Testing Lab) |
| `Escape` | Close modal |
| `↑↓` | Navigate search results |
| `Enter` | Open search result |

---

## Deployment

### Web (Vercel)

See **[SETUP.md](./SETUP.md#vercel-deployment)** for the full guide.

```bash
# Push to GitHub, connect to Vercel, add env vars — done.
git push origin main
```

### Desktop (Windows)

See **[DESKTOP.md](./DESKTOP.md)** for the Tauri build guide.

```bash
npm run desktop:build
# Output: src-tauri/target/release/bundle/
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | For admin operations (backups) |

See **[.env.local.example](./.env.local.example)** for the full template.

---

## Contributing / Extending

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the project architecture guide and how to add new features.

---

## License

MIT — use it, adapt it, build on it.
