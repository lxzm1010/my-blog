---
title: 用 Astro 做一个只放项目作品的博客
summary: 为什么不用现成主题、内容集合的类型校验怎么救了我、以及部署到 GitHub Pages 时 base 路径那个坑。
date: 2026-10-12
tags: ['Astro', '静态站点', '前端']
---

## 从"套主题"到"自己写"

一开始我试了三个现成的博客主题，全部卡在同一个地方：**首页应该放项目，而不是文章列表**。
主题的首页布局是硬编码的文章流，改动它的代价比自己写一个还高。

于是决定自己搭。选 Astro 的原因是它的输出就是一堆静态 HTML，
不需要服务器、不需要数据库，`npm run build` 出来的 `dist/` 直接扔给 GitHub Pages 就完事了。

## 内容集合：frontmatter 少写字段会报错

这是我留下 Astro 而不是回去用纯手写 HTML 的决定性原因。在 `src/content.config.ts` 里定义 schema：

```ts
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    period: z.string(),
    status: z.enum(['已完成', '在研', '已归档']).default('已完成'),
    stack: z.array(z.string()).default([]),
    accent: z.enum(['violet', 'cyan', 'amber', 'rose', 'emerald']).default('violet'),
  }),
});
```

效果很直接：某次我把 `stack` 写成了逗号分隔的字符串而不是数组，构建立刻失败并告诉我文件名和行号，
而不是上线之后页面上出现一个空白的标签区。

对比一下两种做法的反馈时间：

| 做法 | 错误什么时候暴露 | 你当时在干什么 |
| --- | --- | --- |
| 纯 HTML 手写 | 浏览器里看着不对 | 已经写完三个页面了 |
| Markdown 无校验 | 打开页面发现空白 | 已经不记得那段写了什么 |
| Astro 内容集合 | 保存后构建就报错 | 手还在键盘上 |

## 项目卡片的封面不是图片

准备封图是件很烦的事：每个项目都要找图、裁成 16:9、压缩、想 alt 文本。
我干脆不用图片，改成根据 frontmatter 里的 `accent` 字段生成 CSS 渐变：

```css
.accent-violet {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 55%, #22d3ee 100%);
}
.accent-cyan {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 60%, #8b5cf6 100%);
}
```

好处是加一个项目只要写一个 Markdown 文件，视觉风格自动统一；坏处是项目之间辨识度靠图标和标题，
真需要截图的时候还是得放正文里。

## 唯一踩到的部署坑：base 路径

GitHub Pages 的项目仓库地址是 `https://用户名.github.io/仓库名/`，
也就是说站点根路径不是 `/` 而是 `/仓库名/`。

如果你的配置里还写着 `base: '/'`，症状是这样的：**页面能打开，但完全没有样式** ——
因为 CSS 被请求到了 `https://用户名.github.io/styles/xxx.css`，404 了。

解决办法两处：

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://用户名.github.io',
  base: '/仓库名',
});
```

然后内部链接统一走一个工具函数，而不是写死 `/projects`：

```ts
export function url(path = '/') {
  const b = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${b}${path.startsWith('/') ? path : `/${path}`}`;
}
```

以后再换域名、换仓库名，只改配置一行，页面里的链接自动跟着变。

## 现在的工作流

写一篇文章的实际步骤只有三步：新建 `.md`、写 frontmatter、`git push`。
剩下的构建和发布交给 GitHub Actions，几十秒后线上就有了。
