import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase'

function requireAuth() {
  if (!auth) throw new Error('Firebase 尚未設定，請先建立 .env 檔案。')
  return auth
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(requireAuth(), googleProvider)
  return result.user
}

export async function signInWithTestAccount(): Promise<User> {
  const a = requireAuth()
  const email = 'dev@dailylumos.test'
  const password = 'devtest123'
  try {
    const result = await signInWithEmailAndPassword(a, email, password)
    return result.user
  } catch {
    const result = await createUserWithEmailAndPassword(a, email, password)
    await updateProfile(result.user, { displayName: 'Dev Tester' })
    return result.user
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(requireAuth())
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured || !auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}
