import type { CardTheme } from '../types'

export const CARD_THEMES: CardTheme[] = [
  {
    id: 'dawn',
    name: '晨曦',
    nameEn: 'Dawn',
    gradient: 'linear-gradient(135deg, #FFD89B 0%, #FF9A44 100%)',
    textColor: '#4A2800',
    subTextColor: 'rgba(74, 40, 0, 0.65)',
    borderColor: 'rgba(255, 200, 100, 0.4)',
    chapterRange: [1, 5],
  },
  {
    id: 'dew',
    name: '甘露',
    nameEn: 'Dew',
    gradient: 'linear-gradient(135deg, #E8F5E9 0%, #A8D8A8 50%, #88C8A0 100%)',
    textColor: '#1A3D2B',
    subTextColor: 'rgba(26, 61, 43, 0.65)',
    borderColor: 'rgba(100, 180, 130, 0.4)',
    chapterRange: [6, 10],
  },
  {
    id: 'spring',
    name: '溫泉',
    nameEn: 'Spring',
    gradient: 'linear-gradient(135deg, #FFE0E6 0%, #FFBCCC 50%, #FF8FA3 100%)',
    textColor: '#4A1528',
    subTextColor: 'rgba(74, 21, 40, 0.65)',
    borderColor: 'rgba(255, 100, 140, 0.3)',
    chapterRange: [11, 15],
  },
  {
    id: 'starlight',
    name: '星光',
    nameEn: 'Starlight',
    gradient: 'linear-gradient(135deg, #1A1A3E 0%, #3D2B7A 50%, #6B4FA8 100%)',
    textColor: '#E8D8FF',
    subTextColor: 'rgba(232, 216, 255, 0.65)',
    borderColor: 'rgba(180, 150, 255, 0.3)',
    chapterRange: [16, 20],
  },
  {
    id: 'lantern',
    name: '暖燈',
    nameEn: 'Lantern',
    gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFD9A0 50%, #D4914A 100%)',
    textColor: '#3D2200',
    subTextColor: 'rgba(61, 34, 0, 0.65)',
    borderColor: 'rgba(200, 130, 50, 0.4)',
    chapterRange: [21, 25],
  },
  {
    id: 'rainbow',
    name: '彩虹',
    nameEn: 'Rainbow',
    gradient: 'linear-gradient(135deg, #FFB3C1 0%, #FFC8A2 25%, #FFF0A0 50%, #B3E5D4 75%, #C3B1E1 100%)',
    textColor: '#2D1F4A',
    subTextColor: 'rgba(45, 31, 74, 0.65)',
    borderColor: 'rgba(150, 100, 180, 0.3)',
    chapterRange: [26, 31],
  },
]

export function getThemeForChapter(chapter: number): CardTheme {
  const theme = CARD_THEMES.find(
    (t) => chapter >= t.chapterRange[0] && chapter <= t.chapterRange[1]
  )
  return theme ?? CARD_THEMES[0]!
}
