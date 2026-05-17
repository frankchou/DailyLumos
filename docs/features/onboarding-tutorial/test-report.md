# 功能導引教學（Onboarding Tutorial）— 測試報告

功能代號：`onboarding-tutorial`
撰寫角色：QA 測試工程師
測試日期：2026-05-17
對應文件：`test-plan.md`、`requirements.md`、`ux-flow.md`

> **環境限制聲明**：本次驗收在 CI 環境進行，**無法做互動式瀏覽器點擊測試**，
> 也無法模擬 iOS / Android / PWA standalone。以下評估基於：
> （1）`npx tsc -b` 與 `npm run build` 建置驗證；
> （2）對實作原始碼與 `data-tutorial` 對位點的靜態審查。
> 凡涉及實際點擊、跨裝置、Firestore 真實寫入的項目，一律標為「需手動驗證」，
> 不報為通過。

---

## 一、建置結果

| 項目 | 指令 | 結果 |
|------|------|------|
| TypeScript 型別檢查 | `npx tsc -b` | ✅ 通過（exit 0，無錯誤） |
| 正式環境建置 | `npm run build` | ✅ 通過（460 modules，built in ~5s，無錯誤無警告） |

建置層面無阻斷問題。

---

## 二、逐條驗收評估（AC-1～AC-28）

標示：✅ 可靜態/建置確認　🔶 需 dev 環境手動驗證　⚠️ 有疑慮

### 顯示時機

| AC | 評估 | 說明 |
|----|------|------|
| AC-1 手機首次登入自動顯示 | 🔶 | `useTutorialAutoStart` 邏輯齊備（讀旗標→等 isSyncing→等 card-area DOM→start）。需手機 dev 環境驗證實際彈出。 |
| AC-2 桌機首次登入自動顯示 | ⚠️ | 同上邏輯成立，但桌機站①目標 `sidebar-nav` 無對應 DOM（見問題 ISSUE-1），教學會啟動但站①會被跳過。 |
| AC-3 已看過不自動顯示 | 🔶 | `getTutorialFlags` + `alreadySeen` 判定存在；`attemptedUidRef` 防重複。需手動驗證。 |
| AC-4 卡片未 render 不啟動 | ✅／🔶 | 靜態確認：`run()` 內 `requestAnimationFrame` 輪詢 `[data-tutorial="card-area"]`，找到才 `start()`；最多約 2s。邏輯正確；實際時序需手動驗證。 |

### 入口按鈕

| AC | 評估 | 說明 |
|----|------|------|
| AC-5 手機 UserMenu 有「功能導引」 | ✅ | `UserMenu.tsx` 確有「功能導引」項目（含 CompassIcon）。 |
| AC-6 桌機 Sidebar 有「功能導引」且在「登出」之上 | ✅ | `Sidebar.tsx` `UserSection` 彈出選單中「功能導引」按鈕位於「登出」按鈕之前（程式碼順序）。 |
| AC-7 點擊啟動且先收合選單 | ✅ | 兩處 onClick 皆先 `setOpen(false)`/`setMenuOpen(false)` 再 `startTutorial`。 |
| AC-8 回訪者可重看 | ✅ | 入口按鈕無條件渲染（只要 `user` 存在），不受旗標影響。 |

### 裝置區分與站點

| AC | 評估 | 說明 |
|----|------|------|
| AC-9 裝置對應站點清單 | ✅ | `tutorialStore.start` 依 `isMobile()` 選 `buildStations`。 |
| AC-10 手機 7 站內容一致 | ✅／🔶 | `MOBILE_STATIONS` 7 站、targetKey 與文字對齊 requirements 第四節。實際呈現需手動驗證。 |
| AC-11 桌機 5 站內容一致 | ⚠️ | `DESKTOP_STATIONS` 5 站，但站① `sidebar-nav` 無 DOM 對位點（ISSUE-1），實際只會呈現 4 站。 |
| AC-12 桌機無推播 / 加到主畫面站 | ✅ | `DESKTOP_STATIONS` 不含 `menu-reminder`/`menu-install`。 |

### 加到主畫面連動

| AC | 評估 | 說明 |
|----|------|------|
| AC-13 手機未安裝含第⑦站 | ✅／🔶 | `buildStations('mobile', false)` 回傳完整 7 站。需未安裝手機驗證。 |
| AC-14 手機已安裝隱藏第⑦站、6 站、進度正確 | 🔶 | `buildStations` 以 `isStandalone()` filter 掉 `menu-install`；`ProgressIndicator` 用 `stations.length`。邏輯正確，需 PWA standalone 環境實測。 |

