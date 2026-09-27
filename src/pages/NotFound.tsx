import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <p className="text-lg font-semibold">Page not found</p>
      <Link to="/" className="text-sm text-accent">Go home</Link>
    </div>
  )
}
