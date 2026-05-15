import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { VerseCard } from '../types'
import { AnalysisCard } from './AnalysisCard'

interface CardModalProps {
  card: VerseCard | null
  onClose: () => void
}

export function CardModal({ card, onClose }: CardModalProps) {
  // 鍵盤 ESC 關閉
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // 防止背景滾動
  useEffect(() => {
    if (card) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [card])

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
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
              background: 'rgba(44, 31, 20, 0.72)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* 卡片 */}
          <motion.div
            className="relative z-10 w-full max-w-xs"
            style={{ height: '420px' }}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnalysisCard card={card} width="100%" height="100%" />

            {/* 關閉按鈕 */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-90"
              style={{
                background: 'rgba(253, 248, 240, 0.95)',
                boxShadow: '0 2px 12px rgba(61, 43, 31, 0.25)',
                color: '#8B6E5A',
              }}
              aria-label="關閉"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="#8B6E5A" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
