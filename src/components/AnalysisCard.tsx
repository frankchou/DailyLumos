import { useCallback, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { VerseCard as VerseCardType } from '../types'
import { VerseCard } from './VerseCard'
import { ChapterModal } from './ChapterModal'
import { useCardStore } from '../store/cardStore'
import { useAuthStore } from '../store/authStore'
import { parseAnalysisSections } from '../lib/aiPrompt'

interface AnalysisCardProps {
  card: VerseCardType
  className?: string
  /** 設定卡片區大小（預設 280x400 配合既有 perspective 卡片）*/
  width?: number | string
  height?: number | string
}

/**
 * 把 VerseCard 包成一個可翻面的卡片：
 *   - 正面：原本的 VerseCard（多了 AI 解析與書卷引用兩個 callback）
 *   - 背面：CardBack 風格 + AI 解析文字
 *   - 點 AI 解析按鈕 → 翻到背面（首次呼叫 API、之後讀快取）
 *   - 點背面任一處 → 翻回正面
 *
 * VerseCard 本身的視覺不變；當沒傳互動 callback 時完全等同直接用 VerseCard。
 */
export function AnalysisCard({ card, className = '', width = '100%', height = '100%' }: AnalysisCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chapterOpen, setChapterOpen] = useState(false)
  const { saveAnalysis } = useCardStore()
  const { user } = useAuthStore()

  const handleAnalysisClick = useCallback(async () => {
    setError(null)

    // 已有快取 → 直接翻面
    if (card.aiAnalysis) {
      setFlipped(true)
      return
    }

    // 首次：先翻面進入「載入中」狀態（更好的視覺反饋）
    setFlipped(true)
    setLoading(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ reference: card.reference, text: card.text }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const data = (await res.json()) as { analysis: string }
      await saveAnalysis(card.id, data.analysis, user?.uid ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析失敗')
    } finally {
      setLoading(false)
    }
  }, [card.aiAnalysis, card.id, card.reference, card.text, saveAnalysis, user?.uid])

  return (
    <>
      <div
        className={`relative perspective ${className}`}
        style={{ width, height }}
      >
        <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
          {/* 正面：VerseCard */}
          <div className="card-face">
            <VerseCard
              card={card}
              size="full"
              className="w-full h-full"
              onAnalysisClick={handleAnalysisClick}
              onReferenceClick={() => setChapterOpen(true)}
            />
          </div>

          {/* 背面：CardBack 風格 + AI 解析 */}
          <div className="card-face card-back">
            <AnalysisBack
              card={card}
              loading={loading}
              error={error}
              onTapToReturn={() => setFlipped(false)}
            />
          </div>
        </div>
      </div>

      <ChapterModal
        open={chapterOpen}
        book={card.book}
        chapter={card.chapter}
        highlightVerse={card.verse}
        onClose={() => setChapterOpen(false)}
      />
    </>
  )
}

// ─── 卡片背面：解析內容 ───────────────────────────────────────
function AnalysisBack({
  card,
  loading,
  error,
  onTapToReturn,
}: {
  card: VerseCardType
  loading: boolean
  error: string | null
  onTapToReturn: () => void
}) {
  return (
    <button
      onClick={onTapToReturn}
      className="group relative flex flex-col overflow-hidden text-left w-full h-full"
      style={{
        background: 'linear-gradient(145deg, #2C1F14 0%, #3D2B1F 40%, #4A3428 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(212, 168, 83, 0.25)',
        padding: '28px 22px 22px',
        cursor: 'pointer',
      }}
      aria-label="返回經文"
    >
      {/* 背景星點裝飾（CardBack 風格簡化版）*/}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-25"
        viewBox="0 0 280 400"
        fill="none"
      >
        <circle cx="140" cy="200" r="130" stroke="#D4A853" strokeWidth="0.5" />
        <circle cx="140" cy="200" r="100" stroke="#D4A853" strokeWidth="0.5" />
        <circle cx="40" cy="60" r="1.5" fill="#D4A853" />
        <circle cx="240" cy="80" r="1" fill="#F0D08A" />
        <circle cx="50" cy="340" r="1" fill="#F0D08A" />
        <circle cx="230" cy="320" r="1.5" fill="#D4A853" />
        <circle cx="135" cy="40" r="0.8" fill="#F0D08A" />
        <circle cx="145" cy="370" r="0.8" fill="#F0D08A" />
      </svg>

      {/* Header */}
      <div
        className="relative flex items-center gap-1.5 mb-3"
        style={{ color: 'rgba(240, 208, 138, 0.85)' }}
      >
        <span style={{ fontSize: '12px' }}>✦</span>
        <span
          className="font-sans tracking-[0.25em]"
          style={{ fontSize: '11px' }}
        >
          AI 解析 · {card.reference}
        </span>
      </div>

      {/* 內容 */}
      <div className="relative flex-1 overflow-y-auto pr-1">
        {loading ? (
          <LoadingShimmer />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <AnalysisBody text={card.aiAnalysis ?? ''} />
        )}
      </div>

      {/* Footer 提示 */}
      <div
        className="relative mt-3 pt-2.5 flex items-center justify-center"
        style={{ borderTop: '1px solid rgba(212,168,83,0.2)' }}
      >
        <span
          className="font-sans tracking-[0.3em]"
          style={{ color: 'rgba(240,208,138,0.55)', fontSize: '10px' }}
        >
          ✦  輕觸返回經文  ✦
        </span>
      </div>
    </button>
  )
}

function LoadingShimmer() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <motion.div
        className="flex gap-2"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="rounded-full"
            style={{
              width: '8px',
              height: '8px',
              background: '#D4A853',
              boxShadow: '0 0 12px rgba(240,208,138,0.8)',
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
      <motion.p
        className="font-sans text-center tracking-[0.2em]"
        style={{ color: 'rgba(240,208,138,0.7)', fontSize: '11px' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        正在為你細細解讀…
      </motion.p>
    </div>
  )
}

// ─── 解析內文：三段式，每段標題粗體、內文正常字 ───────────────
function AnalysisBody({ text }: { text: string }) {
  const sections = useMemo(() => parseAnalysisSections(text), [text])

  return (
    <div className="flex flex-col gap-5">
      {sections.map((s, i) => (
        <div key={i} className="flex flex-col gap-2">
          {s.heading && (
            <h3
              className="font-serif"
              style={{
                fontSize: '17px',
                color: '#F0D08A',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              {s.heading}
            </h3>
          )}
          <p
            className="font-serif leading-relaxed"
            style={{
              color: '#F2E3C0',
              fontSize: '16px',
              lineHeight: '2.0',
              fontWeight: 400,
              whiteSpace: 'pre-wrap',
            }}
          >
            {s.body}
          </p>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <p
        className="font-serif text-center"
        style={{ color: '#F0D08A', fontSize: '14px', lineHeight: '1.8' }}
      >
        暫時無法產生解析
      </p>
      <p
        className="font-mono text-center"
        style={{ color: 'rgba(240,208,138,0.55)', fontSize: '10px' }}
      >
        {message}
      </p>
      <AnimatePresence>
        <motion.p
          className="font-sans text-center mt-2"
          style={{ color: 'rgba(240,208,138,0.7)', fontSize: '11px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          請輕觸返回，稍後再試
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
