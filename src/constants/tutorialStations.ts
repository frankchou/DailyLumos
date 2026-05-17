// 功能導引教學的站點定義（手機版 / 桌機版）。
// 站點順序與內容對齊 docs/features/onboarding-tutorial/ 的 requirements / ux-flow。

/** 教學裝置版本 */
export type TutorialDevice = 'mobile' | 'desktop'

/**
 * 每個站點以 `data-tutorial` 的值對應一個畫面元素。
 * 對位時以 `document.querySelector('[data-tutorial="<targetKey>"]')` 取得 bounding box。
 */
export type TutorialTargetKey =
  | 'mobile-nav' // 手機底部導覽列
  | 'sidebar-nav' // 桌機左側 Sidebar 導覽
  | 'draw-button' // 抽卡按鈕
  | 'card-area' // 卡片區域容器
  | 'countdown' // 倒數計時（抽完卡後的真實倒數）
  | 'countdown-demo-anchor' // 倒數計時展示站的對位錨點（未抽卡時倒數所在位置）
  | 'user-menu' // 手機右上角頭像按鈕
  | 'user-section' // 桌機 Sidebar 底部使用者區塊
  | 'menu-reminder' // 使用者選單內「每日提醒設定」
  | 'menu-install' // 使用者選單內「加到主畫面」

export interface TutorialStation {
  /** 站點代號（除錯用） */
  id: string
  /** 對應畫面元素的 data-tutorial 值 */
  targetKey: TutorialTargetKey
  /** 頂端英文小標（font-display） */
  eyebrow: string
  /** 說明卡標題 */
  title: string
  /** 說明卡內文 */
  body: string
  /** 挖空框圓角（px），依 ui-spec 第二節對照表 */
  cutoutRadius: number
  /** 是否為圓形挖空（頭像） */
  circle?: boolean
  /** 此站需要使用者選單為展開狀態（手機站⑥⑦） */
  requiresMenuOpen?: boolean
  /**
   * 是否為「展示站」。
   * 展示站不對位真實畫面元素，而是由 TutorialOverlay 在 spotlight 內
   * 渲染一個純展示元件（卡片互動站用 TutorialDemoCard、倒數計時站用
   * TutorialDemoCountdown）。新使用者尚未抽卡、真實互動元素不存在時，
   * 靠此旗標讓該站照常顯示、不被自動跳過、進度不跳號。
   */
  demo?: boolean
  /**
   * 展示站的展示元件是否要「疊在真實目標元素的位置上」。
   * 為 true 時（如卡片互動站、倒數計時站）：仍對位 `targetKey` 的真實
   * 畫面元素，取其 bounding rect，把展示元件疊在原地，視覺上像「在原地
   * 把畫面呈現給你看」。為 false / 未設則展示元件置中於 viewport。
   * 僅在 `demo` 為 true 時有意義。
   */
  demoAtTarget?: boolean
  /**
   * 展示站要渲染哪一種展示元件。
   * 'card' → TutorialDemoCard（站③卡片互動）；
   * 'countdown' → TutorialDemoCountdown（站④明日再來）。
   * 僅在 `demo` 為 true 時有意義。
   */
  demoKind?: 'card' | 'countdown'
}

// ─── 手機版站點（最多 7 站，已安裝 PWA 則 6 站）──────────────────

