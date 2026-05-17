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

  /** 啟動教學。isAuto=true 代表自動顯示，結束時會寫旗標 */
  start: (opts: { isAuto: boolean; uid: string | null }) => void
  /** 前往下一站；已是最後一站則結束教學 */
  next: () => void
  /** 回到上一站 */
  prev: () => void
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
    })
  },

  prev: () => {
    const { index, stations } = get()
    if (index <= 0) return
    const prevIndex = index - 1
    set({
      index: prevIndex,
      menuShouldOpen: stations[prevIndex]?.requiresMenuOpen ?? false,
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
