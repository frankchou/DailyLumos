import { useEffect, useRef } from 'react'
import { useAuthStore, MOCK_UID } from '../store/authStore'
import { useCardStore } from '../store/cardStore'
import { useTutorialStore } from '../store/tutorialStore'
import { isDesktopViewport } from '../lib/platform'
import { getTutorialFlags } from '../services/firestoreService'

/**
 * 首次登入自動顯示教學的判定與啟動（對應 FR-1 / ux-flow 第二節）。
 *
 * 啟動條件需全部成立：
 *   1. user 已就緒。
 *   2. 對應裝置旗標不為 true（讀取失敗 / 欄位不存在皆視為未看過）。
 *   3. 已落在抽卡頁；若不在則先靜默切回（D1 / EX-12）。
 *   4. 卡片載入流程結束（isSyncing 為 false）。
 *   5. 卡片區域容器 DOM 已存在（避免挖空到未 render 的元素）。
 *
 * 條件遲遲不成立不設逾時：寧可不教，也不挖空到空元素。
 * 「等卡片區域 DOM」與「等 isSyncing」收斂為單一輪詢迴圈，避免兩段
 * 等待邏輯重疊與時序競態（review M-1）。輪詢期間若條件仍未成立則放棄，
 * 並把 attemptedUid 重設，留待後續相依值變化時重試。
 */
export function useTutorialAutoStart(): void {
  const { user } = useAuthStore()
  const { isSyncing, currentPage, setCurrentPage } = useCardStore()
  const { start } = useTutorialStore()

  // 已成功啟動過自動教學的 uid，啟動成功後才標記，避免重複觸發。
  // 啟動失敗（DOM 遲未就緒）不標記，允許條件變化時重試。
  const startedUidRef = useRef<string | null>(null)

  useEffect(() => {
    if (!user) {
      startedUidRef.current = null
      return
    }
    if (startedUidRef.current === user.uid) return
    if (isSyncing) return // 等卡片載入流程結束

    // Mock 用戶（本地 emulator）旗標無法持久化，自動顯示會每次登入重來，
    // 故略過自動顯示；本地仍可由「功能導引」入口手動開啟教學測試。
    if (user.uid === MOCK_UID) {
      startedUidRef.current = user.uid
      return
    }

    // D1 / EX-12：教學的所有站點都基於抽卡頁，先確保落在抽卡頁
    if (currentPage !== 'draw') {
      setCurrentPage('draw')
      return // 換頁後 effect 會再次執行
    }

    let cancelled = false
    let frame = 0

    const run = async () => {
      const device: 'mobile' | 'desktop' = isDesktopViewport()
        ? 'desktop'
        : 'mobile'
      const flags = await getTutorialFlags(user.uid)
      if (cancelled) return

      const alreadySeen =
        device === 'mobile' ? flags.tutorialSeenMobile : flags.tutorialSeenDesktop
      if (alreadySeen) {
        // 已看過：標記不再嘗試（旗標已是最終狀態，無需重試）
        startedUidRef.current = user.uid
        return
      }

      // 等卡片區域容器 DOM 出現後才啟動（FR-1.4）。
      // 超時放棄但不標記 uid —— 留待 isSyncing 等相依值再變化時重試。
      let attempts = 0
      const maxAttempts = 120 // 約 2 秒內輪詢
      const waitForCardArea = () => {
        if (cancelled) return
        const cardArea = document.querySelector('[data-tutorial="card-area"]')
        if (cardArea) {
          startedUidRef.current = user.uid
          start({ isAuto: true, uid: user.uid })
          return
        }
        attempts += 1
        if (attempts < maxAttempts) {
          frame = requestAnimationFrame(waitForCardArea)
        }
      }
      frame = requestAnimationFrame(waitForCardArea)
    }

    void run()
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [user, isSyncing, currentPage, setCurrentPage, start])
}
