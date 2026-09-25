import { useEffect, useState } from 'react'
import { Department, Issue, IssueStatus } from '@/types'
import { getDepartments } from '@/services/departments'
import { getIssues, updateIssueStatus } from '@/services/issues'

const PRIORITY_COLOR: Record<string, string> = {
  Low: 'bg-surface text-muted',
  Medium: 'bg-amber-soft text-amber',
  High: 'bg-amber-soft text-amber',
  Critical: 'bg-red-soft text-red'
}

export function CeoIssues() {
  const [issues, setIssues] = useState<(Issue & { deptName: string })[]>([])

  async function load() {
    const { data: depts } = await getDepartments()
    const all: (Issue & { deptName: string })[] = []
    for (const d of depts as Department[]) {
      const { data } = await getIssues(d.id)
      data.forEach((i) => all.push({ ...i, deptName: d.official_name }))
    }
    all.sort((a, b) => b.created_at.localeCompare(a.created_at))
    setIssues(all)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleStatus(id: string, status: IssueStatus) {
    await updateIssueStatus(id, status)
    load()
  }

  const critical = issues.filter((i) => i.priority === 'Critical' && i.status !== 'Resolved')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>

      {critical.length > 0 && (
        <div className="card p-4 border-red/30 bg-red-soft/40">
          <p className="text-sm font-semibold text-red mb-2">Critical — needs your attention</p>
          <div className="flex flex-col gap-2">
            {critical.map((i) => (
              <p key={i.id} className="text-sm">{i.deptName}: {i.title}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {issues.length === 0 && <p className="text-sm text-muted">No issues raised yet.</p>}
        {issues.map((i) => (
          <div key={i.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{i.title}</p>
                <p className="text-xs text-muted">{i.deptName} · {new Date(i.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PRIORITY_COLOR[i.priority]}`}>{i.priority}</span>
            </div>
            <p className="text-sm text-muted mt-2">{i.description}</p>
            <div className="flex items-center gap-2 mt-3">
              {(['Open', 'In Progress', 'Resolved'] as IssueStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(i.id, s)}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    i.status === s ? 'bg-ink text-white border-ink' : 'border-border text-muted'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
