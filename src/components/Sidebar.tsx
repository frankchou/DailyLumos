import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCardStore } from '../store/cardStore'
import { useAuthStore } from '../store/authStore'
import { useTutorialStore } from '../store/tutorialStore'
import { signOut } from '../services/authService'
import { CompassIcon } from './CompassIcon'
import type { AppPage } from '../types'

interface NavItem {
  id: AppPage
  label: string
  subLabel: string
  icon: (active: boolean) => React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: 'draw',
    label: '今日箴言',
    subLabel: 'Daily Verse',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L14.4 8.8L21.6 9.2L16 13.8L17.8 21L12 17.2L6.2 21L8 13.8L2.4 9.2L9.6 8.8L12 2Z"
          fill={active ? '#D4A853' : 'none'}
          stroke={active ? '#D4A853' : '#C4A882'}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'collection',
    label: '我的卡片冊',
    subLabel: 'My Collection',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="10" rx="2"
          fill={active ? '#D4A853' : 'none'}
          stroke={active ? '#D4A853' : '#C4A882'} strokeWidth="1.5" />
        <rect x="13" y="3" width="8" height="10" rx="2"
          fill={active ? '#D4A853' : 'none'}
          stroke={active ? '#D4A853' : '#C4A882'} strokeWidth="1.5" />
        <rect x="3" y="15" width="8" height="6" rx="2"
          fill={active ? '#D4A853' : 'none'}
          stroke={active ? '#D4A853' : '#C4A882'} strokeWidth="1.5" />
        <rect x="13" y="15" width="8" height="6" rx="2"
          fill={active ? '#D4A853' : 'none'}
          stroke={active ? '#D4A853' : '#C4A882'} strokeWidth="1.5" />
      </svg>
    ),
  },
]

function UserSection() {
  const { user } = useAuthStore()
  const { clearUserData, cards } = useCardStore()
  const { start: startTutorial } = useTutorialStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  if (!user) return null

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      clearUserData()
    } finally {
      setSigningOut(false)
      setMenuOpen(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        data-tutorial="user-section"
        onClick={() => setMenuOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150 active:scale-[0.98]"
        style={{
          background: menuOpen ? 'rgba(212,168,83,0.1)' : 'transparent',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,168,83,0.08)' }}
        onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.background = 'transparent' }}
      >
        {/* 頭像 */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full overflow-hidden"
          style={{ outline: '2px solid rgba(212,168,83,0.3)', outlineOffset: '1px' }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName}
              className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-sans text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #F0D08A, #D4A853)', color: '#4A2800' }}>
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* 名稱 */}
        <div className="min-w-0 flex-1 text-left">
          <p className="font-sans text-sm font-medium truncate" style={{ color: '#3D2B1F' }}>
            {user.displayName}
          </p>
          <p className="font-sans text-xs truncate" style={{ color: '#C4A882' }}>
            {cards.length} 張收藏
          </p>
        </div>
        {/* 箭頭 */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          className="shrink-0 transition-transform duration-200"
          style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: '#C4A882' }}
        >
          <path d="M6 9l6 6 6-6" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 上方彈出選單 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(253,248,240,0.98)',
              border: '1px solid rgba(212,168,83,0.2)',
              boxShadow: '0 -8px 32px rgba(61,43,31,0.15)',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            {/* 用戶資訊 */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(212,168,83,0.15)' }}>
              <p className="font-sans text-xs" style={{ color: '#C4A882' }}>{user.email}</p>
            </div>
            {/* 功能導引（重看教學入口，置於登出之上）*/}
            <button
              onClick={() => {
                setMenuOpen(false)
                if (user) startTutorial({ isAuto: false, uid: user.uid })
              }}
              className="w-full flex items-center gap-3 px-4 py-3 font-sans text-sm transition-colors duration-150"
              style={{ color: '#8B6E5A', borderBottom: '1px solid rgba(212,168,83,0.15)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,168,83,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            >
              <CompassIcon />
              功能導引
            </button>

            {/* 登出 */}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center gap-3 px-4 py-3 font-sans text-sm transition-colors duration-150"
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="#8B6E5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {signingOut ? '登出中...' : '登出'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar() {
  const { currentPage, setCurrentPage } = useCardStore()

  return (
    <aside
      className="fixed top-0 left-0 h-full flex flex-col z-40"
      style={{
        width: '240px',
        background: 'rgba(253,248,240,0.97)',
        borderRight: '1px solid rgba(212,168,83,0.15)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Logo 區 */}
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: '1px solid rgba(212,168,83,0.1)' }}>
        <div className="flex items-center gap-3">
          <svg width="28" height="34" viewBox="0 0 36 44" fill="none">
            <path d="M18 4C18 4 8 14 8 24C8 29.523 12.477 34 18 34C23.523 34 28 29.523 28 24C28 14 18 4 18 4Z"
              fill="url(#sbFlameG)" opacity="0.9" />
            <path d="M18 14C18 14 13 20 13 25C13 27.761 15.239 30 18 30C20.761 30 23 27.761 23 25C23 20 18 14 18 14Z"
              fill="url(#sbFlameL)" opacity="0.85" />
            <defs>
              <linearGradient id="sbFlameG" x1="18" y1="4" x2="18" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F0D08A" /><stop offset="1" stopColor="#D4A853" />
              </linearGradient>
              <linearGradient id="sbFlameL" x1="18" y1="14" x2="18" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFDE7" /><stop offset="1" stopColor="#F0D08A" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <p className="font-display tracking-[0.3em] text-xs" style={{ color: '#C4A882' }}>DAILY</p>
            <h1 className="font-display font-semibold tracking-[0.12em] leading-none"
              style={{ fontSize: '22px', color: '#D4A853', textShadow: '0 0 12px rgba(212,168,83,0.3)' }}>
              LUMOS
            </h1>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav data-tutorial="sidebar-nav" className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-150 active:scale-[0.98]"
              style={{
                background: active ? 'rgba(212,168,83,0.12)' : 'transparent',
                border: active ? '1px solid rgba(212,168,83,0.2)' : '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'rgba(212,168,83,0.06)'
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent'
              }}
            >
              {item.icon(active)}
              <div>
                <p className="font-sans text-sm font-medium"
                  style={{ color: active ? '#D4A853' : '#3D2B1F' }}>
                  {item.label}
                </p>
                <p className="font-sans text-xs" style={{ color: active ? '#D4A853' : '#C4A882', opacity: 0.8 }}>
                  {item.subLabel}
                </p>
              </div>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#D4A853' }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* 底部引言裝飾 */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(212,168,83,0.1)' }}>
        <p className="font-serif text-xs text-center leading-relaxed"
          style={{ color: '#C4A882', opacity: 0.6 }}>
          「智慧是首要的，所以要得智慧」
          <br />
          <span className="font-sans" style={{ fontSize: '10px', opacity: 0.7 }}>箴言 4:7</span>
        </p>
      </div>

      {/* 用戶區 */}
      <div className="px-3 pb-4">
        <UserSection />
      </div>
    </aside>
  )
}
