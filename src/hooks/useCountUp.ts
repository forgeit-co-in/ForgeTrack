import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

// Animates a number from 0 to `value` once the element is visible.
// Non-numeric or placeholder values ('—') pass through untouched.
export function useCountUp(value: number | string, durationMs = 900) {
  const [display, setDisplay] = useState<number | string>(typeof value === 'number' ? 0 : value)
  const ref = useRef<HTMLElement | null>(null)
  const started = useRef(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplay(value)
      return
    }
    if (reducedMotion) {
      setDisplay(value)
      return
    }

    const el = ref.current
    if (!el) {
      setDisplay(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          function tick(now: number) {
            const progress = Math.min((now - start) / durationMs, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(eased * (value as number)))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reducedMotion])

  return { ref, display }
}
