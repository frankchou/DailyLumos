import { Sidebar } from './Sidebar'
import { NavBar } from './NavBar'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * 響應式佈局：
 *   手機 (< 1024px) → 底部 NavBar
 *   桌面 (≥ 1024px) → 固定左側 Sidebar（240px）+ 右側捲動主區
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: '#FDF8F0' }}>
      {/* 桌面 Sidebar — lg 以上顯示 */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* 主內容區 */}
      <main
        className="lg:ml-[240px] min-h-screen"
      >
        {children}
      </main>

      {/* 手機底部 NavBar — lg 以下顯示 */}
      <div className="lg:hidden">
        <NavBar />
      </div>
    </div>
  )
}