const MOBILE_STATIONS: TutorialStation[] = [
  {
    id: 'mobile-nav',
    targetKey: 'mobile-nav',
    eyebrow: 'NAVIGATION',
    title: '底部切換兩個分頁',
    body: '這裡可以切換：抽今日箴言、翻看你抽過的卡片冊。每天的卡片都會自動收進卡片冊裡。',
    cutoutRadius: 16,
  },
  {
    id: 'draw-button',
    targetKey: 'draw-button',
    eyebrow: 'DAILY VERSE',
    title: '抽取今日箴言',
    body: '每天一張，是主為你預備的話。先安靜禱告，再輕觸抽取。',
    cutoutRadius: 16,
  },
  {
    id: 'card-area',
    targetKey: 'card-area',
    eyebrow: 'YOUR CARD',
    title: '抽到的卡片',
    body: '抽完卡，卡片會像這樣呈現。可以翻面讀 AI 解析，也能讀到經文的整章原文。',
    cutoutRadius: 20,
    demo: true,
    demoAtTarget: true,
    demoKind: 'card',
  },
  {
    id: 'countdown',
    targetKey: 'countdown-demo-anchor',
    eyebrow: 'NEXT VERSE',
    title: '明日再來',
    body: '抽過卡後，這裡會顯示距離下一張還有多久。時間到了，再回來領取主新的話。',
    cutoutRadius: 12,
    demo: true,
    demoAtTarget: true,
    demoKind: 'countdown',
  },
  {
    id: 'user-menu',
    targetKey: 'user-menu',
    eyebrow: 'YOUR ACCOUNT',
    title: '你的帳號',
    body: '點這顆頭像，會展開你的帳號選單 —— 每日提醒、登出都在這裡。',
    cutoutRadius: 12,
    circle: true,
  },
  {
    id: 'menu-reminder',
    targetKey: 'menu-reminder',
    eyebrow: 'DAILY REMINDER',
    title: '每日提醒',
    body: '可以設一個每天的提醒時間，溫柔地提醒自己回來，與主安靜片刻。',
    cutoutRadius: 12,
    requiresMenuOpen: true,
  },
  {
    id: 'menu-install',
    targetKey: 'menu-install',
    eyebrow: 'ADD TO HOME',
    title: '加到主畫面',
    body: '把 Daily Lumos 加到手機主畫面，往後一點就開，像一般 App 一樣順手。',
    cutoutRadius: 12,
    requiresMenuOpen: true,
  },
]

// ─── 桌機版站點（固定 5 站）────────────────────────────────────

const DESKTOP_STATIONS: TutorialStation[] = [
  {
    id: 'sidebar-nav',
    targetKey: 'sidebar-nav',
    eyebrow: 'NAVIGATION',
    title: '左側切換兩個分頁',
    body: '這裡可以切換：抽今日箴言、翻看你抽過的卡片冊。每天的卡片都會自動收進卡片冊裡。',
    cutoutRadius: 16,
  },
  {
    id: 'draw-button',
    targetKey: 'draw-button',
    eyebrow: 'DAILY VERSE',
    title: '抽取今日箴言',
    body: '每天一張，是主為你預備的話。先安靜禱告，再輕觸抽取。',
    cutoutRadius: 16,
  },
  {
    id: 'card-area',
    targetKey: 'card-area',
    eyebrow: 'YOUR CARD',
    title: '抽到的卡片',
    body: '抽完卡，卡片會像這樣呈現。可以翻面讀 AI 解析，也能讀到經文的整章原文。',
    cutoutRadius: 20,
    demo: true,
    demoAtTarget: true,
    demoKind: 'card',
  },
  {
    id: 'countdown',
    targetKey: 'countdown-demo-anchor',
    eyebrow: 'NEXT VERSE',
    title: '明日再來',
    body: '抽過卡後，這裡會顯示距離下一張還有多久。時間到了，再回來領取主新的話。',
    cutoutRadius: 12,
    demo: true,
    demoAtTarget: true,
    demoKind: 'countdown',
  },
  {
    id: 'user-section',
    targetKey: 'user-section',
    eyebrow: 'YOUR ACCOUNT',
    title: '你的帳號',
    body: '點這個區塊，可以重看這份功能導引，也能登出。',
    cutoutRadius: 16,
  },
]

/**
 * 依裝置與 PWA 安裝狀態，組出本次教學的站點清單。
 * 站數在教學啟動當下算定，流程中不再變動（FR-5.3 / EX-9）。
 *
 * @param device   啟動當下的裝置判定
 * @param standalone 是否已安裝為 PWA（僅手機有意義）
 */
export function buildStations(
  device: TutorialDevice,
  standalone: boolean
): TutorialStation[] {
  if (device === 'desktop') return DESKTOP_STATIONS
  // 手機已安裝 PWA → 移除「加到主畫面」站（FR-5.3）
  return standalone
    ? MOBILE_STATIONS.filter((s) => s.id !== 'menu-install')
    : MOBILE_STATIONS
}
