import { useCardStore } from '../store/cardStore'
import type { AppPage } from '../types'

interface NavItem {
  id: AppPage
  label: string
  icon: (active: boolean) => React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: 'draw',
    label: '今日箴言',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="8"
          height="10"
          rx="2"
          fill={active ? '#D4A853' : 'none'}
          stroke={active ? '#D4A853' : '#C4A882'}
          strokeWidth="1.5"
        />
        <rect
          x="13"
          y="3"
          width="8"
          height="10"
          rx="2"
          fill={active ? '#D4A853' : 'none'}
          stroke={active ? '#D4A853' : '#C4A882'}
          strokeWidth="1.5"
        />
        <rect
          x="3"
          y="15"
          width="8"
          height="6"
          rx="2"
          fill={active ? '#D4A853' : 'none'}
          stroke={active ? '#D4A853' : '#C4A882'}
          strokeWidth="1.5"
        />
        <rect
          x="13"
          y="15"
          width="8"
          height="6"
          rx="2"
          fill={active ? '#D4A853' : 'none'}
          stroke={active ? '#D4A853' : '#C4A882'}
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
]

export function NavBar() {
  const { currentPage, setCurrentPage } = useCardStore()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t"
      style={{
        background: 'rgba(253, 248, 240, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'rgba(212, 168, 83, 0.2)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {navItems.map((item) => {
        const active = currentPage === item.id
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className="flex flex-col items-center gap-1 px-6 py-2 transition-all duration-150 active:scale-95"
          >
            {item.icon(active)}
            <span
              className="text-xs font-medium transition-colors duration-150"
              style={{ color: active ? '#D4A853' : '#C4A882' }}
            >
              {item.label}
            </span>
            {active && (
              <span
                className="absolute bottom-0 h-0.5 w-12 rounded-full"
                style={{ background: '#D4A853' }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
