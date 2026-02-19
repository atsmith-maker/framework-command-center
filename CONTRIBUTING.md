# Contributing & Architecture Guide

A guide to the Framework Command Center codebase — how it's structured, the patterns used, and how to extend it.

---

## Architecture Overview

Framework Command Center is a **Next.js 14 App Router** application with:

- **Supabase** for database, auth, and realtime subscriptions
- **TanStack Query** for client-side data fetching and caching
- **Server Actions** for mutations (Next.js `'use server'` functions)
- **Tiptap** for rich text editing in Assembly and Docs
- **Shadcn/UI** for the component library (built on Radix UI + Tailwind)

### Data flow

```
User action
  → Client component
    → Server Action (lib/actions/*.ts) or API Route (app/api/**)
      → Supabase (PostgreSQL + RLS)
        → TanStack Query cache invalidation
          → Component re-renders with fresh data
```

For read-heavy pages (dashboard, project pages), data is fetched server-side via **Server Components** and passed as `initialData` to TanStack Query hooks — giving you both fast initial loads and live reactivity.

---

## Directory Structure

### `app/` — Routes

```
app/
├── (app)/               # Authenticated routes (wrapped by AppShell)
│   ├── layout.tsx       # Wraps children in AppShell
│   ├── dashboard/       # Dashboard page
│   ├── projects/
│   │   └── [projectId]/ # Project workspace
│   │       ├── layout.tsx        # Project tabs (uses ProjectLayoutClient)
│   │       ├── layout.client.tsx # Tab nav with active state
│   │       ├── tasks/            # Coordination Table
│   │       ├── assembly/         # Assembly Editor
│   │       ├── prompts/          # Prompt Library
│   │       ├── performance/      # Performance Tracker
│   │       └── settings/         # Project Settings
│   ├── library/         # Framework docs browser + [slug] editor
│   ├── testing/         # Testing Lab
│   ├── help/            # Help & User Guide
│   └── settings/        # Global app settings
├── (auth)/              # Unauthenticated routes
│   ├── login/
│   ├── signup/
│   ├── reset-password/
│   └── callback/route.ts  # Supabase OAuth callback
├── api/
│   ├── auth/post-login/   # Smart post-login router (onboarding check)
│   ├── projects/[id]/backup/  # Backup download (GET) + restore (POST)
│   └── shared/[token]/    # Public project view + AI submission
├── shared/[token]/      # Public shared project page (no auth required)
└── page.tsx             # Root redirect
```

### `components/` — UI Components

Every feature has its own folder:

```
components/
├── assembly/       # AssemblyEditor, SectionEditor
├── coordination/   # CoordinationTable, TaskRow, TaskModal
├── common/         # Shared: BackupManager, EmptyState, HelpTooltip
├── dashboard/      # ProjectCard, QuickStats, RecentActivity, QuickActions
├── docs/           # DocsBrowser, DocEditor
├── export/         # ExportMenu
├── help/           # HelpPage
├── layout/         # AppShell, Sidebar, Header, MobileNav
├── onboarding/     # OnboardingWizard
├── performance/    # PerformanceTracker, StarRating
├── projects/       # NewProjectModal, ProjectsTable, ProjectSettingsForm
├── prompts/        # PromptLibrary, PromptCard, PromptModal
├── providers/      # UserProvider, QueryProvider, ThemeProvider
├── search/         # SearchModal
├── settings/       # SettingsPanel
├── share/          # ShareManager
├── shared-view/    # SharedProjectView (public read + AI submit)
├── testing/        # TestingLab
└── ui/             # Shadcn component library (button, card, dialog, etc.)
```

### `lib/` — Logic

```
lib/
├── actions/        # Server Actions (mutations)
│   ├── docs.ts     # createDoc, updateDoc, seedFrameworkDocs
│   ├── performance.ts
│   ├── projects.ts # createProject, updateProject, archiveProject, deleteProject
│   ├── prompts.ts  # createPrompt, updatePrompt, seedProjectPrompts
│   ├── sections.ts # createSection, updateSection, deleteSection
│   └── tasks.ts    # createTask, updateTask, deleteTask
├── hooks/          # TanStack Query hooks
│   ├── index.ts    # useTasks, useSections, usePrompts, usePerformance
│   ├── useDebounce.ts
│   ├── useProjects.ts
│   ├── useSections.ts
│   └── useTasks.ts
├── queries/        # Read-only Supabase fetchers (used in Server Components)
│   ├── docs.ts
│   ├── performance.ts
│   ├── projects.ts
│   ├── prompts.ts
│   ├── sections.ts
│   ├── shares.ts
│   └── tasks.ts
├── providers/      # QueryProvider (TanStack Query setup)
├── supabase/       # Supabase client factories
│   ├── client.ts   # Browser client (singleton)
│   └── server.ts   # Server client (per-request)
└── utils.ts        # cn() and other utilities
```

---

