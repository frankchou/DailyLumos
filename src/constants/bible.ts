import { BIBLE_BOOKS, getBibleBook } from '../data/bibleBooks'

/**
 * 隨機抽選一本書 + 一個章節
 * 每卷書機率均等（1/66），每章節在書內均等
 * 節數由 fetchVerse 透過 chapter 端點抓回後再隨機選一節，避免維護 1189 個章節的節數
 */
export function randomBibleChapter(): { book: string; chapter: number } {
  const book = BIBLE_BOOKS[Math.floor(Math.random() * BIBLE_BOOKS.length)]!
  const chapter = Math.floor(Math.random() * book.chapters) + 1
  return { book: book.code, chapter }
}

/**
 * 組合書卷引用：「創世記 1:1」、「詩篇 23:1」、「約翰福音 3:16」
 */
export function formatReference(book: string, chapter: number, verse: number): string {
  const meta = getBibleBook(book)
  const name = meta?.name ?? book
  return `${name} ${chapter}:${verse}`
}

/**
 * 今日日期（本地時區，YYYY-MM-DD）
 */
export function getTodayDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