### 卡片互動站

| AC | 評估 | 說明 |
|----|------|------|
| AC-15 挖空整個卡片區域 | ✅ | 站③ `targetKey: 'card-area'`；`DrawPage` 的 `<div data-tutorial="card-area">` 固定包住整個卡片容器。 |
| AC-16 說明文字正確 | ✅ | `MOBILE_STATIONS`/`DESKTOP_STATIONS` 站③ `body` 為「抽完卡後，點卡片可翻面看 AI 解析、看整章原文。」（與規格一致，含句末句號）。 |
| AC-17 已抽 / 未抽行為一致 | ✅ | `card-area` 容器在抽卡前後皆存在（包 AnalysisCard 或翻面動畫），同一挖空目標。 |

### 看過教學的記錄

| AC | 評估 | 說明 |
|----|------|------|
| AC-18 手機自動教學結束寫 `tutorialSeenMobile` | 🔶 | `finish()` 在 `isAuto && uidForFlag` 時呼叫 `markTutorialSeen(uid,'mobile')`。需連真實 Firestore 驗證欄位實際變 `true`。 |
| AC-19 桌機自動教學結束寫 `tutorialSeenDesktop` | 🔶 | 同上，device 為 'desktop'。需手動驗證。 |
| AC-20 手動開啟不改旗標 | ✅ | 手動入口 `startTutorial({ isAuto:false })`；`finish()` 僅在 `isAuto` 為真才寫旗標。 |
| AC-21 手機看過、桌機首次仍自動顯示 | ✅／🔶 | 兩旗標獨立，`useTutorialAutoStart` 依 device 各自判定。需跨裝置手動驗證。 |
| AC-22 旗標寫入失敗不阻斷 | ✅ | `markTutorialSeen` try/catch 吞錯只 log；`finish()` 採「樂觀關閉」先關 UI 再 `void markTutorialSeen(...)`，不 await。 |

### 遮罩互動與關閉

| AC | 評估 | 說明 |
|----|------|------|
| AC-23 全畫面遮罩 + 僅當前目標挖空 | ✅／🔶 | SVG mask：白底遮罩 + 黑色 rect 挖空，單一 cutout。視覺呈現需手動驗證。 |
| AC-24 底層不可誤觸 | ✅／🔶 | overlay `fixed inset-0`、`zIndex:70`、`pointerEvents:'auto'`、`onClick` stopPropagation。挖空處透出的真實元素不可點（mask 僅視覺、上層 overlay 攔截）。需手動驗證確認無漏點。 |
| AC-25 每站皆有明確關閉控制元件 | ✅ | `Coachmark` 右上角常駐「略過導引」按鈕。 |
| AC-26 結束後遮罩完全消失 | ✅／🔶 | `finish()` 設 `active:false`，`AnimatePresence` 播退場後卸載。需手動驗證無殘留。 |
| AC-27 下一步 / 上一步 / 完成 | ✅ | `Coachmark`：非首站顯示「上一步」，最後一站「下一步」改「完成」。 |
| AC-28 說明卡不出血、不遮目標 | 🔶 | `computeCardPlacement` 有 clamp 與上下/左右擺位邏輯，但 `estCardHeight` 為固定估值 200，實際內容高度可能不同（見 ISSUE-3）。須手動逐站驗證。 |

---

## 三、邊界情境評估（EX-1～EX-12）

| EX | 評估 | 說明 |
|----|------|------|
| EX-1 載入未完成不啟動 | ✅／🔶 | `isSyncing` 守門 + `card-area` DOM 輪詢。 |
| EX-2 已安裝 PWA 隱藏第⑦站 | 🔶 | `buildStations` filter 邏輯正確，需 standalone 實測。 |
| EX-3 中途關閉寫旗標 | ✅／🔶 | 略過導引走 `finish()`，與完成同路徑。 |
| EX-4 旗標寫入失敗 | ✅ | try/catch + 樂觀關閉，不阻斷。 |
| EX-5 旗標讀取失敗 | ✅ | `getTutorialFlags` catch 回傳預設（皆 false）→ 視為未看過。 |
| EX-6 老使用者首次登入 | ✅ | 欄位不存在時 `?? false` → 未看過 → 自動教。 |
| EX-7 教學中登出 | ✅／🔶 | `TutorialOverlay` 有 `useEffect`：`active && !user` → `finish()`。需手動驗證遮罩確實移除。 |
| EX-8 旋轉 / 縮放重新對位 | ✅／🔶 | `recompute` 綁 `resize`/`scroll`；轉場期間 `setRect(null)` 暫隱。需手動驗證對位正確。 |
| EX-9 臨界尺寸中途切換 | ✅ | `device` 在 `start()` 當下鎖定，流程中不變。 |
| EX-10 選單站未展開 | 🔶 | `menuShouldOpen` 由 store 推送、`UserMenu` 監聽展開；對位用輪詢等 DOM。需手動驗證選單動畫與對位時序。 |
| EX-11 看過手機改桌機 | ✅／🔶 | 兩旗標獨立。 |
| EX-12 自動觸發時在 collection 頁 | ✅ | `useTutorialAutoStart`：`currentPage !== 'draw'` 時 `setCurrentPage('draw')` 再重跑。 |

