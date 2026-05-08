import type { BibleApiResponse } from '../types'
import { getLocalVerse } from '../data/proverbsLocal'

const API_BASE = 'https://bible-api.com'
const TRANSLATION = 'cunpss'
const TIMEOUT_MS = 6000

export interface FetchVerseResult {
  text: string
  fromCache: boolean
}

export async function fetchVerse(chapter: number, verse: number): Promise<FetchVerseResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const url = `${API_BASE}/PRO+${chapter}:${verse}?translation=${TRANSLATION}`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data: BibleApiResponse = await res.json()
    const rawText = data.verses[0]?.text ?? data.text
    // 清理空白與換行
    const text = rawText.trim().replace(/\s+/g, ' ')
    if (!text) throw new Error('Empty verse text')

    return { text, fromCache: false }
  } catch {
    clearTimeout(timer)
    // Fallback 到本地資料
    const local = getLocalVerse(chapter, verse)
    const text = local?.text ?? '你要專心仰賴耶和華，不可倚靠自己的聰明。（箴言 3:5）'
    return { text, fromCache: true }
  }
}
