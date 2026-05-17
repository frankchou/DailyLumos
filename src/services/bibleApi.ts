import type { BibleApiResponse } from '../types'
import { getRandomLocalVerse } from '../data/bibleVersesLocal'

const API_BASE = 'https://bible-api.com'
// bible-api.com 的繁體中文和合本翻譯代碼為 cuv（cunpts 已下架）
// URL 路徑需用 OSIS 大寫 3 碼（GEN/PSA/JHN/PRO 等），剛好等同 BIBLE_BOOKS 的 code
const TRANSLATION = 'cuv'
const TIMEOUT_MS = 6000

// 單章書卷：整本聖經只有一章的書。bible-api.com 會把「書代碼+1」解讀成
// 「第 1 節」而非「第 1 章」，導致只回傳一節。改用明確的節範圍 1:1-N
// （N 為該書總節數）才能取得整章。
const SINGLE_CHAPTER_LAST_VERSE: Record<string, number> = {
  OBA: 21, // 俄巴底亞書
  PHM: 25, // 腓利門書
  '2JN': 13, // 約翰二書
  '3JN': 14, // 約翰三書
  JUD: 25, // 猶大書
}

/** 組出 bible-api.com 的章節參照；單章書卷改用節範圍以避開章/節歧義。 */
function chapterRef(book: string, chapter: number): string {
  const lastVerse = SINGLE_CHAPTER_LAST_VERSE[book]
  return lastVerse ? `${book}+1:1-${lastVerse}` : `${book}+${chapter}`
}

export interface FetchVerseResult {
  book: string
  chapter: number
  verse: number
  text: string
  fromCache: boolean
}

export interface ChapterVerse {
  verse: number
  text: string
}

/**
 * 抓某書某章的所有節，隨機選一節回傳。
 * 用 chapter 端點（不指定 verse）讓 API 自己回所有節，避免維護 1189 個章節的節數。
 */
export async function fetchRandomVerseInChapter(
  book: string,
  chapter: number
): Promise<FetchVerseResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const url = `${API_BASE}/${chapterRef(book, chapter)}?translation=${TRANSLATION}`
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

/**
 * 抓某書某章的所有節（給章節 modal 用）。失敗時回傳 null。
 */
export async function fetchChapter(
  book: string,
  chapter: number
): Promise<ChapterVerse[] | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const url = `${API_BASE}/${chapterRef(book, chapter)}?translation=${TRANSLATION}`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    if (!res.ok) return null

    const data: BibleApiResponse = await res.json()
    const verses = (data.verses ?? []).map((v) => ({
      verse: v.verse,
      text: v.text.trim().replace(/\s+/g, ' '),
    }))
    return verses.length > 0 ? verses : null
  } catch {
    clearTimeout(timer)
    return null
  }
}
