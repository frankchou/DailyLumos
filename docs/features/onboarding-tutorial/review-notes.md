# 功能導引教學（onboarding-tutorial）— 程式碼審查報告

審查角色：Code Reviewer
審查對象：TutorialOverlay / CompassIcon / TutorialDemoCountdown / tutorialStore /
tutorialStations / useTutorialAutoStart，及 firestoreService、App、DrawPage、
UserMenu、Sidebar、NavBar、DrawButton 的修改。
對照文件：`requirements.md`、`coding-conventions` skill。
`npx tsc -b`：通過，無型別錯誤。

---

## 摘要

| 嚴重度 | 數量 |
|--------|------|
| 高     | 3    |
| 中     | 5    |
| 低     | 4    |

**有阻擋上線的嚴重問題**：是。其中 H-1（桌機站①必跳號）直接違反 AC-11、AC-6
的可驗收標準，桌機版教學第一站無法呈現。建議全端修正後再上線。

---

## 高嚴重度（阻擋上線）

### H-1　桌機站①「左側 Sidebar 導覽」沒有挖空目標，會被自動跳過
- 檔案：`src/constants/tutorialStations.ts:118`（`targetKey: 'sidebar-nav'`）
  對照 `src/components/Sidebar.tsx:235`（`<nav>` 元素）。
- 問題：桌機站清單第①站 `targetKey` 為 `'sidebar-nav'`，但全專案搜尋
  `data-tutorial="sidebar-nav"` 無任何結果——`Sidebar.tsx` 的導覽 `<nav>`
  並未掛上該標記。`TutorialOverlay` 的對位輪詢 90 frame 後找不到目標，
  會呼叫 `next()` 自動跳過。
- 影響：桌機版教學一啟動就跳過第①站，直接從「抽卡按鈕」開始，違反
  FR-4.2、第五節站點清單、AC-11（桌機依序 5 站）。`ProgressIndicator`
  仍顯示總數 5，但第 1 站永遠看不到，使用者體感為「1/5 一閃而過」。
- 建議修法：在 `Sidebar.tsx` 的 `<nav className="flex-1 px-3 py-4 ...">`
  加上 `data-tutorial="sidebar-nav"`。

### H-2　桌機站⑤偏好用 `user-section`，但目標靠近 viewport 底部，spotlight 與說明卡可能重疊或被裁切
- 檔案：`src/components/TutorialOverlay.tsx:107-150`、`src/components/Sidebar.tsx:283-285`。
- 問題：`UserSection` 位於 Sidebar 最底（`px-3 pb-4`），`targetCenterX`
  落在 120px 左右（< vw/2），`computeCardPlacement` 桌機分支會優先選
  `right`，`top` 以 `clamp(targetCenterY - estCardHeight/2, …)` 計算。
  但站⑤的彈出選單（`absolute bottom-full`）展開後，真實互動目標是
  「使用者區塊按鈕」本身，挖空框只圈到 `data-tutorial="user-section"`
  的按鈕（不含展開的彈出選單）。EX-10 要求「選單內元素挖空時須確保選單
  已展開、目標可見」——但桌機站⑤的 `requiresMenuOpen` 未設定（見 H-3），
  且挖空目標只有按鈕、未涵蓋彈出選單，使用者看不出「更多設定」在哪。
- 影響：違反 FR-2.3 精神與 EX-10；桌機站⑤介紹的「個人資訊、收藏統計、
  更多設定」其實都在彈出選單裡，但教學沒有展開它，挖空只圈到頭像列。
- 建議修法：與架構師 / UX 確認桌機站⑤是否該自動展開 `UserSection` 的
  彈出選單。若是，需比照 UserMenu 做 `menuShouldOpen` 連動（見 H-3），
  並讓挖空目標涵蓋展開後的選單，或調整 `data-tutorial` 範圍。

