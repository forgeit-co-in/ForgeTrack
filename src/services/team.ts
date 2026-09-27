import { supabase } from '@/lib/supabase'
import { TeamMember } from '@/types'

export async function getTeamMembers(departmentId: string) {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('department_id', departmentId)
    .order('created_at')
  return { data: (data ?? []) as TeamMember[], error }
}

export async function addTeamMember(departmentId: string, name: string, roleTitle: string) {
  const { data, error } = await supabase
    .from('team_members')
    .insert({ department_id: departmentId, name, role_title: roleTitle })
    .select()
    .single()
  return { data: data as TeamMember | null, error }
}

export async function removeTeamMember(id: string) {
  const { error } = await supabase.from('team_members').delete().eq('id', id)
  return { error }
}
