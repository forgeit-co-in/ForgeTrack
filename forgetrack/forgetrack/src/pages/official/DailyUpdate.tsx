import { useState, FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { submitDailyUpdate } from '@/services/updates'
import { Status } from '@/types'
import { CheckCircle2 } from 'lucide-react'

const NUMERIC_FIELDS: { key: string; label: string }[] = [
  { key: 'leads_generated', label: 'Leads Generated' },
  { key: 'calls_completed', label: 'Calls Completed' },
  { key: 'meetings', label: 'Meetings' },
  { key: 'projects_started', label: 'Projects Started' },
  { key: 'projects_completed', label: 'Projects Completed' },
  { key: 'tasks_completed', label: 'Tasks Completed' },
  { key: 'revenue', label: 'Revenue / Sales' }
]

export function DailyUpdate() {
  const { profile } = useAuth()
  const [status, setStatus] = useState<Status>('green')
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
    await submitDailyUpdate({
      department_id: profile.department_id,
      created_by: profile.id,
      date: new Date().toISOString().slice(0, 10),
      overall_status: status,
      work_completed: field('work_completed'),
      work_in_progress: field('work_in_progress'),
      leads_generated: Number(field('leads_generated')) || 0,
      calls_completed: Number(field('calls_completed')) || 0,
      meetings: Number(field('meetings')) || 0,
      projects_started: Number(field('projects_started')) || 0,
      projects_completed: Number(field('projects_completed')) || 0,
      tasks_completed: Number(field('tasks_completed')) || 0,
      revenue: Number(field('revenue')) || 0,
      blockers: field('blockers'),
      support_needed: field('support_needed'),
      tomorrow_priorities: field('tomorrow_priorities'),
      notes: field('notes')
    })
    setSubmitting(false)
    setSubmitted(true)
    setForm({})
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Submit Daily Update</h1>

      <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-5">
        <div>
          <label className="text-xs font-medium text-muted">Overall Status</label>
          <div className="flex gap-2 mt-1.5">
            {(['green', 'yellow', 'red'] as Status[]).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStatus(s)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border capitalize ${
                  status === s ? 'bg-ink text-white border-ink' : 'border-border text-muted'
                }`}
              >
                {s === 'green' ? 'On Track' : s === 'yellow' ? 'Needs Attention' : 'Critical'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted">Work Completed</label>
          <textarea value={field('work_completed')} onChange={(e) => setField('work_completed', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Work In Progress</label>
          <textarea value={field('work_in_progress')} onChange={(e) => setField('work_in_progress', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {NUMERIC_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-medium text-muted">{f.label}</label>
              <input
                type="number"
                min={0}
                value={field(f.key)}
                onChange={(e) => setField(f.key, e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-xs font-medium text-muted">Problems / Blockers</label>
          <textarea value={field('blockers')} onChange={(e) => setField('blockers', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Support Needed</label>
          <input value={field('support_needed')} onChange={(e) => setField('support_needed', e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Tomorrow's Priorities</label>
          <textarea value={field('tomorrow_priorities')} onChange={(e) => setField('tomorrow_priorities', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Additional Notes</label>
          <textarea value={field('notes')} onChange={(e) => setField('notes', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-ink text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitted ? <><CheckCircle2 size={15} /> Submitted</> : submitting ? 'Submitting…' : 'Submit Update'}
        </button>
      </form>
    </div>
  )
}
