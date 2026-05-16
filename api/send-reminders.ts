// Vercel Serverless Function（Node runtime）：每日抽卡提醒發送端
//
// 由 GitHub Actions 每 30 分鐘呼叫一次。流程：
//   1. 驗證 x-cron-secret
//   2. 算出現在台灣時間
//   3. 撈出 pushEnabled 的使用者，挑出：
//        - 設定的提醒時間「已到」（now >= 設定時間）
//        - 且還在 90 分鐘的補送視窗內（吸收 cron 誤差）
//        - 且當天還沒抽卡（lastDrawDate !== 今天）
//        - 且當天還沒通知過（lastNotifiedDate !== 今天）
//   4. 發 FCM，成功後標記 lastNotifiedDate
//
// 環境變數（在 Vercel 設定）：
//   FIREBASE_SERVICE_ACCOUNT — Firebase 服務帳戶 JSON（整段字串）
//   CRON_SECRET              — 與 GitHub Actions 共用的密鑰

import admin from 'firebase-admin'

interface VercelReq {
  method?: string
  headers: Record<string, string | string[] | undefined>
}
interface VercelRes {
  status: (code: number) => VercelRes
  json: (data: unknown) => void
}

// 補送視窗（分鐘）：提醒時間到了之後，這段時間內的 cron 都會補送，
// 用來吸收 GitHub Actions 排程的延遲誤差。
const CATCHUP_WINDOW_MIN = 90

// 引導「先禱告、再抽卡」的溫暖提醒文案（依日期輪替，當天所有人一致）。
// 語氣親切口語、帶領感；今日箴言是主為你預備的禮物與方向。
const MESSAGES: { title: string; body: string }[] = [
  {
    title: '嘿，今天還沒和主說說話喔',
    body: '先停下來，向主禱告一會兒，再抽今日箴言 — 領受這份為你預備的禮物。',
  },
  {
    title: '主為你預備了今天的話',
    body: '安靜下來，把心裡的事交給主，然後翻開卡片，看看祂給你的方向。',
  },
  {
    title: '留三分鐘給自己，也給主',
    body: '先禱告交託，再抽一張今日箴言 — 聽聽主今天想對你說什麼。',
  },
  {
    title: '今天的箴言還在等你',
    body: '別急，先和主禱告片刻，再來領受這句特別為你而寫的話。',
  },
  {
    title: '新的一天，先深呼吸',
    body: '把今天輕輕交給主禱告，然後抽一張卡，讓這份禮物陪你走下去。',
  },
  {
    title: '主有話想對你說',
    body: '先靜靜禱告，再翻開今日箴言 — 願這句話成為你今天的光與方向。',
  },
]

function initAdmin(): void {
  if (admin.apps.length > 0) return
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not set')
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(raw)),
  })
}

// 台灣時間（UTC+8，無日光節約）
function taiwanNow(): { minutes: number; date: string } {
  const tw = new Date(Date.now() + 8 * 3600 * 1000)
  const date =
    `${tw.getUTCFullYear()}-` +
    `${String(tw.getUTCMonth() + 1).padStart(2, '0')}-` +
    `${String(tw.getUTCDate()).padStart(2, '0')}`
  return { minutes: tw.getUTCHours() * 60 + tw.getUTCMinutes(), date }
}

function isInvalidTokenError(code?: string): boolean {
  return (
    code === 'messaging/registration-token-not-registered' ||
    code === 'messaging/invalid-registration-token' ||
    code === 'messaging/invalid-argument'
  )
}

export default async function handler(
  req: VercelReq,
  res: VercelRes
): Promise<void> {
  const secret = process.env.CRON_SECRET
  const provided = req.headers['x-cron-secret']
  if (!secret || provided !== secret) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  try {
    initAdmin()
    const db = admin.firestore()
    const { minutes: nowMin, date } = taiwanNow()

    const snap = await db.collection('users').where('pushEnabled', '==', true).get()

    // 依日期決定今天的文案（當天所有人一致）
    const daySum = date.split('-').reduce((a, b) => a + Number(b), 0)
    const msg = MESSAGES[daySum % MESSAGES.length]!

    const targets: { uid: string; token: string }[] = []
    let skippedNotYet = 0
    let skippedStale = 0
    let skippedDrawn = 0
    let skippedNotified = 0
    let skippedNoToken = 0

    snap.forEach((docSnap) => {
      const d = docSnap.data() as {
        pushHour?: number
        pushMinute?: number
        lastDrawDate?: string
        lastNotifiedDate?: string
        fcmToken?: string
      }
      if (d.lastDrawDate === date) {
        skippedDrawn++ // 當天已抽過 → 不打擾
        return
      }
      if (d.lastNotifiedDate === date) {
        skippedNotified++ // 當天已通知過 → 不重複
        return
      }
      const scheduled = (d.pushHour ?? 8) * 60 + (d.pushMinute ?? 0)
      const delta = nowMin - scheduled
      if (delta < 0) {
        skippedNotYet++ // 提醒時間還沒到
        return
      }
      if (delta > CATCHUP_WINDOW_MIN) {
        skippedStale++ // 超出補送視窗
        return
      }
      if (!d.fcmToken) {
        skippedNoToken++
        return
      }
      targets.push({ uid: docSnap.id, token: d.fcmToken })
    })

    let sent = 0
    let failed = 0

    if (targets.length > 0) {
      const resp = await admin.messaging().sendEach(
        targets.map((t) => ({
          token: t.token,
          data: { title: msg.title, body: msg.body },
        }))
      )
      sent = resp.successCount
      failed = resp.failureCount

      await Promise.all(
        resp.responses.map((r, i) => {
          const uid = targets[i]!.uid
          const ref = db.collection('users').doc(uid)
          if (r.success) {
            // 標記今天已通知 → 同日後續 cron 不再重送
            return ref.update({ lastNotifiedDate: date }).catch(() => undefined)
          }
          if (isInvalidTokenError(r.error?.code)) {
            // token 失效 → 清掉
            return ref.update({ fcmToken: '' }).catch(() => undefined)
          }
          // 其他暫時性失敗 → 不標記，下次 cron 在視窗內會補送
          return undefined
        })
      )
    }

    res.status(200).json({
      ok: true,
      date,
      nowMinutes: nowMin,
      pushEnabledTotal: snap.size,
      skippedNotYet,
      skippedStale,
      skippedDrawn,
      skippedNotified,
      skippedNoToken,
      sent,
      failed,
    })
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'unknown error',
    })
  }
}
