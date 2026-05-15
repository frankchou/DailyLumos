// AI 解析的提示詞、模型設定、Anthropic API 呼叫
// api/analyze.ts (Vercel Edge) 與 vite.config.ts (dev middleware) 共用

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

interface AnthropicTextBlock {
  type: 'text'
  text: string
}

interface AnthropicMessage {
  content: AnthropicTextBlock[]
}

/**
 * 直接呼叫 Anthropic Messages API。
 * 不使用 @anthropic-ai/sdk 因為它依賴 node:fs / node:path，Vercel Edge runtime 不支援。
 * fetch() 在 Edge / Node 都可用，跨環境一致。
 */
export async function callAnthropicAnalysis(
  apiKey: string,
  reference: string,
  text: string
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      system: AI_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `今日的經文：\n${reference}\n${text}\n\n請為這節經文寫一段解析。`,
        },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Anthropic API ${res.status}: ${body.slice(0, 300)}`)
  }

  const data = (await res.json()) as AnthropicMessage
  const block = data.content?.[0]
  const analysis = block?.type === 'text' ? block.text.trim() : ''
  if (!analysis) throw new Error('Empty response from Claude')
  return analysis
}
