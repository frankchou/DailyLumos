// Vercel Serverless Function（Node runtime）：發送一則「測試通知」
//
// 給「提醒設定」裡的測試按鈕用 —— 立刻發一則推播到呼叫者自己的裝置，
// 跳過每日發送端的所有條件（時間、抽卡、已通知）。
//
// 安全性：要求帶 Firebase ID token，驗證是已登入使用者才發。
// 環境變數：FIREBASE_SERVICE_ACCOUNT

import admin from 'firebase-admin'

interface VercelReq {
  method?: string
  body?: unknown
}
interface VercelRes {
  status: (code: number) => VercelRes
  json: (data: unknown) => void
}

function initAdmin(): void {
  if (admin.apps.length > 0) return
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not set')
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(raw)),
  })
}

export default async function handler(
  req: VercelReq,
  res: VercelRes
): Promise<void> {
  // 只在測試環境啟用。ENABLE_PUSH_TEST 只設在 Vercel Preview，
  // 正式環境不設 → 端點直接關閉。
  if (process.env.ENABLE_PUSH_TEST !== 'true') {
    res.status(404).json({ error: 'Not found' })
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    initAdmin()

    const body = (
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    ) as { idToken?: string; token?: string }

    if (!body?.idToken || !body?.token) {
      res.status(400).json({ error: 'Missing idToken or token' })
      return
    }

    // 驗證呼叫者是已登入的使用者
    await admin.auth().verifyIdToken(body.idToken)

    await admin.messaging().send({
      token: body.token,
      data: {
        title: '推播測試成功 ✦',
        body: '太好了，你會在設定的時間收到每日抽卡提醒。',
      },
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'unknown error',
    })
  }
}
