export const defaultLocale = 'en' as const;
export const locales = ['en', 'zh-tw'] as const;

export const localeLabels: Record<(typeof locales)[number], string> = {
  en: 'English',
  'zh-tw': '中文（繁體）',
};

export const ui = {
  en: {
    // Nav
    nav_feed: 'Feed',
    nav_about: 'About',
    nav_friends: 'Friends',
    nav_archive: 'Archive',
    // Theme
    nav_theme_light: 'Light',
    nav_theme_dark: 'Dark',
    nav_theme_system: 'System',
    theme_mode_label: 'Theme Mode',
    theme_accent_label: 'Accent Color',
    theme_rainbow_label: 'Rainbow Mode',
    theme_speed_label: 'Speed',
    // Language
    nav_lang_toggle: '中文',
    nav_lang_toggle_zh: 'English',
    // Author
    author_bio_heading: 'About Me',
    // Social
    social_website: 'Website',
    social_github: 'GitHub',
    social_gitlab: 'GitLab',
    social_git: 'Git',
    social_twitter: 'Twitter / X',
    social_linkedin: 'LinkedIn',
    social_rss: 'RSS Feed',
    social_facebook: 'Facebook',
    social_instagram: 'Instagram',
    social_threads: 'Threads',
    social_youtube: 'YouTube',
    social_email: 'Email',
    // TOC
    widget_toc_label: 'On this page',
    widget_toc_aria: 'Table of contents',
    // Pages
    page_friends_heading: 'Friends',
    page_categories_heading: 'Categories',
    page_tags_heading: 'Tags',
    page_archive_heading: 'Archive',
    archive_article_singular: 'article',
    archive_article_plural: 'articles',
    // Article card
    article_label: 'ARTICLE',
    post_label: 'POST',
    article_word_count: 'words',
    article_read_time: 'min read',
    article_read_in_english: 'Read in English →',
    article_read_in_chinese: 'Read in Chinese →',
    // Search
    nav_search: 'Search',
    page_search_heading: 'Search',
    search_placeholder: 'Search articles and posts...',
    search_aria: 'Search articles and posts',
    search_results_count: 'results for',
    search_no_results: 'No results for',
    search_no_results_hint: 'Try different keywords or check spelling.',
    search_empty_hint: 'Type to search articles and posts.',
    search_tag_hint: 'Tip: use #tag to filter by tag, @category to filter by category.',
    // 404
    page_404_title: 'Page Not Found',
    page_404_heading: '404',
    page_404_message: "The page you're looking for doesn't exist.",
    page_404_back_home: 'Back to Home',
    // Visit counter
    widget_visits_label: 'Site visits',
    widget_visits_pageviews: 'pageviews',
    widget_visits_visitors: 'visitors',
    article_views: 'views',
    // Footer
    footer_copyright: '© {year} {name}',
    footer_license: 'CC BY-NC-SA 4.0',
    footer_rss: 'RSS Feed',
    footer_sitemap: 'Sitemap',
    footer_powered_by: 'Powered by {tools}',
    footer_clear_cookies: 'Clear Cookies',
    footer_clear_cookies_confirm: 'All cookies and local settings will be cleared. Continue?',
    // Date
    date_format: 'en-US',
  },
  'zh-tw': {
    // Nav
    nav_feed: '動態',
    nav_about: '關於',
    nav_friends: '友站',
    nav_archive: '歸檔',
    // Theme
    nav_theme_light: '亮色',
    nav_theme_dark: '暗色',
    nav_theme_system: '系統',
    theme_mode_label: '主題模式',
    theme_accent_label: '強調色',
    theme_rainbow_label: '彩虹模式',
    theme_speed_label: '速度',
    // Language
    nav_lang_toggle: '中文',
    nav_lang_toggle_zh: 'English',
    // Author
    author_bio_heading: '關於我',
    // Social
    social_website: '網站',
    social_github: 'GitHub',
    social_gitlab: 'GitLab',
    social_git: 'Git',
    social_twitter: 'Twitter / X',
    social_linkedin: 'LinkedIn',
    social_rss: 'RSS 訂閱',
    social_facebook: 'Facebook',
    social_instagram: 'Instagram',
    social_threads: 'Threads',
    social_youtube: 'YouTube',
    social_email: '電子郵件',
    // TOC
    widget_toc_label: '本頁目錄',
    widget_toc_aria: '目錄',
    // Pages
    page_friends_heading: '友站',
    page_categories_heading: '分類',
    page_tags_heading: '標籤',
    page_archive_heading: '歸檔',
    archive_article_singular: '篇文章',
    archive_article_plural: '篇文章',
    // Article card
    article_label: '文章',
    post_label: '貼文',
    article_word_count: '字',
    article_read_time: '分鐘閱讀',
    article_read_in_english: '閱讀英文版本 →',
    article_read_in_chinese: '閱讀中文版本 →',
    // Search
    nav_search: '搜尋',
    page_search_heading: '搜尋',
    search_placeholder: '搜尋文章與貼文...',
    search_aria: '搜尋文章與貼文',
    search_results_count: '筆結果，關鍵字：',
    search_no_results: '找不到結果：',
    search_no_results_hint: '試試其他關鍵字或檢查拼寫。',
    search_empty_hint: '輸入關鍵字搜尋文章與貼文。',
    search_tag_hint: '提示：使用 #標籤 篩選標籤，@分類 篩選分類。',
    // 404
    page_404_title: '找不到頁面',
    page_404_heading: '404',
    page_404_message: '您尋找的頁面不存在。',
    page_404_back_home: '返回首頁',
    // Visit counter
    widget_visits_label: '站點訪問',
    widget_visits_pageviews: '次瀏覽',
    widget_visits_visitors: '位訪客',
    article_views: '次瀏覽',
    // Footer
    footer_copyright: '© {year} {name}',
    footer_license: 'CC BY-NC-SA 4.0',
    footer_rss: 'RSS 訂閱',
    footer_sitemap: '網站地圖',
    footer_powered_by: '由 {tools} 強力驅動',
    footer_clear_cookies: '清除 Cookie',
    footer_clear_cookies_confirm: '所有 Cookie 與本地設定將被清除，確定繼續？',
    // Date
    date_format: 'zh-TW',
  },
} as const;

export type Locale = keyof typeof ui;
export type UIKey = keyof (typeof ui)['en'];
