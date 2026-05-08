# Daily Lumos — System Architecture (SA)

**版本**: v1.0  
**日期**: 2026-05-08  
**狀態**: Draft

---

## 1. 技術棧選型

| 層級 | 技術 | 選型理由 |
|------|------|----------|
| 框架 | **React 18 + TypeScript** | 組件化，適合卡片 UI；型別安全 |
| 樣式 | **Tailwind CSS + CSS Variables** | 快速開發；主題系統彈性高 |
| 動畫 | **Framer Motion** | 卡片翻轉、淡入等流暢動畫 |
| 狀態管理 | **Zustand** | 輕量、無 boilerplate，適合 MVP |
| 本地儲存 | **LocalStorage** (JSON) | 簡單；卡片數量有限，無需 IndexedDB |
| 外部 API | **Bible-api.com** | 免費、支援多版本聖經含繁中文 |
| 建置工具 | **Vite** | 快速 HMR，現代前端標準 |
| 部署 | **Vercel / GitHub Pages** | 靜態站台，免費 tier 足夠 |

---

## 2. 系統架構圖

```
┌─────────────────────────────────────────────────┐
│                  Browser (Client)                │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │            React Application             │   │
│  │                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌───────┐  │   │
│  │  │  Pages   │  │  Stores  │  │ Hooks │  │   │
│  │  │ /draw    │  │ cardStore│  │useApi │  │   │
│  │  │ /collect │  │ uiStore  │  │useDraw│  │   │
│  │  └──────────┘  └──────────┘  └───────┘  │   │
│  │                                          │   │
│  │  ┌──────────────────────────────────┐   │   │
│  │  │          Components              │   │   │
│  │  │  DrawCard │ CardBook │ CardModal │   │   │
│  │  └──────────────────────────────────┘   │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │         LocalStorage (Persistence)       │   │
│  │  - cards[]  - lastDrawDate  - settings   │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                        │
                        │ HTTP GET
                        ▼
┌─────────────────────────────────────────────────┐
│              Bible-api.com (External)            │
│  GET /data/verses/cunpss/PRO {chapter}:{verse}  │
└─────────────────────────────────────────────────┘
```

---

## 3. 目錄結構

```
daily-lumos/
├── public/
│   ├── favicon.ico
│   └── manifest.json          # PWA manifest
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── pages/
│   │   ├── DrawPage.tsx        # 今日抽卡頁
│   │   └── CollectionPage.tsx  # 卡片冊頁
│   │
│   ├── components/
│   │   ├── DrawButton.tsx      # 抽卡按鈕（帶光效動畫）
│   │   ├── VerseCard.tsx       # 箴言卡片（通用）
│   │   ├── CardFlip.tsx        # 卡片翻轉動畫容器
│   │   ├── CardModal.tsx       # 卡片放大檢視
│   │   ├── CountdownTimer.tsx  # 倒數計時（距明日重置）
│   │   ├── CollectionGrid.tsx  # 卡片冊格狀排列
│   │   └── NavBar.tsx          # 底部導覽列
│   │
│   ├── store/
│   │   └── cardStore.ts        # Zustand store（卡片資料、今日狀態）
│   │
│   ├── hooks/
│   │   ├── useDailyDraw.ts     # 抽卡邏輯（判斷是否可抽）
│   │   └── useBibleApi.ts      # API 呼叫與 Fallback
│   │
│   ├── services/
│   │   └── bibleApi.ts         # Bible-api.com 封裝
│   │
│   ├── data/
│   │   └── proverbsLocal.ts    # 本地備份（所有箴言節次）
│   │
│   ├── constants/
│   │   ├── themes.ts           # 卡片主題設定
│   │   └── proverbs.ts         # 箴言章節範圍設定
│   │
│   └── styles/
│       └── globals.css
│
├── docs/
│   ├── PRD.md
│   ├── SA.md
│   └── UIUX.md
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. 資料模型

### 4.1 卡片 (Card)

```typescript
interface VerseCard {
  id: string;              // UUID
  date: string;            // "YYYY-MM-DD" 抽卡日期
  book: string;            // "PRO" (Proverbs)
  chapter: number;         // 1–31
  verse: number;           // 節次
  reference: string;       // "箴言 3:5"
  text: string;            // 箴言全文（繁體中文）
  theme: CardTheme;        // 對應主題
  createdAt: number;       // timestamp
}
```

### 4.2 卡片主題 (CardTheme)

```typescript
type ThemeId = 'dawn' | 'dew' | 'spring' | 'starlight' | 'lantern' | 'rainbow';

