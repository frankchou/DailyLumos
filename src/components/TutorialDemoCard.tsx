/**
 * 教學專用的「展示版」箴言卡片。
 *
 * 為什麼需要：真實的卡片區域（AnalysisCard）只在抽完卡的 done 狀態才
 * 出現可互動內容，新使用者第一次登入還沒抽卡，互動元素不存在。為了讓
 * 「卡片互動」這一站仍能介紹翻面看 AI 解析、看整章原文這兩個互動點、
 * 且進度號碼不跳號，教學在 spotlight 內放一個純展示元件 —— 視覺比照
 * 真實 VerseCard，但顯示固定範例經文、不真的翻面、不呼叫 AI，
 * 教學結束即隨 overlay 一起消失，不碰任何真實系統狀態。
 *
 * 站③會把這張展示卡「疊在真實卡片區域的位置上」（同位置、貼合大小），
 * 視覺上像在原地把卡片呈現給使用者看，故卡片尺寸由外部傳入。卡片上的
 * ①② 編號標記對應到說明卡內的 ①② 兩行編號說明（TutorialDemoCardCalloutLines）
 * —— 手機版垂直空間有限，標註併入說明卡，避免另開獨立標註卡蓋住展示卡。
 *
 * 手機版站③：螢幕垂直空間放不下「全尺寸卡片 + 說明卡 + ①② 標記」，故由
 * 外部傳入 scale（< 1）整體等比縮小展示卡。卡片以 transform 縮放，①② 標記、
 * 卡片內容比例、標記與 AI 鈕 / 章節出處的相對位置都隨之等比例縮放、保持正確。
 *
 * 視覺與標註樣式對齊 docs/features/onboarding-tutorial/ui-spec.md。
 */

import { getThemeForBook } from '../constants/themes'

/** 固定範例經文（靜態值，箴言 3:5，套用「甘露」主題）。 */
const DEMO_VERSE = {
  reference: '箴言 3:5',
  text: '你要專心仰賴耶和華，不可倚靠自己的聰明。',
  theme: getThemeForBook('PRO'),
}

/** 真實卡片區域（DrawPage 的 AnalysisCard / 卡背）尺寸，作為展示卡片預設值。 */
const DEFAULT_CARD_WIDTH = 280
const DEFAULT_CARD_HEIGHT = 400

/** AI 解析 icon：放大鏡，與真實 VerseCard 右上角按鈕一致的線稿風格。 */
function AnalysisIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" stroke={color} strokeWidth="1.7" fill="none" />
      <path
        d="M14.7 14.7L20 20"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * 金色序號圓點。下方互動標註與卡片上的位置標記共用同一視覺語言，
 * 讓使用者能把「卡片上的 ①」一眼對到「下方標註 ①」。
 * size 預設 20px（標註用）；卡片上的標記傳入較小尺寸。
 */
function StepBadge({ index, size = 20 }: { index: number; size?: number }) {
  return (
    <span
      className="font-sans flex items-center justify-center shrink-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '9999px',
        background: 'linear-gradient(135deg, #F0D08A, #D4A853)',
        color: '#4A2800',
        fontSize: `${Math.round(size * 0.55)}px`,
        fontWeight: 600,
      }}
    >
      {index}
    </span>
  )
}

/**
 * 卡片上的位置標記：在序號圓點外再加白邊與陰影，
 * 使其從卡片背景浮出、不與卡片內容混淆。
 */
function CardMarker({ index }: { index: number }) {
  return (
    <span
      className="flex items-center justify-center"
      style={{
        borderRadius: '9999px',
        background: '#FDF8F0',
        padding: '2px',
        boxShadow: '0 2px 8px rgba(61,43,31,0.28)',
      }}
    >
      <StepBadge index={index} size={18} />
    </span>
  )
}

/** 單行互動標註：序號圓點 + 文字，置於說明卡內。 */
function CalloutLine({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start" style={{ gap: '10px' }}>
      <StepBadge index={index} />
      <p
        className="font-sans"
        style={{ fontSize: '13px', color: '#8B6E5A', lineHeight: 1.65 }}
      >
        {children}
      </p>
    </div>
  )
}

