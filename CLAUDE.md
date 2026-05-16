# Daily Lumos — 專案準則

每日箴言抽卡 PWA。使用者每天抽一張聖經經文卡,搭配 AI 解析、收藏、每日推播提醒。

## 技術棧
- 前端:React 18 + TypeScript + Vite + Tailwind CSS + framer-motion + zustand
- 後端:Vercel Serverless Functions（`api/`）
- 登入 / 資料庫 / 推播:Firebase（Auth、Firestore、Cloud Messaging）
- AI 解析:Claude API
- 排程:cron-job.org（每分鐘觸發推播發送端）
- 部署:Vercel　／　倉庫:GitHub `frankchou/DailyLumos`

## 鐵則
- **三份系統文件一起更新**:每次有意義的改動,`docs/系統架構.md`、
  `docs/系統機制.md`、`docs/版本紀錄.md` 必須同批更新,不可只改其中一兩份。
  詳見 `commit-and-docs` skill。
- 提交前 `npx tsc -b` 必須通過。
- push 到 `main` 需使用者同意。
- 測試 / 除錯功能（如測試推播）**絕不能出現在正式環境**,以環境變數控制。

## 設計系統
本專案視覺與語氣規範見 `design-system` skill（暖米底、燙金點綴;語氣溫暖、
神的稱呼統一用「主」）。

## 重要文件
- `docs/系統架構.md` —— 系統組成與職責
- `docs/系統機制.md` —— 各功能怎麼運作
- `docs/版本紀錄.md` —— 每次改動的紀錄
- `docs/AI團隊設計草稿.md` —— AI 敏捷團隊（19 角色）設計

## AI 敏捷團隊
本專案以 19 角色 AI 團隊分工開發,團隊定義見全域 `~/.claude/`（agents / skills）。
派工方式見 `feature-workflow` skill。
