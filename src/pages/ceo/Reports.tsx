import { useEffect, useState } from 'react'
import { Department, WeeklyReport } from '@/types'
import { getDepartments } from '@/services/departments'
import { getWeeklyReports } from '@/services/updates'

export function CeoReports() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [reports, setReports] = useState<(WeeklyReport & { deptName: string })[]>([])

  useEffect(() => {
    getDepartments().then(async ({ data: depts }) => {
      setDepartments(depts)
      const all: (WeeklyReport & { deptName: string })[] = []
      for (const d of depts) {
        const { data } = await getWeeklyReports(d.id, 6)
        data.forEach((r) => all.push({ ...r, deptName: d.official_name }))
      }
      all.sort((a, b) => b.week_start.localeCompare(a.week_start))
      setReports(all)
    })
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
      <div className="flex flex-col gap-3">
        {reports.length === 0 && <p className="text-sm text-muted">No weekly reports submitted yet.</p>}
        {reports.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{r.deptName}</p>
              <p className="text-xs text-muted">{r.week_start} → {r.week_end}</p>
            </div>
            <p className="text-sm text-muted mt-2">{r.achievements}</p>
            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border text-xs">
              <div><p className="text-muted">Leads</p><p className="font-semibold text-sm">{r.leads}</p></div>
              <div><p className="text-muted">Sales</p><p className="font-semibold text-sm">{r.sales}</p></div>
              <div><p className="text-muted">Projects done</p><p className="font-semibold text-sm">{r.projects_completed}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
