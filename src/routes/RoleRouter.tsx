import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Sends an authenticated user to the dashboard that matches their role.
export function RoleRouter() {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (!profile) return <Navigate to="/login" replace />
  if (profile.role === 'CEO') return <Navigate to="/ceo" replace />
  return <Navigate to="/department" replace />
}