### H-3　桌機 `UserSection` 完全沒有接 `menuShouldOpen`，桌機選單類站點無法自動展開
- 檔案：`src/components/Sidebar.tsx:57-71`（`UserSection`）對照
  `src/components/UserMenu.tsx:30-33`。
- 問題：手機 `UserMenu` 有監看 `menuShouldOpen` 自動展開 / 收合選單，
  並在教學進行中停用 click-outside（`UserMenu.tsx:36-45`）。但桌機
  `UserSection` 完全沒有引入 `menuShouldOpen` / `tutorialActive`：
  - 教學進行中桌機選單不會自動展開（EX-10 違反，若桌機站⑤需展開）。
  - `UserSection` 的 click-outside handler（`Sidebar.tsx:65-71`）在教學
    進行中仍生效，使用者一旦手動展開選單，點遮罩任何處（遮罩
    `onClick` 只 `stopPropagation`，但 `mousedown` 仍會冒泡到 document）
    會把選單關掉。
- 影響：桌機教學選單站行為與手機不一致；維護性差（兩套選單邏輯分歧）。
- 建議修法：`UserSection` 比照 `UserMenu` 引入 `useTutorialStore` 的
  `active` 與 `menuShouldOpen`，教學進行中停用 click-outside 並依
  `menuShouldOpen` 控制展開。同時釐清 H-2 桌機站⑤是否需要展開。

---

## 中嚴重度

### M-1　`useTutorialAutoStart` 切回抽卡頁後 `attemptedUidRef` 永久卡死，可能完全不啟動教學
- 檔案：`src/hooks/useTutorialAutoStart.ts:43-50`。
- 問題：當 `currentPage !== 'draw'` 時，effect 先 `setCurrentPage('draw')`
  並 `return`，**但此 return 在 `attemptedUidRef.current = user.uid` 之前**，
  看似 OK。然而換頁後 effect 重跑，這次走到 `attemptedUidRef.current = user.uid`
  並啟動 `run()`。問題在 `run()` 內若 `waitForCardArea` 輪詢 120 frame
  仍找不到 `card-area`（例如 DrawPage 尚在 `isSyncing` 的
  `SyncingOverlay`、卡片區尚未掛載），就**靜默放棄且 ref 已設**，
  該 uid 此次 session 再也不會自動啟動。雖然規格 EX-1 允許「寧可不教」，
  但 `isSyncing` 的等待已在 effect 層用 `if (isSyncing) return` 處理，
  `run()` 內又另開一個 120 frame 輪詢，兩段等待邏輯重疊且時序競態：
  effect 因 `isSyncing` 變 false 而重跑時 `attemptedUidRef` 可能已被前一次
  設定，導致 `run()` 不再重跑。
- 影響：在較慢的網路 / 裝置上，首次登入教學可能機率性不出現（AC-1/AC-2
  不穩定）。
- 建議修法：將「等 card-area DOM」與「等 isSyncing」收斂為單一等待點；
  或在 `run()` 輪詢失敗時把 `attemptedUidRef.current` 重設為 `null`，
  允許下次條件變化時重試。建議與架構師確認等待狀態機。

### M-2　`recompute`（resize/scroll）對 `requiresMenuOpen` 站點可能讀到舊位置或 null
- 檔案：`src/components/TutorialOverlay.tsx:374-384`、`427-435`。
- 問題：`recompute` 對一般站直接 `readTargetRect`，找不到就 `setRect(null)`，
  挖空與說明卡會瞬間消失。選單站（站⑥⑦）若在 resize 過程中選單動畫
  尚未完成或暫時不可見，`recompute` 會把 `rect` 設成 `null`，造成挖空
  閃爍。`useLayoutEffect` 的輪詢只在「站點切換」觸發，resize 時不會
  重新輪詢。EX-8 要求「重新對位、至少不挖到錯位」，目前實作在邊界會
  變成「整個挖空消失」。