---

## 四、發現的問題

### ISSUE-1（高）桌機站① `sidebar-nav` 無對應 DOM 元素
- **現象**：`tutorialStations.ts` 桌機站① `targetKey: 'sidebar-nav'`，但 `Sidebar.tsx`
  的 nav 區塊（`navItems.map` 的按鈕）**沒有任何元素帶 `data-tutorial="sidebar-nav"`**。
  全專案 grep `sidebar-nav` 僅出現在 `tutorialStations.ts`。
- **影響**：桌機教學啟動後，`TutorialOverlay` 對站①找不到目標，輪詢約 1.5s 後
  自動 `next()` 跳過站①。使用者實際只會看到站②～⑤共 4 站，**違反 AC-11**
  （桌機應呈現 5 站）。進度指示總數仍是 5，但站①一閃即過。
- **重現步驟**：桌機（≥1024px）以全新帳號登入 → 自動教學啟動 → 觀察站①是否
  停留在 Sidebar 導覽並顯示說明卡。預期會直接跳到「抽卡按鈕」站。
- **建議**：在 `Sidebar.tsx` 的 `<nav>`（或其導覽項目容器）加上
  `data-tutorial="sidebar-nav"`。轉交全端工程師。

### ISSUE-2（中）裝置判定基準與版面斷點不一致
- **現象**：教學裝置判定用 `isMobile()`（基於 `navigator.userAgent` 的 OS 偵測），
  但 App 版面切換（NavBar vs Sidebar、DrawPage 手機/桌機佈局）用 CSS `lg:` 斷點
  （1024px 視窗寬）。兩者基準不同。
- **影響情境**：
  （a）桌機瀏覽器把視窗縮窄到 <1024px：版面變成手機佈局（底部 NavBar、
  `card-area` 為手機那份），但 `isMobile()` 仍判定為 desktop → 教學跑桌機版站點，
  站① `sidebar-nav` 對應的 Sidebar 此時被 CSS `hidden`，目標量不到尺寸 →
  整個桌機教學的多站可能對位失敗 / 跳過。
  （b）平板（iPadOS）`detectOS()` 判為 ios → 手機版教學，但若視窗 ≥1024px
  版面是桌機 Sidebar，手機版站① `mobile-nav`（底部 NavBar）被 `hidden`。
- **規格定位**：EX-9 規定「不處理中途切版，以啟動當下裝置判定為準」，但 EX-9
  針對的是「流程進行中切換」。此處問題是**啟動當下** `isMobile()` 判定的版本與
  當下實際渲染的版面就不一致。屬規格未完全涵蓋的邊界。
- **建議**：回報總指揮，由架構師裁定教學裝置判定是否應改用與版面一致的基準
  （如 `window.innerWidth >= 1024` 或 matchMedia），或明確接受此邊界。

### ISSUE-3（低）說明卡擺位用固定估高，可能造成出血 / 遮擋
- **現象**：`computeCardPlacement` 用 `estCardHeight = 200`（固定值）判斷上下空間
  是否足夠。但說明卡實際高度隨 `body` 文字長度變動（如倒數計時站文字較長）。
- **影響**：實際卡片高於 200px 時，擺位判斷可能誤判「塞得下」而導致說明卡
  超出畫面或遮住挖空目標，與 AC-28 期望不符。
- **建議**：需 dev 環境逐站目視確認；若有出血，建議改為量測實際卡片高度後
  再定位（`useLayoutEffect` 二次校正）。轉交全端 / UI 評估。

### 觀察事項（非缺陷）
- `card-area` 與 `countdown` 的 `data-tutorial` 在 DrawPage 同時出現在手機與桌機
  兩套佈局。`readTargetRect` 取「第一個 width>0 或 height>0」的元素，被 CSS `hidden`
  的那份尺寸為 0 會被略過 —— 設計上可正確取到當前可見的那份，無缺陷，但與
  ISSUE-2 疊加時（版面與裝置判定不一致）仍可能取錯。
