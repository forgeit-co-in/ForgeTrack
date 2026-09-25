import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Department, DailyUpdate } from '@/types'
import { getDepartments } from '@/services/departments'
import { getDailyUpdates } from '@/services/updates'
import { Period, filterByPeriod, sumField, toChartSeries } from '@/utils/analytics'

const PERIODS: { key: Period; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' }
]

export function CeoAnalytics() {
  const [period, setPeriod] = useState<Period>('weekly')
  const [departments, setDepartments] = useState<Department[]>([])
  const [allUpdates, setAllUpdates] = useState<Record<string, DailyUpdate[]>>({})

  useEffect(() => {
    getDepartments().then(async ({ data: depts }) => {
      setDepartments(depts)
      const map: Record<string, DailyUpdate[]> = {}
      for (const d of depts) {
        const { data } = await getDailyUpdates(d.id, 60)
        map[d.id] = data
      }
      setAllUpdates(map)
    })
  }, [])

  const flatUpdates = Object.values(allUpdates).flat()
  const periodUpdates = filterByPeriod(flatUpdates, period)

  const trend = toChartSeries(periodUpdates, 'leads_generated').reduce((acc: any[], cur) => {
    const existing = acc.find((a) => a.date === cur.date)
    if (existing) existing.value += cur.value
    else acc.push({ ...cur })
    return acc
  }, [])

  const byDept = departments.map((d) => ({
    name: d.official_name?.split(' ')[0] ?? d.name,
    leads: sumField(filterByPeriod(allUpdates[d.id] ?? [], period), 'leads_generated'),
    tasks: sumField(filterByPeriod(allUpdates[d.id] ?? [], period), 'tasks_completed')
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <div className="flex bg-card border border-border rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === p.key ? 'bg-ink text-white' : 'text-muted'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4">Leads Trend — {period}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4">Department Comparison — Leads</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <Tooltip />
              <Bar dataKey="leads" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 md:col-span-2">
          <h2 className="text-sm font-semibold mb-4">Tasks Completed by Department</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <Tooltip />
              <Bar dataKey="tasks" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
