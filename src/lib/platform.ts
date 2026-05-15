// 裝置 / 平台偵測 —— 用於決定是否顯示「加到主畫面」教學、是否啟用推播

export type DeviceOS = 'ios' | 'android' | 'desktop'

/**
 * 偵測作業系統。
 * 注意：iPadOS 13+ 的 Safari 會把 userAgent 偽裝成 Mac，
 * 需用 maxTouchPoints 補判（桌機 Mac 不會有觸控點）。
 */
export function detectOS(): DeviceOS {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (isIOS) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

/** 是否為手機（iOS 或 Android）*/
export function isMobile(): boolean {
  return detectOS() !== 'desktop'
}

/** App 是否已以「主畫面 PWA」模式開啟（已安裝）*/
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean })
    .standalone === true
  return (
    window.matchMedia('(display-mode: standalone)').matches || iosStandalone
  )
}
