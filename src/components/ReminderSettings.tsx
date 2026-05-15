import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import {
  getPushSettings,
  savePushSettings,
  type PushSettings,
} from '../services/firestoreService'
import {
  enablePushAndGetToken,
  isPushSupported,
  sendTestPush,
} from '../services/pushService'
import { detectOS, isStandalone } from '../lib/platform'
import { InstallGuide } from './InstallGuide'

interface ReminderSettingsProps {
  open: boolean
  onClose: () => void
}

const DEFAULT: PushSettings = {
  pushEnabled: false,
  pushHour: 8,
  pushMinute: 0,
  fcmToken: '',
}

const pad2 = (n: number) => String(n).padStart(2, '0')

// 測試按鈕只在「測試環境」顯示。VITE_ENABLE_PUSH_TEST 只設在 Vercel Preview，
// 正式環境（Production）不設此變數 → 按鈕不會出現。
const SHOW_PUSH_TEST = import.meta.env.VITE_ENABLE_PUSH_TEST === 'true'

// 半小時間隔的時間選項（00:00、00:30 … 23:30），value = 一天中的總分鐘數
const TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => ({
  total: i * 30,
  label: `${pad2(Math.floor((i * 30) / 60))}:${pad2((i * 30) % 60)}`,
}))

export function ReminderSettings({ open, onClose }: ReminderSettingsProps) {
  const { user } = useAuthStore()
  const uid = user?.uid ?? null
  const isRealUser = !!uid && uid !== '__mock__'

  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<PushSettings>(DEFAULT)
  const [guideOpen, setGuideOpen] = useState(false)
  const [testState, setTestState] = useState<'idle' | 'sending' | 'sent'>('idle')

  const os = detectOS()
  const iosNeedsInstall = os === 'ios' && !isStandalone()

  // ESC 關閉 + 鎖捲動
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // 打開時載入設定
  useEffect(() => {
    if (!open) return
    setError(null)
    if (!isRealUser) {
      setSettings(DEFAULT)
      setLoading(false)
      return
    }
    setLoading(true)
    getPushSettings(uid)
      .then((s) => setSettings(s))
      .catch(() => setSettings(DEFAULT))
      .finally(() => setLoading(false))
  }, [open, uid, isRealUser])

  // 寫回 Firestore（mock 用戶只更新本地 state）
  const persist = useCallback(
    async (patch: Partial<PushSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }))
      if (isRealUser) {
        try {
          await savePushSettings(uid, patch)
        } catch (err) {
          setError(err instanceof Error ? err.message : '儲存失敗')
        }
      }
    },
    [uid, isRealUser]
  )

  // 切換開關
  const handleToggle = useCallback(async () => {
    setError(null)
    if (settings.pushEnabled) {
      // 關閉
      await persist({ pushEnabled: false })
      return
    }
    // 開啟：iOS 未安裝 → 先引導安裝
    if (iosNeedsInstall) {
      setGuideOpen(true)
      return
    }
    if (!isPushSupported()) {
      setError('此瀏覽器不支援推播通知')
      return
    }
    setBusy(true)
    const result = await enablePushAndGetToken()
    setBusy(false)
    if ('error' in result) {
      setError(result.error)
      return
    }
    await persist({ pushEnabled: true, fcmToken: result.token })
  }, [settings.pushEnabled, iosNeedsInstall, persist])

  const handleTimeChange = useCallback(
    (totalMinutes: number) => {
      persist({
        pushHour: Math.floor(totalMinutes / 60),
        pushMinute: totalMinutes % 60,
      })
    },
    [persist]
  )

  const handleTestPush = useCallback(async () => {
    setError(null)
    setTestState('sending')
    const result = await sendTestPush(settings.fcmToken)
    if ('error' in result) {
      setError(result.error)
      setTestState('idle')
      return
    }
    setTestState('sent')
    setTimeout(() => setTestState('idle'), 3000)
  }, [settings.fcmToken])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[65] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
            {/* 遮罩 */}
            <div
              className="absolute inset-0"
              style={{
                background: 'rgba(44, 31, 20, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />

            {/* Modal */}
            <motion.div
              className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden"
              style={{
                background: '#FDF8F0',
                boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                border: '1px solid rgba(212,168,83,0.25)',
              }}
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="px-6 pt-6 pb-4 flex items-start justify-between"
                style={{ borderBottom: '1px solid rgba(212,168,83,0.2)' }}
              >
                <div>
                  <p
                    className="font-sans text-xs tracking-[0.3em] mb-1"
                    style={{ color: '#C4A882' }}
                  >
                    DAILY REMINDER
                  </p>
                  <h2 className="font-serif text-xl" style={{ color: '#3D2B1F' }}>
                    每日抽卡提醒
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all active:scale-90"
                  style={{ background: 'rgba(212,168,83,0.12)' }}
                  aria-label="關閉"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 3L13 13M13 3L3 13"
                      stroke="#8B6E5A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(212,168,83,0.25)" strokeWidth="2" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                ) : (
                  <>
                    {/* 開關 */}
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <p className="font-sans text-sm font-medium" style={{ color: '#3D2B1F' }}>
                          開啟每日提醒
                        </p>
                        <p className="font-sans text-xs mt-0.5" style={{ color: '#C4A882' }}>
                          溫柔提醒你禱告、抽今日箴言
                        </p>
                      </div>
                      <ToggleSwitch
                        on={settings.pushEnabled}
                        busy={busy}
                        onClick={handleToggle}
                      />
                    </div>

                    {/* 時間選擇（開啟時才顯示）*/}
                    <AnimatePresence>
                      {settings.pushEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mt-4 pt-4 flex items-center justify-between"
                            style={{ borderTop: '1px solid rgba(212,168,83,0.18)' }}
                          >
                            <p className="font-sans text-sm font-medium" style={{ color: '#3D2B1F' }}>
                              提醒時間
                            </p>
                            <select
                              value={settings.pushHour * 60 + settings.pushMinute}
                              onChange={(e) => handleTimeChange(Number(e.target.value))}
                              className="font-sans text-sm rounded-xl px-3 py-2"
                              style={{
                                background: 'rgba(212,168,83,0.12)',
                                border: '1px solid rgba(212,168,83,0.3)',
                                color: '#3D2B1F',
                              }}
                            >
                              {TIME_SLOTS.map((slot) => (
                                <option key={slot.total} value={slot.total}>
                                  {slot.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* 發送測試通知 — 只在測試環境顯示 */}
                          {SHOW_PUSH_TEST && (
                            <button
                              onClick={handleTestPush}
                              disabled={testState === 'sending'}
                              className="w-full mt-3 py-2.5 rounded-xl font-sans text-sm tracking-wider transition-all active:scale-95"
                              style={{
                                background: 'rgba(212,168,83,0.12)',
                                border: '1px dashed rgba(212,168,83,0.4)',
                                color: testState === 'sent' ? '#D4A853' : '#8B6E5A',
                              }}
                            >
                              {testState === 'sending'
                                ? '發送中…'
                                : testState === 'sent'
                                  ? '✦ 測試通知已發送'
                                  : '發送測試通知（測試環境）'}
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 智慧跳過說明 */}
                    <div
                      className="mt-4 rounded-2xl px-4 py-3 flex gap-2.5"
                      style={{ background: 'rgba(212,168,83,0.1)' }}
                    >
                      <span style={{ color: '#D4A853', fontSize: '13px' }}>✦</span>
                      <p className="font-sans text-xs leading-relaxed" style={{ color: '#8B6E5A' }}>
                        當天已經抽過卡，到了提醒時間就不會再打擾你。
                      </p>
                    </div>

                    {/* iOS 未安裝提示 */}
                    {iosNeedsInstall && (
                      <div
                        className="mt-3 rounded-2xl px-4 py-3"
                        style={{ background: 'rgba(255,143,163,0.1)', border: '1px solid rgba(255,143,163,0.25)' }}
                      >
                        <p className="font-sans text-xs leading-relaxed mb-2" style={{ color: '#C4756A' }}>
                          iPhone / iPad 需先把 app「加到主畫面」才能收推播。
                        </p>
                        <button
                          onClick={() => setGuideOpen(true)}
                          className="font-sans text-xs tracking-wider underline"
                          style={{ color: '#D4A853' }}
                        >
                          查看加到主畫面教學
                        </button>
                      </div>
                    )}

                    {/* 錯誤訊息 */}
                    {error && (
                      <p
                        className="mt-3 font-sans text-xs text-center"
                        style={{ color: '#C4756A' }}
                      >
                        {error}
                      </p>
                    )}

                    {!isRealUser && (
                      <p
                        className="mt-3 font-sans text-xs text-center"
                        style={{ color: '#C4A882' }}
                      >
                        （Dev 測試帳號：設定不會寫入雲端）
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <InstallGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  )
}

// ─── 開關元件 ─────────────────────────────────────────────────
function ToggleSwitch({
  on,
  busy,
  onClick,
}: {
  on: boolean
  busy: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="relative shrink-0 rounded-full transition-colors duration-200"
      style={{
        width: '48px',
        height: '28px',
        background: on
          ? 'linear-gradient(135deg, #F0D08A, #D4A853)'
          : 'rgba(196,168,130,0.35)',
        cursor: busy ? 'wait' : 'pointer',
      }}
      aria-pressed={on}
      aria-label="開關每日提醒"
    >
      <motion.span
        className="absolute top-1 flex items-center justify-center rounded-full"
        style={{
          width: '20px',
          height: '20px',
          background: '#FFFCF6',
          boxShadow: '0 1px 4px rgba(61,43,31,0.3)',
        }}
        animate={{ left: on ? '24px' : '4px' }}
        transition={{ type: 'spring', damping: 20, stiffness: 320 }}
      >
        {busy && (
          <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(212,168,83,0.3)" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#D4A853" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </motion.span>
    </button>
  )
}
