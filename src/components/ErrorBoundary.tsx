import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center px-8 text-center gap-6"
          style={{ background: '#FDF8F0' }}
        >
          <div style={{ fontSize: '40px' }}>⚠️</div>
          <div>
            <p className="font-serif text-lg mb-2" style={{ color: '#3D2B1F' }}>
              發生了一些問題
            </p>
            <p className="font-sans text-sm" style={{ color: '#8B6E5A' }}>
              {this.state.error.message}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full font-sans text-sm"
            style={{ background: '#D4A853', color: '#4A2800' }}
          >
            重新載入
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
