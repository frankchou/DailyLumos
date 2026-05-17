import { useEffect, useState, useCallback, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTutorialStore } from '../store/tutorialStore'
import { useAuthStore } from '../store/authStore'
import { TutorialDemoCountdown } from './TutorialDemoCountdown'
import { TutorialDemoCard, TutorialDemoCardCalloutLines } from './TutorialDemoCard'
import type { TutorialStation } from '../constants/tutorialStations'

// ─── 視覺常數（對齊 ui-spec）──────────────────────────────────

const OVERLAY_COLOR = 'rgba(44,31,20,0.72)' // 暖黑遮罩
const CARD_BG = 'rgba(253,248,240,0.98)'
// 站④倒數展示盒底色：須完全不透明，才能徹底遮住挖空處透出的真實抽卡按鈕
const CARD_BG_OPAQUE = 'rgb(253,248,240)'
const SPOTLIGHT_TRANSITION = { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] as const }

// 站③（卡片互動展示站）手機版專用：展示卡（貼合真實卡片 280×400）太高，
// 手機螢幕放不下「完整卡片 + 說明卡 + ①② 兩個編號標記」。故手機版把展示卡
// 整體等比縮小到此比例，騰出垂直空間，讓卡片、說明卡、①② 標記都擺得下、
// 互不遮擋。縮小後的卡片仍置於真實卡片區域的中央，視覺上仍是「在原地呈現
// 卡片」。桌機版說明卡排在卡片側邊、空間足夠，不縮放（維持全尺寸）。
const MOBILE_CARD_DEMO_SCALE = 0.72

/** 目標元素的位置與尺寸（viewport 座標） */
interface TargetRect {
  top: number
  left: number
  width: number
  height: number
}

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'center'

interface CardPlacement {
  placement: Placement
  /** 說明卡定位樣式 */
  style: React.CSSProperties
}

// ─── 對位：讀取目標元素 bounding box ──────────────────────────

function readTargetRect(targetKey: string): TargetRect | null {
  // 同一 targetKey 可能有多個元素（如手機 / 桌機各一份倒數計時），
  // 取第一個「實際可見、有尺寸」的元素。
  const els = document.querySelectorAll(`[data-tutorial="${targetKey}"]`)
  for (const el of Array.from(els)) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) {
      return { top: r.top, left: r.left, width: r.width, height: r.height }
    }
  }
  return null
}

// ─── 說明卡擺位策略（對齊 ux-flow 第三節 / ui-spec 3.4）──────