## Key Patterns

### Server Components + TanStack Query hydration

Heavy data-fetching pages use Server Components to load initial data, then pass it to client components via `initialData`:

```typescript
// app/(app)/projects/[projectId]/tasks/page.tsx (Server Component)
export default async function TasksPage({ params }) {
  const supabase = createServerClient()
  const tasks = await getTasksByProject(supabase, params.projectId)
  return <CoordinationTable projectId={params.projectId} initialTasks={tasks} />
}

// components/coordination/CoordinationTable.tsx (Client Component)
export function CoordinationTable({ projectId, initialTasks }) {
  const { tasks } = useTasks(projectId, initialTasks) // TanStack Query with initialData
  // ...
}
```

### Server Actions for mutations

All writes go through Server Actions (`'use server'` functions in `lib/actions/`). They handle auth, validation, Supabase writes, and `revalidatePath` cache busting:

```typescript
// lib/actions/tasks.ts
'use server'
export async function updateTask(id: string, data: Partial<Task>) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await supabase.from('coordination_tasks')
    .update(data).eq('id', id)
  if (error) throw error
  revalidatePath('/projects')
}
```

### Optimistic updates

TanStack Query mutations use `onMutate` for optimistic updates — the UI updates immediately, then rolls back if the server errors:

```typescript
useMutation({
  mutationFn: ({ id, ...updates }) => updateTaskAction(id, updates),
  onMutate: async ({ id, ...updates }) => {
    await queryClient.cancelQueries({ queryKey })
    const previous = queryClient.getQueryData(queryKey)
    queryClient.setQueryData(queryKey, old => old?.map(t => t.id === id ? { ...t, ...updates } : t))
    return { previous }
  },
  onError: (_, __, ctx) => queryClient.setQueryData(queryKey, ctx?.previous),
  onSettled: () => queryClient.invalidateQueries({ queryKey }),
})
```

### Realtime subscriptions

Supabase realtime is used for live task and project sync. Hooks subscribe to postgres changes and update the TanStack Query cache directly:

```typescript
// lib/hooks/useProjects.ts
supabase.channel('projects-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
    queryClient.setQueryData(['projects'], old => {
      if (payload.eventType === 'UPDATE') 
        return old?.map(p => p.id === payload.new.id ? payload.new : p)
      // ...
    })
  }).subscribe()
```

---

## Adding a New Feature

Here's the pattern to follow when adding a new feature to an existing project section:

**1. Add the database column** — Update `supabase/schema.sql` and run the migration in Supabase SQL Editor.

**2. Update TypeScript types** — Edit `types/database.ts` to add the new column.

**3. Add a query** — If it needs a read, add to the relevant file in `lib/queries/`.

**4. Add a server action** — If it needs writes, add to the relevant file in `lib/actions/`.

**5. Update the hook** — Wire the server action into the TanStack Query hook in `lib/hooks/index.ts`.

**6. Build the UI component** — Add or update the component in `components/[feature]/`.

**7. Wire it into the page** — Fetch `initialData` in the Server Component page and pass it to the component.

---

## Adding a New Page

1. Create `app/(app)/your-page/page.tsx` (Server Component)
2. Fetch data server-side and pass as props to a Client Component
3. Add the route to `PROTECTED_PATHS` in `middleware.ts` if needed (it's already covered by the `/(app)/` group)
4. Add a nav link to `Sidebar.tsx`, `MobileNav.tsx`, and optionally `QuickActions.tsx`

---

## Database Conventions

- All tables use UUID primary keys (`gen_random_uuid()`)
- All tables have `created_at` (immutable) and most have `updated_at` (auto-updated by trigger)
- All tables have RLS enabled — every query must be from an authenticated user who owns the data
- The `project_id` FK links child tables to their parent project; delete cascades automatically
- `sort_order` (integer) is used for user-defined ordering of tasks and sections

---

## Code Style

- **TypeScript strict mode** — no `any` except where Supabase types require it (cast with `as any`)
- **Named exports** — all components and functions use named exports (not default)
- **Server Components by default** — only add `'use client'` when you need hooks, event handlers, or browser APIs
- **Tailwind for styling** — no CSS modules or styled-components; use `cn()` from `lib/utils` for conditional classes
- **Shadcn/UI for primitives** — prefer existing components in `components/ui/` over building from scratch

---

## Environment Variables

See `.env.local.example` for the full list. Only two are required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The service role key is optional and only used by the backup/restore API route.

---

## Testing & QA

There's no automated test suite yet. Before shipping changes:

1. Run `npx tsc --noEmit` — must return zero errors
2. Run `npm run build` — must complete successfully
3. Test the core workflows manually (create project → add tasks → assembly → export)
4. Check mobile layout on a narrow viewport

---

## Deployment

See [SETUP.md](./SETUP.md) for Vercel deployment and [DESKTOP.md](./DESKTOP.md) for the Tauri Windows build.
