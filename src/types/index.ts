export type ThemeId = 'dawn' | 'dew' | 'spring' | 'starlight' | 'lantern' | 'rainbow'

export interface CardTheme {
  id: ThemeId
  name: string
  nameEn: string
  gradient: string
  textColor: string
  subTextColor: string
  borderColor: string
  books: string[] // 對應的聖經書卷代碼陣列（OSIS 3 碼）
}

export interface VerseCard {
  id: string
  date: string           // "YYYY-MM-DD"
  book: string           // OSIS 書卷代碼，如 "GEN"、"PSA"、"JHN"
  chapter: number
  verse: number
  reference: string      // "創世記 1:1"、"詩篇 23:1"
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
