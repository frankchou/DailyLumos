import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useCardStore } from '../store/cardStore'
import { signOut } from '../services/authService'
import { InstallGuide } from './InstallGuide'
import { ReminderSettings } from './ReminderSettings'
import { detectOS, isStandalone } from '../lib/platform'

export function UserMenu() {
  const { user } = useAuthStore()
  const { clearUserData, cards } = useCardStore()
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [reminderOpen, setReminderOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = detectOS() !== 'desktop'
  // 只在手機、且尚未安裝成 PWA 時，才顯示「加到主畫面」教學入口
  const showInstallItem = isMobile && !isStandalone()
  // 推播只在手機提供（桌面不推播）
  const showReminderItem = isMobile

  // 點擊外部關閉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!user) return null

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      clearUserData()
    } finally {
      setSigningOut(false)
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      {/* 頭像按鈕 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden transition-all active:scale-90"
        style={{ outline: '2px solid rgba(212,168,83,0.4)', outlineOffset: '1px' }}
        aria-label="使用者選單"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-sans text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #F0D08A, #D4A853)', color: '#4A2800' }}
          >
            {user.displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {/* 下拉選單 */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-2 w-60 rounded-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(253,248,240,0.97)',
              border: '1px solid rgba(212,168,83,0.2)',
              boxShadow: '0 8px 32px rgba(61,43,31,0.18)',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {/* 用戶資訊 */}
            <div
              className="px-4 py-4 flex items-center gap-3"
              style={{ borderBottom: '1px solid rgba(212,168,83,0.15)' }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-sans text-sm"
                    style={{ background: 'linear-gradient(135deg, #F0D08A, #D4A853)', color: '#4A2800' }}
                  >
                    {user.displayName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium truncate" style={{ color: '#3D2B1F' }}>
                  {user.displayName}
                </p>
                <p className="font-sans text-xs truncate" style={{ color: '#C4A882' }}>
                  {user.email}
                </p>
              </div>
            </div>

            {/* 收藏統計 */}
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(212,168,83,0.15)' }}
            >
              <span style={{ color: '#D4A853', fontSize: '12px' }}>✦</span>
              <span className="font-sans text-xs" style={{ color: '#8B6E5A' }}>
                已收藏 <strong style={{ color: '#D4A853' }}>{cards.length}</strong> 張箴言卡
              </span>
            </div>

            {/* 每日提醒設定（手機）*/}
            {showReminderItem && (
              <button
                onClick={() => {
                  setReminderOpen(true)
                  setOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 font-sans text-sm transition-colors duration-150"
                style={{ color: '#8B6E5A', borderBottom: '1px solid rgba(212,168,83,0.15)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,168,83,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"
                    stroke="#8B6E5A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                每日提醒設定
              </button>
            )}

            {/* 加到主畫面（手機、未安裝時）*/}
            {showInstallItem && (
              <button
                onClick={() => {
                  setGuideOpen(true)
                  setOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 font-sans text-sm transition-colors duration-150"
                style={{ color: '#8B6E5A', borderBottom: '1px solid rgba(212,168,83,0.15)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,168,83,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="3" width="12" height="18" rx="2.5" stroke="#8B6E5A" strokeWidth="1.5" />
                  <path d="M12 7.5v5M9.5 10h5" stroke="#8B6E5A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                加到主畫面
              </button>
            )}

            {/* 登出 */}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center gap-3 px-4 py-3.5 font-sans text-sm transition-colors duration-150"
              style={{ color: '#8B6E5A' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,168,83,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            >
              {signingOut ? (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(212,168,83,0.3)" strokeWidth="2" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="#8B6E5A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {signingOut ? '登出中...' : '登出'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 加到主畫面教學 modal */}
      <InstallGuide open={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* 每日提醒設定 modal */}
      <ReminderSettings open={reminderOpen} onClose={() => setReminderOpen(false)} />
    </div>
  )
}
