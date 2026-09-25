import { useState, FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

export function Login() {
  const { session, profile, signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Only leave the login page once we have BOTH a session and a resolved profile.
  // Redirecting on session alone races with profile loading and can bounce
  // between "/" and "/login" forever.
  if (!loading && session && profile) return <Navigate to="/" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) setError(error)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-xl2 bg-accent/15 flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15 L9 8 L13 13 L20 5" />
            </svg>
          </div>
          <h1 className="text-white text-xl font-semibold tracking-tight">ForgeTrack</h1>
          <p className="text-white/50 text-sm mt-1">One company. Four teams. One clear view.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl2 shadow-pop p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              placeholder="you@forgeit.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-red bg-red-soft rounded-lg px-3 py-2">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">ForgeTrack · Internal use only</p>
      </div>
    </div>
  )
}
