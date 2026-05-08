import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onFinish, 500) // 等待淡出動畫
    }, 2200)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(160deg, #2C1F14 0%, #3D2B1F 50%, #1A1209 100%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 背景光暈 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212, 168, 83, 0.12) 0%, transparent 65%)',
            }}
          />

          {/* Logo */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* 火焰圖示 */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <svg width="48" height="60" viewBox="0 0 48 60" fill="none">
                <path
                  d="M24 4C24 4 8 20 8 34C8 43.941 15.059 52 24 52C32.941 52 40 43.941 40 34C40 20 24 4 24 4Z"
                  fill="url(#splashFlameGold)"
                  opacity="0.9"
                />
                <path
                  d="M24 18C24 18 15 28 15 36C15 40.418 19.029 44 24 44C28.971 44 33 40.418 33 36C33 28 24 18 24 18Z"
                  fill="url(#splashFlameLight)"
                  opacity="0.85"
                />
                <defs>
                  <linearGradient id="splashFlameGold" x1="24" y1="4" x2="24" y2="52" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F0D08A" />
                    <stop offset="1" stopColor="#D4A853" />
                  </linearGradient>
                  <linearGradient id="splashFlameLight" x1="24" y1="18" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFDE7" />
                    <stop offset="1" stopColor="#F0D08A" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* 文字 */}
            <div className="flex flex-col items-center gap-1">
              <motion.span
                className="font-display tracking-[0.5em] text-xs"
                style={{ color: 'rgba(240, 208, 138, 0.7)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                DAILY
              </motion.span>
              <motion.h1
                className="font-display font-semibold tracking-[0.15em]"
                style={{
                  fontSize: '48px',
                  color: '#D4A853',
                  textShadow: '0 0 30px rgba(212, 168, 83, 0.6), 0 0 60px rgba(212, 168, 83, 0.3)',
                }}
                initial={{ opacity: 0, letterSpacing: '0.3em' }}
                animate={{ opacity: 1, letterSpacing: '0.15em' }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                LUMOS
              </motion.h1>
            </div>
          </motion.div>

          {/* 副標題 */}
          <motion.p
            className="mt-8 font-serif text-sm text-center"
            style={{ color: 'rgba(196, 168, 130, 0.65)', letterSpacing: '0.08em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            每天一句光，照亮前行的路
          </motion.p>

          {/* 底部星點裝飾 */}
          <motion.div
            className="absolute bottom-16 flex gap-3 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.4 }}
          >
            {['·', '✦', '·'].map((s, i) => (
              <span key={i} style={{ color: 'rgba(212, 168, 83, 0.4)', fontSize: i === 1 ? '12px' : '8px' }}>
                {s}
              </span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
