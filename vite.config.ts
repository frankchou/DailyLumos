import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import Anthropic from '@anthropic-ai/sdk'
import {
  AI_MODEL,
  AI_MAX_TOKENS,
  AI_SYSTEM_PROMPT,
  buildUserPrompt,
} from './src/lib/aiPrompt'

/**
 * 開發階段用的 /api/analyze middleware：
 *   本地跑 `npm run dev` / `npm run dev:local` 時讓 Vite 接管這個路徑，
 *   行為與 api/analyze.ts (Vercel Edge Function) 保持一致。
 *   需要 .env 裡有 ANTHROPIC_API_KEY。
 */
function devAnalyzeApi(apiKey: string | undefined): Plugin {
  return {
    name: 'dev-analyze-api',
    configureServer(server) {
      server.middlewares.use('/api/analyze', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }

        if (!apiKey) {
          send(res, 500, {
            error:
              'ANTHROPIC_API_KEY not set. 把 key 加到 .env 後重啟 dev server。',
          })
          return
        }

        const chunks: Buffer[] = []
        req.on('data', (c: Buffer) => chunks.push(c))
        req.on('end', async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as {
              reference?: string
              text?: string
            }
            if (!body.reference || !body.text) {
              send(res, 400, { error: 'Missing reference or text' })
              return
            }

            const client = new Anthropic({ apiKey })
            const msg = await client.messages.create({
              model: AI_MODEL,
              max_tokens: AI_MAX_TOKENS,
              system: AI_SYSTEM_PROMPT,
              messages: [
                { role: 'user', content: buildUserPrompt(body.reference, body.text) },
              ],
            })
            const first = msg.content[0]
            const analysis = first?.type === 'text' ? first.text.trim() : ''
            if (!analysis) {
              send(res, 502, { error: 'Empty response from Claude' })
              return
            }
            send(res, 200, { analysis })
          } catch (err) {
            send(res, 502, {
              error: err instanceof Error ? err.message : 'Unknown error',
            })
          }
        })
      })
    },
  }
}

function send(
  res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (d: string) => void },
  status: number,
  data: unknown
): void {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

export default defineConfig(({ mode }) => {
  // loadEnv 讀 .env / .env.local / .env.<mode>，這裡只取 ANTHROPIC_ 開頭
  const env = loadEnv(mode, process.cwd(), 'ANTHROPIC_')
  return {
    plugins: [react(), devAnalyzeApi(env.ANTHROPIC_API_KEY)],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            motion: ['framer-motion'],
          },
        },
      },
    },
  }
})
