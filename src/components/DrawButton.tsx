interface DrawButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

export function DrawButton({ onClick, disabled = false, loading = false }: DrawButtonProps) {
  return (
    <button
      data-tutorial="draw-button"
      onClick={onClick}
      disabled={disabled || loading}
      className="relative flex flex-col items-center gap-3 group"
    >
      <div
        className="relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-200 active:scale-95"
        style={{
          background: disabled
            ? 'rgba(196, 168, 130, 0.3)'
            : 'linear-gradient(135deg, #F0D08A 0%, #D4A853 50%, #A8782A 100%)',
          boxShadow: disabled
            ? 'none'
            : '0 0 20px rgba(212, 168, 83, 0.4)',
          animation: disabled || loading ? 'none' : 'pulseGlow 2s ease-in-out infinite',
        }}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            {/* 光芒星 */}
            <path
              d="M16 4L17.8 12.2L26 14L17.8 15.8L16 24L14.2 15.8L6 14L14.2 12.2L16 4Z"
              fill="white"
              opacity="0.95"
            />
            <path
              d="M16 10L16.9 14.1L21 15L16.9 15.9L16 20L15.1 15.9L11 15L15.1 14.1L16 10Z"
              fill="rgba(212, 168, 83, 0.4)"
            />
          </svg>
        )}

        {/* Hover glow ring */}
        {!disabled && !loading && (
          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              boxShadow: '0 0 0 4px rgba(212, 168, 83, 0.25)',
            }}
          />
        )}
      </div>

      <span
        className="font-sans text-sm tracking-widest transition-colors duration-200"
        style={{ color: disabled ? '#C4A882' : '#8B6E5A' }}
      >
        {loading ? '抽取中...' : '抽取今日箴言'}
      </span>
    </button>
  )
}