- Mock 用戶（`__mock__`，本地 emulator）刻意略過自動顯示，僅能手動開啟測試 ——
  屬合理設計，但代表 AC-1/AC-2 的「自動顯示」無法在本地 emulator 驗證，
  需正式 Firebase dev 環境。

---

## 五、需使用者在 dev 環境手動驗證的清單

開發者請在「手機瀏覽器、手機 PWA、桌機」三種環境，用**全新測試帳號**執行：

1. **AC-1 / AC-10**：手機新帳號登入 → 自動彈出手機版教學 → 確認 7 站順序與文字。
2. **AC-2 / AC-11**：桌機新帳號登入 → 確認 5 站（**特別確認站① Sidebar 導覽是否
   正常顯示** —— 預期會因 ISSUE-1 被跳過，請確認）。
3. **AC-3 / TC-B1**：已看過教學的帳號重新登入 → 確認不自動彈出。
4. **AC-13 / AC-14 / TC-B2**：手機瀏覽器（7 站）vs PWA standalone（6 站，進度 1/6～6/6）。
5. **AC-18 / AC-19**：自動教學走完後，到 Firestore 確認 `users` 文件對應旗標變 `true`。
6. **AC-21 / EX-11**：同帳號手機看過後改桌機登入 → 確認桌機版仍自動顯示。
7. **AC-22 / EX-4**：開發者工具切離線後完成教學 → 確認 App 不卡死、無錯誤彈窗。
8. **AC-23～AC-26**：遮罩覆蓋、底層不可點、略過導引可關、結束無殘留。
9. **AC-28 / ISSUE-3**：逐站目視說明卡，特別是倒數計時站、底部導覽站、
   選單內項目站，確認不出血、不遮目標。
10. **TC-S3 / TC-S4 / EX-10**：手機站⑤→⑥ 選單自動展開、站⑥→⑤ 上一步選單收合。
11. **TC-S1 / EX-7**：教學進行中登出 → 確認遮罩立即消失。
12. **TC-B8**：新帳號未抽卡時的倒數計時站 → 確認顯示展示版倒數（23:59:59）。
13. **TC-X6 / ISSUE-2**：桌機視窗縮到 <1024px 後開啟教學 → 確認對位是否正常
   （此情境疑有問題）。

---

## 六、驗收統計與結論

| 分類 | 數量 | 項目 |
|------|------|------|
| ✅ 可靜態 / 建置確認通過 | 13 | AC-5, AC-6, AC-7, AC-8, AC-9, AC-12, AC-15, AC-16, AC-17, AC-20, AC-22, AC-25, AC-27 |
| 🔶 需 dev 環境手動驗證 | 12 | AC-1, AC-3, AC-4, AC-10, AC-13, AC-14, AC-18, AC-19, AC-21, AC-23, AC-24, AC-26, AC-28 之中需互動的部分（多項為「✅／🔶」混合，最終呈現須手動確認） |
| ⚠️ 有疑慮 | 3 | AC-2、AC-11（皆受 ISSUE-1 影響）；AC-28（受 ISSUE-3 影響） |

> 註：部分 AC 標示為「✅／🔶」（邏輯靜態可確認、但實際呈現需手動驗證），
> 上表 ⚠️ 與 🔶 以「最終是否能判定通過」歸類，未把任何未實際驗證項報為純通過。

**建置**：`tsc -b` 與 `npm run build` 皆通過。

**關鍵風險**：
1. **ISSUE-1（高）** — 桌機站① `sidebar-nav` 缺 `data-tutorial` 標記，桌機教學
   實際只會呈現 4 站，違反 AC-11。**建議上線前修正**。
2. **ISSUE-2（中）** — 教學裝置判定（UA-based `isMobile()`）與版面斷點（CSS 1024px）
   不一致，桌機窄視窗 / 平板情境下對位可能失敗。建議架構師裁定。
3. **ISSUE-3（低）** — 說明卡固定估高，長文字站可能出血 / 遮擋，需目視確認。

**結論**：功能整體實作完整、建置乾淨，多數驗收標準邏輯層面成立。但 ISSUE-1
為明確的功能缺陷（桌機教學少一站），應修正後再交回 QA 複驗；其餘需開發者
在 dev 環境完成上述手動驗證清單後才能正式逐條勾選驗收。
</content>
