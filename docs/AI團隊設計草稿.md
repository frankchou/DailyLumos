# AI 敏捷團隊設計

> 「19 個 agent + 總指揮」團隊的設計文件。
> 狀態:**已確認,待執行步驟 B(建立檔案)**。

---

## 一、團隊總覽

- **要建立的 sub-agent:19 個**
- **總指揮:1 位(由主線 Claude 擔任,不需建立)**
- **團隊角色總數:20**

| 層級 | 角色 | 數 |
|------|------|:--:|
| 商業/成長層 | 市場分析、行銷(兼小編)、數據分析師 | 3 |
| 核心層 | 產品經理、架構師、全端、Code Reviewer、QA 測試 | 5 |
| 設計層 | UX、UI、美術、文案 | 4 |
| 專職層 | 專案經理、DevOps、資安、技術文件 | 4 |
| 治理/控管層 | 法務、稽核、風險管理師 | 3 |
| 總指揮 | 主線 Claude | — |

---

## 二、運作模型

### 總指揮(我)做什麼 —— 兼任 Scrum Master
總指揮即敏捷流程中的 **Scrum Master**:主持流程、排除阻礙、確保團隊照 `feature-workflow` 運作。
1. 接到你的任務 → 讀 `feature-workflow` skill → 判斷需要哪些角色。
2. 派工:開對應的 sub-agent(含專案經理)。
3. 主持流程、排除阻礙,收回各角色產出(檔案 + 摘要),整合。
4. 套用 `commit-and-docs` 準則收尾。

> **Scrum Master 職能** = 總指揮(我):顧「流程順不順、阻礙排除、找誰整合」。
> **專案經理** = 獨立 agent:顧「任務拆解、排程、相依、進度追蹤」。
> 兩者不同 —— Scrum Master 是流程引導者,專案經理是任務與進度管理者;故
> Scrum Master 併入總指揮,專案經理仍為獨立 agent(agent 總數維持 19)。

### 並行 vs 接力
- **可並行**:研究、設計、分析類(不碰程式碼)→ 多個 agent 同時跑。
- **需接力**:實作類(改同一批程式碼)→ 依序,或用 git worktree 隔離。
- **典型流程**:

```
商業/成長層(成長任務才有)
   → 產品經理(需求) → 專案經理(拆任務、排程)
   → 架構師 ∥ 設計層(UX/UI/美術/文案)      ← 並行
   → 全端工程師(實作)
   → Code Reviewer ∥ QA 測試               ← 並行
   → 技術文件(更新三份文件)
   → DevOps(部署)
治理/控管層:碰到合規/風險/版權時,任一階段插入
```

### 角色交付方式
agent 之間不直接對話。每個角色:① 把產出**寫成檔案**,② 回報摘要給總指揮。
總指揮再把檔案/摘要轉交下一棒。每個功能用一個工作資料夾:

```
docs/features/<功能代號>/
   ├── requirements.md      產品經理
   ├── task-board.md        專案經理
   ├── architecture.md      架構師
   ├── ux-flow.md           UX
   ├── ui-spec.md           UI
   ├── copy.md              文案
   ├── test-plan.md         QA
   ├── review-notes.md      Code Reviewer
   └── ...(各角色產出)
```

---

## 三、19 個角色職責定義

格式:**職責** / **邊界(不做什麼)** / **讀取 skill** / **產出檔案**

### 商業/成長層

#### 1. 市場分析
- **職責**:競品分析、目標客群、市場趨勢、機會評估。
- **邊界**:只提供對外洞察,不寫需求規格(那是產品經理)。
- **讀取 skill**:`feature-workflow`
- **產出**:`market-research.md`

#### 2. 行銷(兼小編)
- **職責**:成長策略、行銷活動、通路、上線計畫;社群貼文撰寫與經營。
- **邊界**:不定產品需求;產品內文字交給文案。
- **讀取 skill**:`feature-workflow`、`design-system`(品牌語氣)
- **產出**:`marketing-plan.md`、社群貼文草稿

#### 3. 數據分析師
- **職責**:產品指標、留存漏斗、推播開啟率、A/B 結果分析。
- **邊界**:只解讀數據,不做產品決策。
- **讀取 skill**:`feature-workflow`
- **產出**:`data-insights.md`

### 核心層

#### 4. 產品經理(兼商業分析)
- **職責**:把需求/洞察轉成規格、驗收標準、優先序;功能效益評估(BA 職能)。
- **邊界**:不做技術設計(架構師)、不做視覺(設計層)、不做排程(專案經理)。
- **讀取 skill**:`feature-workflow`
- **產出**:`requirements.md`(含使用者故事、驗收標準)

#### 5. 架構師 / Tech Lead
- **職責**:系統設計、技術選型、資料結構、把需求拆成技術方案。
- **邊界**:做設計決策,不大量寫實作碼(交全端)。
- **讀取 skill**:`coding-conventions`、`security-baseline`
- **產出**:`architecture.md`(技術方案、影響檔案清單)

#### 6. 全端工程師
- **職責**:依架構與設計實作 React / TS / Firebase / Serverless。
- **邊界**:不自行變更需求或架構,有疑慮回報總指揮。
- **讀取 skill**:`coding-conventions`、`design-system`、`commit-and-docs`
- **產出**:程式碼變更

#### 7. Code Reviewer
- **職責**:讀程式碼,抓 bug、品質、慣例、可維護性問題。
- **邊界**:只審查、不直接改碼(問題回報全端修)。
- **讀取 skill**:`coding-conventions`、(底層可用內建 `/review`)
- **產出**:`review-notes.md`

#### 8. QA 測試
- **職責**:測試計畫、邊界案例、實際驗證行為是否符合驗收標準。
- **邊界**:測「跑起來對不對」,不讀程式碼細節(那是 Reviewer)。
- **讀取 skill**:`test-standards`
- **產出**:`test-plan.md`、`test-report.md`

