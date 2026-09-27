import { supabase } from '@/lib/supabase'
import { Department } from '@/types'

export async function getDepartments() {
  const { data, error } = await supabase.from('departments').select('*').order('name')
  return { data: (data ?? []) as Department[], error }
}
