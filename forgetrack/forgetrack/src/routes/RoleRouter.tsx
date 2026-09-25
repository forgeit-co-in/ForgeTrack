import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Sends an authenticated user to the dashboard that matches their role.
export function RoleRouter() {
  const { session, profile, loading, profileError, signOut } = useAuth()

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <p className="text-base font-semibold">No profile found</p>
          <p className="text-sm text-muted mt-2">
            You're signed in, but there's no ForgeTrack profile linked to this account yet
            {profileError ? ` (${profileError})` : ''}. Ask an admin to add a row in the
            `profiles` table for this user, then sign in again.
          </p>
          <button onClick={signOut} className="mt-4 text-sm font-medium text-accent">
            Sign out
          </button>
        </div>
      </div>
    )
  }

  if (profile.role === 'CEO') return <Navigate to="/ceo" replace />
  return <Navigate to="/department" replace />
}
