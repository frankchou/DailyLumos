import { useState, useEffect } from 'react'

function getMidnightMs(): number {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

export function useCountdown() {
  const [remaining, setRemaining] = useState(getMidnightMs)

  useEffect(() => {
    const tick = setInterval(() => {
      const ms = getMidnightMs()
      setRemaining(ms)
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  return {
    display: formatCountdown(remaining),
    isExpired: remaining <= 0,
  }
}
