import { useAuth } from '@/context/AuthContext'
import { DEPARTMENT_CONFIG, ROLE_TO_SLUG } from '@/lib/departments'
import { User, Mail, Shield, Building2, LogOut } from 'lucide-react'

const ROLE_LABEL: Record<string, string> = {
  CEO: 'Chief Executive Officer',
  CVO: 'Chief Visionary Officer',
  CMO: 'Chief Marketing Officer',
  CTO: 'Chief Technology Officer',
  CDO: 'Chief Development Officer'
}

export function Profile() {
  const { profile, signOut } = useAuth()
  if (!profile) return null

  const slug = ROLE_TO_SLUG[profile.role]
  const dept = slug ? DEPARTMENT_CONFIG[slug] : undefined

  const rows = [
    { icon: User, label: 'Full Name', value: profile.full_name },
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Shield, label: 'Role', value: `${profile.role} — ${ROLE_LABEL[profile.role] ?? ''}` },
    { icon: Building2, label: 'Department', value: dept ? dept.name : 'All departments (CEO)' }
  ]

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>

      <div className="card p-6 flex flex-col items-center gap-3 text-center">
        <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center text-lg font-semibold text-accent">
          {profile.full_name?.charAt(0) ?? '?'}
        </div>
        <div>
          <p className="font-semibold">{profile.full_name}</p>
          <p className="text-xs text-muted">{profile.email}</p>
        </div>
      </div>

      <div className="card divide-y divide-border">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 px-5 py-3.5">
            <r.icon size={16} className="text-muted shrink-0" />
            <div>
              <p className="text-[11px] text-muted">{r.label}</p>
              <p className="text-sm font-medium">{r.value}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={signOut}
        className="self-start flex items-center gap-2 text-sm font-medium text-red bg-red-soft rounded-lg px-4 py-2.5"
      >
        <LogOut size={15} /> Sign out
      </button>
    </div>
  )
}
