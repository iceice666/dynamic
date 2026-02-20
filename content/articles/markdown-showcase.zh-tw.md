---
title: Markdown 功能展示
description: 這個部落格支援的所有 markdown 功能——GFM、數學公式、提示區塊、劇透文字、程式碼區塊等。
category: docs
categoryName: Docs
tags: [markdown, reference]
publishedAt: 2026-02-20
draft: false
---

# Markdown 功能展示

這個部落格所有可用 markdown 功能的完整參考。撰寫文章時可以把這裡當作複製貼上的來源。

## GFM：GitHub Flavored Markdown

### 行內格式

**粗體**、_斜體_、~~刪除線~~、`行內程式碼`，以及 **_粗斜體_**。

智慧標點已啟用：「彎引號」、'單引號'，以及破折號——像這樣——都會自動轉換。

### 連結

[內部連結到開始使用](/articles/getting-started)

[外部連結在新分頁開啟](https://astro.build)

### 圖片

![Astro logo](https://astro.build/assets/press/astro-icon-light.png)

### 引用區塊

> 「最好的文件，是你真的會去讀的那種。」
>
> — 網路上某人

### 任務清單

- [x] GFM 支援
- [x] 語法高亮
- [x] 數學公式渲染
- [ ] 傳送術

### 表格

| 外掛 | 功能 |
| --- | --- |
| `remark-math` + `rehype-katex` | LaTeX 數學公式渲染 |
| `remark-admonitions` | `:::note` / `:::tip` / `:::warning` / `:::danger` 區塊 |
| `remark-spoiler` | `||劇透文字||` 行內劇透 |
| `rehype-accessible-emojis` | 為表情符號加上 `<span role="img" aria-label="...">` |
| `remark-breaks` | 單個換行 → `<br>`（不需要行尾空格） |

---

## 程式碼區塊

程式碼圍欄使用 [Shiki](https://shiki.style) 進行語法高亮。語言標籤和複製按鈕會自動注入。

```ts
export function greet(name: string): string {
  return `你好，${name}！`;
}
```

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

```bash
pnpm dev        # 啟動開發伺服器
pnpm build      # 正式環境建置
pnpm check      # 型別檢查 + lint
```

---

## 數學公式

由 `remark-math` + `rehype-katex` 驅動。

行內：$E = mc^2$ 以及 $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

區塊：

$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
$$

---

## 提示區塊

四種標注類型，各有不同樣式：

:::note
**注意**提供有用的背景說明。適合用於「順帶一提」的資訊。
:::

:::tip
**提示**強調讀者可能不知道的最佳實踐或捷徑。
:::

:::warning
**警告**標記常見的陷阱或容易出錯的地方。
:::

:::danger
**危險**標注用於關鍵風險——資料遺失、資安問題、破壞性變更。
:::

---

## 劇透文字

用 `||雙直線||` 包住文字可以建立行內劇透（點擊即可顯示）：

答案是 ||42||，當然。

劇透也可以包含較長的句子：||是管家幹的，從頭到尾都是他。||

---

## 表情符號

短代碼（透過 `remark-emoji`）：:rocket: :sparkles: :tada: :warning:

Unicode 表情符號由 `rehype-accessible-emojis` 加上無障礙 `aria-label`：😄 ✨ 🚀 🎉

---

## 標題錨點

每個標題（`##`、`###` 等）都有可點擊的錨點連結。把滑鼠移到本頁任何標題上，就能看到 :link: 符號出現。你可以直接連結到特定段落，例如 [#數學公式](#數學公式) 或 [#提示區塊](#提示區塊)。

---

## 換行

已啟用 `remark-breaks`，所以原始碼中的單個換行會變成 `<br>`。
這一行緊接在上一行之後，中間只有一個換行。
這一行也是。

沒有 `remark-breaks` 的話，你需要行尾兩個空格或空白行才能換行。
