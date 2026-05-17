# AI 敏捷團隊 — 可攜團隊包

這是一支 **19 角色的 AI 敏捷團隊**（Claude Code subagent）+ 共用 skill。
打包成可攜形式，方便在不同電腦 / 開發環境間移植。

## 內容

```
claude-team/
├── agents/      19 個角色 agent（market-analyst、product-manager、architect …）
├── skills/      6 個通用 skill（feature-workflow、coding-conventions …）
├── CLAUDE.md    全域工作準則（含角色路由表）
└── install.sh   一鍵安裝腳本
```

## 怎麼安裝（換電腦 / 換環境時）

1. 把這個 repo clone 到新電腦。
2. 在 `claude-team/` 目錄執行：
   ```
   bash install.sh
   ```
3. 它會把 `agents/`、`skills/`、`CLAUDE.md` 複製到 `~/.claude/`。
4. 重開 Claude Code，所有專案就能使用這支團隊。

> `~/.claude/` 是「使用者層」設定，安裝後**所有專案自動套用**，不需逐專案設定。
> Mac / Linux 在 `~/.claude/`；Windows 在 `C:\Users\你\.claude\`。

## 不包含什麼（刻意的）

**專案專屬**的部分不放這裡，因為每個專案不同：

- `design-system` skill（各專案的視覺 / 語氣規範）
- 專案自己的 `CLAUDE.md`（技術棧、領域規則）

這些放在「各專案自己的 repo」裡，clone 該專案時就會一起帶到。

## 怎麼用這支團隊

- **方式 A**：直接告訴主線 Claude「我要做功能 X」，它會判斷該找哪些角色、分工、整合。
- **方式 B**：自己開新對話、用 `@角色名` 點名單一角色來用。

派工規則見 `skills/feature-workflow`。
