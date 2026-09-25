import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { DailyUpdate } from '@/types'
import { getDailyUpdates } from '@/services/updates'
import { Period, filterByPeriod, sumField, toChartSeries } from '@/utils/analytics'

const PERIODS: { key: Period; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' }
]

export function DepartmentAnalytics() {
  const { profile } = useAuth()
  const [period, setPeriod] = useState<Period>('weekly')
  const [updates, setUpdates] = useState<DailyUpdate[]>([])

  useEffect(() => {
    if (profile?.department_id) getDailyUpdates(profile.department_id, 60).then((r) => setUpdates(r.data))
  }, [profile])

  const periodUpdates = filterByPeriod(updates, period)
  const leadsTrend = toChartSeries(periodUpdates, 'leads_generated')
  const tasksTrend = toChartSeries(periodUpdates, 'tasks_completed')

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4"><p className="text-xs text-muted">Leads</p><p className="text-xl font-semibold">{sumField(periodUpdates, 'leads_generated')}</p></div>
        <div className="card p-4"><p className="text-xs text-muted">Calls</p><p className="text-xl font-semibold">{sumField(periodUpdates, 'calls_completed')}</p></div>
        <div className="card p-4"><p className="text-xs text-muted">Tasks Done</p><p className="text-xl font-semibold">{sumField(periodUpdates, 'tasks_completed')}</p></div>
        <div className="card p-4"><p className="text-xs text-muted">Revenue</p><p className="text-xl font-semibold">{sumField(periodUpdates, 'revenue')}</p></div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4">Leads Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={leadsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4">Tasks Completed</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tasksTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <Tooltip />
              <Bar dataKey="value" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