- 建議修法：`recompute` 找不到目標時保留前一次 `rect`（不要設 null），
  或對選單站也走輪詢路徑。

### M-3　`menuShouldOpen` 由 store 全域控制，但只有手機 `UserMenu` 消費；桌機與重看情境語意不清
- 檔案：`src/store/tutorialStore.ts:66,79,89`、`src/components/UserMenu.tsx:30-33`。
- 問題：`start()` 依 `stations[0]?.requiresMenuOpen` 設 `menuShouldOpen`。
  桌機站清單目前無任何站設 `requiresMenuOpen`，所以桌機恆為 false——
  邏輯上沒 bug，但這代表桌機站⑤的選單展開需求被忽略（與 H-3 同源）。
  此外 `UserMenu` 的 `useEffect` 在 `tutorialActive` 為 true 時
  `setOpen(menuShouldOpen)`，手機教學跑到非選單站時會強制 `setOpen(false)`,
  若使用者此前自己開著選單也會被關閉——教學進行中尚可接受，但語意應
  在註解講清楚。
- 建議修法：釐清桌機選單站策略後一併處理；註解補上「教學進行中選單
  完全由教學編排」的明確說明。

### M-4　展示站（demo）的 spotlight 對位與 viewport 置中元件耦合，resize 時 `recompute` 量到的是動畫中尺寸
- 檔案：`src/components/TutorialOverlay.tsx:374-383`、`508-536`。
- 問題：展示站的 `demoRef` 元素以 `position:absolute; translate(-50%,-50%)`
  置中。`recompute` 在 resize 時讀 `demoRef.getBoundingClientRect()`，
  但展示元件外層有 `pointer-events-none` 與固定 padding，量測本身 OK；
  風險在於 `useLayoutEffect` 的 demo 分支用 `requestAnimationFrame`
  無限重試直到 `demoRef.current` 存在（`TutorialOverlay.tsx:404-406`），
  若因故 `demoRef` 永遠為 null（例如 `isDemoStation` 與 `station.demo`
  判定不一致），會造成 **無上限的 rAF 迴圈**，雖有 cleanup
  `cancelAnimationFrame`，但只在站點切換 / 卸載時觸發。
- 影響：理論上 `isDemoStation = station?.demo === true` 與
  `station.demo` 一致，目前不會無限迴圈；但缺乏 `maxAttempts` 保護，
  屬脆弱寫法。
- 建議修法：demo 分支也加上 `maxAttempts` 上限，超過則 fallback
  （例如直接以 viewport 中心給一個預設 rect）。

### M-5　`finish()` 對 mock 用戶用字串字面值 `'__mock__'` 判斷，與 `useTutorialAutoStart` 重複且易漂移
- 檔案：`src/store/tutorialStore.ts:97`、`src/hooks/useTutorialAutoStart.ts:38`。
- 問題：`'__mock__'` 這個 magic string 在兩處各寫一次。若日後 mock uid
  改名，漏改一處會造成 mock 環境誤寫 Firestore 或誤判。違反
  coding-conventions「優先沿用既有常數、不重複」。
- 建議修法：抽成共用常數（如 `MOCK_UID`）置於 `lib/` 或 authStore，
  兩處共用。

---

## 低嚴重度

### L-1　`readTargetRect` 的可見性判斷用 `width > 0 || height > 0`，應為 `&&`
- 檔案：`src/components/TutorialOverlay.tsx:39`。
- 問題：註解寫「取第一個實際可見、有尺寸的元素」，但條件是 `||`。
  一個寬度 0、高度非 0（或反之）的退化元素會被當成有效目標，挖空框
  會變成一條線。實務上多數元素不會出現單邊為 0，影響小，但與註解
  意圖不符。
- 建議修法：改為 `r.width > 0 && r.height > 0`。

