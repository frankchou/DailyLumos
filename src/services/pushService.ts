// FCM 客戶端：註冊 service worker、請求通知授權、取得 FCM token
import { getToken, onMessage } from 'firebase/messaging'
import { getMessagingIfSupported, firebaseConfigForSW, auth } from '../lib/firebase'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined
const SW_PATH = '/firebase-messaging-sw.js'

export type PushPermission = 'granted' | 'denied' | 'unsupported' | 'default'

/** 此瀏覽器是否支援 Web 推播 */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  )
}

/** 目前的通知授權狀態 */
export function currentPermission(): PushPermission {
  if (!isPushSupported()) return 'unsupported'
  return Notification.permission as PushPermission
}

/**
 * 註冊推播用的 service worker。
 * Firebase 設定透過 query 參數傳給 SW（SW 讀不到 import.meta.env）。
 */
async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null
  const params = new URLSearchParams(firebaseConfigForSW).toString()
  try {
    return await navigator.serviceWorker.register(`${SW_PATH}?${params}`)
  } catch {
    return null
  }
}

/**
 * 請求授權並取得 FCM token。
 * 回傳 token 字串；失敗 / 未授權回傳 null。
 */
export async function enablePushAndGetToken(): Promise<
  { token: string } | { error: string }
> {
  if (!isPushSupported()) {
    return { error: '此瀏覽器不支援推播通知' }
  }
  if (!VAPID_KEY) {
    return { error: 'VAPID 金鑰尚未設定（VITE_FIREBASE_VAPID_KEY）' }
  }

  // 請求通知授權
  let permission = Notification.permission
  if (permission === 'default') {
    permission = await Notification.requestPermission()
  }
  if (permission !== 'granted') {
    return { error: '你尚未允許通知，請到瀏覽器設定開啟' }
  }

  const messaging = await getMessagingIfSupported()
  if (!messaging) return { error: '此環境不支援推播' }

  const registration = await registerSW()
  if (!registration) return { error: 'Service Worker 註冊失敗' }

  try {
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    })
    if (!token) return { error: '無法取得推播 token' }
    return { token }
  } catch (err) {
    return { error: err instanceof Error ? err.message : '取得推播 token 失敗' }
  }
}

/**
 * 發送一則測試通知到自己的裝置（跳過每日發送端的所有條件）。
 */
export async function sendTestPush(
  fcmToken: string
): Promise<{ ok: true } | { error: string }> {
  const user = auth?.currentUser
  if (!user) return { error: '請先登入' }
  if (!fcmToken) return { error: '尚未取得推播 token，請先開啟推播' }

  try {
    const idToken = await user.getIdToken()
    const res = await fetch('/api/test-push', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken, token: fcmToken }),
    })
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string }
      return { error: d.error ?? `HTTP ${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : '發送失敗' }
  }
}

/**
 * 監聽前景訊息（app 開啟時收到推播）— 顯示一個簡單通知。
 * 回傳取消監聽的函式。
 */
export async function listenForegroundMessages(): Promise<() => void> {
  const messaging = await getMessagingIfSupported()
  if (!messaging) return () => {}
  return onMessage(messaging, (payload) => {
    const title = payload.data?.title ?? '每日箴言提醒'
    const body = payload.data?.body ?? ''
    if (currentPermission() === 'granted') {
      new Notification(title, { body, icon: '/icon-192.png' })
    }
  })
}
