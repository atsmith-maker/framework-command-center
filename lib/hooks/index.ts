'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { createTask, updateTask, deleteTask } from '@/lib/actions/tasks'
import { createSection, updateSection, deleteSection } from '@/lib/actions/sections'
import { createPrompt, updatePrompt, deletePrompt } from '@/lib/actions/prompts'
import { createPerformanceLog, deletePerformanceLog } from '@/lib/actions/performance'
import type { Task, Section, Prompt, PerformanceLog } from '@/types/database'

export function useTasks(projectId: string, initialData?: Task[]) {
  const qc = useQueryClient()
  const supabase = createClient()
  const query = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('coordination_tasks').select('*').eq('project_id', projectId).order('sort_order')
      if (error) throw error
      return data ?? []
    },
    initialData,
  })
  const create = useMutation({
    mutationFn: (vars: { title: string; data?: Record<string, unknown> }) => createTask(projectId, vars.title, vars.data as Parameters<typeof createTask>[2]),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })
  const update = useMutation({
    mutationFn: (vars: { id: string; updates: Record<string, unknown> }) => updateTask(vars.id, vars.updates),
    onMutate: async ({ id, updates }) => {
      await qc.cancelQueries({ queryKey: ['tasks', projectId] })
      const prev = qc.getQueryData<Task[]>(['tasks', projectId])
      qc.setQueryData(['tasks', projectId], (old: Task[] | undefined) => old?.map(t => t.id === id ? { ...t, ...updates } : t))
      return { prev }
    },
    onError: (_e, _v, ctx) => qc.setQueryData(['tasks', projectId], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })
  const remove = useMutation({
    mutationFn: (id: string) => deleteTask(id, projectId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })
  return { tasks: query.data ?? [], isLoading: query.isLoading, create, update, remove }
}

export function useSections(projectId: string, initialData?: Section[]) {
  const qc = useQueryClient()
  const supabase = createClient()
  const query = useQuery({
    queryKey: ['sections', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('assembly_sections').select('*').eq('project_id', projectId).order('sort_order')
      if (error) throw error
      return data ?? []
    },
    initialData,
  })
  const create = useMutation({
    mutationFn: (title: string) => createSection(projectId, title, (query.data?.length ?? 0)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sections', projectId] }),
  })
  const update = useMutation({
    mutationFn: (vars: { id: string; updates: Parameters<typeof updateSection>[1] }) => updateSection(vars.id, vars.updates),
    onMutate: async ({ id, updates }) => {
      await qc.cancelQueries({ queryKey: ['sections', projectId] })
      const prev = qc.getQueryData<Section[]>(['sections', projectId])
      qc.setQueryData(['sections', projectId], (old: Section[] | undefined) => old?.map(s => s.id === id ? { ...s, ...updates } : s))
      return { prev }
    },
    onError: (_e, _v, ctx) => qc.setQueryData(['sections', projectId], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['sections', projectId] }),
  })
  const remove = useMutation({
    mutationFn: (id: string) => deleteSection(id, projectId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sections', projectId] }),
  })
  return { sections: query.data ?? [], isLoading: query.isLoading, create, update, remove }
}

export function usePrompts(projectId: string, initialData?: Prompt[]) {
  const qc = useQueryClient()
  const supabase = createClient()
  const query = useQuery({
    queryKey: ['prompts', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('prompts').select('*').eq('project_id', projectId).order('sort_order')
      if (error) throw error
      return data ?? []
    },
    initialData,
  })
  const create = useMutation({
    mutationFn: (vars: { title: string; content: string; target_ai?: string; category?: string }) => createPrompt(projectId, vars.title, vars.content, vars.target_ai, vars.category),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prompts', projectId] }),
  })
  const update = useMutation({
    mutationFn: (vars: { id: string; updates: Parameters<typeof updatePrompt>[1] }) => updatePrompt(vars.id, vars.updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prompts', projectId] }),
  })
  const remove = useMutation({
    mutationFn: (id: string) => deletePrompt(id, projectId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prompts', projectId] }),
  })
  return { prompts: query.data ?? [], isLoading: query.isLoading, create, update, remove }
}

export function usePerformance(projectId: string, initialData?: PerformanceLog[]) {
  const qc = useQueryClient()
  const supabase = createClient()
  const query = useQuery({
    queryKey: ['performance', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('performance_logs').select('*').eq('project_id', projectId).order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    initialData,
  })
  const create = useMutation({
    mutationFn: (vars: { ai_model: string; rating: number; revisions?: number; time_spent?: number; notes?: string; task_id?: string }) => createPerformanceLog(projectId, vars.ai_model, vars.rating, vars.revisions, vars.time_spent, vars.notes, vars.task_id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['performance', projectId] }),
  })
  const remove = useMutation({
    mutationFn: (id: string) => deletePerformanceLog(id, projectId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['performance', projectId] }),
  })
  return { logs: query.data ?? [], isLoading: query.isLoading, create, remove }
}
