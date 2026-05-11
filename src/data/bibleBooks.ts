// 全聖經 66 卷書資料：書卷代碼、中文/英文名、章數、分類
// 章數合計 1189，與聖經實際章數相符
// API URL slug：bible-api.com 接受小寫英文書名、多字書名用 + 連接

export type BibleCategory =
  | 'pentateuch' // 摩西五經
  | 'history' // 歷史書
  | 'wisdom' // 智慧/詩歌書
  | 'major-prophets' // 大先知書
  | 'minor-prophets' // 小先知書
  | 'gospels' // 福音書
  | 'acts' // 使徒行傳
  | 'epistles' // 書信
  | 'revelation' // 啟示錄

export interface BibleBook {
  code: string // 內部用代碼（OSIS 風格 3 碼），存入卡片資料
  apiSlug: string // 給 bible-api.com 用的 URL slug
  name: string // 繁中書名
  nameEn: string // 英文書名
  testament: 'old' | 'new'
  category: BibleCategory
  chapters: number // 該卷書共幾章
}

export const BIBLE_BOOKS: BibleBook[] = [
  // ── 摩西五經 ──────────────────────────────────────────
  { code: 'GEN', apiSlug: 'genesis', name: '創世記', nameEn: 'Genesis', testament: 'old', category: 'pentateuch', chapters: 50 },
  { code: 'EXO', apiSlug: 'exodus', name: '出埃及記', nameEn: 'Exodus', testament: 'old', category: 'pentateuch', chapters: 40 },
  { code: 'LEV', apiSlug: 'leviticus', name: '利未記', nameEn: 'Leviticus', testament: 'old', category: 'pentateuch', chapters: 27 },
  { code: 'NUM', apiSlug: 'numbers', name: '民數記', nameEn: 'Numbers', testament: 'old', category: 'pentateuch', chapters: 36 },
  { code: 'DEU', apiSlug: 'deuteronomy', name: '申命記', nameEn: 'Deuteronomy', testament: 'old', category: 'pentateuch', chapters: 34 },

  // ── 歷史書 ────────────────────────────────────────────
  { code: 'JOS', apiSlug: 'joshua', name: '約書亞記', nameEn: 'Joshua', testament: 'old', category: 'history', chapters: 24 },
  { code: 'JDG', apiSlug: 'judges', name: '士師記', nameEn: 'Judges', testament: 'old', category: 'history', chapters: 21 },
  { code: 'RUT', apiSlug: 'ruth', name: '路得記', nameEn: 'Ruth', testament: 'old', category: 'history', chapters: 4 },
  { code: '1SA', apiSlug: '1+samuel', name: '撒母耳記上', nameEn: '1 Samuel', testament: 'old', category: 'history', chapters: 31 },
  { code: '2SA', apiSlug: '2+samuel', name: '撒母耳記下', nameEn: '2 Samuel', testament: 'old', category: 'history', chapters: 24 },
  { code: '1KI', apiSlug: '1+kings', name: '列王紀上', nameEn: '1 Kings', testament: 'old', category: 'history', chapters: 22 },
  { code: '2KI', apiSlug: '2+kings', name: '列王紀下', nameEn: '2 Kings', testament: 'old', category: 'history', chapters: 25 },
  { code: '1CH', apiSlug: '1+chronicles', name: '歷代志上', nameEn: '1 Chronicles', testament: 'old', category: 'history', chapters: 29 },
  { code: '2CH', apiSlug: '2+chronicles', name: '歷代志下', nameEn: '2 Chronicles', testament: 'old', category: 'history', chapters: 36 },
  { code: 'EZR', apiSlug: 'ezra', name: '以斯拉記', nameEn: 'Ezra', testament: 'old', category: 'history', chapters: 10 },
  { code: 'NEH', apiSlug: 'nehemiah', name: '尼希米記', nameEn: 'Nehemiah', testament: 'old', category: 'history', chapters: 13 },
  { code: 'EST', apiSlug: 'esther', name: '以斯帖記', nameEn: 'Esther', testament: 'old', category: 'history', chapters: 10 },

  // ── 智慧/詩歌書 ───────────────────────────────────────
  { code: 'JOB', apiSlug: 'job', name: '約伯記', nameEn: 'Job', testament: 'old', category: 'wisdom', chapters: 42 },
  { code: 'PSA', apiSlug: 'psalms', name: '詩篇', nameEn: 'Psalms', testament: 'old', category: 'wisdom', chapters: 150 },
  { code: 'PRO', apiSlug: 'proverbs', name: '箴言', nameEn: 'Proverbs', testament: 'old', category: 'wisdom', chapters: 31 },
  { code: 'ECC', apiSlug: 'ecclesiastes', name: '傳道書', nameEn: 'Ecclesiastes', testament: 'old', category: 'wisdom', chapters: 12 },
  { code: 'SNG', apiSlug: 'song+of+solomon', name: '雅歌', nameEn: 'Song of Solomon', testament: 'old', category: 'wisdom', chapters: 8 },

  // ── 大先知書 ──────────────────────────────────────────
  { code: 'ISA', apiSlug: 'isaiah', name: '以賽亞書', nameEn: 'Isaiah', testament: 'old', category: 'major-prophets', chapters: 66 },
  { code: 'JER', apiSlug: 'jeremiah', name: '耶利米書', nameEn: 'Jeremiah', testament: 'old', category: 'major-prophets', chapters: 52 },
  { code: 'LAM', apiSlug: 'lamentations', name: '耶利米哀歌', nameEn: 'Lamentations', testament: 'old', category: 'major-prophets', chapters: 5 },
  { code: 'EZK', apiSlug: 'ezekiel', name: '以西結書', nameEn: 'Ezekiel', testament: 'old', category: 'major-prophets', chapters: 48 },
  { code: 'DAN', apiSlug: 'daniel', name: '但以理書', nameEn: 'Daniel', testament: 'old', category: 'major-prophets', chapters: 12 },

  // ── 小先知書 ──────────────────────────────────────────
  { code: 'HOS', apiSlug: 'hosea', name: '何西阿書', nameEn: 'Hosea', testament: 'old', category: 'minor-prophets', chapters: 14 },
  { code: 'JOL', apiSlug: 'joel', name: '約珥書', nameEn: 'Joel', testament: 'old', category: 'minor-prophets', chapters: 3 },
  { code: 'AMO', apiSlug: 'amos', name: '阿摩司書', nameEn: 'Amos', testament: 'old', category: 'minor-prophets', chapters: 9 },
  { code: 'OBA', apiSlug: 'obadiah', name: '俄巴底亞書', nameEn: 'Obadiah', testament: 'old', category: 'minor-prophets', chapters: 1 },
  { code: 'JON', apiSlug: 'jonah', name: '約拿書', nameEn: 'Jonah', testament: 'old', category: 'minor-prophets', chapters: 4 },
  { code: 'MIC', apiSlug: 'micah', name: '彌迦書', nameEn: 'Micah', testament: 'old', category: 'minor-prophets', chapters: 7 },
  { code: 'NAM', apiSlug: 'nahum', name: '那鴻書', nameEn: 'Nahum', testament: 'old', category: 'minor-prophets', chapters: 3 },
  { code: 'HAB', apiSlug: 'habakkuk', name: '哈巴谷書', nameEn: 'Habakkuk', testament: 'old', category: 'minor-prophets', chapters: 3 },
  { code: 'ZEP', apiSlug: 'zephaniah', name: '西番雅書', nameEn: 'Zephaniah', testament: 'old', category: 'minor-prophets', chapters: 3 },
  { code: 'HAG', apiSlug: 'haggai', name: '哈該書', nameEn: 'Haggai', testament: 'old', category: 'minor-prophets', chapters: 2 },
  { code: 'ZEC', apiSlug: 'zechariah', name: '撒迦利亞書', nameEn: 'Zechariah', testament: 'old', category: 'minor-prophets', chapters: 14 },
  { code: 'MAL', apiSlug: 'malachi', name: '瑪拉基書', nameEn: 'Malachi', testament: 'old', category: 'minor-prophets', chapters: 4 },

  // ── 福音書 ────────────────────────────────────────────
  { code: 'MAT', apiSlug: 'matthew', name: '馬太福音', nameEn: 'Matthew', testament: 'new', category: 'gospels', chapters: 28 },
  { code: 'MRK', apiSlug: 'mark', name: '馬可福音', nameEn: 'Mark', testament: 'new', category: 'gospels', chapters: 16 },
  { code: 'LUK', apiSlug: 'luke', name: '路加福音', nameEn: 'Luke', testament: 'new', category: 'gospels', chapters: 24 },
  { code: 'JHN', apiSlug: 'john', name: '約翰福音', nameEn: 'John', testament: 'new', category: 'gospels', chapters: 21 },

  // ── 使徒行傳 ──────────────────────────────────────────
  { code: 'ACT', apiSlug: 'acts', name: '使徒行傳', nameEn: 'Acts', testament: 'new', category: 'acts', chapters: 28 },

  // ── 書信 ──────────────────────────────────────────────
  { code: 'ROM', apiSlug: 'romans', name: '羅馬書', nameEn: 'Romans', testament: 'new', category: 'epistles', chapters: 16 },
  { code: '1CO', apiSlug: '1+corinthians', name: '哥林多前書', nameEn: '1 Corinthians', testament: 'new', category: 'epistles', chapters: 16 },
  { code: '2CO', apiSlug: '2+corinthians', name: '哥林多後書', nameEn: '2 Corinthians', testament: 'new', category: 'epistles', chapters: 13 },
  { code: 'GAL', apiSlug: 'galatians', name: '加拉太書', nameEn: 'Galatians', testament: 'new', category: 'epistles', chapters: 6 },
  { code: 'EPH', apiSlug: 'ephesians', name: '以弗所書', nameEn: 'Ephesians', testament: 'new', category: 'epistles', chapters: 6 },
  { code: 'PHP', apiSlug: 'philippians', name: '腓立比書', nameEn: 'Philippians', testament: 'new', category: 'epistles', chapters: 4 },
  { code: 'COL', apiSlug: 'colossians', name: '歌羅西書', nameEn: 'Colossians', testament: 'new', category: 'epistles', chapters: 4 },
  { code: '1TH', apiSlug: '1+thessalonians', name: '帖撒羅尼迦前書', nameEn: '1 Thessalonians', testament: 'new', category: 'epistles', chapters: 5 },
  { code: '2TH', apiSlug: '2+thessalonians', name: '帖撒羅尼迦後書', nameEn: '2 Thessalonians', testament: 'new', category: 'epistles', chapters: 3 },
  { code: '1TI', apiSlug: '1+timothy', name: '提摩太前書', nameEn: '1 Timothy', testament: 'new', category: 'epistles', chapters: 6 },
  { code: '2TI', apiSlug: '2+timothy', name: '提摩太後書', nameEn: '2 Timothy', testament: 'new', category: 'epistles', chapters: 4 },
  { code: 'TIT', apiSlug: 'titus', name: '提多書', nameEn: 'Titus', testament: 'new', category: 'epistles', chapters: 3 },
  { code: 'PHM', apiSlug: 'philemon', name: '腓利門書', nameEn: 'Philemon', testament: 'new', category: 'epistles', chapters: 1 },
  { code: 'HEB', apiSlug: 'hebrews', name: '希伯來書', nameEn: 'Hebrews', testament: 'new', category: 'epistles', chapters: 13 },
  { code: 'JAS', apiSlug: 'james', name: '雅各書', nameEn: 'James', testament: 'new', category: 'epistles', chapters: 5 },
  { code: '1PE', apiSlug: '1+peter', name: '彼得前書', nameEn: '1 Peter', testament: 'new', category: 'epistles', chapters: 5 },
  { code: '2PE', apiSlug: '2+peter', name: '彼得後書', nameEn: '2 Peter', testament: 'new', category: 'epistles', chapters: 3 },
  { code: '1JN', apiSlug: '1+john', name: '約翰一書', nameEn: '1 John', testament: 'new', category: 'epistles', chapters: 5 },
  { code: '2JN', apiSlug: '2+john', name: '約翰二書', nameEn: '2 John', testament: 'new', category: 'epistles', chapters: 1 },
  { code: '3JN', apiSlug: '3+john', name: '約翰三書', nameEn: '3 John', testament: 'new', category: 'epistles', chapters: 1 },
  { code: 'JUD', apiSlug: 'jude', name: '猶大書', nameEn: 'Jude', testament: 'new', category: 'epistles', chapters: 1 },

  // ── 啟示錄 ────────────────────────────────────────────
  { code: 'REV', apiSlug: 'revelation', name: '啟示錄', nameEn: 'Revelation', testament: 'new', category: 'revelation', chapters: 22 },
]

// 快查表：code → BibleBook
export const BIBLE_BOOK_BY_CODE: Record<string, BibleBook> = Object.fromEntries(
  BIBLE_BOOKS.map((b) => [b.code, b])
)

export function getBibleBook(code: string): BibleBook | undefined {
  return BIBLE_BOOK_BY_CODE[code]
}
