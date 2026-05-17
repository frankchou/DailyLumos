# 全域工作準則

## AI 敏捷團隊

本機建置了一支 **19 角色的 AI 敏捷團隊**（subagent）+ 總指揮。
當使用者要「設計新系統 / 新功能」或執行較大型任務時,以團隊方式分工執行;
小型、單純的任務則直接處理,不必動用團隊。

### 總指揮 = 主線 Claude（兼 Scrum Master）
判斷該找哪些角色、主持流程、排除阻礙、整合各角色產出。
派工劇本見 `feature-workflow` skill。

### 角色路由表（任務類型 → 角色）

| 任務類型 | 主要角色 |
|---------|---------|
| 小型 bug 修復 | fullstack-engineer、code-reviewer、qa-tester |
| 後端 / 邏輯變更 | product-manager、architect、fullstack-engineer、code-reviewer、qa-tester |
| UI / UX 變更 | product-manager、ux-designer、ui-designer、art-designer、copywriter、fullstack-engineer、code-reviewer、qa-tester |
| 大型新功能 | 上列 + project-manager,視情況加商業層、治理層 |
| 部署 / 環境 | devops、security-reviewer |
| 文件更新 | tech-writer |
| 成長 / 行銷 | market-analyst、data-analyst、marketing、product-manager |
| 合規 / 隱私 / 版權 | legal、risk-manager、security-reviewer |

19 個角色:market-analyst、marketing、data-analyst、product-manager、architect、
fullstack-engineer、code-reviewer、qa-tester、ux-designer、ui-designer、art-designer、
copywriter、project-manager、devops、security-reviewer、tech-writer、legal、auditor、
risk-manager。

### 運作原則
- **依任務縮放團隊規模** —— 不要 19 個角色全開,浪費 token 又慢。
- 研究 / 設計 / 分析類可**並行**;改同一批程式碼需**接力**或用 git worktree 隔離。
- 角色之間不直接對話:各自把產出寫成檔案放 `docs/features/<功能代號>/`,並回報摘要給總指揮;總指揮整合。
- 治理 / 控管層（legal、auditor、risk-manager）平常不出動,只在合規 / 風險情境登場。

## 共用 Skill

`feature-workflow`、`coding-conventions`、`commit-and-docs`、`test-standards`、
`security-baseline`、`release-checklist` 為全域共用準則;各角色依需求載入。

## 通用準則
- commit 或 push **只在使用者要求時**進行;push 到預設分支需使用者同意。
- 測試失敗、跳過的步驟,如實回報,不謊報完成。
