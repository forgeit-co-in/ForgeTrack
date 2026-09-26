import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AppNotification } from '@/types'
import { getNotifications, markNotificationRead } from '@/services/notifications'
import { supabase } from '@/lib/supabase'
import { Bell, FileText, AlertTriangle, MessageSquare, Clock, Radio } from 'lucide-react'

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
    if (!profile) return
    getNotifications(profile.id).then(({ data }) => setItems(data))

    const channel = supabase
      .channel(`notifications-${profile.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        (payload) => setItems((prev) => [payload.new as AppNotification, ...prev])
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [profile])

  async function handleRead(id: string) {
    await markNotificationRead(id)
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <span className="flex items-center gap-1 text-[11px] text-muted">
          <Radio size={12} className="text-green" /> live
        </span>
      </div>
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
