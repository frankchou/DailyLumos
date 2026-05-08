import { useState } from 'react'
import { motion } from 'framer-motion'
import { signInWithGoogle, signInWithTestAccount } from '../services/authService'

const IS_EMULATOR = import.meta.env.VITE_USE_EMULATOR === 'true'

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (!msg.includes('popup-closed') && !msg.includes('cancelled')) {
        setError('登入失敗，請再試一次')
      }
      setLoading(false)
    }
  }

  const handleDevLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithTestAccount()
    } catch (err) {
      setError(err instanceof Error ? err.message : '測試登入失敗')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-8"
      style={{
        background: 'linear-gradient(160deg, #2C1F14 0%, #3D2B1F 50%, #1A1209 100%)',
      }}
    >
      {/* 背景光暈 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212,168,83,0.1) 0%, transparent 65%)',
        }}
      />

      {/* Logo */}
      <motion.div
        className="flex flex-col items-center gap-4 mb-14"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <svg width="52" height="64" viewBox="0 0 52 64" fill="none">
          <path
            d="M26 4C26 4 10 22 10 37C10 47.493 17.163 56 26 56C34.837 56 42 47.493 42 37C42 22 26 4 26 4Z"
            fill="url(#loginFlameG)"
            opacity="0.9"
          />
          <path
            d="M26 19C26 19 17 30 17 38C17 42.971 21.029 47 26 47C30.971 47 35 42.971 35 38C35 30 26 19 26 19Z"
            fill="url(#loginFlameL)"
            opacity="0.85"
          />
          <defs>
            <linearGradient id="loginFlameG" x1="26" y1="4" x2="26" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F0D08A" />
              <stop offset="1" stopColor="#D4A853" />
            </linearGradient>
            <linearGradient id="loginFlameL" x1="26" y1="19" x2="26" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFDE7" />
              <stop offset="1" stopColor="#F0D08A" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex flex-col items-center gap-0.5">
          <span
            className="font-display tracking-[0.5em] text-xs"
            style={{ color: 'rgba(240,208,138,0.65)' }}
          >
            DAILY
          </span>
          <h1
            className="font-display font-semibold tracking-[0.15em]"
            style={{
              fontSize: '44px',
              color: '#D4A853',
              textShadow:
                '0 0 28px rgba(212,168,83,0.6), 0 0 56px rgba(212,168,83,0.3)',
            }}
          >
            LUMOS
          </h1>
        </div>

        <p
          className="font-serif text-sm text-center mt-1"
          style={{ color: 'rgba(196,168,130,0.7)', letterSpacing: '0.06em' }}
        >
          每天一句光，照亮前行的路
        </p>
      </motion.div>

      {/* 登入卡片 */}
      <motion.div
        className="w-full max-w-xs flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div
          className="w-full rounded-3xl p-6 flex flex-col items-center gap-4"
          style={{
            background: 'rgba(253,248,240,0.06)',
            border: '1px solid rgba(212,168,83,0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p
            className="font-sans text-xs text-center tracking-wider"
            style={{ color: 'rgba(196,168,130,0.7)' }}
          >
            登入以儲存你的每日箴言收藏
          </p>

          {/* Google 登入按鈕 */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-sans text-sm font-medium tracking-wide transition-all duration-200 active:scale-95"
            style={{
              background: loading ? 'rgba(253,248,240,0.7)' : '#FEFCF8',
              color: '#3D2B1F',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}
          >
            {loading ? (
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(212,168,83,0.3)" strokeWidth="2" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              /* Google SVG logo */
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading ? '登入中...' : '使用 Google 帳號登入'}
          </button>

          {/* Dev 快速登入（只在 emulator 模式顯示） */}
          {IS_EMULATOR && (
            <button
              onClick={handleDevLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-sans text-xs tracking-wider transition-all duration-200 active:scale-95"
              style={{
                background: 'rgba(212,168,83,0.12)',
                border: '1px dashed rgba(212,168,83,0.4)',
                color: 'rgba(212,168,83,0.8)',
              }}
            >
              ⚡ Dev 快速登入（本地測試）
            </button>
          )}

          {error && (
            <div className="w-full rounded-xl p-3" style={{ background: 'rgba(255,143,163,0.1)', border: '1px solid rgba(255,143,163,0.3)' }}>
              <p className="font-sans text-xs font-medium mb-1" style={{ color: '#FF8FA3' }}>登入錯誤</p>
              <p className="font-mono text-xs break-all leading-relaxed" style={{ color: 'rgba(255,143,163,0.8)' }}>
                {error}
              </p>
            </div>
          )}
        </div>

        {/* 底部說明 */}
        <p
          className="font-sans text-center leading-relaxed"
          style={{ color: 'rgba(196,168,130,0.45)', fontSize: '11px' }}
        >
          登入即代表你同意我們儲存
          <br />
          你的箴言收藏至雲端
        </p>
      </motion.div>

      {/* 裝飾星點 */}
      <motion.div
        className="absolute bottom-10 flex gap-3 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {['·', '✦', '·'].map((s, i) => (
          <span
            key={i}
            style={{
              color: 'rgba(212,168,83,0.35)',
              fontSize: i === 1 ? '11px' : '7px',
            }}
          >
            {s}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
