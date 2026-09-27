import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, PenSquare, FileText, BarChart3,
  AlertTriangle, MessageSquare, Bell, User, LogOut
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { MobileNav, NavItem } from './MobileNav'
import { DEPARTMENT_CONFIG, ROLE_TO_SLUG } from '@/lib/departments'
import { ThemeToggle } from '@/components/ThemeToggle'
import { PageTransition } from '@/components/PageTransition'
import { useScrolled } from '@/hooks/useScrolled'

const NAV: NavItem[] = [
  { label: 'Dashboard', to: '/department', icon: LayoutDashboard },
  { label: 'My Team', to: '/department/team', icon: Users },
  { label: 'Daily Update', to: '/department/daily-update', icon: PenSquare },
  { label: 'Weekly', to: '/department/weekly-report', icon: FileText },
  { label: 'Analytics', to: '/department/analytics', icon: BarChart3 },
  { label: 'Issues', to: '/department/issues', icon: AlertTriangle },
  { label: 'Feedback', to: '/department/feedback', icon: MessageSquare },
  { label: 'Notifications', to: '/department/notifications', icon: Bell }
]

export function OfficialLayout() {
  const { profile, signOut } = useAuth()
  const slug = profile ? ROLE_TO_SLUG[profile.role] : undefined
  const dept = slug ? DEPARTMENT_CONFIG[slug] : undefined
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 glass border-r px-4 py-6 sticky top-0 h-screen">
        <div className="px-2 mb-8 flex items-center gap-2.5">
          <img src="/logo.png" alt="Forgeit" className="h-8 w-8 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-semibold tracking-tight">ForgeTrack</p>
            <p className="text-xs text-muted">{dept?.name ?? 'Department'}</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/department'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface hover:text-ink'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border pt-4 flex flex-col gap-1">
          <ThemeToggle />
          <NavLink to="/department/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-surface hover:text-ink">
            <User size={17} /> Profile
          </NavLink>
          <button onClick={signOut} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-red-soft hover:text-red text-left">
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className={`md:hidden sticky top-0 z-30 flex items-center justify-between px-4 transition-all duration-300 ${
            scrolled ? 'glass py-2 shadow-card' : 'bg-transparent py-4'
          }`}
          style={{ paddingTop: `calc(env(safe-area-inset-top, 0px) + ${scrolled ? '0.5rem' : '1rem'})` }}
        >
          <p className={`font-semibold transition-all duration-300 ${scrolled ? 'text-sm' : 'text-base'}`}>{dept?.name ?? 'ForgeTrack'}</p>
          <button onClick={signOut} className="text-muted"><LogOut size={18} /></button>
        </header>
        <main className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-8 max-w-5xl w-full mx-auto">
          <PageTransition>
            <Outlet context={{ profile, department: dept }} />
          </PageTransition>
        </main>
      </div>

      <MobileNav items={NAV} />
    </div>
  )
}
