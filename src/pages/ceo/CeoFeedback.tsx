import { useEffect, useState } from 'react'
import { Department } from '@/types'
import { getDepartments } from '@/services/departments'
import { getFeedback, sendFeedback } from '@/services/feedback'
import { useAuth } from '@/context/AuthContext'
import { Send } from 'lucide-react'

export function CeoFeedback() {
  const { profile } = useAuth()
  const [departments, setDepartments] = useState<Department[]>([])
  const [selected, setSelected] = useState<string>('')
  const [message, setMessage] = useState('')
  const [feedItems, setFeedItems] = useState<any[]>([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getDepartments().then(({ data }) => {
      setDepartments(data)
      if (data[0]) setSelected(data[0].id)
    })
  }, [])

  useEffect(() => {
    getFeedback().then(({ data }) => setFeedItems(data))
  }, [sending])

  async function handleSend() {
    if (!selected || !message.trim() || !profile) return
    setSending(true)
    const dept = departments.find((d) => d.id === selected)
    await sendFeedback({
      department_id: selected,
      from_ceo: profile.id,
      to_official: dept?.official_name ?? '',
      related_report_id: null,
      message
    })
    setMessage('')
    setSending(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>

      <div className="card p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Send feedback</h2>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.official_name} — {d.name}</option>
          ))}
        </select>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Good progress. Focus more on sales conversion next week."
          className="rounded-lg border border-border px-3 py-2 text-sm resize-none"
        />
        <button
          onClick={handleSend}
          disabled={sending || !message.trim()}
          className="self-end flex items-center gap-2 bg-brand text-white text-sm font-medium rounded-lg px-4 py-2 disabled:opacity-50"
        >
          <Send size={14} /> Send
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {feedItems.map((f) => (
          <div key={f.id} className="card p-4">
            <p className="text-sm">{f.message}</p>
            <p className="text-xs text-muted mt-1">To {f.to_official} · {new Date(f.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