function computeCardPlacement(
  rect: TargetRect,
  isMobileDevice: boolean,
  cardWidth: number,
  estCardHeight: number
): CardPlacement {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const margin = isMobileDevice ? 16 : 24
  const gap = 12 // 說明卡與挖空框間隙（含箭頭）
  const pad = isMobileDevice ? 8 : 10 // 挖空 padding

  const cutoutTop = rect.top - pad
  const cutoutBottom = rect.top + rect.height + pad
  const cutoutLeft = rect.left - pad
  const cutoutRight = rect.left + rect.width + pad
  const targetCenterX = rect.left + rect.width / 2
  const targetCenterY = rect.top + rect.height / 2

  if (isMobileDevice) {
    const spaceAbove = cutoutTop - margin
    const spaceBelow = vh - cutoutBottom - margin

    // 目標在上半 → 卡片置下方
    if (targetCenterY < vh / 2 && spaceBelow >= estCardHeight + gap) {
      const left = clamp(
        targetCenterX - cardWidth / 2,
        margin,
        vw - cardWidth - margin
      )
      return {
        placement: 'bottom',
        style: { top: cutoutBottom + gap, left },
      }
    }
    // 目標在下半 → 卡片置上方
    if (spaceAbove >= estCardHeight + gap) {
      const left = clamp(
        targetCenterX - cardWidth / 2,
        margin,
        vw - cardWidth - margin
      )
      return {
        placement: 'top',
        style: { bottom: vh - cutoutTop + gap, left },
      }
    }
    // 上下都塞不下（大目標）→ 底部置中，隱藏箭頭
    return {
      placement: 'center',
      style: {
        left: clamp((vw - cardWidth) / 2, margin, vw - cardWidth - margin),
        bottom: `calc(${margin}px + env(safe-area-inset-bottom, 0px))`,
      },
    }
  }

  // ── 桌機：以左右為主 ──
  const spaceRight = vw - cutoutRight - margin
  const spaceLeft = cutoutLeft - margin

  // 目標偏左（如 Sidebar）→ 卡片置右側
  if (targetCenterX < vw / 2 && spaceRight >= cardWidth + gap) {
    const top = clamp(
      targetCenterY - estCardHeight / 2,
      margin,
      vh - estCardHeight - margin
    )
    return { placement: 'right', style: { left: cutoutRight + gap, top } }
  }
  // 目標偏右 → 卡片置左側
  if (spaceLeft >= cardWidth + gap) {
    const top = clamp(
      targetCenterY - estCardHeight / 2,
      margin,
      vh - estCardHeight - margin
    )
    return { placement: 'left', style: { right: vw - cutoutLeft + gap, top } }
  }
  // 左右塞不下 → 置於下方
  if (vh - cutoutBottom - margin >= estCardHeight + gap) {
    return {
      placement: 'bottom',
      style: {
        top: cutoutBottom + gap,
        left: clamp(
          targetCenterX - cardWidth / 2,
          margin,
          vw - cardWidth - margin
        ),
      },
    }
  }
  // 最後退路：置中、隱藏箭頭
  return {
    placement: 'center',
    style: {
      left: (vw - cardWidth) / 2,
      top: (vh - estCardHeight) / 2,
    },
  }
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min
  return Math.min(Math.max(value, min), max)
}

// ─── 進度指示 ─────────────────────────────────────────────────

