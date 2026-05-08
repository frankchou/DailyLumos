import { useCallback } from 'react'
import { useCardStore } from '../store/cardStore'
import { useAuthStore } from '../store/authStore'
import { fetchVerse } from '../services/bibleApi'
import { randomProverbsVerse, formatReference, getTodayDate } from '../constants/proverbs'
import { getThemeForChapter } from '../constants/themes'
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
      const { chapter, verse } = randomProverbsVerse()
      const { text } = await fetchVerse(chapter, verse)
      const theme = getThemeForChapter(chapter)
      const today = getTodayDate()

      const card: VerseCard = {
        id: generateId(),
        date: today,
        book: 'PRO',
        chapter,
        verse,
        reference: formatReference(chapter, verse),
        text,
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
