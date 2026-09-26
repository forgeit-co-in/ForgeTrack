import { supabase } from '@/lib/supabase'
import { DailyUpdate, WeeklyReport } from '@/types'

export async function submitDailyUpdate(payload: Omit<DailyUpdate, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('daily_updates').insert(payload).select().single()
  return { data: data as DailyUpdate | null, error }
}

export async function getDailyUpdates(departmentId?: string, limit = 30) {
  let query = supabase.from('daily_updates').select('*').order('date', { ascending: false }).limit(limit)
  if (departmentId) query = query.eq('department_id', departmentId)
  const { data, error } = await query
  return { data: (data ?? []) as DailyUpdate[], error }
}

export async function submitWeeklyReport(payload: Omit<WeeklyReport, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('weekly_reports').insert(payload).select().single()
  return { data: data as WeeklyReport | null, error }
}

export async function getWeeklyReports(departmentId?: string, limit = 12) {
  let query = supabase.from('weekly_reports').select('*').order('week_start', { ascending: false }).limit(limit)
  if (departmentId) query = query.eq('department_id', departmentId)
  const { data, error } = await query
  return { data: (data ?? []) as WeeklyReport[], error }
}
