'use client'
import { useState, useCallback } from 'react'
type Toast = { id: string; title?: string; description?: string; variant?: 'default' | 'destructive' }
let listeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []
function dispatch(toast: Toast) {
  toasts = [...toasts, toast]
  listeners.forEach(l => l(toasts))
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== toast.id)
    listeners.forEach(l => l(toasts))
  }, 3000)
}
export function toast(props: Omit<Toast, 'id'>) { dispatch({ ...props, id: Math.random().toString(36).slice(2) }) }
export function useToast() {
  const [state, setState] = useState<Toast[]>(toasts)
  useState(() => { listeners.push(setState); return () => { listeners = listeners.filter(l => l !== setState) } })
  return { toasts: state, toast }
}
