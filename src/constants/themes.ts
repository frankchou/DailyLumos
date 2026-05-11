import type { CardTheme } from '../types'

/**
 * 主題與聖經書卷的對應：依書卷內容氛圍手工映射
 *   晨曦 ☀️  開始、光、新生命       → 創世記、約書亞記、四福音、使徒行傳
 *   甘露 💧  智慧、滋潤、生命之道   → 詩篇、箴言、雅各書
 *   溫泉 🌸  愛、溫柔、關係         → 路得記、雅歌、何西阿、腓利門、約一二三
 *   星光 ✨  深邃、敬畏、異象       → 士師、撒上下、王上下、智慧書（深沉者）、先知書（哀歎/異象）
 *   暖燈 🪔  教導、引導、安慰       → 摩西律法書、歷代志、復興時期、保羅書信、希伯來、彼前後
 *   彩虹 🌈  盟約、應許、奇蹟       → 以斯帖、啟示錄
 */
export const CARD_THEMES: CardTheme[] = [
  {
    id: 'dawn',
    name: '晨曦',
    nameEn: 'Dawn',
    gradient: 'linear-gradient(135deg, #FFD89B 0%, #FF9A44 100%)',
    textColor: '#4A2800',
    subTextColor: 'rgba(74, 40, 0, 0.65)',
    borderColor: 'rgba(255, 200, 100, 0.4)',
    books: ['GEN', 'JOS', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT'],
  },
  {
    id: 'dew',
    name: '甘露',
    nameEn: 'Dew',
    gradient: 'linear-gradient(135deg, #E8F5E9 0%, #A8D8A8 50%, #88C8A0 100%)',
    textColor: '#1A3D2B',
    subTextColor: 'rgba(26, 61, 43, 0.65)',
    borderColor: 'rgba(100, 180, 130, 0.4)',
    books: ['PSA', 'PRO', 'JAS'],
  },
  {
    id: 'spring',
    name: '溫泉',
    nameEn: 'Spring',
    gradient: 'linear-gradient(135deg, #FFE0E6 0%, #FFBCCC 50%, #FF8FA3 100%)',
    textColor: '#4A1528',
    subTextColor: 'rgba(74, 21, 40, 0.65)',
    borderColor: 'rgba(255, 100, 140, 0.3)',
    books: ['RUT', 'SNG', 'HOS', 'PHM', '1JN', '2JN', '3JN'],
  },
  {
    id: 'starlight',
    name: '星光',
    nameEn: 'Starlight',
    gradient: 'linear-gradient(135deg, #1A1A3E 0%, #3D2B7A 50%, #6B4FA8 100%)',
    textColor: '#E8D8FF',
    subTextColor: 'rgba(232, 216, 255, 0.65)',
    borderColor: 'rgba(180, 150, 255, 0.3)',
    books: [
      'JDG', '1SA', '2SA', '1KI', '2KI',
      'JOB', 'ECC',
      'JER', 'LAM', 'EZK', 'DAN',
      'JOL', 'AMO', 'OBA', 'NAM', 'HAB', 'ZEP',
      'JUD',
    ],
  },
  {
    id: 'lantern',
    name: '暖燈',
    nameEn: 'Lantern',
    gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFD9A0 50%, #D4914A 100%)',
    textColor: '#3D2200',
    subTextColor: 'rgba(61, 34, 0, 0.65)',
    borderColor: 'rgba(200, 130, 50, 0.4)',
    books: [
      'EXO', 'LEV', 'NUM', 'DEU',
      '1CH', '2CH', 'EZR', 'NEH',
      'ISA', 'JON', 'MIC', 'HAG', 'ZEC', 'MAL',
      'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL',
      '1TH', '2TH', '1TI', '2TI', 'TIT',
      'HEB', '1PE', '2PE',
    ],
  },
  {
    id: 'rainbow',
    name: '彩虹',
    nameEn: 'Rainbow',
    gradient: 'linear-gradient(135deg, #FFB3C1 0%, #FFC8A2 25%, #FFF0A0 50%, #B3E5D4 75%, #C3B1E1 100%)',
    textColor: '#2D1F4A',
    subTextColor: 'rgba(45, 31, 74, 0.65)',
    borderColor: 'rgba(150, 100, 180, 0.3)',
    books: ['EST', 'REV'],
  },
]

// 反向快查表：bookCode → CardTheme
const BOOK_TO_THEME: Record<string, CardTheme> = {}
for (const theme of CARD_THEMES) {
  for (const book of theme.books) {
    BOOK_TO_THEME[book] = theme
  }
}

export function getThemeForBook(book: string): CardTheme {
  return BOOK_TO_THEME[book] ?? CARD_THEMES[0]!
}
