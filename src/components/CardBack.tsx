interface CardBackProps {
  className?: string
}

export function CardBack({ className = '' }: CardBackProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(145deg, #2C1F14 0%, #3D2B1F 40%, #4A3428 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(212, 168, 83, 0.25)',
        width: '100%',
        height: '100%',
      }}
    >
      {/* 幾何光芒裝飾 */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 280 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 大圓 */}
        <circle cx="140" cy="200" r="130" stroke="#D4A853" strokeWidth="0.5" />
        <circle cx="140" cy="200" r="100" stroke="#D4A853" strokeWidth="0.5" />
        {/* 光芒線條 */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16
          const rad = (angle * Math.PI) / 180
          const x1 = 140 + 105 * Math.cos(rad)
          const y1 = 200 + 105 * Math.sin(rad)
          const x2 = 140 + 135 * Math.cos(rad)
          const y2 = 200 + 135 * Math.sin(rad)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#D4A853"
              strokeWidth="0.8"
            />
          )
        })}
        {/* 中央菱形 */}
        <polygon
          points="140,160 160,200 140,240 120,200"
          stroke="#D4A853"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>

      {/* 外框金邊 */}
      <div
        className="absolute inset-3 pointer-events-none"
        style={{
          border: '1px solid rgba(212, 168, 83, 0.3)',
          borderRadius: '18px',
        }}
      />

      {/* Logo 區域 */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* 光焰圖示 */}
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
          <path
            d="M18 4C18 4 8 14 8 24C8 29.523 12.477 34 18 34C23.523 34 28 29.523 28 24C28 14 18 4 18 4Z"
            fill="url(#flameGold)"
            opacity="0.9"
          />
          <path
            d="M18 14C18 14 13 20 13 25C13 27.761 15.239 30 18 30C20.761 30 23 27.761 23 25C23 20 18 14 18 14Z"
            fill="url(#flameLight)"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="flameGold" x1="18" y1="4" x2="18" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F0D08A" />
              <stop offset="1" stopColor="#D4A853" />
            </linearGradient>
            <linearGradient id="flameLight" x1="18" y1="14" x2="18" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFDE7" />
              <stop offset="1" stopColor="#F0D08A" />
            </linearGradient>
          </defs>
        </svg>

        {/* 文字 */}
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="font-display tracking-[0.4em] text-gold-light opacity-70"
            style={{ fontSize: '10px', color: '#F0D08A' }}
          >
            DAILY
          </span>
          <span
            className="font-display font-semibold tracking-[0.15em]"
            style={{
              fontSize: '28px',
              color: '#D4A853',
              textShadow: '0 0 20px rgba(212, 168, 83, 0.5), 0 0 40px rgba(212, 168, 83, 0.25)',
            }}
          >
            LUMOS
          </span>
        </div>

        {/* 提示文字 */}
        <p
          className="font-sans text-center mt-4 opacity-50"
          style={{ fontSize: '11px', color: '#C4A882', letterSpacing: '0.1em' }}
        >
          點擊抽取今日箴言
        </p>
      </div>

      {/* 角落星點 */}
      {[
        'top-5 left-5', 'top-5 right-5',
        'bottom-5 left-5', 'bottom-5 right-5',
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} opacity-40`}
          style={{ color: '#D4A853', fontSize: '10px' }}
        >
          ✦
        </div>
      ))}
    </div>
  )
}
