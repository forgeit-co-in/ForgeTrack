import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Role } from '@/types'

export function ProtectedRoute({ allow }: { allow: Role[] }) {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-muted">
        Loading ForgeTrack…
      </div>
    )
  }

  if (!session || !profile) return <Navigate to="/login" replace />
  if (!allow.includes(profile.role)) return <Navigate to="/" replace />

  return <Outlet />
}
