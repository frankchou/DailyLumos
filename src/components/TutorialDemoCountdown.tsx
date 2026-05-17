/**
 * 教學專用的「展示版」倒數計時。
 *
 * 為什麼需要：真實的 CountdownTimer 只在抽完卡的 done 狀態才 render，
 * 新使用者第一次登入還沒抽卡，元素不存在。為了讓「倒數計時」這一站
 * 仍能介紹這個功能、且進度號碼不跳號，教學在 spotlight 內放一個
 * 純展示元件 —— 視覺比照真實 CountdownTimer，但顯示固定範例時間、
 * 不真的計時、不碰任何真實系統狀態，教學結束即隨 overlay 一起消失。
 */

/** 固定範例時間（靜態值，不倒數） */
const DEMO_DISPLAY = '23:59:59'

export function TutorialDemoCountdown() {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="font-sans text-xs tracking-widest" style={{ color: '#C4A882' }}>
        距明日新箴言
      </p>
      <p
        className="font-display font-medium tracking-wider"
        style={{ color: '#8B6E5A', fontSize: '20px', fontVariantNumeric: 'tabular-nums' }}
      >
        {DEMO_DISPLAY}
      </p>
    </div>
  )
}
