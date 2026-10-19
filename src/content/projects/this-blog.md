---
title: 这个博客本身
summary: 一个只放项目作品的静态站点。没有数据库、没有后端，写完 Markdown 推上去就发布。
period: '2026'
status: 在研
featured: false
stack: ['Astro', 'TypeScript', 'GitHub Actions']
accent: amber
icon: '✦'
tags: ['Astro', '前端', '静态站点']
---

## 为什么自己写

现成的博客主题大多是为"写作"设计的：一篇文章接一篇文章，侧边栏放归档和标签。
但我想要的是**项目橱窗**——每个项目要有技术栈、截图、在线预览和源码入口，
而且首页要能一眼看到几个精选作品。这种结构套主题比自己写还费劲。

## 技术选择

最终用 Astro，三个原因：

1. **输出是纯静态文件**，扔到 GitHub Pages 上就行，不需要服务器
2. **内容集合有类型校验**，frontmatter 少写一个字段，构建时直接报错并指出文件名
3. **默认不加载 JavaScript**，唯一用到 JS 的地方是亮暗主题切换按钮

## 内容怎么组织

```
src/content/
├── blog/        # 笔记，文件名就是链接
└── projects/    # 项目，字段有 stack / repo / demo / accent
```

项目卡片的封面色不是图片，而是根据 frontmatter 里的 `accent` 字段生成渐变，
省掉了准备封面图这件事，也让整站风格统一。
