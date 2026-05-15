// AI 解析的提示詞、模型設定、Anthropic API 呼叫
// api/analyze.ts (Vercel Edge) 與 vite.config.ts (dev middleware) 共用

export const AI_MODEL = 'claude-haiku-4-5-20251001'
export const AI_MAX_TOKENS = 900

export const AI_SYSTEM_PROMPT = `你是一位溫和、富有同理心的基督教神學老師。
為使用者抽到的聖經經文寫一段親近而有深度的解析，分成三段，每段都有明確標題。

嚴格遵守以下格式（每段以「## 標題」開頭、換行寫內文，三段都要有）：

## 書卷背景
60-90 字。介紹這節經文出自的書卷、寫作背景、整段所在的上下文脈絡。

## 經文含義
80-110 字。解釋這節經文本身的意思、字面與靈意層面、神學要點。

## 生活應用
80-110 字。把這節經文具體應用到當代日常生活，溫暖、不說教，可以給簡短的場景例子。

整體用繁體中文（台灣慣用語），語氣溫暖、像跟朋友分享。`

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
          content: `今日的經文：\n${reference}\n${text}\n\n請依照三段式格式為這節經文寫解析。`,
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

// ─── 解析回傳格式 ─────────────────────────────────────────────
// 新格式：## 書卷背景\n內文\n\n## 經文含義\n內文 ...
// 舊格式（沒有 ##，但通常有 3 段空行分隔）：自動套上三個標準標題

export interface AnalysisSection {
  heading: string
  body: string
}

export const STANDARD_HEADINGS = ['書卷背景', '經文含義', '生活應用']

export function parseAnalysisSections(text: string): AnalysisSection[] {
  const trimmed = text.trim()
  if (!trimmed) return [{ heading: '', body: '' }]

  // ── 新格式：含 ## 標記 ──
  if (/(^|\n)##\s+/.test(trimmed)) {
    const parts = trimmed
      .split(/\n*##\s+/)
      .map((p) => p.trim())
      .filter(Boolean)

    const sections: AnalysisSection[] = []
    for (const part of parts) {
      const nl = part.indexOf('\n')
      if (nl === -1) {
        sections.push({ heading: '', body: part })
      } else {
        const heading = part.slice(0, nl).trim()
        const body = part.slice(nl + 1).trim()
        sections.push({ heading, body })
      }
    }
    if (sections.length > 0) return sections
  }

  // ── 舊格式：用空行切段 ──
  const paragraphs = trimmed
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  // 剛好 3 段 → 套用標準三標題
  if (paragraphs.length === 3) {
    return paragraphs.map((body, i) => ({
      heading: STANDARD_HEADINGS[i]!,
      body,
    }))
  }

  // 其他段數 → 每段給對應標題（不足 3 個就留空標題）
  if (paragraphs.length > 1) {
    return paragraphs.map((body, i) => ({
      heading: STANDARD_HEADINGS[i] ?? '',
      body,
    }))
  }

  // 單段純文字 → 無標題整段顯示
  return [{ heading: '', body: trimmed }]
}
