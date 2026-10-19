# 我的博客 / 项目橱窗

基于 [Astro](https://astro.build) 的静态站点：首页放精选项目，`/projects` 是完整项目橱窗，
`/blog` 是技术笔记。没有数据库、没有后端，所有内容都是 Markdown 文件。

- 亮色 / 暗色主题跟随系统，可手动切换（记住选择，刷新不会闪白屏）
- 项目卡片用 CSS 渐变作封面，不需要准备图片
- frontmatter 有类型校验，写错字段构建就会报错
- 除了主题切换按钮，页面不加载 JavaScript

---

## 本地跑起来

```bash
pnpm install    # 首次
pnpm dev        # http://localhost:4321/my-blog
```

> 本地地址后面那个 `/my-blog` 不是多余的：`astro.config.mjs` 里 `base` 配成了 `/my-blog`
> （为了 GitHub Pages 的仓库路径），本地开发也会跟着带上这个前缀。
> 直接访问 `http://localhost:4321` 会 404。

其他命令：

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 本地开发，改文件自动刷新 |
| `pnpm build` | 构建到 `dist/` |
| `pnpm preview` | 预览构建产物（发布前建议看一眼） |

> 项目里的 `.npmrc` 把源指向了 npmmirror（国内快很多）。如果你的网络访问官方源更快，
> 删掉这个文件就行。

---

## 先改这几处

1. **`src/consts.ts`** —— 站点名、作者、hero 文案、GitHub 链接。改这一个文件全站生效。
2. **`astro.config.mjs`** —— 顶部的 `SITE` 和 `BASE`，部署前必须改（见下方部署章节）。
3. **`src/pages/about.astro`** —— "关于"页的正文。
4. **`src/content/projects/`、`src/content/blog/`** —— 把示例内容换成你自己的。

---

## 写一篇笔记

在 `src/content/blog/` 下新建 `.md` 文件，**文件名就是永久链接**：
`hello-world.md` → `/blog/hello-world`。

```markdown
---
title: 文章标题
summary: 一句话摘要，会显示在列表里
date: 2026-10-12
tags: ['Astro', '前端']
draft: false
---

正文从这里开始，正常写 Markdown 就行。
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 标题 |
| `summary` | ✅ | 摘要，列表页和 SEO 描述都用它 |
| `date` | ✅ | 发布日期，`2026-10-12` 这种格式 |
| `tags` | ❌ | 标签数组，会自动生成 `/tags/标签名` 页面 |
| `draft` | ❌ | `true` 时只在本地开发可见，构建产物里会被过滤掉 |

## 加一个项目

在 `src/content/projects/` 下新建 `.md` 文件，同上，文件名就是链接。

```markdown
---
title: 项目名称
summary: 一两句话说清这个项目解决什么问题
period: '2026'
status: 已完成          # 已完成 / 在研 / 已归档
featured: true          # true 才会出现在首页「精选项目」
stack: ['Python', 'pandas']
accent: violet          # 卡片渐变色：violet / cyan / amber / rose / emerald
icon: '▤'               # 卡片上的图标字符
repo: https://github.com/you/repo   # 可选
demo: https://example.com           # 可选
tags: ['数据可视化']
---

## 想解决的问题
...
```

正文里建议写四块：**想解决什么问题、技术选型、卡住的地方、结果**。
这是别人（和三个月后的你）最想看的顺序。

---

## 部署到 GitHub Pages

### 1. 建仓库、推代码

本地仓库已经初始化好了，第一个提交也已存在（`node_modules` / `dist` 已在 `.gitignore` 里）。
现在只要在 GitHub 建一个**空仓库**，然后：

```bash
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

> 这个身份只配在了当前仓库，而且用的是 GitHub 提供的 noreply 邮箱
> （`189887428+lxzm1010@users.noreply.github.com`），真实邮箱不会出现在公开的提交记录里。
> 想让所有新仓库都这样，执行
> `git config --global user.name "你的名字"` 和
> `git config --global user.email "189887428+lxzm1010@users.noreply.github.com"`。

### 2. 改 `astro.config.mjs` 里的两行

这是**唯一一个上线后最难自己排查的坑**：仓库类型决定了 `BASE`。

| 仓库名形态 | `SITE` | `BASE` |
| --- | --- | --- |
| `你的用户名.github.io`（用户主页站点） | `https://你的用户名.github.io` | `'/'` |
| `my-blog`（普通项目仓库） | `https://你的用户名.github.io` | `'/my-blog'` |

`BASE` 配错的症状：**页面能打开，但完全没有样式**（CSS 请求到了错误的路径，404）。

> 另外：如果 `BASE` 改成了子路径，Markdown 正文里手写的绝对链接
> （比如 `[看这篇](/blog/xxx)`）也要补上前缀，或者改成完整网址。

### 3. 打开 Pages

仓库 → **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。

不要选 "Deploy from a branch" —— 本站用 Actions 构建，`dist/` 不进仓库。

### 4. 推代码即发布

`.github/workflows/deploy.yml` 已经写好了，推到 `main` 就会自动构建并部署。
几十秒后访问 `https://你的用户名.github.io/仓库名/`。

### 5. 绑定自己的域名（可选）

1. 域名 DNS 加一条 CNAME 指向 `你的用户名.github.io`
2. 仓库 Settings → Pages → Custom domain 填域名
3. 同时把 `astro.config.mjs` 的 `SITE` 改成你的域名、`BASE` 改回 `'/'`
4. 在 `public/` 下放一个内容为域名的 `CNAME` 文件（GitHub 会自动生成，但你手动放一份更稳）

---

## 目录结构

```
.
├── astro.config.mjs           # 站点配置（SITE / BASE 在这里）
├── src/
│   ├── consts.ts              # 站点信息集中改这里
│   ├── content.config.ts      # 内容集合 schema（字段校验）
│   ├── content/
│   │   ├── blog/              # 笔记：一个 .md 一篇文章
│   │   └── projects/          # 项目：一个 .md 一个项目
│   ├── layouts/BaseLayout.astro
│   ├── components/            # Header / Footer / 卡片 / 主题切换
│   ├── pages/
│   │   ├── index.astro        # 首页
│   │   ├── projects/          # 项目列表 + 详情
│   │   ├── blog/              # 笔记列表 + 详情
│   │   ├── tags/[tag].astro   # 标签页
│   │   ├── about.astro
│   │   ├── 404.astro
│   │   └── rss.xml.ts         # RSS 订阅
│   ├── styles/global.css      # 全部样式（含亮暗主题变量）
│   └── utils/                 # 链接拼接、阅读时长、内容查询
└── .github/workflows/deploy.yml
```

## 自定义外观

站点是科幻风：深空背景 + 霓虹青紫 + 坐标网格 + HUD 角标 + 等宽数据标签。
**暗色是默认**，亮色是「日间实验室」变体，两套都由同一批变量名驱动。

所有颜色、发光都在 `src/styles/global.css` 顶部的变量块里，改这几行就能换掉整个气质：

```css
:root {
  --accent: #2ae4ff;      /* 主色：导航高亮、按钮、行内代码、各种发光 */
  --accent-2: #a06bff;    /* 副色：顶栏扫描线、引用块左边框 */
  --accent-3: #ff2e9a;    /* 点缀色：hero 星云光斑 */
  --grad: linear-gradient(120deg, #2ae4ff, #7c6cff 52%, #ff2e9a);  /* 标题渐变、详情页光带、404 */
  --glow-sm: 0 0 12px rgba(42, 228, 255, 0.22);                    /* 小发光，hover 用 */
}
```

亮色主题的同一批变量在 `:root[data-theme='light']` 和
`@media (prefers-color-scheme: light)` 两段里（后者用于"跟随系统"这种情况），
改配色时三处要一起改。

想调科幻感的强弱：

- 网格和扫描线：`--grid-line` 的透明度、`.hero::after` 里那个 `rgba(120, 200, 255, 0.03)`
- 卡片四角括号：`.card::before` 的 `opacity`（默认 0.5，hover 时 1）
- 圆角硬度：`--radius` / `--radius-lg`（现在 6px / 10px，调大就更"圆润"，调 0 就更"硬核"）
- 完全不想要科幻感：把 `--glow-*` 全设成 `none`、`--grid-line` 设透明即可回到素净风格

## 以后想在线写文章？

GitHub Pages 是纯静态托管，没有后端，所以不能用"登录后台"式的 CMS。
但可以用 **git-based CMS**（比如 Decap CMS、Pages CMS）：
它把文章存回你的仓库，触发 Actions 重新构建，全程不需要服务器和数据库。