interface CardTheme {
  id: ThemeId;
  name: string;            // "晨曦"
  nameEn: string;          // "Dawn"
  gradient: string;        // Tailwind gradient class
  textColor: string;       // 主題對應文字顏色
  accentColor: string;     // 強調色
}
```

### 4.3 本地儲存結構 (LocalStorage)

```typescript
// key: "daily-lumos-state"
interface LocalState {
  cards: VerseCard[];      // 所有歷史卡片
  lastDrawDate: string;    // 最後抽卡日期 "YYYY-MM-DD"
  todayCard: VerseCard | null;  // 今日卡片快取
}
```

---

## 5. API 整合

### 5.1 Bible-api.com

**Base URL**: `https://bible-api.com`

**端點格式**:
```
GET https://bible-api.com/{book}+{chapter}:{verse}?translation=cunpss
```

**範例請求**:
```
GET https://bible-api.com/PRO+3:5?translation=cunpss
```

**回應格式**:
```json
{
  "reference": "Proverbs 3:5",
  "verses": [
    {
      "book_id": "PRO",
      "book_name": "Proverbs",
      "chapter": 3,
      "verse": 5,
      "text": "你要專心仰賴耶和華，不可倚靠自己的聰明，"
    }
  ],
  "text": "你要專心仰賴耶和華，不可倚靠自己的聰明，",
  "translation_id": "cunpss",
  "translation_name": "Chinese Union Version (Simplified)",
  "translation_note": "Public Domain"
}
```

**注意**: `cunpss` 為簡體中文版本，若需繁體需在前端做字型處理或改用 `cuv` 版本確認支援度。

### 5.2 隨機節次生成邏輯

```typescript
// 箴言各章節數
const PROVERBS_VERSE_COUNT: Record<number, number> = {
  1: 33, 2: 22, 3: 35, 4: 27, 5: 23,
  6: 35, 7: 27, 8: 36, 9: 18, 10: 32,
  11: 31, 12: 28, 13: 25, 14: 35, 15: 33,
  16: 33, 17: 28, 18: 24, 19: 29, 20: 30,
  21: 31, 22: 29, 23: 35, 24: 34, 25: 28,
  26: 28, 27: 27, 28: 28, 29: 27, 30: 33,
  31: 31
};

function randomVerse(): { chapter: number; verse: number } {
  const chapter = Math.floor(Math.random() * 31) + 1;
  const maxVerse = PROVERBS_VERSE_COUNT[chapter];
  const verse = Math.floor(Math.random() * maxVerse) + 1;
  return { chapter, verse };
}
```

### 5.3 Fallback 策略

```
API 呼叫
  ├─ 成功 → 使用 API 回應
  └─ 失敗（逾時/網路錯誤）
       └─ 使用本地預存 proverbsLocal.ts 中的對應節次
```

---

## 6. 狀態管理 (Zustand Store)

```typescript
interface CardStore {
  // State
  cards: VerseCard[];
  todayCard: VerseCard | null;
  lastDrawDate: string;
  isLoading: boolean;
  error: string | null;

  // Derived
  canDrawToday: () => boolean;
  getCardsByDate: (date: string) => VerseCard[];

  // Actions
  drawCard: () => Promise<void>;
  loadFromStorage: () => void;
  persistToStorage: () => void;
}
```

---

## 7. 抽卡流程（業務邏輯）

```
[使用者點擊抽卡]
        │
        ▼
canDrawToday()?
  ├─ NO  → 顯示今日卡片 + 倒數計時
  └─ YES
       │
       ▼
  隨機生成 chapter:verse
       │
       ▼
  呼叫 bibleApi.fetchVerse()
  ├─ 成功 → 解析回應
  └─ 失敗 → 從 proverbsLocal 取得
       │
       ▼
  判斷主題（根據章節）
       │
       ▼
  建立 VerseCard 物件
       │
       ▼
  儲存至 Zustand Store
       │
       ▼
  persistToStorage() → LocalStorage
       │
       ▼
  觸發卡片翻轉動畫
       │
       ▼
  顯示今日箴言卡片
```

---

## 8. 效能考量

| 項目 | 策略 |
|------|------|
| API 快取 | 今日卡片抽取後快取至 LocalStorage，同日不重複呼叫 |
| 圖片資源 | 使用 CSS Gradient 替代圖片，避免大量圖片載入 |
| Bundle 大小 | Vite tree-shaking；Framer Motion 按需引入 |
| 首屏優化 | 關鍵 CSS inline；延遲載入 CollectionPage |

---

## 9. 安全性考量

- Bible-api.com 為公開 API，無需 API Key，無敏感資料
- 所有資料存於 Client 端 LocalStorage，無後端資料庫，無帳號資料外洩風險
- XSS 防護：React 預設 escape，不使用 `dangerouslySetInnerHTML`

---

*文件結束*
