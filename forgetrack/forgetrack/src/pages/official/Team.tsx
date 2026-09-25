import { useAuth } from '@/context/AuthContext'
import { DEPARTMENT_CONFIG, ROLE_TO_SLUG } from '@/lib/departments'
import { Users } from 'lucide-react'

export function Team() {
  const { profile } = useAuth()
  const slug = profile ? ROLE_TO_SLUG[profile.role] : undefined
  const config = slug ? DEPARTMENT_CONFIG[slug] : undefined

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">My Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {config?.team.map((role, idx) => (
          <div key={idx} className="card p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
              <Users size={15} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">{role}</p>
              <p className="text-xs text-muted">Team member</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
