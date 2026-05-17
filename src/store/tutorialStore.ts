import { create } from 'zustand'
import { isDesktopViewport, isStandalone } from '../lib/platform'
import {
  buildStations,
  type TutorialDevice,
  type TutorialStation,
} from '../constants/tutorialStations'
import { markTutorialSeen } from '../services/firestoreService'
import { MOCK_UID } from './authStore'

/**
 * 功能導引教學的全域狀態。
 * 負責：管理是否進行中、目前站序、站點清單，以及（給選單元件用的）「選單需展開」訊號。
 * 視覺與對位由 TutorialOverlay 元件負責，本 store 只管流程狀態。
 */
interface TutorialStore {
  /** 教學是否進行中（遮罩是否顯示） */
  active: boolean
  /** 本次教學的裝置版本（啟動當下鎖定，流程中不變） */
  device: TutorialDevice
  /** 本次教學的站點清單（啟動當下算定） */
  stations: TutorialStation[]
  /** 目前站序索引（0-based） */
  index: number
  /**
   * 本次是否為「自動顯示」。
   * 只有自動顯示在結束時才寫入 Firestore 旗標；手動重看不寫（FR-6.6）。
   */
  isAuto: boolean
  /** 結束教學時要寫旗標的對象 uid（自動顯示時才有值） */
  uidForFlag: string | null
  /**
   * 是否要求使用者選單展開。
   * UserMenu 元件監看此值決定是否自動展開選單（手機站⑥⑦）。
   */
  menuShouldOpen: boolean
  /**
   * 最近一次站序移動的方向。
   * TutorialOverlay 對位逾時、需自動跳過某站時，依此方向決定往前或往後
   * 跳 —— 往後（上一步）進入無法對位的站時，要繼續往後跳，不可往前跳，
   * 否則會在被跳過的站之間反覆彈跳、卡死（導航防呆）。
   */
  lastDirection: 'forward' | 'backward'

  /** 啟動教學。isAuto=true 代表自動顯示，結束時會寫旗標 */
  start: (opts: { isAuto: boolean; uid: string | null }) => void
  /** 前往下一站；已是最後一站則結束教學 */
  next: () => void
  /** 回到上一站；已是第一站時依情境結束或維持不動 */
  prev: () => void
  /**
   * 自動跳過「對位逾時、無法呈現」的站。
   * 依 `lastDirection` 往前或往後跳，使前進 / 後退兩個方向遇到被跳過的
   * 站都能正確 traverse、不會卡死。逾界（前進到底 / 後退到底）則結束教學。
   */
  skipUnalignableStation: () => void
  /** 結束教學（完成或略過導引皆呼叫此） */
  finish: () => void
}

export const useTutorialStore = create<TutorialStore>((set, get) => ({
  active: false,
  device: 'mobile',
  stations: [],
  index: 0,
  isAuto: false,
  uidForFlag: null,
  menuShouldOpen: false,
  lastDirection: 'forward',

  start: ({ isAuto, uid }) => {
    // 教學版本以視窗寬度判定，與 Layout 的版面斷點一致；
    // 'desktop' = 寬版（Sidebar），'mobile' = 窄版（底部 NavBar）。
    const device: TutorialDevice = isDesktopViewport() ? 'desktop' : 'mobile'
    const stations = buildStations(device, isStandalone())
    set({
      active: true,
      device,
      stations,
      index: 0,
      isAuto,
      uidForFlag: isAuto ? uid : null,
      menuShouldOpen: stations[0]?.requiresMenuOpen ?? false,
      lastDirection: 'forward',
    })
  },

  next: () => {
    const { index, stations } = get()
    if (index >= stations.length - 1) {
      get().finish()
      return
    }
    const nextIndex = index + 1
    set({
      index: nextIndex,
      menuShouldOpen: stations[nextIndex]?.requiresMenuOpen ?? false,
      lastDirection: 'forward',
    })
  },

  prev: () => {
    const { index, stations } = get()
    if (index <= 0) return
    const prevIndex = index - 1
    set({
      index: prevIndex,
      menuShouldOpen: stations[prevIndex]?.requiresMenuOpen ?? false,
      lastDirection: 'backward',
    })
  },

  skipUnalignableStation: () => {
    // 對位逾時、無法呈現的站要自動跳過。關鍵：依「最近移動方向」決定
    // 往哪邊跳 —— 若使用者是按「上一步」退進這個站，就繼續往後退；按
    // 「下一步」進來就繼續往前。否則往後退時遇到被跳過的站，會被往前
    // 推回原處，在兩站之間反覆彈跳、永遠卡死（導航防呆核心）。
    const { index, stations, lastDirection } = get()
    if (lastDirection === 'backward') {
      // 往後退：再退一站；已是第一站仍無法對位 → 結束教學（避免卡死）。
      if (index <= 0) {
        get().finish()
        return
      }
      const prevIndex = index - 1
      set({
        index: prevIndex,
        menuShouldOpen: stations[prevIndex]?.requiresMenuOpen ?? false,
        lastDirection: 'backward',
      })
      return
    }
    // 往前進：再進一站；已是最後一站 → 結束教學。
    if (index >= stations.length - 1) {
      get().finish()
      return
    }
    const nextIndex = index + 1
    set({
      index: nextIndex,
      menuShouldOpen: stations[nextIndex]?.requiresMenuOpen ?? false,
      lastDirection: 'forward',
    })
  },

  finish: () => {
    const { isAuto, uidForFlag, device } = get()
    // 樂觀關閉：先讓教學退場，旗標背景寫入（失敗不阻斷使用者，EX-4）
    set({ active: false, menuShouldOpen: false, isAuto: false, uidForFlag: null })
    if (isAuto && uidForFlag && uidForFlag !== MOCK_UID) {
      void markTutorialSeen(uidForFlag, device)
    }
  },
}))
