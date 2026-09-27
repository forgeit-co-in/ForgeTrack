import { useEffect, useState, FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getIssues, raiseIssue } from '@/services/issues'
import { Issue, IssuePriority } from '@/types'
import { Plus } from 'lucide-react'

const PRIORITY_COLOR: Record<string, string> = {
  Low: 'bg-surface text-muted',
  Medium: 'bg-amber-soft text-amber',
  High: 'bg-amber-soft text-amber',
  Critical: 'bg-red-soft text-red'
}

export function OfficialIssues() {
  const { profile } = useAuth()
  const [issues, setIssues] = useState<Issue[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<IssuePriority>('Medium')
  const [description, setDescription] = useState('')
  const [expected, setExpected] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    if (profile?.department_id) {
      const { data } = await getIssues(profile.department_id)
      setIssues(data)
    }
  }

  useEffect(() => {
    load()
  }, [profile])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!profile?.department_id) return
    setSubmitting(true)
    await raiseIssue({
      department_id: profile.department_id,
      created_by: profile.id,
      title,
      priority,
      description,
      expected_resolution_date: expected || null,
      status: 'Open'
    })
    setTitle('')
    setDescription('')
    setExpected('')
    setPriority('Medium')
    setSubmitting(false)
    setShowForm(false)
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>
        <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5 bg-brand text-white text-sm font-medium rounded-lg px-3.5 py-2">
          <Plus size={15} /> Raise Issue
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-muted">Issue</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Client delayed requirements" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Priority</label>
            <div className="flex gap-2 mt-1.5">
              {(['Low', 'Medium', 'High', 'Critical'] as IssuePriority[]).map((p) => (
                <button type="button" key={p} onClick={() => setPriority(p)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${priority === p ? 'bg-brand text-white border-brand' : 'border-border text-muted'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Expected Resolution Date</label>
            <input type="date" value={expected} onChange={(e) => setExpected(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <button type="submit" disabled={submitting} className="bg-brand text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60">
            {submitting ? 'Submitting…' : 'Submit Issue'}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {issues.length === 0 && <p className="text-sm text-muted">No issues raised yet.</p>}
        {issues.map((i) => (
          <div key={i.id} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{i.title}</p>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PRIORITY_COLOR[i.priority]}`}>{i.priority}</span>
            </div>
            <p className="text-sm text-muted mt-1">{i.description}</p>
            <p className="text-xs text-muted mt-2">Status: {i.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
