import { LucideIcon } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
}

export function KpiCard({ label, value, icon: Icon, trend }: KpiCardProps) {
  const { ref, display } = useCountUp(value)

  return (
    <div
      ref={ref as any}
      className="card p-5 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-pop"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted font-medium">{label}</span>
        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon size={16} className="text-accent" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{display}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend.positive ? 'text-green' : 'text-red'}`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