/**
 * 站③展示卡的 ①② 兩行編號說明 —— 併入說明卡（Coachmark）內呈現。
 * 對應展示卡上的 ①② 位置標記。手機版垂直空間有限，故不另開獨立
 * 標註卡（避免堆疊蓋住展示卡底部的 ② 標記）。
 */
export function TutorialDemoCardCalloutLines() {
  return (
    <div className="flex flex-col" style={{ gap: '10px' }}>
      <CalloutLine index={1}>
        點卡片右上角的「AI」鈕，卡片會翻面，主透過 AI 為你細細解析這節經文。
      </CalloutLine>
      <CalloutLine index={2}>
        點左下角的「{DEMO_VERSE.reference}」，就能讀這節經文所在的整章。
      </CalloutLine>
    </div>
  )
}

/**
 * 展示用箴言卡片本體（靜態、不可翻面）。
 * 尺寸預設比照真實卡片區域（280×400）；站③會傳入量測到的真實卡片
 * 實際尺寸，使展示卡與被遮罩蓋住的真實卡片完全貼合。
 *
 * `scale`（預設 1）用於手機版站③：以 transform 整體等比縮小卡片，
 * 騰出垂直空間給說明卡與 ①② 標記。卡片內容、標記、相對位置皆隨之
 * 等比例縮放。桌機版不傳 scale，維持全尺寸。外層容器尺寸應為
 * `width × scale` / `height × scale`（縮放後實際佔位大小）。
 */
export function TutorialDemoCard({
  width = DEFAULT_CARD_WIDTH,
  height = DEFAULT_CARD_HEIGHT,
  scale = 1,
}: {
  width?: number
  height?: number
  scale?: number
}) {
  const { theme, reference, text } = DEMO_VERSE

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: theme.gradient,
        borderRadius: '24px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: '0 12px 40px rgba(61, 43, 31, 0.2)',
        padding: '24px 20px',
        transform: scale === 1 ? undefined : `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {/* 主題標籤 */}
      <div
        className="flex items-center gap-1.5"
        style={{ color: theme.subTextColor }}
      >
        <span className="text-xs opacity-80">✦</span>
        <span className="font-sans tracking-widest" style={{ fontSize: '11px' }}>
          {theme.name} · {theme.nameEn}
        </span>
      </div>

      {/* AI 解析按鈕（右上角，靜態展示，比照真實卡片）*/}
      <div
        className="absolute flex items-center gap-1 font-sans tracking-wider"
        style={{
          top: '18px',
          right: '18px',
          fontSize: '10px',
          color: theme.textColor,
          opacity: 0.85,
          padding: '6px 11px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.22)',
          border: `1px solid ${theme.borderColor}`,
          letterSpacing: '0.1em',
        }}
      >
        <AnalysisIcon color={theme.textColor} />
        AI
      </div>

      {/* 位置標記 ①：指向右上角 AI / 翻面按鈕，對應下方標註① */}
      <div className="absolute" style={{ top: '12px', right: '4px' }}>
        <CardMarker index={1} />
      </div>

      {/* 箴言文字 */}
      <div className="flex flex-1 items-center justify-center">
        <p
          className="font-serif text-center leading-relaxed"
          style={{
            color: theme.textColor,
            fontSize: '16px',
            lineHeight: '1.9',
          }}
        >
          {text}
        </p>
      </div>

      {/* 底部分隔線 + 章節 */}
      <div>
        <div
          className="mb-2"
          style={{ height: '1px', background: theme.borderColor }}
        />
        <div
          className="flex items-center justify-between font-sans"
          style={{ color: theme.subTextColor, fontSize: '10px' }}
        >
          {/* 位置標記 ②：指向章節出處，對應下方標註② */}
          <span className="flex items-center" style={{ gap: '6px' }}>
            <CardMarker index={2} />
            <span className="tracking-wider">{reference}</span>
          </span>
          <span className="opacity-70">範例</span>
        </div>
      </div>

      {/* 裝飾光點，沿用真實 VerseCard */}
      <div
        className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-20"
        style={{ background: 'rgba(255,255,255,0.6)', filter: 'blur(20px)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-16 w-16 rounded-full opacity-15"
        style={{ background: 'rgba(255,255,255,0.5)', filter: 'blur(15px)' }}
      />
    </div>
  )
}
