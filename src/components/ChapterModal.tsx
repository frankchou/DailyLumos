import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchChapter, type ChapterVerse } from '../services/bibleApi'
import { getBibleBook } from '../data/bibleBooks'

interface ChapterModalProps {
  open: boolean
  book: string
  chapter: number
  highlightVerse: number
  onClose: () => void
}

type ReadingMode = 'horizontal' | 'vertical'
const READING_MODE_KEY = 'daily-lumos-reading-mode'

function loadReadingMode(): ReadingMode {
  try {
    return localStorage.getItem(READING_MODE_KEY) === 'vertical'
      ? 'vertical'
      : 'horizontal'
  } catch {
    return 'horizontal'
  }
}

function saveReadingMode(mode: ReadingMode): void {
  try {
    localStorage.setItem(READING_MODE_KEY, mode)
  } catch {
    /* ignore quota */
  }
}

// 簡單記憶體快取：同一章不重複打 API
const cache = new Map<string, ChapterVerse[]>()

export function ChapterModal({ open, book, chapter, highlightVerse, onClose }: ChapterModalProps) {
  const [verses, setVerses] = useState<ChapterVerse[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [mode, setMode] = useState<ReadingMode>(() => loadReadingMode())
  const highlightRef = useRef<HTMLElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bookMeta = getBibleBook(book)
  const cacheKey = `${book}-${chapter}`
  const isVertical = mode === 'vertical'

  // ESC 關閉 + 鎖背景捲動
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // 打開時抓章節資料
  useEffect(() => {
    if (!open) return

    const cached = cache.get(cacheKey)
    if (cached) {
      setVerses(cached)
      setError(false)
      return
    }

    setLoading(true)
    setError(false)
    setVerses(null)
    fetchChapter(book, chapter)
      .then((data) => {
        if (data) {
          cache.set(cacheKey, data)
          setVerses(data)
        } else {
          setError(true)
        }
      })
      .finally(() => setLoading(false))
  }, [open, book, chapter, cacheKey])

  // 自動 scroll 到 highlight 那節
  // 依賴含 open：每次重新打開（即使章節資料走快取沒變）都要重新捲動
  useEffect(() => {
    if (!open || !verses) return
    const t = setTimeout(() => {
      highlightRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }, 150)
    return () => clearTimeout(t)
  }, [open, verses, mode, highlightVerse])

  const toggleMode = (next: ReadingMode) => {
    if (next === mode) return
    setMode(next)
    saveReadingMode(next)
  }

  // 直書翻頁：下一頁（較後經文）在左邊 → scrollBy left 負值
  const turnPage = (dir: 'next' | 'prev') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.85
    el.scrollBy({
      left: dir === 'next' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* 遮罩 */}
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(44, 31, 20, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          {/* Sheet/Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md flex flex-col overflow-hidden rounded-3xl"
            style={{
              background: '#FDF8F0',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              maxHeight: '85vh',
              border: '1px solid rgba(212,168,83,0.25)',
            }}
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 pt-6 pb-4 flex items-start justify-between gap-3"
              style={{ borderBottom: '1px solid rgba(212,168,83,0.2)' }}
            >
              <div className="min-w-0">
                <p
                  className="font-sans text-xs tracking-[0.3em] mb-1"
                  style={{ color: '#C4A882' }}
                >
                  {bookMeta?.nameEn ?? book} · CHAPTER {chapter}
                </p>
                <h2 className="font-serif text-2xl" style={{ color: '#3D2B1F' }}>
                  {bookMeta?.name ?? book} 第 {chapter} 章
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* 直書/橫書切換 */}
                <div
                  className="flex items-center rounded-full overflow-hidden"
                  style={{
                    background: 'rgba(212,168,83,0.1)',
                    border: '1px solid rgba(212,168,83,0.25)',
                  }}
                >
                  <ModeButton
                    label="橫"
                    active={mode === 'horizontal'}
                    onClick={() => toggleMode('horizontal')}
                  />
                  <ModeButton
                    label="直"
                    active={mode === 'vertical'}
                    onClick={() => toggleMode('vertical')}
                  />
                </div>

                {/* 關閉按鈕 */}
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all active:scale-90"
                  style={{ background: 'rgba(212,168,83,0.12)', color: '#8B6E5A' }}
                  aria-label="關閉"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 3L13 13M13 3L3 13"
                      stroke="#8B6E5A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            {isVertical ? (
              loading || error ? (
                <div
                  className="flex items-center justify-center"
                  style={{ height: 'min(56vh, 420px)' }}
                >
                  {loading ? <LoadingSpinner /> : <ErrorText />}
                </div>
              ) : verses ? (
                <div
                  ref={scrollRef}
                  className="no-scrollbar overflow-x-auto overflow-y-hidden font-serif"
                  style={{
                    height: 'min(56vh, 420px)',
                    padding: '20px 24px',
                    // 捲動容器本身設成 vertical-rl，捲動原點才會落在開頭（右側）
                    writingMode: 'vertical-rl',
                    lineHeight: '2.1',
                    fontSize: '17px',
                    color: '#5A4830',
                  }}
                >
                  {verses.map((v) => {
                    const isHighlight = v.verse === highlightVerse
                    return (
                      <span
                        key={v.verse}
                        ref={(el) => {
                          if (isHighlight) highlightRef.current = el
                        }}
                        style={{
                          background: isHighlight
                            ? 'linear-gradient(180deg, rgba(240,208,138,0.3) 0%, rgba(212,168,83,0.16) 100%)'
                            : 'transparent',
                          color: isHighlight ? '#3D2B1F' : '#5A4830',
                          padding: isHighlight ? '3px 5px' : '0 2px',
                          borderRadius: '6px',
                          boxShadow: isHighlight
                            ? '0 0 0 1px rgba(212,168,83,0.35)'
                            : 'none',
                        }}
                      >
                        <span
                          className="font-sans"
                          style={{
                            fontSize: '11px',
                            color: isHighlight ? '#D4A853' : '#C4A882',
                            marginRight: '3px',
                            fontWeight: isHighlight ? 600 : 400,
                          }}
                        >
                          {v.verse}
                        </span>
                        {v.text}
                      </span>
                    )
                  })}
                </div>
              ) : null
            ) : (
              <div
                className="overflow-y-auto"
                style={{ padding: '20px 24px', flex: 1, minHeight: 0 }}
              >
                {loading && <LoadingSpinner />}
                {error && <ErrorText />}
                {verses && (
                  <HorizontalView
                    verses={verses}
                    highlightVerse={highlightVerse}
                    highlightRef={highlightRef}
                  />
                )}
              </div>
            )}

            {/* 直書翻頁列 */}
            {isVertical && verses && (
              <div
                className="flex items-center justify-between px-6 py-3"
                style={{ borderTop: '1px solid rgba(212,168,83,0.2)' }}
              >
                <PageButton label="下一頁" onClick={() => turnPage('next')} />
                <span
                  className="flex items-center gap-1.5 font-sans tracking-wide"
                  style={{ color: '#C4A882', fontSize: '11px' }}
                >
                  <SwipeHandIcon />
                  左右滑動翻頁
                </span>
                <PageButton label="上一頁" onClick={() => turnPage('prev')} />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── 橫書（預設）─────────────────────────────────────────────
function HorizontalView({
  verses,
  highlightVerse,
  highlightRef,
}: {
  verses: ChapterVerse[]
  highlightVerse: number
  highlightRef: React.MutableRefObject<HTMLElement | null>
}) {
  return (
    <ol className="space-y-3">
      {verses.map((v) => {
        const isHighlight = v.verse === highlightVerse
        return (
          <li
            key={v.verse}
            ref={(el) => {
              if (isHighlight) highlightRef.current = el
            }}
            className="flex gap-3 leading-relaxed font-serif rounded-xl transition-all"
            style={{
              padding: isHighlight ? '12px 14px' : '4px 0',
              background: isHighlight
                ? 'linear-gradient(135deg, rgba(240,208,138,0.22) 0%, rgba(212,168,83,0.12) 100%)'
                : 'transparent',
              border: isHighlight
                ? '1px solid rgba(212,168,83,0.35)'
                : '1px solid transparent',
              boxShadow: isHighlight ? '0 4px 14px rgba(212,168,83,0.18)' : 'none',
              fontSize: '15px',
              color: isHighlight ? '#3D2B1F' : '#5A4830',
            }}
          >
            <span
              className="font-sans shrink-0"
              style={{
                fontSize: '11px',
                color: isHighlight ? '#D4A853' : '#C4A882',
                paddingTop: '4px',
                minWidth: '18px',
                fontWeight: isHighlight ? 600 : 400,
              }}
            >
              {v.verse}
            </span>
            <span className="flex-1">{v.text}</span>
          </li>
        )
      })}
    </ol>
  )
}

// ─── 小元件 ─────────────────────────────────────────────────
// 手指左右滑動 icon：指向上的手 + 左右動作箭頭
function SwipeHandIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* 指向上的手 */}
      <path
        d="M10.2 14V7.5a1.8 1.8 0 0 1 3.6 0V12.5h1.6a1.7 1.7 0 0 1 1.7 1.7V16a3.5 3.5 0 0 1-3.5 3.5h-2a3.7 3.7 0 0 1-3.1-1.7L6.9 15.3a1.6 1.6 0 0 1 2.7-1.7l0.6 0.9Z"
        stroke="#C4A882"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 左右動作箭頭 */}
      <path
        d="M5 8.5 3 10.5 5 12.5"
        stroke="#C4A882"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 8.5 21 10.5 19 12.5"
        stroke="#C4A882"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="rgba(212,168,83,0.25)" strokeWidth="2" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="#D4A853"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function ErrorText() {
  return (
    <p className="font-sans text-sm text-center py-8" style={{ color: '#8B6E5A' }}>
      暫時無法載入此章節，請稍後再試。
    </p>
  )
}

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="font-sans tracking-wider transition-all active:scale-95"
      style={{
        fontSize: '12px',
        padding: '6px 12px',
        color: active ? '#3D2B1F' : '#8B6E5A',
        background: active ? '#D4A853' : 'transparent',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        border: 'none',
        minWidth: '32px',
      }}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}

function PageButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-sans tracking-wider transition-all active:scale-95"
      style={{
        fontSize: '12px',
        padding: '7px 18px',
        borderRadius: '999px',
        color: '#8B6E5A',
        background: 'rgba(212,168,83,0.12)',
        border: '1px solid rgba(212,168,83,0.3)',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}
