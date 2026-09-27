import { useEffect, useState, FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { DEPARTMENT_CONFIG, ROLE_TO_SLUG } from '@/lib/departments'
import { getTeamMembers, addTeamMember, removeTeamMember } from '@/services/team'
import { TeamMember } from '@/types'
import { Users, Plus, Trash2 } from 'lucide-react'

export function Team() {
  const { profile } = useAuth()
  const slug = profile ? ROLE_TO_SLUG[profile.role] : undefined
  const config = slug ? DEPARTMENT_CONFIG[slug] : undefined

  const [members, setMembers] = useState<TeamMember[]>([])
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!profile?.department_id) return
    setLoading(true)
    const { data } = await getTeamMembers(profile.department_id)
    setMembers(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [profile])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!profile?.department_id || !name.trim() || !position.trim()) return
    await addTeamMember(profile.department_id, name.trim(), position.trim())
    setName('')
    setPosition('')
    setShowForm(false)
    load()
  }

  async function handleRemove(id: string) {
    await removeTeamMember(id)
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Team</h1>
          <p className="text-sm text-muted mt-0.5">{config?.name}</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 bg-brand text-white text-sm font-medium rounded-lg px-3.5 py-2"
        >
          <Plus size={15} /> Add Member
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card p-5 flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Raman"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">Position</label>
              <input
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Cold Caller"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button type="submit" className="self-start bg-brand text-white text-sm font-medium rounded-lg px-4 py-2">
            Add to team
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading && <p className="text-sm text-muted">Loading team…</p>}
        {!loading && members.length === 0 && (
          <p className="text-sm text-muted md:col-span-2">
            No team members added yet. Use "Add Member" to add each person by name and position.
          </p>
        )}
        {members.map((m) => (
          <div key={m.id} className="card p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Users size={15} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{m.name}</p>
              <p className="text-xs text-muted truncate">{m.role_title}</p>
            </div>
            <button onClick={() => handleRemove(m.id)} className="text-muted hover:text-red shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
