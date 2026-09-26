import { supabase } from '@/lib/supabase'
import { Feedback } from '@/types'

export async function sendFeedback(payload: Omit<Feedback, 'id' | 'created_at' | 'read'>) {
  const { data, error } = await supabase.from('feedback').insert({ ...payload, read: false }).select().single()
  return { data: data as Feedback | null, error }
}

export async function getFeedback(departmentId?: string) {
  let query = supabase.from('feedback').select('*').order('created_at', { ascending: false })
  if (departmentId) query = query.eq('department_id', departmentId)
  const { data, error } = await query
  return { data: (data ?? []) as Feedback[], error }
}
