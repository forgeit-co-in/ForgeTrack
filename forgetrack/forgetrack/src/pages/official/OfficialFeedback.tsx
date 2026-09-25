import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getFeedback } from '@/services/feedback'
import { Feedback } from '@/types'

export function OfficialFeedback() {
  const { profile } = useAuth()
  const [items, setItems] = useState<Feedback[]>([])

  useEffect(() => {
    if (profile?.department_id) getFeedback(profile.department_id).then(({ data }) => setItems(data))
  }, [profile])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Feedback from CEO</h1>
      <div className="flex flex-col gap-3">
        {items.length === 0 && <p className="text-sm text-muted">No feedback yet.</p>}
        {items.map((f) => (
          <div key={f.id} className="card p-4">
            <p className="text-sm">{f.message}</p>
            <p className="text-xs text-muted mt-1">{new Date(f.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
