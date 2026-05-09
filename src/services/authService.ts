import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase'
import { useAuthStore, type AuthUser } from '../store/authStore'

const MOCK_AUTH_KEY = 'daily-lumos-mock-auth'
const IS_EMULATOR = import.meta.env.VITE_USE_EMULATOR === 'true'

function requireAuth() {
  if (!auth) throw new Error('Firebase 尚未設定，請先建立 .env 檔案。')
  return auth
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(requireAuth(), googleProvider)
  return result.user
}

/**
 * Dev 快速登入：在 emulator 模式下完全跳過 Firebase Auth，
 * 直接用 mock user 寫到 store + localStorage。
 * 原因：Codespaces 容器內的 127.0.0.1:9099 從瀏覽器無法連到。
 */
export async function signInWithTestAccount(): Promise<void> {
  const mockUser: AuthUser = {
    uid: '__mock__',
    displayName: 'Dev Tester',
    email: 'dev@test.local',
    photoURL: '',
  }
  localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(mockUser))
  useAuthStore.getState().setAuthUser(mockUser)
}

export async function signOut(): Promise<void> {
  if (IS_EMULATOR) {
    localStorage.removeItem(MOCK_AUTH_KEY)
    useAuthStore.getState().setAuthUser(null)
    return
  }
  await firebaseSignOut(requireAuth())
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured || !auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}
