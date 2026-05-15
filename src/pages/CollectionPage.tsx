import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCardStore } from '../store/cardStore'
import { VerseCard } from '../components/VerseCard'
import { CardModal } from '../components/CardModal'
import type { VerseCard as VerseCardType } from '../types'

function EmptyState({ onGoToDraw }: { onGoToDraw: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" fill="rgba(212,168,83,0.08)" />
          <circle cx="60" cy="60" r="35" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />
          <rect x="38" y="42" width="20" height="28" rx="3" fill="rgba(212,168,83,0.25)" stroke="#D4A853" strokeWidth="1.2" />
          <rect x="62" y="42" width="20" height="28" rx="3" fill="rgba(212,168,83,0.15)" stroke="#D4A853" strokeWidth="1.2" />
          <line x1="60" y1="43" x2="60" y2="69" stroke="#D4A853" strokeWidth="0.8" />
          <path d="M60 25L61.5 32H68.5L62.5 36.5L65 44L60 39.5L55 44L57.5 36.5L51.5 32H58.5L60 25Z"
            fill="rgba(212,168,83,0.4)" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <p className="font-serif text-lg" style={{ color: '#3D2B1F' }}>你的卡片冊還是空的</p>
        <p className="font-sans text-sm leading-relaxed" style={{ color: '#C4A882' }}>
          每天抽一張箴言，
          <br />
          開始你的收藏吧
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        onClick={onGoToDraw}
        className="px-8 py-3 rounded-full font-sans text-sm tracking-wider transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #F0D08A 0%, #D4A853 100%)',
          color: '#4A2800',
          boxShadow: '0 4px 16px rgba(212,168,83,0.35)',
        }}
      >
        去抽今日箴言
      </motion.button>
    </div>
  )
}

// 卡片格子（共用於手機/桌面）
function CardGrid({ cards, onSelect }: { cards: VerseCardType[]; onSelect: (c: VerseCardType) => void }) {
  return (
    /*
      手機: 2 欄
      md (768px): 3 欄
      xl (1280px): 4 欄
    */
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
      {cards.map((card, index) => (
        <motion.button
          key={card.id}
          onClick={() => onSelect(card)}
          className="text-left transition-all active:scale-95"
          style={{ height: '220px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.35 }}
          whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
        >
          <VerseCard card={card} size="mini" className="w-full h-full" />
        </motion.button>
      ))}
    </div>
  )
}

export function CollectionPage() {
  const { cards, setCurrentPage } = useCardStore()
  // 只存 id，selected card 即時從 store 查
  // → AI 解析存檔後 store 的 cards 更新，這裡會跟著拿到最新的（含 aiAnalysis），不會 stale
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedCard: VerseCardType | null = selectedId
    ? cards.find((c) => c.id === selectedId) ?? null
    : null

  return (
    <div className="min-h-screen pb-24 lg:pb-10" style={{ background: '#FDF8F0' }}>
      {/* ── Header ──────────────────────────────────────── */}
      <header className="px-6 lg:px-10 pt-10 lg:pt-12 pb-6">
        <div className="flex items-end justify-between max-w-6xl">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] mb-1" style={{ color: '#C4A882' }}>
              MY COLLECTION
            </p>
            <h1 className="font-serif text-2xl lg:text-3xl" style={{ color: '#3D2B1F' }}>
              我的卡片冊
            </h1>
          </div>
          {cards.length > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(212,168,83,0.12)' }}
            >
              <span style={{ color: '#D4A853', fontSize: '12px' }}>✦</span>
              <span className="font-sans text-xs font-medium" style={{ color: '#8B6E5A' }}>
                {cards.length} 張
              </span>
            </div>
          )}
        </div>

        {/* 桌面版副標 */}
        {cards.length > 0 && (
          <p className="hidden lg:block font-sans text-sm mt-1" style={{ color: '#C4A882' }}>
            點擊任一卡片可放大查看
          </p>
        )}
      </header>

      {/* ── Content ─────────────────────────────────────── */}
      {cards.length === 0 ? (
        <EmptyState onGoToDraw={() => setCurrentPage('draw')} />
      ) : (
        <main className="px-4 lg:px-10">
          <div className="max-w-6xl">
            <CardGrid cards={cards} onSelect={(c) => setSelectedId(c.id)} />
          </div>
        </main>
      )}

      {/* Modal */}
      <CardModal card={selectedCard} onClose={() => setSelectedId(null)} />
    </div>
  )
}
