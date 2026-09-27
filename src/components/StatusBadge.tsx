import { Status } from '@/types'

const CONFIG: Record<Status, { label: string; dot: string; text: string; bg: string }> = {
  green: { label: 'On Track', dot: 'bg-green', text: 'text-green', bg: 'bg-green-soft' },
  yellow: { label: 'Needs Attention', dot: 'bg-amber', text: 'text-amber', bg: 'bg-amber-soft' },
  red: { label: 'Critical', dot: 'bg-red', text: 'text-red', bg: 'bg-red-soft' }
}

export function StatusBadge({ status, compact = false }: { status: Status; compact?: boolean }) {
  const c = CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {!compact && c.label}
    </span>
  )
}
