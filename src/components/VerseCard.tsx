import type { VerseCard as VerseCardType } from '../types'

interface VerseCardProps {
  card: VerseCardType
  size?: 'full' | 'mini'
  className?: string
}

export function VerseCard({ card, size = 'full', className = '' }: VerseCardProps) {
  const { theme, text, reference, date } = card
  const isMini = size === 'mini'

  return (
    <div
      className={`relative flex flex-col overflow-hidden ${className}`}
      style={{
        background: theme.gradient,
        borderRadius: isMini ? '16px' : '24px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: isMini
          ? '0 4px 16px rgba(61, 43, 31, 0.12)'
          : '0 12px 40px rgba(61, 43, 31, 0.2)',
        width: isMini ? '100%' : '100%',
        height: isMini ? '100%' : '100%',
        padding: isMini ? '14px' : '28px 24px',
      }}
    >
      {/* 主題標籤 */}
      <div
        className="flex items-center gap-1.5"
        style={{ color: theme.subTextColor }}
      >
        <span className="text-xs opacity-80">✦</span>
        <span
          className="font-sans tracking-widest"
          style={{ fontSize: isMini ? '10px' : '12px' }}
        >
          {theme.name} · {theme.nameEn}
        </span>
      </div>

      {/* 箴言文字 */}
      <div className="flex flex-1 items-center justify-center">
        <p
          className="font-serif text-center leading-relaxed"
          style={{
            color: theme.textColor,
            fontSize: isMini ? '12px' : '18px',
            lineHeight: isMini ? '1.7' : '1.9',
            display: '-webkit-box',
            WebkitLineClamp: isMini ? 5 : undefined,
            WebkitBoxOrient: 'vertical' as const,
            overflow: isMini ? 'hidden' : 'visible',
          }}
        >
          {text}
        </p>
      </div>

      {/* 底部分隔線 + 章節 + 日期 */}
      <div>
        <div
          className="mb-2"
          style={{
            height: '1px',
            background: theme.borderColor,
          }}
        />
        <div
          className="flex items-center justify-between font-sans"
          style={{
            color: theme.subTextColor,
            fontSize: isMini ? '9px' : '11px',
          }}
        >
          <span className="tracking-wider">{reference}</span>
          <span className="opacity-70">{date}</span>
        </div>
      </div>

      {/* 裝飾光點 */}
      {!isMini && (
        <>
          <div
            className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-20"
            style={{ background: 'rgba(255,255,255,0.6)', filter: 'blur(20px)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-6 -left-6 h-16 w-16 rounded-full opacity-15"
            style={{ background: 'rgba(255,255,255,0.5)', filter: 'blur(15px)' }}
          />
        </>
      )}
    </div>
  )
}
