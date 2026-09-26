import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getFeedback } from '@/services/feedback'
import { supabase } from '@/lib/supabase'
import { Feedback } from '@/types'
import { Radio } from 'lucide-react'

export function OfficialFeedback() {
  const { profile } = useAuth()
  const [items, setItems] = useState<Feedback[]>([])
  const [justArrived, setJustArrived] = useState<string | null>(null)

  useEffect(() => {
    if (!profile?.department_id) return
    getFeedback(profile.department_id).then(({ data }) => setItems(data))

    // Live updates: any new feedback the CEO sends for this department appears
    // immediately, without needing a refresh.
    const channel = supabase
      .channel(`feedback-${profile.department_id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback',
          filter: `department_id=eq.${profile.department_id}`
        },
        (payload) => {
          const row = payload.new as Feedback
          setItems((prev) => [row, ...prev])
          setJustArrived(row.id)
          setTimeout(() => setJustArrived(null), 4000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [profile])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Feedback from CEO</h1>
        <span className="flex items-center gap-1 text-[11px] text-muted">
          <Radio size={12} className="text-green" /> live
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 && <p className="text-sm text-muted">No feedback yet.</p>}
        {items.map((f) => (
          <div
            key={f.id}
            className={`card p-4 transition-colors ${f.id === justArrived ? 'border-accent bg-accent/5' : ''}`}
          >
            <p className="text-sm">{f.message}</p>
            <p className="text-xs text-muted mt-1">{new Date(f.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
