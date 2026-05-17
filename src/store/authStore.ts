import { create } from 'zustand'
import type { User } from 'firebase/auth'

/**
 * 本地 emulator 的 mock 使用者 uid。
 * mock 環境不持久化、也不應寫入正式 Firestore，多處需據此判定，
 * 故抽成單一常數共用，避免字面值散落各處漂移。
 */
export const MOCK_UID = '__mock__'

export interface AuthUser {
  uid: string
  displayName: string
  email: string
  photoURL: string
}

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName ?? '使用者',
    email: user.email ?? '',
    photoURL: user.photoURL ?? '',
  }
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthStore {
  user: AuthUser | null
  status: AuthStatus
  setUser: (user: User | null) => void
  setAuthUser: (user: AuthUser | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: 'loading',

  setUser: (firebaseUser) => {
    if (firebaseUser) {
      set({ user: toAuthUser(firebaseUser), status: 'authenticated' })
    } else {
      set({ user: null, status: 'unauthenticated' })
    }
  },

  setAuthUser: (user) => {
    if (user) {
      set({ user, status: 'authenticated' })
    } else {
      set({ user: null, status: 'unauthenticated' })
    }
  },
}))
