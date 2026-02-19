'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const FRAMEWORK_DOCS = [
  { slug: 'overview', title: 'Framework Overview', category: 'Core', content: '# Framework Overview\n\nThe AI Project Framework v3.0 is a coordination system for managing complex projects using multiple AI models working in parallel.\n\n## Core Principles\n\n- **Specialization**: Each AI has strengths. Use them accordingly.\n- **Coordination**: Claude acts as the integration and QA layer.\n- **Flexibility**: The framework scales from 3-task projects to 60+ task productions.\n\n## The AI Team\n\n- **Claude** — Architecture, integration, QA\n- **ChatGPT** — User-facing content, writing\n- **Gemini** — Hardware, technical builds\n- **Perplexity** — Research, fact-checking\n- **Grok** — Code generation\n- **DeepSeek** — Algorithms, optimization' },
  { slug: 'quick-start', title: 'Quick Start Guide', category: 'Core', content: '# Quick Start Guide\n\n## 5 Steps to Your First Project\n\n1. **Define scope** — What are you building? What are the deliverables?\n2. **Break into tasks** — Each task should be assignable to one AI\n3. **Assign to AIs** — Match tasks to the AI best suited for them\n4. **Execute in phases** — Discovery → Execution → Integration → Trial\n5. **Integrate outputs** — Claude assembles everything into the final deliverable' },
  { slug: 'phase1-discovery', title: 'Phase 1: Discovery & Design', category: 'Phases', content: '# Phase 1: Discovery & Design\n\nThe discovery phase is where you and Claude plan the entire project before any execution begins.\n\n## Outputs\n\n- Complete task list with assignments\n- Prompt library for each task\n- Timeline and dependencies\n- Success criteria' },
  { slug: 'phase2-execution', title: 'Phase 2: Execution & Iteration', category: 'Phases', content: '# Phase 2: Execution & Iteration\n\nDistribute tasks to the assigned AIs and collect outputs.\n\n## Process\n\n1. Send prompts to each AI\n2. Collect and review outputs\n3. Iterate on unsatisfactory outputs\n4. Log performance ratings' },
  { slug: 'phase3-integration', title: 'Phase 3: Integration & Mastering', category: 'Phases', content: '# Phase 3: Integration & Mastering\n\nClaude unifies all AI outputs into one cohesive deliverable.\n\n## Steps\n\n1. Collect all approved outputs\n2. Resolve conflicts and inconsistencies\n3. Apply consistent voice and formatting\n4. Produce final integrated document' },
  { slug: 'phase4-trial', title: 'Phase 4: Trial & Refinement', category: 'Phases', content: '# Phase 4: Trial & Refinement\n\nTest the deliverable and refine based on feedback.\n\n## Checklist\n\n- [ ] Core functionality verified\n- [ ] Edge cases tested\n- [ ] Feedback incorporated\n- [ ] Final approval' },
  { slug: 'coordination-guide', title: 'Master Coordination Guide', category: 'Operations', content: '# Master Coordination Guide\n\nHow to manage task flow across multiple AIs simultaneously.\n\n## Task States\n\n- **Todo** — Not started\n- **In Progress** — AI is working on it\n- **Review** — Output received, under review\n- **Done** — Approved and complete\n- **Blocked** — Waiting on dependency' },
  { slug: 'prompt-library-guide', title: 'Prompt Library Guide', category: 'Operations', content: '# Prompt Library Guide\n\nHow to write effective prompts for each AI in your team.\n\n## Prompt Structure\n\n1. **Context** — What project, what phase\n2. **Task** — Specific deliverable\n3. **Constraints** — Format, length, style\n4. **Examples** — If helpful\n5. **Output format** — Exactly what you want back' },
  { slug: 'performance-tracking', title: 'AI Performance Tracking', category: 'Operations', content: '# AI Performance Tracking\n\nTrack which AIs perform best for which types of tasks.\n\n## Rating Scale\n\n- ⭐ 1 — Major rework needed\n- ⭐⭐ 2 — Significant issues\n- ⭐⭐⭐ 3 — Acceptable with edits\n- ⭐⭐⭐⭐ 4 — Good, minor tweaks\n- ⭐⭐⭐⭐⭐ 5 — Excellent, use as-is' },
  { slug: 'ai-team-roles', title: 'AI Team Roles & Strengths', category: 'Reference', content: '# AI Team Roles & Strengths\n\n## Claude\nBest for: Architecture, long-form analysis, integration, code review, QA\n\n## ChatGPT\nBest for: Creative writing, user-facing copy, brainstorming, conversational content\n\n## Gemini\nBest for: Technical documentation, hardware specs, multimodal tasks\n\n## Perplexity\nBest for: Current research, fact-checking, citations, market data\n\n## Grok\nBest for: Code generation, debugging, technical problem-solving\n\n## DeepSeek\nBest for: Algorithms, mathematical optimization, data processing' },
  { slug: 'export-guide', title: 'Export & Backup Guide', category: 'Reference', content: '# Export & Backup Guide\n\n## Export Formats\n\n- **JSON** — Complete project backup, restorable\n- **Markdown** — Human-readable document\n- **CSV** — Performance data for spreadsheets\n\n## Backup Strategy\n\nExport JSON backups at the end of each phase. Store in cloud storage.' },
  { slug: 'share-links', title: 'Shared Links for AI Collaboration', category: 'Reference', content: '# Shared Links for AI Collaboration\n\nGenerate a shareable URL that gives AIs read access to your project context.\n\n## Use Cases\n\n- Give an AI the full project context before assigning a task\n- Let AIs submit their outputs directly into the assembly\n- Share project status with collaborators' },
  { slug: 'flexibility-guide', title: 'Framework Flexibility Guide', category: 'Core', content: '# Framework Flexibility Guide\n\nThe framework scales to any project size.\n\n## Small Projects (3-10 tasks)\n- 1-2 phases may be sufficient\n- Single AI may handle multiple roles\n- Lighter documentation\n\n## Medium Projects (10-30 tasks)\n- Full 4-phase structure\n- 2-4 AIs\n- Full prompt library\n\n## Large Projects (30+ tasks)\n- Extended phases with sub-phases\n- Full AI team\n- Detailed performance tracking' },
  { slug: 'chrome-setup', title: 'Chrome & Browser Setup', category: 'Reference', content: '# Chrome & Browser Setup\n\nOptimize your browser for multi-AI coordination.\n\n## Recommended Setup\n\n- Pin tabs for each AI you use regularly\n- Use tab groups: one group per project phase\n- Bookmark your Framework Command Center URL\n- Enable notifications for email confirmations' },
  { slug: 'automation-export', title: 'Automation & Export Workflows', category: 'Operations', content: '# Automation & Export Workflows\n\nStreamline repetitive tasks in your AI coordination workflow.\n\n## Weekly Workflow\n\n1. Monday: Review all in-progress tasks\n2. Export CSV performance report\n3. Update task statuses\n4. Prepare prompts for the week\n5. Friday: Full JSON backup' },
  { slug: 'subcontractors', title: 'Subcontractor Tools Guide', category: 'Reference', content: '# Subcontractor Tools Guide\n\nWhen to use specialized tools beyond the core AI team.\n\n## Categories\n\n- **Image Generation**: Midjourney, DALL-E, Stable Diffusion\n- **Video**: Runway, Sora\n- **Audio**: ElevenLabs, Suno\n- **Code**: GitHub Copilot, Cursor\n- **Research**: Consensus, Elicit\n\n## Decision Rule\n\nUse subcontractors only when core AIs cannot do the job adequately or a specialist tool is clearly superior.' },
]

export async function seedFrameworkDocs(userId: string) {
  const supabase = createServerClient()
  const existing = await supabase.from('framework_docs').select('slug').eq('user_id', userId)
  const existingSlugs = new Set((existing.data ?? []).map((d: { slug: string }) => d.slug))
  const toInsert = FRAMEWORK_DOCS.filter(d => !existingSlugs.has(d.slug)).map(d => ({ ...d, user_id: userId, is_seeded: true }))
  if (toInsert.length > 0) {
    await supabase.from('framework_docs').insert(toInsert)
  }
  revalidatePath('/library')
}

export async function updateDoc(id: string, updates: { title?: string; content?: string }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('framework_docs').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id)
  if (error) throw error
  revalidatePath('/library')
}
