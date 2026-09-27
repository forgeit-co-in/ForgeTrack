import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 glass border-t flex md:hidden transition-transform duration-300 ease-out ${
        reducedMotion || mounted ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {items.slice(0, 5).map((item, i) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-all duration-300 ${
              isActive ? 'text-accent' : 'text-muted'
            } ${reducedMotion || mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`
          }
          style={{ transitionDelay: mounted ? `${i * 40}ms` : '0ms' }}
        >
          <item.icon size={19} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
