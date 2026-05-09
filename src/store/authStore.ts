import { create } from 'zustand'
import type { User } from 'firebase/auth'

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
