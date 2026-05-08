export type ThemeId = 'dawn' | 'dew' | 'spring' | 'starlight' | 'lantern' | 'rainbow'

export interface CardTheme {
  id: ThemeId
  name: string
  nameEn: string
  gradient: string
  textColor: string
  subTextColor: string
  borderColor: string
  chapterRange: [number, number]
}

export interface VerseCard {
  id: string
  date: string           // "YYYY-MM-DD"
  book: string           // "PRO"
  chapter: number
  verse: number
  reference: string      // "箴言 3:5"
  text: string
  theme: CardTheme
  createdAt: number
}

export interface BibleApiResponse {
  reference: string
  verses: {
    book_id: string
    book_name: string
    chapter: number
    verse: number
    text: string
  }[]
  text: string
  translation_id: string
  translation_name: string
}

export type AppPage = 'draw' | 'collection'
