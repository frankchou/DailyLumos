// AI 解析的提示詞與模型設定 — api/analyze.ts (production) 與
// vite.config.ts (dev middleware) 共用，避免兩邊不同步

export const AI_MODEL = 'claude-haiku-4-5-20251001'
export const AI_MAX_TOKENS = 700

export const AI_SYSTEM_PROMPT = `你是一位溫和、富有同理心的基督教神學老師。
使用者每天會抽到一節聖經經文，請為他們提供一段約 150-250 字的繁體中文解析。

要求：
1. 用溫暖、親近、像跟朋友分享的語氣，避免說教
2. 包含三個層次但自然成段（不要使用編號或標題）：
   - 經文字面/處境意義
   - 神學或靈意層面
   - 對現代日常生活的應用
3. 直接給解析內容，不要重複「這節經文是說…」這類開頭
4. 使用繁體中文（台灣慣用語）`

export function buildUserPrompt(reference: string, text: string): string {
  return `今日的經文：\n${reference}\n${text}\n\n請為這節經文寫一段解析。`
}
