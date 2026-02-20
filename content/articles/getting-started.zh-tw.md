---
title: 開始使用
description: 快速導覽這個部落格的內容系統——文章、短文、翻譯與 frontmatter。
category: docs
tags: [guide, meta]
publishedAt: 2026-02-20
draft: false
---

# 開始使用

歡迎來到這個 Astro 部落格的示範內容。`content/` 裡的每個檔案都是一份活的參考——每個檔案都展示了內容系統的某個實際功能。

## 兩種內容類型

### 文章（Articles）

文章存放在 `content/articles/`，是長篇、有結構的內容，支援完整的 frontmatter：

```yaml
---
title: 我的文章
description: 顯示在卡片和 SEO 的簡短摘要。
category: engineering        # 用於 URL 的 slug
tags: [astro, tutorial]
publishedAt: 2026-01-15
draft: false
lang: en
---
```

除了 `publishedAt` 之外，所有欄位都是選填的——`title` 和 `description` 可以從 markdown 內文自動提取（第一個 `# 標題` 成為標題，第一段成為描述）。

### 短文（Posts）

短文存放在 `content/posts/`，是格式精簡的短篇筆記。最簡單的合法短文是一個完全沒有 frontmatter 的檔案：

```markdown
剛發現 Astro 5 讓內容集合快很多。
值得升級。
```

詳情請看短文的說明。

## 翻譯

文章透過 `{slug}.{lang}.md` 的命名慣例支援翻譯：

```
content/articles/
  getting-started.md          ← 基底（英文）
  getting-started.zh-tw.md    ← 翻譯（繁體中文）
```

基底檔案必須包含 `lang` 欄位，宣告其語言（例如 `lang: en`、`lang: zh-tw`）。翻譯檔案完全省略 `lang`——語言由檔名後綴自動推斷。網站會自動連結兩者，在文章頁面顯示語言切換器。

這篇文章（`getting-started.zh-tw.md`）就是 `getting-started.md` 的翻譯——切換到 English 可以看到原文。

## 草稿文章

在 frontmatter 中設定 `draft: true` 會讓文章從列表和搜尋中隱藏。它仍然會建置，所以你可以直接導航到它的 URL 來預覽。請看這個集合裡的 `draft-article.md` 作為實際範例。

## 探索參考檔案

| 檔案 | 展示內容 |
| --- | --- |
| `getting-started.md` + `.zh-tw.md` | 翻譯對、標準 frontmatter |
| `markdown-showcase.md` + `.zh-tw.md` | 這個部落格支援的所有 markdown 功能 |
| `article-frontmatter.md` | 文章 schema 的所有欄位及說明 |
| `draft-article.md` | `draft: true` 的行為 |
