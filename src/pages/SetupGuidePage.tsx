import { motion } from 'framer-motion'

const steps = [
  {
    num: '1',
    title: '建立 Firebase 專案',
    desc: '前往 Firebase Console，建立新專案（或選擇既有專案）。',
    link: 'https://console.firebase.google.com',
    linkText: 'console.firebase.google.com',
  },
  {
    num: '2',
    title: '啟用 Google 登入',
    desc: 'Authentication → 登入方式 → Google → 啟用',
    link: null,
    linkText: null,
  },
  {
    num: '3',
    title: '建立 Firestore 資料庫',
    desc: 'Firestore Database → 建立資料庫 → 選擇 Production 模式',
    link: null,
    linkText: null,
  },
  {
    num: '4',
    title: '設定 Firestore 規則',
    desc: '將 firestore.rules 的內容貼到 Firestore → Rules 頁面並發布。',
    link: null,
    linkText: null,
  },
  {
    num: '5',
    title: '建立 .env 檔案',
    desc: '在專案根目錄複製 .env.example 為 .env，填入 Firebase 設定值後重啟。',
    link: null,
    linkText: null,
  },
]

export function SetupGuidePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: 'linear-gradient(160deg, #2C1F14 0%, #3D2B1F 50%, #1A1209 100%)' }}
    >
      {/* 背景光暈 */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.1) 0%, transparent 65%)' }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none" className="mb-3">
            <path d="M18 4C18 4 8 14 8 24C8 29.523 12.477 34 18 34C23.523 34 28 29.523 28 24C28 14 18 4 18 4Z"
              fill="url(#sgFlameG)" opacity="0.9" />
            <path d="M18 14C18 14 13 20 13 25C13 27.761 15.239 30 18 30C20.761 30 23 27.761 23 25C23 20 18 14 18 14Z"
              fill="url(#sgFlameL)" opacity="0.85" />
            <defs>
              <linearGradient id="sgFlameG" x1="18" y1="4" x2="18" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F0D08A" /><stop offset="1" stopColor="#D4A853" />
              </linearGradient>
              <linearGradient id="sgFlameL" x1="18" y1="14" x2="18" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFDE7" /><stop offset="1" stopColor="#F0D08A" />
              </linearGradient>
            </defs>
          </svg>
          <h1 className="font-display font-semibold tracking-[0.15em]"
            style={{ fontSize: '32px', color: '#D4A853', textShadow: '0 0 20px rgba(212,168,83,0.5)' }}>
            LUMOS
          </h1>
          <p className="font-sans text-xs mt-2 tracking-widest" style={{ color: 'rgba(196,168,130,0.6)' }}>
            需要設定 Firebase 才能使用
          </p>
        </motion.div>

        {/* 步驟卡 */}
        <motion.div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(253,248,240,0.07)',
            border: '1px solid rgba(212,168,83,0.2)',
            backdropFilter: 'blur(12px)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="px-5 py-4 flex items-start gap-4"
              style={{
                borderBottom: i < steps.length - 1 ? '1px solid rgba(212,168,83,0.1)' : 'none',
              }}
            >
              {/* 序號 */}
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-xs font-semibold mt-0.5"
                style={{ background: 'rgba(212,168,83,0.2)', color: '#D4A853' }}
              >
                {step.num}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium mb-0.5" style={{ color: '#FEFCF8' }}>
                  {step.title}
                </p>
                <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(196,168,130,0.7)' }}>
                  {step.desc}
                </p>
                {step.link && (
                  <p className="font-sans text-xs mt-1" style={{ color: '#D4A853', opacity: 0.8 }}>
                    → {step.linkText}
                  </p>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* .env 範例 */}
        <motion.div
          className="mt-4 rounded-2xl p-4"
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(212,168,83,0.12)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <p className="font-sans text-xs mb-2" style={{ color: '#D4A853', opacity: 0.7 }}>
            .env 檔案範例
          </p>
          <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all"
            style={{ color: 'rgba(196,168,130,0.6)', fontSize: '10px' }}>
{`VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc`}
          </pre>
        </motion.div>

        <motion.p
          className="text-center font-sans text-xs mt-5"
          style={{ color: 'rgba(196,168,130,0.45)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          設定完成後，重新執行 <code style={{ color: 'rgba(212,168,83,0.7)' }}>npm run dev</code> 即可
        </motion.p>
      </div>
    </div>
  )
}
