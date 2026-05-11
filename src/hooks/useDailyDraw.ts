import { useCallback } from 'react'
import { useCardStore } from '../store/cardStore'
import { useAuthStore } from '../store/authStore'
import { fetchRandomVerseInChapter } from '../services/bibleApi'
import { randomBibleChapter, formatReference, getTodayDate } from '../constants/bible'
import { getThemeForBook } from '../constants/themes'
import type { VerseCard } from '../types'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useDailyDraw() {
  const { canDrawToday, addCard, setLoading, setError } = useCardStore()
  const { user } = useAuthStore()

  const draw = useCallback(async (): Promise<VerseCard | null> => {
    if (!canDrawToday()) return null

    setLoading(true)
    setError(null)

    try {
      const { book, chapter } = randomBibleChapter()
      const result = await fetchRandomVerseInChapter(book, chapter)
      // 若 API 失敗走後備，result.book/chapter/verse 來自本地精選經文（可能是別卷書）
      const theme = getThemeForBook(result.book)
      const today = getTodayDate()

      const card: VerseCard = {
        id: generateId(),
        date: today,
        book: result.book,
        chapter: result.chapter,
        verse: result.verse,
        reference: formatReference(result.book, result.chapter, result.verse),
        text: result.text,
        theme,
        createdAt: Date.now(),
      }

      await addCard(card, user?.uid ?? null)
      return card
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生錯誤，請再試一次')
      return null
    } finally {
      setLoading(false)
    }
  }, [canDrawToday, addCard, setLoading, setError, user])

  return { draw }
}
