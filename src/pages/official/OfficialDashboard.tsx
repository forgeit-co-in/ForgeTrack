import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { KpiCard } from '@/components/KpiCard'
import { StatusBadge } from '@/components/StatusBadge'
import { DEPARTMENT_CONFIG, ROLE_TO_SLUG } from '@/lib/departments'
import { getDepartments } from '@/services/departments'
import { getDailyUpdates } from '@/services/updates'
import { getIssues } from '@/services/issues'
import { DailyUpdate, Issue } from '@/types'
import { computeStatus, filterByPeriod, sumField } from '@/utils/analytics'
import { Users, PhoneCall, Rocket, ListTodo } from 'lucide-react'

export function OfficialDashboard() {
  const { profile } = useAuth()
  const slug = profile ? ROLE_TO_SLUG[profile.role] : undefined
  const config = slug ? DEPARTMENT_CONFIG[slug] : undefined
  const [updates, setUpdates] = useState<DailyUpdate[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [deptId, setDeptId] = useState<string>('')

  useEffect(() => {
    if (!profile?.department_id) return
    setDeptId(profile.department_id)
    getDailyUpdates(profile.department_id, 60).then((r) => setUpdates(r.data))
    getIssues(profile.department_id).then((r) => setIssues(r.data))
  }, [profile])

  const openIssues = issues.filter((i) => i.status !== 'Resolved')
  const weekly = filterByPeriod(updates, 'weekly')
  const monthly = filterByPeriod(updates, 'monthly')
  const status = computeStatus(updates, openIssues.length)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{config?.official_role} · {config?.official_name}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{config?.name}</h1>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Leads (30d)" value={sumField(monthly, 'leads_generated')} icon={Users} />
        <KpiCard label="Calls (30d)" value={sumField(monthly, 'calls_completed')} icon={PhoneCall} />
        <KpiCard label="Projects Completed" value={sumField(monthly, 'projects_completed')} icon={Rocket} />
        <KpiCard label="Tasks (7d)" value={sumField(weekly, 'tasks_completed')} icon={ListTodo} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-3">Recent Updates</h2>
          <div className="flex flex-col divide-y divide-border">
            {updates.slice(0, 5).map((u) => (
              <div key={u.id} className="py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{u.date}</span>
                  <StatusBadge status={u.overall_status} compact />
                </div>
                <p className="text-sm text-muted mt-1 line-clamp-2">{u.work_completed}</p>
              </div>
            ))}
            {updates.length === 0 && <p className="text-sm text-muted py-2">Submit your first daily update to get started.</p>}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-3">Open Issues</h2>
          <div className="flex flex-col divide-y divide-border">
            {openIssues.slice(0, 5).map((i) => (
              <div key={i.id} className="py-2.5">
                <p className="text-sm font-medium">{i.title}</p>
                <p className="text-xs text-muted">{i.priority} · {i.status}</p>
              </div>
            ))}
            {openIssues.length === 0 && <p className="text-sm text-muted py-2">No open issues. Nice work.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
