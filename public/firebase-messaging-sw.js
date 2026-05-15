/* Daily Lumos — FCM 背景推播 Service Worker
 *
 * Firebase 設定不寫死在這裡，由 app 註冊此 SW 時透過 URL query 帶入
 * （app 才讀得到 import.meta.env）。
 */

importScripts(
  'https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js'
)

const params = new URL(self.location).searchParams
firebase.initializeApp({
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
})

const messaging = firebase.messaging()

// 背景訊息（app 沒開時）→ 自行顯示通知（用 data payload，可完全掌控）
messaging.onBackgroundMessage((payload) => {
  const title = (payload.data && payload.data.title) || '每日箴言提醒'
  const body = (payload.data && payload.data.body) || ''
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'daily-lumos-reminder',
    data: { url: '/' },
  })
})

// 點擊通知 → 開啟 / 聚焦 app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ('focus' in client) return client.focus()
        }
        return self.clients.openWindow(url)
      })
  )
})
