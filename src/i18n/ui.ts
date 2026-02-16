export const ui = {
  en: {
    // Nav
    nav_feed: 'Feed',
    nav_categories: 'Categories',
    nav_tags: 'Tags',
    nav_friends: 'Friends',
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
    // Article card
    article_label: 'ARTICLE',
    post_label: 'POST',
    // Date
    date_format: 'en-US',
  },
  'zh-tw': {
    // Nav
    nav_feed: '動態',
    nav_categories: '分類',
    nav_tags: '標籤',
    nav_friends: '友站',
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
    // Article card
    article_label: '文章',
    post_label: '貼文',
    // Date
    date_format: 'zh-TW',
  },
} as const;

export type Locale = keyof typeof ui;
export type UIKey = keyof typeof ui['en'];
