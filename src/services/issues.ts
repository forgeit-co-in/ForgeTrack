import { supabase } from '@/lib/supabase'
import { Issue } from '@/types'

export async function raiseIssue(payload: Omit<Issue, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('issues').insert(payload).select().single()
  return { data: data as Issue | null, error }
}

export async function getIssues(departmentId?: string) {
  let query = supabase.from('issues').select('*').order('created_at', { ascending: false })
  if (departmentId) query = query.eq('department_id', departmentId)
  const { data, error } = await query
  return { data: (data ?? []) as Issue[], error }
}

export async function updateIssueStatus(id: string, status: Issue['status']) {
  const { data, error } = await supabase.from('issues').update({ status }).eq('id', id).select().single()
  return { data: data as Issue | null, error }
}
