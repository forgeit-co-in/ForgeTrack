import { useAuth } from '@/context/AuthContext'
import { KpiCard } from '@/components/KpiCard'
import { DepartmentCard } from '@/components/DepartmentCard'
import { useDepartmentSummaries } from '@/hooks/useDepartments'
import { Users, PhoneCall, CalendarCheck, Rocket, CheckCircle2, IndianRupee, ListTodo, AlertOctagon } from 'lucide-react'

export function CeoDashboard() {
  const { profile } = useAuth()
  const { summaries, loading, error } = useDepartmentSummaries()

  const totals = summaries.reduce(
    (acc, s) => {
      acc.openIssues += s.open_issues
      return acc
    },
    { openIssues: 0 }
  )

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Manish'

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted">Good morning, {firstName}</p>
        <h1 className="text-2xl font-semibold tracking-tight">CEO Command Center</h1>
      </div>

      {error && (
        <div className="card p-4 text-sm text-red bg-red-soft border-red/20">
          Could not load live data ({error}). Connect Supabase to see real numbers — showing an empty state.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Leads" value={loading ? '—' : summaries.reduce((a, s) => a + Number(s.key_metric_value), 0)} icon={Users} />
        <KpiCard label="Open Issues" value={loading ? '—' : totals.openIssues} icon={AlertOctagon} />
        <KpiCard label="Active Projects" value={loading ? '—' : '—'} icon={Rocket} />
        <KpiCard label="Pending Tasks" value={loading ? '—' : summaries.reduce((a, s) => a + s.pending_items, 0)} icon={ListTodo} />
        <KpiCard label="Calls Completed" value="—" icon={PhoneCall} />
        <KpiCard label="Meetings" value="—" icon={CalendarCheck} />
        <KpiCard label="Completed Projects" value="—" icon={CheckCircle2} />
        <KpiCard label="Revenue" value="—" icon={IndianRupee} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Departments</h2>
          <span className="text-xs text-muted">Tap a card for full department detail</span>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="card p-5 h-40 animate-pulse bg-surface" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaries.map((s) => (
              <DepartmentCard key={s.department.id} summary={s} />
            ))}
            {summaries.length === 0 && (
              <div className="card p-6 text-sm text-muted md:col-span-2">
                No departments found yet. Run the Supabase schema and seed the four departments to populate this view.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
