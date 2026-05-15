import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { detectOS } from '../lib/platform'

interface InstallGuideProps {
  open: boolean
  onClose: () => void
}

interface Step {
  text: string
  hint?: ReactNode
}

// ─── iOS 分享鈕圖示 ──────────────────────────────────────────
const ShareIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3v12M12 3L8 7M12 3l4 4"
      stroke="#D4A853"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 12v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7"
      stroke="#D4A853"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ─── 加入主畫面圖示（方框 + 加號）─────────────────────────────
const AddBoxIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="4"
      stroke="#D4A853"
      strokeWidth="1.6"
    />
    <path
      d="M12 8.5v7M8.5 12h7"
      stroke="#D4A853"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

// ─── Android 三點選單圖示 ────────────────────────────────────
const DotsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="5" r="1.8" fill="#D4A853" />
    <circle cx="12" cy="12" r="1.8" fill="#D4A853" />
    <circle cx="12" cy="19" r="1.8" fill="#D4A853" />
  </svg>
)

const IOS_STEPS: Step[] = [
  { text: '點 Safari 畫面下方工具列的「分享」按鈕', hint: ShareIcon },
  { text: '在選單往下滑，點「加入主畫面」', hint: AddBoxIcon },
  { text: '點右上角的「新增」，完成！' },
]

const ANDROID_STEPS: Step[] = [
  { text: '點 Chrome 畫面右上角的「⋮」選單', hint: DotsIcon },
  { text: '點「安裝應用程式」（或「加到主畫面」）', hint: AddBoxIcon },
  { text: '點「安裝」，完成！' },
]

export function InstallGuide({ open, onClose }: InstallGuideProps) {
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

  const os = detectOS()
  const steps = os === 'android' ? ANDROID_STEPS : IOS_STEPS
  const osLabel = os === 'android' ? 'Android' : 'iPhone / iPad'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-5"
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
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: '#FDF8F0',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              border: '1px solid rgba(212,168,83,0.25)',
            }}
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-5 text-center">
              <div className="flex justify-center mb-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #F0D08A, #D4A853)' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="6"
                      y="3"
                      width="12"
                      height="18"
                      rx="2.5"
                      stroke="#4A2800"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M12 7.5v5M9.5 10h5"
                      stroke="#4A2800"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <p
                className="font-sans text-xs tracking-[0.3em] mb-1"
                style={{ color: '#C4A882' }}
              >
                {osLabel}
              </p>
              <h2 className="font-serif text-xl" style={{ color: '#3D2B1F' }}>
                把 Daily Lumos 加到主畫面
              </h2>
              <p
                className="font-sans text-sm mt-2 leading-relaxed"
                style={{ color: '#8B6E5A' }}
              >
                像 app 一樣一點就開，
                <br />
                日後也能收到每日抽卡提醒。
              </p>
            </div>

            {/* Steps */}
            <div
              className="px-6 py-5 flex flex-col gap-4"
              style={{ borderTop: '1px solid rgba(212,168,83,0.18)' }}
            >
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-sm font-semibold"
                    style={{
                      background: 'rgba(212,168,83,0.15)',
                      color: '#D4A853',
                      border: '1px solid rgba(212,168,83,0.35)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <p
                    className="flex-1 font-sans text-sm leading-relaxed"
                    style={{ color: '#5A4830' }}
                  >
                    {step.text}
                  </p>
                  {step.hint && <div className="shrink-0">{step.hint}</div>}
                </div>
              ))}
            </div>

            {/* 按鈕 */}
            <div className="px-6 pb-6 pt-1">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-sans text-sm tracking-wider transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #F0D08A 0%, #D4A853 100%)',
                  color: '#4A2800',
                  boxShadow: '0 4px 16px rgba(212,168,83,0.35)',
                }}
              >
                我知道了
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