function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center" style={{ gap: '8px' }}>
      <span className="font-sans" style={{ fontSize: '12px', color: '#C4A882' }}>
        {current + 1} / {total}
      </span>
      <div className="flex items-center" style={{ gap: '5px' }}>
        {Array.from({ length: total }).map((_, i) => {
          const isCurrent = i === current
          const isDone = i < current
          return (
            <span
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '9999px',
                background: isCurrent
                  ? '#D4A853'
                  : isDone
                    ? 'rgba(212,168,83,0.55)'
                    : 'rgba(196,168,130,0.35)',
                boxShadow: isCurrent ? '0 0 6px rgba(212,168,83,0.5)' : 'none',
                transition: 'background 0.25s ease-out, box-shadow 0.25s ease-out',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── 說明卡內容 ───────────────────────────────────────────────

interface CoachmarkProps {
  station: TutorialStation
  index: number
  total: number
  isMobileDevice: boolean
  cardWidth: number
  /** 是否在說明卡內附上站③的 ①② 兩行編號說明 */
  showCardCallouts: boolean
  onPrev: () => void
  onNext: () => void
  onSkip: () => void
}

function Coachmark({
  station,
  index,
  total,
  isMobileDevice,
  cardWidth,
  showCardCallouts,
  onPrev,
  onNext,
  onSkip,
}: CoachmarkProps) {
  const isFirst = index === 0
  const isLast = index === total - 1
  const padding = isMobileDevice ? '20px' : '24px'

  return (
    <div
      style={{
        width: `${cardWidth}px`,
        background: CARD_BG,
        border: '1px solid rgba(212,168,83,0.25)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(61,43,31,0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding,
        position: 'relative',
      }}
    >
      {/* 略過導引（右上角常駐關閉入口）*/}
      <button
        onClick={onSkip}
        className="absolute flex items-center transition-colors duration-150"
        style={{ top: '12px', right: '14px', gap: '4px', color: '#C4A882' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#8B6E5A')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#C4A882')}
        aria-label="略過導引"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-sans" style={{ fontSize: '13px' }}>
          略過導引
        </span>
      </button>

      {/* 頂端英文小標 */}
      <p
        className="font-display"
        style={{
          fontSize: '11px',
          letterSpacing: '0.18em',
          color: '#C4A882',
          marginBottom: '6px',
          paddingRight: '88px', // 避開右上角略過鈕
        }}
      >
        {station.eyebrow}
      </p>

      {/* 標題 */}
      <h3
        className="font-serif"
        style={{
          fontSize: isMobileDevice ? '17px' : '18px',
          fontWeight: 600,
          color: '#3D2B1F',
          lineHeight: 1.4,
        }}
      >
        {station.title}
      </h3>

      {/* 說明內文 */}
      <p
        className="font-sans"
        style={{
          fontSize: '14px',
          color: '#8B6E5A',
          lineHeight: 1.7,
          marginTop: '8px',
        }}
      >
        {station.body}
      </p>

      {/* 站③：①② 兩行編號說明併入說明卡內（對應展示卡上的 ①② 標記）。
          手機版垂直空間有限，不另開獨立標註卡，避免堆疊蓋住展示卡。 */}
      {showCardCallouts && (
        <div style={{ marginTop: '14px' }}>
          <TutorialDemoCardCalloutLines />
        </div>
      )}

      {/* 分隔線 */}
      <div
        style={{
          height: '1px',
          background: 'rgba(212,168,83,0.15)',
          margin: '16px 0',
        }}
      />

      {/* 底部列：進度 + 導覽按鈕 */}
      <div className="flex items-center justify-between">
        <ProgressIndicator current={index} total={total} />

        <div className="flex items-center" style={{ gap: '8px' }}>
          {!isFirst && (
            <button
              onClick={onPrev}
              className="font-sans rounded-full transition-all duration-150 active:scale-95"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#8B6E5A',
                padding: '8px 14px',
                border: '1px solid rgba(212,168,83,0.3)',
                background: 'transparent',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(212,168,83,0.08)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              上一步
            </button>
          )}
          <button
            onClick={onNext}
            className="font-sans rounded-full transition-all duration-150 active:scale-95"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#4A2800',
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #F0D08A, #D4A853)',
              boxShadow: '0 2px 8px rgba(168,120,42,0.3)',
            }}
          >
            {isLast ? '完成' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── 主元件 ───────────────────────────────────────────────────

export function TutorialOverlay() {
  const { active, device, stations, index, next, prev, finish, skipUnalignableStation } =
    useTutorialStore()
  const { user } = useAuthStore()
  const isMobileDevice = device === 'mobile'

  const station = stations[index]
  // 展示站（站③卡片互動、站④倒數計時）皆「疊在真實目標位置」：對位真實
  // 畫面錨點元素，把展示元件疊在原地，視覺上像在原地呈現該功能。
  // （站②抽卡按鈕不是展示站，對位真實 DrawButton。）
  const isDemoAtTarget =
    station?.demo === true && station?.demoAtTarget === true
  const demoKind = station?.demoKind
  const [rect, setRect] = useState<TargetRect | null>(null)

  // 站④（倒數計時展示站）：量測 TutorialDemoCountdown 自身的自然內容尺寸。
  // 挖空框與暖米底盒要「貼合倒數內容本身」，不可鋪滿整個 card-action-area
  // 錨點（那會變成一張大卡片）。以一個離畫面的隱藏節點量測自然尺寸。
  const countdownMeasureRef = useRef<HTMLDivElement>(null)
  const [countdownSize, setCountdownSize] = useState<{
    width: number
    height: number
  } | null>(null)
  useLayoutEffect(() => {
    if (!active || demoKind !== 'countdown') {
      setCountdownSize(null)
      return
    }
    const el = countdownMeasureRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) {
      setCountdownSize({ width: r.width, height: r.height })
    }
  }, [active, demoKind])

  // 視窗寬度納入 state，使說明卡寬度能隨旋轉螢幕 / 縮放更新（review L-3）
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 360 : window.innerWidth
  )
  const cardWidth = isMobileDevice
    ? Math.min(viewportWidth * 0.88, 320)
    : 360

  // 教學進行中使用者登出 → 立即關閉教學（EX-7），不殘留在登入畫面
  useEffect(() => {
    if (active && !user) finish()
  }, [active, user, finish])

  // 對位：站點切換 / resize / scroll 時重算目標位置（EX-8）。
  // 一般站與展示站皆讀真實畫面元素（展示站對位的是要疊上展示元件的
  // 真實錨點，如卡片區域 / 抽卡按鈕）。
  // 找不到目標時保留上一次的 rect（不設 null）—— 選單站在 resize 過程中
  // 選單動畫可能暫時量不到，若清成 null 會造成挖空閃爍（review M-2）。
  const recompute = useCallback(() => {
    if (!station) return
    const found = readTargetRect(station.targetKey)
    if (found) setRect(found)
  }, [station])

  // 站點切換時對位。
  // 一般站：requiresMenuOpen 的目標可能要等選單展開動畫，故以短暫輪詢
  //   等目標 DOM 就緒；目標始終不出現則自動跳過此站。
  // 展示站（站③④）：對位真實畫面錨點元素（卡片區域 / 抽卡按鈕），輪詢
  //   等其就緒；逾時不自動跳過（避免進度跳號），改置中顯示。
  useLayoutEffect(() => {
    if (!active || !station) return
    let frame = 0
    let attempts = 0
    const maxAttempts = 90 // 約 90 frame（~1.5s）內等目標出現
    const tryAlign = () => {
      // 一般站與展示站（站③④）：對位真實畫面元素。
      const found = readTargetRect(station.targetKey)
      if (found) {
        setRect(found)
        return
      }
      attempts += 1
      if (attempts < maxAttempts) {
        frame = requestAnimationFrame(tryAlign)
      } else if (station.demo) {
        // 展示站不可被跳過（進度不可跳號）；真實目標逾時未出現時
        // 退而以 viewport 中心給一個預設 rect，至少照常顯示展示卡。
        console.warn(
          `[tutorial] 展示站「${station.id}」對位逾時，目標 data-tutorial="${station.targetKey}" 未出現，改置中顯示`
        )
        const vw = window.innerWidth
        const vh = window.innerHeight
        setRect({ top: vh / 2 - 200, left: vw / 2 - 140, width: 280, height: 400 })
      } else {
        // 一般站目標始終不存在 → 跳過此站。依最近移動方向往前 / 往後跳
        // （skipUnalignableStation），確保上一步 / 下一步兩個方向都不會
        // 卡在被跳過的站上。記 log 以利線上追查跳號情形（review L-4）。
        console.warn(
          `[tutorial] 站點「${station.id}」對位逾時，目標 data-tutorial="${station.targetKey}" 未出現，自動跳過`
        )
        skipUnalignableStation()
      }
    }
    setRect(null) // 轉場期間先暫隱，待對位完成再顯示
    frame = requestAnimationFrame(tryAlign)
    return () => cancelAnimationFrame(frame)
  }, [active, station, skipUnalignableStation])

  // resize / scroll 時跟隨重算；resize 另更新視窗寬度供說明卡重算寬度
  useEffect(() => {
    if (!active) return
    const onResize = () => {
      setViewportWidth(window.innerWidth)
      recompute()
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', recompute, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', recompute, true)
    }
  }, [active, recompute])

  // 粗估說明卡整體高度，供 computeCardPlacement 判斷上 / 下 / 左 / 右
  // 是否塞得下。站③說明卡內含 ①② 兩行編號說明，需給較高估值。
  const hasCallouts = demoKind === 'card'
  const estCardHeight = hasCallouts ? 320 : 200

  // 站③（卡片互動展示站）手機版：展示卡縮小（MOBILE_CARD_DEMO_SCALE），
  // 故展示卡實際佔位 = 真實卡片 rect × scale。挖空框、展示卡定位、說明卡
  // 擺位都改用這個「縮小後且仍置於原 rect 中央」的 displayRect，這樣聚光燈
  // 只罩住縮小後的卡片，下方也空出足夠垂直空間擺說明卡、不壓到 ①② 標記。
  // 其餘情況（桌機、站④等）displayRect 即真實 rect，行為不變。
  const cardDemoScale =
    hasCallouts && isMobileDevice ? MOBILE_CARD_DEMO_SCALE : 1

  // displayRect = 挖空框 / 展示元件 / 說明卡擺位實際依據的矩形。
  //  · 站③手機版：真實卡片 rect 等比縮小、仍置於原 rect 中央。
  //  · 站④桌機：桌機錨點槽位（DesktopInfoPanel 左欄裝真實 CountdownTimer
  //         的 w-fit 容器）本身就緊貼真實倒數，故直接套槽位 rect ——
  //         展示倒數即精準重疊真實倒數，不可自行量測尺寸再置中（錨點
  //         比內容寬時，置中會把展示倒數整體往右推，造成水平偏移）。
  //  · 站④手機：手機錨點是鋪滿操作區的大方框（inset-0），遠大於倒數內容，
  //         故仍以 countdownSize 量測倒數自然尺寸、置於錨點中央，挖空才會
  //         貼合倒數本身、不鋪成一張大卡片。
  //  · 其餘站：displayRect 即真實 rect。
  const isDesktopCountdown =
    demoKind === 'countdown' && station?.targetKey === 'countdown-demo-anchor-desktop'
  let displayRect: TargetRect | null = rect
  if (rect && demoKind === 'countdown' && isDesktopCountdown) {
    // 桌機：直接用錨點槽位 rect（已緊貼真實倒數），精準重疊。
    displayRect = rect
  } else if (rect && demoKind === 'countdown' && countdownSize) {
    // 手機：量測倒數自然尺寸，置於大方框錨點中央。
    displayRect = {
      width: countdownSize.width,
      height: countdownSize.height,
      left: rect.left + (rect.width - countdownSize.width) / 2,
      top: rect.top + (rect.height - countdownSize.height) / 2,
    }
  } else if (rect && cardDemoScale !== 1) {
    displayRect = {
      width: rect.width * cardDemoScale,
      height: rect.height * cardDemoScale,
      left: rect.left + (rect.width * (1 - cardDemoScale)) / 2,
      top: rect.top + (rect.height * (1 - cardDemoScale)) / 2,
    }
  }

  const pad = isMobileDevice ? 8 : 10
  // 挖空框幾何（含 padding）；displayRect 為 null（轉場 / 未對位）時無挖空
  const cutout = displayRect
    ? {
        x: displayRect.left - pad,
        y: displayRect.top - pad,
        width: displayRect.width + pad * 2,
        height: displayRect.height + pad * 2,
      }
    : null
  const cutoutRadius =
    station?.circle && cutout
      ? Math.max(cutout.width, cutout.height) / 2
      : (station?.cutoutRadius ?? 12)

  const cardPlacement = displayRect
    ? computeCardPlacement(
        displayRect,
        isMobileDevice,
        cardWidth,
        estCardHeight
      )
    : null

  // AnimatePresence 常駐，遮罩本體以 active 控制進退場，
  // 讓教學結束時能播放退場淡出（ui-spec 第一節）。
  return createPortal(
    <AnimatePresence>
      {active && station && (
        <motion.div
          key="tutorial-overlay"
          className="fixed inset-0"
          style={{ zIndex: 70, pointerEvents: 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          // 點遮罩暗處不關閉教學（總指揮裁示 4 / ux-flow 第三節）
          onClick={(e) => e.stopPropagation()}
        >
        {/* 黑色遮罩 + SVG mask 挖空 */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <mask id="tutorial-cutout-mask">
              {/* 白 = 顯示遮罩，黑 = 挖空 */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {cutout && (
                <motion.rect
                  initial={false}
                  animate={{
                    x: cutout.x,
                    y: cutout.y,
                    width: cutout.width,
                    height: cutout.height,
                  }}
                  transition={SPOTLIGHT_TRANSITION}
                  rx={cutoutRadius}
                  ry={cutoutRadius}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={OVERLAY_COLOR}
            mask="url(#tutorial-cutout-mask)"
          />
        </svg>

        {/* 站④倒數展示站：離畫面的隱藏量測節點。以倒數展示元件的自然
            尺寸決定挖空框與暖米底盒大小（貼合內容、不鋪大框）。放在
            視窗外、不可見、不佔互動，量到尺寸後即不再重排。 */}
        {demoKind === 'countdown' && (
          <div
            ref={countdownMeasureRef}
            aria-hidden="true"
            className="pointer-events-none fixed"
            style={{ top: -9999, left: -9999, visibility: 'hidden' }}
          >
            <TutorialDemoCountdown />
          </div>
        )}

        {/* 展示站專用：在 spotlight 內渲染展示用元件。
            此元件只活在教學 overlay 內 —— 不碰真實頁面、不影響系統狀態，
            教學結束時隨 overlay 一起卸載，無殘留。

            ① 卡片互動站（demoKind='card'）：展示卡疊在「真實卡片區域」量測到
               的 rect 上 —— 同位置、貼合大小，視覺上像在原地把卡片呈現出來。
               ①② 編號說明已併入說明卡內，卡片上保留對應的 ①② 位置標記。
            ② 倒數計時站（demoKind='countdown'）：展示倒數定位在卡片下方「常駐
               操作區容器」錨點的中央 —— 即抽完卡後真實倒數計時實際出現的
               位置（手機版按鈕位置會換成倒數；桌機版左欄資訊區）。挖空框與
               暖米底盒貼合倒數內容本身的大小（量測 TutorialDemoCountdown），
               不鋪滿整個錨點容器，不會變成一張大卡片。 */}
        {isDemoAtTarget && rect && displayRect && demoKind === 'card' && (
          <div
            className="absolute pointer-events-none"
            style={{
              // 容器疊在 displayRect 上：桌機 / 全尺寸時即真實卡片 rect；
              // 手機版站③則為「縮小後且仍置於原 rect 中央」的範圍。
              top: displayRect.top,
              left: displayRect.left,
              width: displayRect.width,
              height: displayRect.height,
              zIndex: 75,
            }}
          >
            {/* 展示卡本體仍以真實卡片尺寸建構（保持內容比例），再以 scale
                整體等比縮放到 displayRect 大小。桌機版 scale=1，行為不變。 */}
            <TutorialDemoCard
              width={rect.width}
              height={rect.height}
              scale={cardDemoScale}
            />
          </div>
        )}
        {isDemoAtTarget && rect && demoKind === 'countdown' && cutout && (
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              // 暖米底盒貼合挖空(cutout)區域 —— 此處 cutout 已是「倒數內容
              // 自然尺寸 + padding」（見 displayRect 的 countdown 分支），
              // 故底盒只有倒數那一小塊大小，不透明地蓋住底下真實內容，
              // 不會鋪成一張大卡片。
              top: cutout.y,
              left: cutout.x,
              width: cutout.width,
              height: cutout.height,
              background: CARD_BG_OPAQUE,
              borderRadius: cutoutRadius,
              zIndex: 75,
            }}
          >
            <TutorialDemoCountdown />
          </div>
        )}
        {/* 挖空框的金色細線 + 呼吸光暈 */}
        {cutout && (
          <motion.div
            className="absolute pointer-events-none"
            initial={false}
            animate={{
              x: cutout.x,
              y: cutout.y,
              width: cutout.width,
              height: cutout.height,
            }}
            transition={SPOTLIGHT_TRANSITION}
            style={{ top: 0, left: 0 }}
          >
            <motion.div
              className="w-full h-full"
              style={{
                borderRadius: cutoutRadius,
                border: '1px solid rgba(212,168,83,0.55)',
              }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(212,168,83,0.3)',
                  '0 0 20px rgba(212,168,83,0.5)',
                  '0 0 20px rgba(212,168,83,0.3)',
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {/* 說明卡 */}
        <AnimatePresence mode="wait">
          {cardPlacement && (
            <motion.div
              key={station.id}
              className="absolute"
              style={{ ...cardPlacement.style, zIndex: 80 }}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Coachmark
                station={station}
                index={index}
                total={stations.length}
                isMobileDevice={isMobileDevice}
                cardWidth={cardWidth}
                showCardCallouts={hasCallouts}
                onPrev={prev}
                onNext={next}
                onSkip={finish}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
