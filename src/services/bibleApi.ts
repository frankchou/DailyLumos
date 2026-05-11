import type { BibleApiResponse } from '../types'
import { getBibleBook } from '../data/bibleBooks'
import { getRandomLocalVerse } from '../data/bibleVersesLocal'

const API_BASE = 'https://bible-api.com'
const TRANSLATION = 'cunpts'
const TIMEOUT_MS = 6000

export interface FetchVerseResult {
  book: string
  chapter: number
  verse: number
  text: string
  fromCache: boolean
}

/**
 * 抓某書某章的所有節，隨機選一節回傳。
 * 用 chapter 端點（不指定 verse）讓 API 自己回所有節，避免維護 1189 個章節的節數。
 */
export async function fetchRandomVerseInChapter(
  book: string,
  chapter: number
): Promise<FetchVerseResult> {
  const meta = getBibleBook(book)
  const slug = meta?.apiSlug ?? book.toLowerCase()

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const url = `${API_BASE}/${slug}+${chapter}?translation=${TRANSLATION}`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data: BibleApiResponse = await res.json()
    const verses = data.verses ?? []
    if (verses.length === 0) throw new Error('Empty chapter')

    const picked = verses[Math.floor(Math.random() * verses.length)]!
    const text = picked.text.trim().replace(/\s+/g, ' ')
    if (!text) throw new Error('Empty verse text')

    return {
      book,
      chapter,
      verse: picked.verse,
      text,
      fromCache: false,
    }
  } catch {
    clearTimeout(timer)
    // 後備：本地精選經文隨機選一節（跨書卷）
    const local = getRandomLocalVerse()
    return { ...local, fromCache: true }
  }
}
