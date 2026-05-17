import { useEffect, useState, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SplashScreen } from './components/SplashScreen'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoginPage } from './pages/LoginPage'
import { SetupGuidePage } from './pages/SetupGuidePage'

const DrawPage = lazy(() => import('./pages/DrawPage').then(m => ({ default: m.DrawPage })))
const CollectionPage = lazy(() => import('./pages/CollectionPage').then(m => ({ default: m.CollectionPage })))
import { useCardStore } from './store/cardStore'
import { useAuthStore, type AuthUser } from './store/authStore'
import { onAuthChange } from './services/authService'
import { isFirebaseConfigured } from './lib/firebase'
import { TutorialOverlay } from './components/TutorialOverlay'
import { useTutorialAutoStart } from './hooks/useTutorialAutoStart'

const IS_EMULATOR = import.meta.env.VITE_USE_EMULATOR === 'true'
const MOCK_AUTH_KEY = 'daily-lumos-mock-auth'

function AuthenticatedApp() {
  const { currentPage } = useCardStore()
  // 首次登入自動顯示功能導引教學（內含載入完成判定）
  useTutorialAutoStart()

  return (
    <Layout>
      <TutorialOverlay />
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {currentPage === 'draw' ? (
            <motion.div
              key="draw"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
            >
              <DrawPage />
            </motion.div>
          ) : (
            <motion.div
              key="collection"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
            >
              <CollectionPage />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </Layout>
  )
}

export function App() {
  const [showSplash, setShowSplash] = useState(true)
  const { syncFromCloud, clearUserData } = useCardStore()
  const { status, setUser, setAuthUser } = useAuthStore()

  // 本地 emulator：從 localStorage 還原 mock 用戶（完全跳過 Firebase Auth）
  useEffect(() => {
    if (!IS_EMULATOR) return
    const stored = localStorage.getItem(MOCK_AUTH_KEY)
    if (stored) {
      try {
        const mockUser = JSON.parse(stored) as AuthUser
        setAuthUser(mockUser)
        syncFromCloud(mockUser)
      } catch {
        setAuthUser(null)
      }
    } else {
      setAuthUser(null)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 正式環境：監聽 Firebase Auth 狀態
  useEffect(() => {
    if (IS_EMULATOR) return
    let currentUid: string | null = null
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser && currentUid !== firebaseUser.uid) {
        currentUid = firebaseUser.uid
        await syncFromCloud({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName ?? '使用者',
          email: firebaseUser.email ?? '',
          photoURL: firebaseUser.photoURL ?? '',
        })
      } else if (!firebaseUser) {
        currentUid = null
        clearUserData()
      }
    })
    return unsubscribe
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Firebase 未設定 → 顯示引導頁（不 crash）────────────────
  if (!isFirebaseConfigured) {
    return (
      <>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
        {!showSplash && <SetupGuidePage />}
      </>
    )
  }

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'

  return (
    <ErrorBoundary>
      {/* Splash */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Auth 載入中 */}
      {!showSplash && isLoading && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#FDF8F0' }}>
          <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(212,168,83,0.2)" strokeWidth="2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* 未登入 → 登入頁 */}
      <AnimatePresence>
        {!showSplash && !isLoading && !isAuthenticated && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 已登入 → 主 App */}
      <AnimatePresence>
        {!showSplash && !isLoading && isAuthenticated && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthenticatedApp />
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  )
}
