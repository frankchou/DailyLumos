import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCardStore } from '../store/cardStore'
import { useDailyDraw } from '../hooks/useDailyDraw'
import { VerseCard } from '../components/VerseCard'
import { CardBack } from '../components/CardBack'
import { DrawButton } from '../components/DrawButton'
import { CountdownTimer } from '../components/CountdownTimer'
import { UserMenu } from '../components/UserMenu'
import { getTodayDate } from '../constants/proverbs'

type DrawState = 'idle' | 'loading' | 'revealing' | 'done'

function formatDisplayDate(dateStr: string): string {
  const parts = dateStr.split('-')
  const y = parts[0] ?? ''
  const m = parts[1] ?? ''
  const d = parts[2] ?? ''
  return `${y} 年 ${m} 月 ${d} 日`
}

// ─── Loading overlay ─────────────────────────────────────────
function SyncingOverlay() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#FDF8F0' }}>
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="rgba(212,168,83,0.2)" strokeWidth="2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="font-sans text-sm tracking-wider" style={{ color: '#C4A882' }}>
          正在載入你的卡片冊...
        </p>
      </div>
    </div>
  )
}

// ─── 桌面左側資訊欄 ──────────────────────────────────────────
function DesktopInfoPanel({ today, drawState, todayCard }: {
  today: string
  drawState: DrawState
  todayCard: import('../types').VerseCard | null
}) {
  return (
    <div className="flex flex-col justify-center gap-8">
      {/* 日期 */}
      <div>
        <p className="font-sans text-xs tracking-[0.3em] mb-2" style={{ color: '#C4A882' }}>
          TODAY
        </p>
        <p className="font-serif text-2xl" style={{ color: '#3D2B1F' }}>
          {formatDisplayDate(today)}
        </p>
      </div>

      {/* 狀態說明 */}
      <AnimatePresence mode="wait">
        {drawState !== 'done' ? (
          <motion.div
            key="pre"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            <p className="font-serif leading-relaxed" style={{ fontSize: '18px', color: '#8B6E5A' }}>
              點擊右側抽取
              <br />
              今日的箴言卡
            </p>
            <p className="font-sans text-sm" style={{ color: '#C4A882' }}>
              每天只能抽取一次，
              <br />
              讓一句話陪你度過這一天。
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="post"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {/* 主題標籤 */}
            {todayCard && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit"
                style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)' }}>
                <span style={{ color: '#D4A853', fontSize: '10px' }}>✦</span>
                <span className="font-sans text-xs" style={{ color: '#8B6E5A' }}>
                  {todayCard.theme.name} · {todayCard.theme.nameEn}
                </span>
              </div>
            )}
            <p className="font-serif leading-relaxed" style={{ fontSize: '16px', color: '#8B6E5A' }}>
              今日的光已亮起，
              <br />
              願這句箴言
              <br />
              伴你同行。
            </p>
            <CountdownTimer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 裝飾元素 */}
      <div className="flex items-center gap-2 opacity-30">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: i === 2 ? '8px' : '5px',
              height: i === 2 ? '8px' : '5px',
              background: '#D4A853',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Card + Button 區域（共用） ───────────────────────────────
function CardArea({ flipped, drawState, todayCard, handleDraw, isLoading, canDrawToday }: {
  flipped: boolean
  drawState: DrawState
  todayCard: import('../types').VerseCard | null
  handleDraw: () => void
  isLoading: boolean
  canDrawToday: () => boolean
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Card */}
      <div
        className="perspective"
        style={{ width: '280px', height: '400px' }}
      >
        <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
          <div className="card-face card-back">
            <AnimatePresence>
              {(drawState === 'done' || drawState === 'revealing') && todayCard && (
                <motion.div
                  className="w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <VerseCard card={todayCard} size="full" className="w-full h-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="card-face">
            <CardBack className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* 手機版底部按鈕/倒數（桌面版這裡只顯示按鈕，倒數在左欄） */}
      <AnimatePresence mode="wait">
        {drawState !== 'done' ? (
          <motion.div
            key="btn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <DrawButton
              onClick={handleDraw}
              loading={isLoading || drawState === 'loading' || drawState === 'revealing'}
              disabled={!canDrawToday()}
            />
          </motion.div>
        ) : (
          /* 手機版在此顯示倒數，桌面版已在左欄顯示 */
          <motion.div
            key="mobile-countdown"
            className="lg:hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <CountdownTimer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────
export function DrawPage() {
  const { todayCard, canDrawToday, isLoading, isSyncing } = useCardStore()
  const { draw } = useDailyDraw()
  const [drawState, setDrawState] = useState<DrawState>(todayCard ? 'done' : 'idle')
  const [flipped, setFlipped] = useState(!!todayCard)

  useEffect(() => {
    if (todayCard && drawState === 'idle') {
      setDrawState('done')
      setFlipped(true)
    }
  }, [todayCard]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDraw = useCallback(async () => {
    if (!canDrawToday() || drawState !== 'idle') return
    setDrawState('loading')
    const card = await draw()
    if (!card) { setDrawState('idle'); return }
    setDrawState('revealing')
    setTimeout(() => {
      setFlipped(true)
      setTimeout(() => setDrawState('done'), 750)
    }, 200)
  }, [canDrawToday, draw, drawState])

  const today = getTodayDate()

  if (isSyncing) return <SyncingOverlay />

  const cardAreaProps = { flipped, drawState, todayCard, handleDraw, isLoading, canDrawToday }

  return (
    <div className="min-h-screen" style={{ background: '#FDF8F0' }}>

      {/* ── 手機版佈局 (< 1024px) ─────────────────────────── */}
      <div className="lg:hidden flex flex-col items-center pb-24">
        {/* 手機 Header */}
        <header className="w-full flex items-center justify-between px-6 pt-12 pb-4">
          <div className="flex flex-col gap-0.5">
            <span className="font-display tracking-[0.4em] text-xs" style={{ color: '#C4A882' }}>DAILY</span>
            <h1 className="font-display font-semibold tracking-[0.15em]"
              style={{ fontSize: '26px', color: '#D4A853', textShadow: '0 0 14px rgba(212,168,83,0.35)' }}>
              LUMOS
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <UserMenu />
            <p className="font-sans text-xs tracking-wide" style={{ color: '#C4A882' }}>
              {formatDisplayDate(today)}
            </p>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-8 px-8 w-full max-w-sm mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center"
          >
            <CardArea {...cardAreaProps} />
          </motion.div>
        </main>

        <footer className="mt-8 pb-4">
          <p className="font-sans text-xs text-center tracking-wider opacity-50" style={{ color: '#8B6E5A' }}>
            每天一句光，照亮前行的路
          </p>
        </footer>
      </div>

      {/* ── 桌面版佈局 (≥ 1024px) ─────────────────────────── */}
      <div className="hidden lg:flex min-h-screen">
        {/* 裝飾背景 */}
        <div className="pointer-events-none fixed inset-0 lg:left-[240px]"
          style={{
            background: 'radial-gradient(ellipse at 70% 50%, rgba(212,168,83,0.06) 0%, transparent 60%)',
          }} />

        <div className="flex-1 flex items-center justify-center px-12 py-12 relative">
          {/* 兩欄佈局：max 900px 居中 */}
          <div className="w-full max-w-3xl grid grid-cols-2 gap-16 items-center">

            {/* 左欄：資訊 */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <DesktopInfoPanel today={today} drawState={drawState} todayCard={todayCard} />
            </motion.div>

            {/* 右欄：卡片 */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <CardArea {...cardAreaProps} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