### L-2　`Coachmark` 的 hover 變色用 inline `onMouseEnter/Leave` 直接改 DOM style，重複且不符既有 Tailwind 慣例
- 檔案：`src/components/TutorialOverlay.tsx:239-240,322-325`，
  另 `UserMenu.tsx`、`Sidebar.tsx` 多處同模式。
- 問題：專案既有元件確實也用此模式，故非新引入的壞味道；但 hover
  狀態用 JS 改 style 在 touch 裝置上 `onMouseLeave` 不一定觸發，
  可能殘留 hover 色。屬既有技術債，新程式碼沿用一致性 OK，僅記錄。
- 建議修法：可改用 Tailwind `hover:` 變體或 CSS class，非阻擋項。

### L-3　`cardWidth` 在元件 render 時直接讀 `window.innerWidth`，resize 不更新
- 檔案：`src/components/TutorialOverlay.tsx:356-358`。
- 問題：`cardWidth` 於 render 時計算一次，`computeCardPlacement` 雖在
  resize 時透過 `recompute → setRect` 重算位置，但 `cardWidth` 本身
  不會隨視窗變化更新（手機 `window.innerWidth * 0.88`）。手機旋轉
  螢幕後說明卡寬度仍是舊值。EX-8 提到旋轉螢幕需重新對位，寬度未跟進
  屬輕微瑕疵。
- 建議修法：將 `cardWidth` 納入 resize 重算（用 state + resize listener），
  或接受此邊界。

### L-4　`ProgressIndicator` 對「展示站被自動跳過」以外的情境正確，但站數固定後若中途某站對位失敗仍會跳號
- 檔案：`src/components/TutorialOverlay.tsx:160-191`、`414-419`。
- 問題：一般站對位失敗（90 frame）會 `next()` 自動跳過，`total` 仍是
  `stations.length`。若某選單站因展開動畫慢於 1.5s 而對位失敗，使用者
  會看到進度從 4/7 直接跳到 6/7。手機選單展開動畫 0.18s，正常不會
  超時；但低階裝置 + 教學切站瞬間 resize 可能觸發。屬防禦性提醒。
- 建議修法：選單站可比照規格意圖延長 `maxAttempts`，或在跳過時記
  log 以利線上追查。

---

## 需求對照（requirements.md）

逐條檢查無重大遺漏，惟下列需特別注意：

- **AC-11 / 第五節**：因 H-1，桌機版實際只呈現 4 站（①被跳過），
  **不符**。
- **AC-6**：H-1 導致桌機站①失效，但「功能導引」入口按鈕本身位置
  正確（`Sidebar.tsx:151-163`，置於登出之上）；入口存在，符合。
- **EX-10**：手機選單站（⑥⑦）有 `requiresMenuOpen` + `UserMenu`
  連動，符合；桌機站⑤無對應機制（H-2/H-3），**不符**。
- **FR-6.4 / AC-18,19**：自動教學結束寫旗標邏輯正確
  （`tutorialStore.finish` → `markTutorialSeen`），手動重看不寫
  （`isAuto` 為 false），符合 FR-6.6 / AC-20。
- **EX-4 / AC-22**：`markTutorialSeen` 吞錯只記 log、`finish()` 樂觀
  關閉，寫入失敗不阻斷使用者，符合。
- **EX-7**：`TutorialOverlay` 監看 `user` 變 null 即 `finish()`，符合。
- **FR-8 / 卡片互動站**：`card-area` 容器固定包整個卡片區域，文字固定，
  符合 AC-15/16/17。
- **FR-5.3 / AC-14**：`buildStations` 依 `isStandalone()` 過濾 menu-install
  站，站數正確、進度指示用 `stations.length`，符合。

---

## 三份系統文件

本次為功能新增，提醒收尾時依專案鐵則同批更新
`docs/系統架構.md`、`docs/系統機制.md`、`docs/版本紀錄.md`
（`commit-and-docs` skill）——此為文件待辦，非程式碼缺陷。
