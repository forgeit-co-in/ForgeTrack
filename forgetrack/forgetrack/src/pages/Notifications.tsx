import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AppNotification } from '@/types'
import { getNotifications, markNotificationRead } from '@/services/notifications'
import { Bell, FileText, AlertTriangle, MessageSquare, Clock } from 'lucide-react'

const ICONS: Record<string, any> = {
  daily_report: FileText,
  weekly_report: FileText,
  issue: AlertTriangle,
  critical_issue: AlertTriangle,
  feedback: MessageSquare,
  missed_report: Clock,
  status_change: Bell
}

export function Notifications() {
  const { profile } = useAuth()
  const [items, setItems] = useState<AppNotification[]>([])

  useEffect(() => {
    if (profile) getNotifications(profile.id).then(({ data }) => setItems(data))
  }, [profile])

  async function handleRead(id: string) {
    await markNotificationRead(id)
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
      <div className="flex flex-col gap-2">
        {items.length === 0 && <p className="text-sm text-muted">You're all caught up.</p>}
        {items.map((n) => {
          const Icon = ICONS[n.type] ?? Bell
          return (
            <button
              key={n.id}
              onClick={() => handleRead(n.id)}
              className={`card p-4 flex items-start gap-3 text-left ${!n.read ? 'border-accent/30 bg-accent/5' : ''}`}
            >
              <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                <Icon size={15} className="text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted mt-0.5">{n.body}</p>
                <p className="text-[11px] text-muted mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
