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

// 簡單記憶體快取：同一章不重複打 API
const cache = new Map<string, ChapterVerse[]>()

export function ChapterModal({ open, book, chapter, highlightVerse, onClose }: ChapterModalProps) {
  const [verses, setVerses] = useState<ChapterVerse[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const highlightRef = useRef<HTMLLIElement | null>(null)
  const bookMeta = getBibleBook(book)
  const cacheKey = `${book}-${chapter}`

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
  useEffect(() => {
    if (!verses) return
    const t = setTimeout(() => {
      highlightRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 100)
    return () => clearTimeout(t)
  }, [verses])

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
              className="px-6 pt-6 pb-4 flex items-start justify-between"
              style={{ borderBottom: '1px solid rgba(212,168,83,0.2)' }}
            >
              <div>
                <p
                  className="font-sans text-xs tracking-[0.3em] mb-1"
                  style={{ color: '#C4A882' }}
                >
                  {bookMeta?.nameEn ?? book} · CHAPTER {chapter}
                </p>
                <h2
                  className="font-serif text-2xl"
                  style={{ color: '#3D2B1F' }}
                >
                  {bookMeta?.name ?? book} 第 {chapter} 章
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all active:scale-90"
                style={{
                  background: 'rgba(212,168,83,0.12)',
                  color: '#8B6E5A',
                }}
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

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto flex-1">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <svg
                    className="animate-spin"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="rgba(212,168,83,0.25)"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="#D4A853"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              {error && (
                <p
                  className="font-sans text-sm text-center py-8"
                  style={{ color: '#8B6E5A' }}
                >
                  暫時無法載入此章節，請稍後再試。
                </p>
              )}

              {verses && (
                <ol className="space-y-3">
                  {verses.map((v) => {
                    const isHighlight = v.verse === highlightVerse
                    return (
                      <li
                        key={v.verse}
                        ref={isHighlight ? highlightRef : null}
                        className="flex gap-3 leading-relaxed font-serif rounded-xl transition-all"
                        style={{
                          padding: isHighlight ? '12px 14px' : '4px 0',
                          background: isHighlight
                            ? 'linear-gradient(135deg, rgba(240,208,138,0.22) 0%, rgba(212,168,83,0.12) 100%)'
                            : 'transparent',
                          border: isHighlight
                            ? '1px solid rgba(212,168,83,0.35)'
                            : '1px solid transparent',
                          boxShadow: isHighlight
                            ? '0 4px 14px rgba(212,168,83,0.18)'
                            : 'none',
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
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
