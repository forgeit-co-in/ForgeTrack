import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { StatusBadge } from '@/components/StatusBadge'
import { useDepartmentSummaries } from '@/hooks/useDepartments'
import { DEPARTMENT_CONFIG } from '@/lib/departments'
import { DailyUpdate, WeeklyReport, Issue } from '@/types'
import { getDailyUpdates, getWeeklyReports } from '@/services/updates'
import { getIssues } from '@/services/issues'

export function DepartmentsIndex() {
  const { summaries, loading } = useDepartmentSummaries()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading && <p className="text-sm text-muted">Loading…</p>}
        {summaries.map((s) => (
          <a key={s.department.id} href={`/ceo/departments/${s.department.slug}`} className="card p-5 flex items-center justify-between hover:shadow-pop transition-shadow">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide">{s.department.official_role}</p>
              <p className="font-semibold">{s.department.official_name} — {s.department.name}</p>
            </div>
            <StatusBadge status={s.status} />
          </a>
        ))}
      </div>
    </div>
  )
}

export function DepartmentDetail() {
  const { slug } = useParams()
  const config = slug ? DEPARTMENT_CONFIG[slug] : undefined
  const [updates, setUpdates] = useState<DailyUpdate[]>([])
  const [weekly, setWeekly] = useState<WeeklyReport[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const { summaries } = useDepartmentSummaries()
  const summary = summaries.find((s) => s.department.slug === slug)

  useEffect(() => {
    if (!summary) return
    getDailyUpdates(summary.department.id, 14).then((r) => setUpdates(r.data))
    getWeeklyReports(summary.department.id, 4).then((r) => setWeekly(r.data))
    getIssues(summary.department.id).then((r) => setIssues(r.data))
  }, [summary])

  if (!config) return <p className="text-sm text-muted">Unknown department.</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide">{config.official_role} · {config.official_name}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{config.name}</h1>
        </div>
        {summary && <StatusBadge status={summary.status} />}
      </div>
      <p className="text-sm text-muted -mt-4">{config.focus_area}</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-3">Recent Daily Updates</h2>
          <div className="flex flex-col divide-y divide-border">
            {updates.length === 0 && <p className="text-sm text-muted py-2">No updates yet.</p>}
            {updates.map((u) => (
              <div key={u.id} className="py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{u.date}</span>
                  <StatusBadge status={u.overall_status} compact />
                </div>
                <p className="text-sm text-muted mt-1 line-clamp-2">{u.work_completed}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-3">Weekly Reports</h2>
          <div className="flex flex-col divide-y divide-border">
            {weekly.length === 0 && <p className="text-sm text-muted py-2">No weekly reports yet.</p>}
            {weekly.map((w) => (
              <div key={w.id} className="py-2.5">
                <p className="text-xs font-medium">{w.week_start} → {w.week_end}</p>
                <p className="text-sm text-muted mt-1 line-clamp-2">{w.achievements}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold mb-3">Issues</h2>
        <div className="flex flex-col divide-y divide-border">
          {issues.length === 0 && <p className="text-sm text-muted py-2">No issues raised.</p>}
          {issues.map((i) => (
            <div key={i.id} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{i.title}</p>
                <p className="text-xs text-muted">{i.priority} priority · {i.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold mb-3">Team</h2>
        <div className="flex flex-wrap gap-2">
          {config.team.map((t, idx) => (
            <span key={idx} className="text-xs bg-surface border border-border rounded-full px-3 py-1.5">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
