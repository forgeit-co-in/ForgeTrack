import { useEffect, useState } from 'react'
import { Department, DailyUpdate, Issue, DepartmentSummary } from '@/types'
import { getDepartments } from '@/services/departments'
import { getDailyUpdates } from '@/services/updates'
import { getIssues } from '@/services/issues'
import { computeStatus, filterByPeriod, sumField } from '@/utils/analytics'
import { DEPARTMENT_CONFIG } from '@/lib/departments'

// Aggregates department + updates + issues into CEO-facing summaries.
export function useDepartmentSummaries() {
  const [summaries, setSummaries] = useState<DepartmentSummary[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data: depts, error: deptErr } = await getDepartments()
      if (deptErr) {
        if (!cancelled) {
          setError(deptErr.message)
          setLoading(false)
        }
        return
      }

      const results: DepartmentSummary[] = []
      for (const dept of depts) {
        const { data: updates } = await getDailyUpdates(dept.id, 60)
        const { data: issues } = await getIssues(dept.id)
        const openIssues = issues.filter((i: Issue) => i.status !== 'Resolved')
        const weekly = filterByPeriod(updates, 'weekly')
        const monthly = filterByPeriod(updates, 'monthly')
        const latest = updates[0]

        results.push({
          department: dept,
          status: computeStatus(updates, openIssues.length),
          today_progress: latest?.work_completed || 'No update submitted yet today.',
          weekly_progress: `${sumField(weekly, 'tasks_completed')} tasks completed this week`,
          monthly_progress: `${sumField(monthly, 'projects_completed')} projects completed this month`,
          key_metric_label: 'Leads (30d)',
          key_metric_value: String(sumField(monthly, 'leads_generated')),
          pending_items: monthly.length ? sumField(monthly, 'tasks_completed') : 0,
          open_issues: openIssues.length
        })
      }

      if (!cancelled) {
        setDepartments(depts)
        setSummaries(results)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { summaries, departments, loading, error }
}

export function departmentLabel(slug: string) {
  return DEPARTMENT_CONFIG[slug]?.name ?? slug
}
