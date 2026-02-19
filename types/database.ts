export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: { id: string; user_id: string; name: string; description: string | null; status: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; name: string; description?: string | null; status?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string; name?: string; description?: string | null; status?: string; updated_at?: string }
      }
      coordination_tasks: {
        Row: { id: string; project_id: string; user_id: string; title: string; description: string | null; assigned_ai: string | null; status: string; priority: string; dependencies: string[] | null; sort_order: number; created_at: string; updated_at: string }
        Insert: { id?: string; project_id: string; user_id: string; title: string; description?: string | null; assigned_ai?: string | null; status?: string; priority?: string; dependencies?: string[] | null; sort_order?: number; created_at?: string; updated_at?: string }
        Update: { id?: string; title?: string; description?: string | null; assigned_ai?: string | null; status?: string; priority?: string; dependencies?: string[] | null; sort_order?: number; updated_at?: string }
      }
      assembly_sections: {
        Row: { id: string; project_id: string; user_id: string; title: string; content: string | null; sort_order: number; created_at: string; updated_at: string }
        Insert: { id?: string; project_id: string; user_id: string; title: string; content?: string | null; sort_order?: number; created_at?: string; updated_at?: string }
        Update: { id?: string; title?: string; content?: string | null; sort_order?: number; updated_at?: string }
      }
      prompts: {
        Row: { id: string; project_id: string; user_id: string; title: string; content: string; target_ai: string | null; category: string | null; sort_order: number; created_at: string; updated_at: string }
        Insert: { id?: string; project_id: string; user_id: string; title: string; content: string; target_ai?: string | null; category?: string | null; sort_order?: number; created_at?: string; updated_at?: string }
        Update: { id?: string; title?: string; content?: string; target_ai?: string | null; category?: string | null; sort_order?: number; updated_at?: string }
      }
      performance_logs: {
        Row: { id: string; project_id: string; task_id: string | null; user_id: string; ai_model: string; rating: number; revisions: number; time_spent: number | null; notes: string | null; created_at: string }
        Insert: { id?: string; project_id: string; task_id?: string | null; user_id: string; ai_model: string; rating: number; revisions?: number; time_spent?: number | null; notes?: string | null; created_at?: string }
        Update: { id?: string; rating?: number; revisions?: number; time_spent?: number | null; notes?: string | null }
      }
      framework_docs: {
        Row: { id: string; user_id: string; slug: string; title: string; content: string | null; category: string | null; is_seeded: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; slug: string; title: string; content?: string | null; category?: string | null; is_seeded?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; title?: string; content?: string | null; category?: string | null; updated_at?: string }
      }
      project_shares: {
        Row: { id: string; project_id: string; user_id: string; token: string; password_hash: string | null; expires_at: string | null; max_views: number | null; view_count: number; created_at: string }
        Insert: { id?: string; project_id: string; user_id: string; token: string; password_hash?: string | null; expires_at?: string | null; max_views?: number | null; view_count?: number; created_at?: string }
        Update: { id?: string; view_count?: number }
      }
      user_profiles: {
        Row: { id: string; onboarding_completed: boolean; created_at: string; updated_at: string }
        Insert: { id: string; onboarding_completed?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; onboarding_completed?: boolean; updated_at?: string }
      }
    }
  }
}

export type Project = Database['public']['Tables']['projects']['Row']
export type Task = Database['public']['Tables']['coordination_tasks']['Row']
export type Section = Database['public']['Tables']['assembly_sections']['Row']
export type Prompt = Database['public']['Tables']['prompts']['Row']
export type PerformanceLog = Database['public']['Tables']['performance_logs']['Row']
export type FrameworkDoc = Database['public']['Tables']['framework_docs']['Row']
export type ProjectShare = Database['public']['Tables']['project_shares']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']

export const AI_MODELS = ['Claude', 'ChatGPT', 'Gemini', 'Grok', 'Perplexity', 'DeepSeek'] as const
export type AIModel = typeof AI_MODELS[number]

export const TASK_STATUSES = ['todo', 'in-progress', 'review', 'done', 'blocked'] as const
export type TaskStatus = typeof TASK_STATUSES[number]

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const
export type TaskPriority = typeof TASK_PRIORITIES[number]
