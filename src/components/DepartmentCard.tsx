import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { DepartmentSummary } from '@/types'

export function DepartmentCard({ summary }: { summary: DepartmentSummary }) {
  const { department, status, today_progress, key_metric_label, key_metric_value, pending_items, open_issues } = summary

  return (
    <Link
      to={`/ceo/departments/${department.slug}`}
      className="card p-5 flex flex-col gap-4 hover:shadow-pop transition-shadow group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted font-medium uppercase tracking-wide">{department.official_role}</p>
          <h3 className="text-base font-semibold">{department.official_name}</h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <p className="text-sm text-muted line-clamp-2">{today_progress}</p>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border">
        <div className="pt-3">
          <p className="text-[11px] text-muted">{key_metric_label}</p>
          <p className="text-sm font-semibold">{key_metric_value}</p>
        </div>
        <div className="pt-3">
          <p className="text-[11px] text-muted">Pending</p>
          <p className="text-sm font-semibold">{pending_items}</p>
        </div>
        <div className="pt-3">
          <p className="text-[11px] text-muted">Open Issues</p>
          <p className={`text-sm font-semibold ${open_issues > 0 ? 'text-red' : ''}`}>{open_issues}</p>
        </div>
      </div>

      <div className="flex items-center text-xs font-medium text-accent gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        View department <ArrowUpRight size={13} />
      </div>
    </Link>
  )
}
