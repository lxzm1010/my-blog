import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ─────────────────────────────────────────────────────────────
//  ⚠️  换到 GitHub Pages 时，只需要改下面两行
//
//  情形 A：仓库名是 `你的用户名.github.io`（用户主页站点）
//          SITE = 'https://你的用户名.github.io'
//          BASE = '/'
//
//  情形 B：仓库名是 `my-blog` 之类的普通项目仓库
//          SITE = 'https://你的用户名.github.io'
//          BASE = '/my-blog'
//
//  BASE 配错的典型症状：页面能打开，但完全没有样式。
//  （GitHub Actions 不需要改：这个文件会跟着代码一起提交上去）
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
//  当前配置：仓库 my-blog（普通项目仓库）
//  站点地址：https://lxzm1010.github.io/my-blog/
//
//  如果以后换成 `lxzm1010.github.io` 这种用户主页仓库，
//  只需把 BASE 改回 '/'，并同步改 SITE。
// ─────────────────────────────────────────────────────────────
const SITE = 'https://lxzm1010.github.io';
const BASE = '/my-blog';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [sitemap()],

  markdown: {
    // 代码高亮用 Shiki（Astro 内置，不需要额外装包）
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});
