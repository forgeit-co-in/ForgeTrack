import { useState } from 'react'
import { Bell, Moon, Sun, Smartphone } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-accent' : 'bg-border'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export function CeoSettings() {
  const [dailyDigest, setDailyDigest] = useState(true)
  const [criticalOnly, setCriticalOnly] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="card divide-y divide-border">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Bell size={16} className="text-muted" />
            <div>
              <p className="text-sm font-medium">Daily digest notification</p>
              <p className="text-xs text-muted">A single summary each morning instead of per-update pings</p>
            </div>
          </div>
          <Toggle checked={dailyDigest} onChange={setDailyDigest} />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Bell size={16} className="text-muted" />
            <div>
              <p className="text-sm font-medium">Critical issues only</p>
              <p className="text-xs text-muted">Mute low/medium priority issue notifications</p>
            </div>
          </div>
          <Toggle checked={criticalOnly} onChange={setCriticalOnly} />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon size={16} className="text-muted" /> : <Sun size={16} className="text-muted" />}
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted">Switch the whole app between light and dark</p>
            </div>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggle} />
        </div>
      </div>

      <div className="card p-5 flex items-start gap-3">
        <Smartphone size={16} className="text-muted mt-0.5" />
        <div>
          <p className="text-sm font-medium">Install ForgeTrack</p>
          <p className="text-xs text-muted mt-0.5">
            Use the install prompt when it appears, or your browser's "Install app" / "Add to
            Home Screen" option, to run ForgeTrack as a standalone app on desktop or mobile.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted">
        Notification preferences above are stored on this device only for now. Wire them to a
        `user_settings` table if you want them to persist across devices.
      </p>
    </div>
  )
}
