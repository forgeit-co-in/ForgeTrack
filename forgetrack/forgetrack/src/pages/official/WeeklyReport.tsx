import { useState, FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { submitWeeklyReport } from '@/services/updates'
import { CheckCircle2 } from 'lucide-react'

function startOfWeek() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().slice(0, 10)
}

export function WeeklyReport() {
  const { profile } = useAuth()
  const [form, setForm] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function field(key: string) {
    return form[key] ?? ''
  }
  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!profile?.department_id) return
    setSubmitting(true)
    const weekStart = startOfWeek()
    const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 86400000).toISOString().slice(0, 10)
    await submitWeeklyReport({
      department_id: profile.department_id,
      created_by: profile.id,
      week_start: weekStart,
      week_end: weekEnd,
      achievements: field('achievements'),
      leads: Number(field('leads')) || 0,
      sales: Number(field('sales')) || 0,
      projects_completed: Number(field('projects_completed')) || 0,
      team_productivity_notes: field('team_productivity_notes'),
      completed_work: field('completed_work'),
      pending_work: field('pending_work'),
      problems: field('problems'),
      next_week_priorities: field('next_week_priorities')
    })
    setSubmitting(false)
    setSubmitted(true)
    setForm({})
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Weekly Report</h1>
      <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-5">
        <div>
          <label className="text-xs font-medium text-muted">Major Achievements</label>
          <textarea value={field('achievements')} onChange={(e) => setField('achievements', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-muted">Leads</label>
            <input type="number" value={field('leads')} onChange={(e) => setField('leads', e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Sales</label>
            <input type="number" value={field('sales')} onChange={(e) => setField('sales', e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Projects Done</label>
            <input type="number" value={field('projects_completed')} onChange={(e) => setField('projects_completed', e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Team Productivity Notes</label>
          <textarea value={field('team_productivity_notes')} onChange={(e) => setField('team_productivity_notes', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Completed Work</label>
          <textarea value={field('completed_work')} onChange={(e) => setField('completed_work', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Pending Work</label>
          <textarea value={field('pending_work')} onChange={(e) => setField('pending_work', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Problems</label>
          <textarea value={field('problems')} onChange={(e) => setField('problems', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Next Week's Priorities</label>
          <textarea value={field('next_week_priorities')} onChange={(e) => setField('next_week_priorities', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>
        <button type="submit" disabled={submitting} className="bg-ink text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
          {submitted ? <><CheckCircle2 size={15} /> Submitted</> : submitting ? 'Submitting…' : 'Submit Weekly Report'}
        </button>
      </form>
    </div>
  )
}
