import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const {
  VITE_FIREBASE_API_KEY: apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: authDomain,
  VITE_FIREBASE_PROJECT_ID: projectId,
  VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID: appId,
} = import.meta.env

/**
 * 是否已填入 Firebase 設定。
 * 若未建立 .env，此值為 false，App 會顯示設定引導頁，不會 crash。
 */
export const isFirebaseConfigured =
  Boolean(apiKey) &&
  Boolean(projectId) &&
  apiKey !== 'your_api_key_here'

// 只在有設定時才初始化，避免 Firebase 因 undefined 值拋出錯誤
export const app = isFirebaseConfigured
  ? initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId })
  : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const googleProvider = new GoogleAuthProvider()

// 本地開發時連 Firebase Emulator，不動到正式資料
if (import.meta.env.VITE_USE_EMULATOR === 'true' && auth && db) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
