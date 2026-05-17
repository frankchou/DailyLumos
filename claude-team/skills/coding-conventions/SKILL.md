---
name: coding-conventions
description: 程式碼風格與慣例準則。撰寫或審查 TypeScript / React 程式碼時應參考。架構師、全端工程師、Code Reviewer 適用。
---

# 程式碼慣例

## 通用原則

- 新程式碼要**讀起來像周圍既有的程式碼** —— 比照其命名、註解密度、慣用寫法。
- 優先沿用專案既有的工具函式、型別、元件,不重複造輪子。
- 函式單一職責;避免過深巢狀,提早 return。
- 不留無用程式碼、不留 commented-out 區塊。

## TypeScript

- 全程 `strict`。避免 `any`;不得已時就近註解原因。
- 用 `type` / `interface` 明確描述資料結構,匯出共用型別。
- 公開函式標註回傳型別。

## React

- 一律 function component + hooks。
- side effect 放 `useEffect`,並正確處理 cleanup 與相依陣列。
- 昂貴計算或穩定 callback 才用 `useMemo` / `useCallback`,勿濫用。
- 元件檔案以該元件命名;一個檔案以一個主要 export 為原則。

## 命名

- 變數 / 函式：camelCase。型別 / 元件 / 類別：PascalCase。常數：UPPER_SNAKE_CASE。
- 命名要說明「是什麼 / 做什麼」,避免縮寫與模糊字眼。

## 註解

- 註解寫「為什麼」,不寫「做了什麼」（程式碼自己會說）。
- 比照專案語言（本專案註解多為繁體中文）。

## 錯誤處理

- 對外部呼叫（API、Firebase）做明確錯誤處理,不吞錯。
- 回傳結果用 discriminated union（如 `{ ok } | { error }`）優於拋例外,比照既有寫法。

## 提交前

- `npx tsc -b` 必須通過,無型別錯誤才算完成。
