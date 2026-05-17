interface CompassIconProps {
  /** 線條顏色，預設為次文字色，與既有選單圖示一致 */
  color?: string
  size?: number
}

/**
 * 「功能導引」入口的羅盤圖示。
 * 描邊風格（strokeWidth 1.5、單色）與 UserMenu / Sidebar 既有選單圖示統一。
 */
export function CompassIcon({ color = '#8B6E5A', size = 16 }: CompassIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <path
        d="M15.5 8.5L13.4 13.4L8.5 15.5L10.6 10.6L15.5 8.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1" fill={color} />
    </svg>
  )
}
