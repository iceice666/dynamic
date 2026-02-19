---
title: Markdown 功能展示
description: 內建 Markdown 功能加上數學公式、表情符號無障礙及提示區塊。
category: meta
categoryName: Meta
tags: [example, hello]
publishedAt: 2026-02-16
draft: false
---

# Markdown 功能展示

本頁展示內建 Markdown 功能（GFM、智慧標點、程式碼區塊）以及外掛功能（數學、表情符號、提示區塊、劇透文字等）。

## 內建 Markdown（GFM + 智慧標點）

智慧標點：「引號」、"雙引號"，以及破折號——全部正確渲染。

行內程式碼：`astro.config.mjs`

### 任務清單

- [x] Markdown 解析
- [x] 表格
- [ ] 完成文件撰寫

### 表格

| 功能             | 狀態 | 備註                              |
| ---------------- | ---- | --------------------------------- |
| GFM              | ✅    | 表格、任務清單、刪除線            |
| 語法高亮         | ✅    | Shiki 主題                        |
| 外掛             | ✅    | 數學、表情符號、提示區塊          |

### 刪除線

這是 ~~已棄用的~~ 更新後的內容。

### 引用區塊

> 「Markdown 應該易讀且富有表現力。」——所有人

### 程式碼區塊

```ts
export function sum(a: number, b: number): number {
  return a + b;
}
```

## 外掛

### 數學（remark-math + rehype-katex）

行內：$E = mc^2$

區塊：

$$
\int_0^\infty e^{-x} dx = 1
$$

### 表情符號（remark-emoji + rehype-accessible-emojis）

表情符號簡碼：:rocket: :star: :tada: :thumbsup:

Unicode 表情符號無障礙支援：😄 ✨ 🚀

### 提示區塊（remark-admonitions）

:::note
這是一個提示區塊，用於補充說明。
:::

:::tip
這是一個技巧區塊，用於最佳實踐。
:::

:::warning
這是一個警告區塊，用於注意事項。
:::

:::danger
這是一個危險區塊，用於重要風險提示。
:::

### 劇透文字

點擊以揭示：||這是一個秘密訊息！||

你可以在任何地方使用劇透，例如答案是 ||42||。

### 外部連結

此連結會在新分頁中開啟並帶有安全屬性：[Google](https://google.com)

### 標題錨點

本頁的每個標題都有可點擊的錨點連結——將滑鼠移到任何標題上即可看到 `#` 符號。
