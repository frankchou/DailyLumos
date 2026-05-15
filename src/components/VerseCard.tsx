import type { VerseCard as VerseCardType } from '../types'

// AI 解析 icon：放大鏡（檢視／解讀），風格對齊系統其他線稿 icon
// filled = 已有快取的解析（鏡片填色），否則線稿
function AnalysisIcon({ color, filled }: { color: string; filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* 鏡片 */}
      <circle
        cx="10"
        cy="10"
        r="6.5"
        stroke={color}
        strokeWidth="1.7"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.3 : 0}
      />
      {/* 手把 */}
      <path
        d="M14.7 14.7L20 20"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

// 卡片正面可容納的大約字數；超過則在句末標點處節錄（避免裁切）
const MAX_CARD_CHARS = 88

function lastIndexOfAny(s: string, chars: string): number {
  for (let i = s.length - 1; i >= 0; i--) {
    if (chars.includes(s[i]!)) return i
  }
  return -1
}

function fitVerseText(text: string): string {
  if (text.length <= MAX_CARD_CHARS) return text
  const window = text.slice(0, MAX_CARD_CHARS)
  // 在句末標點（。；！？）斷句，其次逗號；節錄本身即為完整一句，不加省略號
  let cut = lastIndexOfAny(window, '。；！？')
  if (cut < MAX_CARD_CHARS * 0.45) {
    const comma = lastIndexOfAny(window, '，、')
    if (comma > cut) cut = comma
  }
  if (cut > 0) return text.slice(0, cut + 1)
  return window
}

interface VerseCardProps {
  card: VerseCardType
  size?: 'full' | 'mini'
  className?: string
  /** 點擊書卷引用（藍框）：開章節 modal。沒傳就照原本顯示，不可點 */
  onReferenceClick?: () => void
  /** 點擊「AI 解析」按鈕（橘框）：翻面顯示 AI 解析。沒傳就完全不顯示按鈕 */
  onAnalysisClick?: () => void
}

export function VerseCard({
  card,
  size = 'full',
  className = '',
  onReferenceClick,
  onAnalysisClick,
}: VerseCardProps) {
  const { theme, text, reference, date, aiAnalysis } = card
  const isMini = size === 'mini'
  // mini 尺寸不顯示互動元件，避免跟外層的「點卡片開 modal」衝突
  const showAnalysisBtn = !isMini && !!onAnalysisClick
  const refClickable = !isMini && !!onReferenceClick
  const hasCachedAnalysis = !!aiAnalysis
  // mini 靠 line-clamp 截斷；full 用句末標點節錄超長的節，避免裁切
  const shownText = isMini ? text : fitVerseText(text)

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

      {/* AI 解析按鈕（右上角，只在 full + 有 callback 時顯示）*/}
      {showAnalysisBtn && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAnalysisClick!()
          }}
          className="absolute flex items-center gap-1 font-sans tracking-wider transition-all active:scale-95 z-10"
          style={{
            top: '20px',
            right: '20px',
            fontSize: '10px',
            color: theme.textColor,
            opacity: 0.85,
            padding: '6px 11px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.22)',
            border: `1px solid ${theme.borderColor}`,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            letterSpacing: '0.1em',
          }}
          aria-label="AI 解析"
        >
          <AnalysisIcon color={theme.textColor} filled={hasCachedAnalysis} />
          AI
        </button>
      )}

      {/* 箴言文字 */}
      <div className="flex flex-1 items-center justify-center">
        <p
          className="font-serif text-center leading-relaxed"
          style={{
            color: theme.textColor,
            fontSize: isMini ? '12px' : '17px',
            lineHeight: isMini ? '1.7' : '1.9',
            display: '-webkit-box',
            WebkitLineClamp: isMini ? 5 : undefined,
            WebkitBoxOrient: 'vertical' as const,
            overflow: isMini ? 'hidden' : 'visible',
          }}
        >
          {shownText}
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
          {refClickable ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onReferenceClick!()
              }}
              className="tracking-wider transition-all active:scale-95 hover:underline cursor-pointer"
              style={{
                color: theme.subTextColor,
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
                fontSize: 'inherit',
              }}
            >
              {reference}
            </button>
          ) : (
            <span className="tracking-wider">{reference}</span>
          )}
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
