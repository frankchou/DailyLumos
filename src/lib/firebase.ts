import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging'

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

// Firebase Cloud Messaging — 推播用。
// 瀏覽器不支援（或環境無 SW）時 getMessaging 會拋錯，故包成可選的非同步取得。
export async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (!app) return null
  try {
    if (!(await isSupported())) return null
    return getMessaging(app)
  } catch {
    return null
  }
}

// 給 service worker 用的 Firebase 設定（透過註冊 URL 的 query 傳入）
export const firebaseConfigForSW = {
  apiKey: apiKey ?? '',
  authDomain: authDomain ?? '',
  projectId: projectId ?? '',
  messagingSenderId: messagingSenderId ?? '',
  appId: appId ?? '',
}
