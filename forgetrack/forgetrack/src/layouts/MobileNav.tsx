import { NavLink } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export function MobileNav({ items }: { items: NavItem[] }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {items.slice(0, 5).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              isActive ? 'text-accent' : 'text-muted'
            }`
          }
        >
          <item.icon size={19} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