### 設計層

#### 9. UX 設計
- **職責**:使用者流程、資訊架構、互動設計。
- **邊界**:管「怎麼用」,不管「長怎樣」(交 UI)。
- **讀取 skill**:`design-system`
- **產出**:`ux-flow.md`

#### 10. UI 設計
- **職責**:視覺設計、元件規格、版面、狀態。
- **邊界**:依 UX 流程設計外觀,不改流程邏輯。
- **讀取 skill**:`design-system`
- **產出**:`ui-spec.md`

#### 11. 美術設計
- **職責**:色彩、插畫、圖示、視覺素材。
- **邊界**:產出素材與色彩規範,不做元件版面(交 UI)。
- **讀取 skill**:`design-system`
- **產出**:`art-assets.md` + 素材檔

#### 12. 文案
- **職責**:產品內文字 —— 推播文案、AI 提示詞、UI 文字、錯誤訊息。
- **邊界**:寫產品內文字,不寫社群行銷文(交行銷)。
- **讀取 skill**:`design-system`(語氣規範)
- **產出**:`copy.md`

### 專職層

#### 13. 專案經理
- **職責**:任務拆解、排程、相依管理、進度追蹤、風險上報。
- **邊界**:管「事情怎麼排、進度如何」,不做角色的專業內容。
- **讀取 skill**:`feature-workflow`
- **產出**:`task-board.md`

#### 14. DevOps / 發布工程師
- **職責**:部署、環境變數、CI、排程器、Vercel/cron 設定。
- **邊界**:管交付環境,不寫產品功能碼。
- **讀取 skill**:`release-checklist`、`commit-and-docs`
- **產出**:`deploy-notes.md`

#### 15. 資安審查
- **職責**:Firestore 規則、密鑰處理、登入安全、端點防護。
- **邊界**:技術安全面;商業/法律風險交風險管理與法務。
- **讀取 skill**:`security-baseline`、(底層可用內建 `/security-review`)
- **產出**:`security-review.md`

#### 16. 技術文件
- **職責**:維護 `系統架構.md`、`系統機制.md`、`版本紀錄.md` 三份文件。
- **邊界**:只寫文件,不改程式。
- **讀取 skill**:`commit-and-docs`
- **產出**:更新三份系統文件

### 治理/控管層

#### 17. 法務
- **職責**:服務條款、隱私權政策、授權與版權(含聖經譯本版權)、合規。
- **邊界**:法律意見;不做技術風險(交風險管理)。
- **讀取 skill**:`feature-workflow`
- **產出**:`legal-review.md`

#### 18. 稽核
- **職責**:查核團隊有無遵循自訂流程與規範(`commit-and-docs`、測試流程等)。
- **邊界**:查「有沒有照規矩做」,不查程式品質(那是 Reviewer)。
- **讀取 skill**:`feature-workflow`、`commit-and-docs`
- **產出**:`audit-report.md`

#### 19. 風險管理師
- **職責**:辨識/評估/緩解技術、營運、商業各類風險。
- **邊界**:綜觀風險;技術安全細節交資安。
- **讀取 skill**:`feature-workflow`、`security-baseline`
- **產出**:`risk-assessment.md`

---

## 四、要建立的 Skill(共 7 個 — 共用準則)

| Skill | 內容 | 主要讀者 |
|-------|------|---------|
| `feature-workflow` | 總指揮派工劇本:任務類型 → 角色 → 執行順序 | 總指揮、多數角色 |
| `design-system` | 專案視覺/語氣規範:色票、字型、間距、品牌語氣 | 設計層、全端、行銷 |
| `coding-conventions` | 程式風格與慣例 | 架構師、全端、Reviewer |
| `commit-and-docs` | commit 訊息規範 + 三份文件一起更新鐵則 | 全端、技術文件、DevOps、稽核 |
| `test-standards` | 測試方法與涵蓋標準 | QA |
| `security-baseline` | 安全基準規則 | 資安、架構師、風險管理 |
| `release-checklist` | 部署與發布檢查清單 | DevOps |

> `design-system` 為**專案專屬**(每個專案不同);其餘多為**通用**。

---

## 五、檔案放置策略

| 內容 | 通用/專屬 | 放置位置 |
|------|----------|---------|
| 19 個角色 agent | 通用 | `~/.claude/agents/`(全域,所有專案自動可用) |
| `feature-workflow` 等 6 個通用 skill | 通用 | `~/.claude/skills/` |
| `design-system` skill | 專案專屬 | `專案/.claude/skills/` |
| 通用準則、角色路由表 | 通用 | `~/.claude/CLAUDE.md` |
| 專案技術棧、領域規則 | 專案專屬 | `專案/CLAUDE.md` |

> 若日後要給隊友共用,再把通用部分抽成 template repo 或 plugin。

---

## 六、已確認決議

1. ✅ 19 個角色職責邊界 —— 合理,不調整。
2. ✅ Skill 先建 7 個。
3. ✅ 「專案經理」**獨立**為一個 agent → 要建立的 agent 共 **19 個**。
   ✅ 「Scrum Master」職能**併入總指揮**(不另建 agent);與獨立的專案經理分工不同。
4. ✅ 角色與通用 skill 放 `~/.claude/` 全域。
5. ✅ 功能工作資料夾放 `docs/features/<功能代號>/`。

---

## 七、執行步驟(步驟 B)

1. 建 7 個 skill(`SKILL.md` + 內容)。
2. 建 19 個 agent 檔(`~/.claude/agents/*.md`)。
3. 建/更新 `CLAUDE.md`(專案 + 全域)。
4. 用一個小任務試跑整套流程,驗證後再正式使用。
