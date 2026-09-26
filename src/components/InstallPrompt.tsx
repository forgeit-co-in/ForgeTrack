import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault()
      const dismissed = localStorage.getItem('forgetrack-install-dismissed')
      setDeferred(e as BeforeInstallPromptEvent)
      if (!dismissed) setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferred) return
    await deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') setVisible(false)
  }

  function handleDismiss() {
    setVisible(false)
    localStorage.setItem('forgetrack-install-dismissed', '1')
  }

  if (!visible || !deferred) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50">
      <div className="card p-4 flex items-start gap-3 shadow-pop">
        <img src="/logo.png" alt="ForgeTrack" className="h-10 w-10 rounded-lg object-cover shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold">Install ForgeTrack</p>
          <p className="text-xs text-muted mt-0.5">Add it to your home screen for one-tap access, even offline.</p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 bg-brand text-white text-xs font-medium rounded-lg px-3 py-1.5"
            >
              <Download size={13} /> Install
            </button>
            <button onClick={handleDismiss} className="text-xs font-medium text-muted px-2 py-1.5">
              Not now
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-muted shrink-0">
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
