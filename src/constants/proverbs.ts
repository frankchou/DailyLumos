// 箴言各章節總節數
export const PROVERBS_VERSE_COUNT: Record<number, number> = {
  1: 33, 2: 22, 3: 35, 4: 27, 5: 23,
  6: 35, 7: 27, 8: 36, 9: 18, 10: 32,
  11: 31, 12: 28, 13: 25, 14: 35, 15: 33,
  16: 33, 17: 28, 18: 24, 19: 29, 20: 30,
  21: 31, 22: 29, 23: 35, 24: 34, 25: 28,
  26: 28, 27: 27, 28: 28, 29: 27, 30: 33,
  31: 31,
}

export function randomProverbsVerse(): { chapter: number; verse: number } {
  const chapter = Math.floor(Math.random() * 31) + 1
  const maxVerse = PROVERBS_VERSE_COUNT[chapter] ?? 30
  const verse = Math.floor(Math.random() * maxVerse) + 1
  return { chapter, verse }
}

export function formatReference(chapter: number, verse: number): string {
  return `箴言 ${chapter}:${verse}`
}

export function getTodayDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
