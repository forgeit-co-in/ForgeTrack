import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

// Keys on the route so each navigation remounts this wrapper and replays the
// fade+lift entrance — a lightweight page transition without a routing library.
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  )
}
