import { useCountdown } from '../hooks/useCountdown'

export function CountdownTimer() {
  const { display } = useCountdown()

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="font-sans text-xs tracking-widest" style={{ color: '#C4A882' }}>
        距明日新箴言
      </p>
      <p
        className="font-display font-medium tracking-wider"
        style={{ color: '#8B6E5A', fontSize: '20px', fontVariantNumeric: 'tabular-nums' }}
      >
        {display}
      </p>
    </div>
  )
}
