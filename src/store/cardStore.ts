import { create } from 'zustand'
import type { VerseCard, AppPage } from '../types'
import { CARD_THEMES } from '../constants/themes'
import { getTodayDate } from '../constants/proverbs'
import {
  saveCard,
  loadCards,
  updateLastDrawDate,
  ensureUserProfile,
  getUserLastDrawDate,
  type StoredCard,
} from '../services/firestoreService'
import type { AuthUser } from './authStore'

// ─── LocalStorage fallback (guest / offline cache) ───────────

const STORAGE_KEY = 'daily-lumos-state'

interface LocalState {
  cards: VerseCard[]
  lastDrawDate: string
  todayCard: VerseCard | null
}

function localLoad(): LocalState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LocalState) : { cards: [], lastDrawDate: '', todayCard: null }
  } catch {
    return { cards: [], lastDrawDate: '', todayCard: null }
  }
}

function localSave(state: LocalState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* quota */ }
}

function localClear() {
  localStorage.removeItem(STORAGE_KEY)
}

// ─── Restore theme from themeId ──────────────────────────────

function restoreCard(stored: StoredCard): VerseCard {
  const theme = CARD_THEMES.find((t) => t.id === stored.themeId) ?? CARD_THEMES[0]!
  const { themeId: _drop, ...rest } = stored
  return { ...rest, theme }
}

// ─── Store ───────────────────────────────────────────────────

interface CardStore {
  cards: VerseCard[]
  lastDrawDate: string
  todayCard: VerseCard | null
  isLoading: boolean
  isSyncing: boolean
  error: string | null
  currentPage: AppPage

  canDrawToday: () => boolean
  setCurrentPage: (page: AppPage) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void

  /** 登入後：從 Firestore 載入該用戶資料 */
  syncFromCloud: (user: AuthUser) => Promise<void>
  /** 登出後：清空狀態 */
  clearUserData: () => void
  /** 新增一張卡片（同時存到 Firestore / LocalStorage）*/
  addCard: (card: VerseCard, uid: string | null) => Promise<void>
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  lastDrawDate: '',
  todayCard: null,
  isLoading: false,
  isSyncing: false,
  error: null,
  currentPage: 'draw',

  canDrawToday: () => {
    const today = getTodayDate()
    return get().lastDrawDate !== today
  },

  setCurrentPage: (page) => set({ currentPage: page }),
  setLoading: (v) => set({ isLoading: v }),
  setError: (e) => set({ error: e }),

  syncFromCloud: async (user) => {
    set({ isSyncing: true })
    try {
      // 確保 Firestore 有該用戶的 profile doc
      await ensureUserProfile(user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      })

      const [storedCards, lastDrawDate] = await Promise.all([
        loadCards(user.uid),
        getUserLastDrawDate(user.uid),
      ])

      const today = getTodayDate()
      const cards = storedCards.map(restoreCard)
      const todayCard = lastDrawDate === today ? (cards[0] ?? null) : null

      set({ cards, lastDrawDate, todayCard })
    } catch (err) {
      console.error('Cloud sync failed:', err)
      // Fallback 到 localStorage
      const local = localLoad()
      set({
        cards: local.cards,
        lastDrawDate: local.lastDrawDate,
        todayCard: local.todayCard,
      })
    } finally {
      set({ isSyncing: false })
    }
  },

  clearUserData: () => {
    localClear()
    set({ cards: [], lastDrawDate: '', todayCard: null, currentPage: 'draw' })
  },

  addCard: async (card, uid) => {
    // 樂觀更新 UI
    set((state) => ({
      cards: [card, ...state.cards],
      lastDrawDate: card.date,
      todayCard: card,
    }))

    if (uid) {
      // 雲端儲存
      try {
        await Promise.all([
          saveCard(uid, card),
          updateLastDrawDate(uid, card.date),
        ])
      } catch (err) {
        console.error('Failed to save card to Firestore:', err)
      }
    } else {
      // Guest mode → localStorage
      const { cards, lastDrawDate, todayCard } = get()
      localSave({ cards, lastDrawDate, todayCard })
    }
  },
}))
