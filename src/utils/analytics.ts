import { DailyUpdate, Status } from '@/types'

export type Period = 'daily' | 'weekly' | 'monthly'

function withinDays(dateStr: string, days: number) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  return diff <= days
}

export function filterByPeriod(updates: DailyUpdate[], period: Period): DailyUpdate[] {
  const days = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30
  return updates.filter((u) => withinDays(u.date, days))
}

export function sumField(updates: DailyUpdate[], field: keyof DailyUpdate): number {
  return updates.reduce((acc, u) => acc + (Number(u[field]) || 0), 0)
}

export function computeStatus(updates: DailyUpdate[], openIssues: number): Status {
  if (openIssues >= 3) return 'red'
  const latest = updates[0]
  if (latest?.overall_status === 'red') return 'red'
  if (openIssues >= 1 || latest?.overall_status === 'yellow') return 'yellow'
  if (updates.length === 0) return 'yellow'
  return 'green'
}

export function toChartSeries(updates: DailyUpdate[], field: keyof DailyUpdate) {
  return [...updates]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((u) => ({ date: u.date.slice(5), value: Number(u[field]) || 0 }))
}
