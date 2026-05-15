// Vercel Serverless Function (Edge runtime)：
// 用 Claude Haiku 為單節經文生成靈修式解析。
// 直接 fetch Anthropic REST API；不引入 @anthropic-ai/sdk（含 node:fs 等 Edge 不支援的模組）。
// 需要環境變數 ANTHROPIC_API_KEY（在 Vercel dashboard 設定）。

import { callAnthropicAnalysis } from '../src/lib/aiPrompt'

interface AnalyzeRequest {
  reference: string
  text: string
}

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return jsonResponse({ error: 'ANTHROPIC_API_KEY not configured on server' }, 500)
  }

  let body: AnalyzeRequest
  try {
    body = (await req.json()) as AnalyzeRequest
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  const { reference, text } = body
  if (!reference || !text) {
    return jsonResponse({ error: 'Missing reference or text' }, 400)
  }

  try {
    const analysis = await callAnthropicAnalysis(apiKey, reference, text)
    return jsonResponse({ analysis }, 200)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return jsonResponse({ error: msg }, 502)
  }
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}
