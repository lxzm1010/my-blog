import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 笔记（博客文章）
 * 每篇文章 = src/content/blog/ 下的一个 .md 文件，文件名就是永久链接。
 * 比如 hello-world.md → /blog/hello-world
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    /** 草稿：本地能看到，生产构建时被过滤掉 */
    draft: z.boolean().default(false),
  }),
});

/**
 * 项目
 * 每个项目 = src/content/projects/ 下的一个 .md 文件。
 * 这里的 schema 是"安全网"：漏写 title 或 stack 不是渲染空白，
 * 而是构建直接报错并指出是哪个文件。
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    /** 年份或时间段，自由填写，如 "2025" 或 "2024 - 2025" */
    period: z.string(),
    status: z.enum(['已完成', '在研', '已归档']).default('已完成'),
    /** 首页只展示 featured: true 的项目 */
    featured: z.boolean().default(false),
    stack: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    /** 封面渐变的配色方案，不用放图片也能有设计感 */
    accent: z.enum(['violet', 'cyan', 'amber', 'rose', 'emerald']).default('violet'),
    /** 卡片上的图标字符 */
    icon: z.string().default('◆'),
    /** 标签，会和笔记共用一个 /tags/xxx 页面 */
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects };
