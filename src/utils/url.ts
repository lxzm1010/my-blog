/**
 * 内部链接统一走这个函数。
 *
 * 为什么需要它：部署到 GitHub Pages 的项目仓库时，站点根路径是
 * `/仓库名/` 而不是 `/`。所有内部链接都必须带这个前缀，否则
 * 上线后点击链接会 404。
 *
 * 只要 astro.config.mjs 里的 BASE 改对了，这里会自动跟随，
 * 你写链接时直接写 `url('/projects')` 即可。
 */
const base = import.meta.env.BASE_URL;

export function url(path = '/'): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

/** 估算中文 + 英文混排的阅读时间（分钟） */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (body.match(/[a-zA-Z0-9]+/g) ?? []).length;
  // 中文约 400 字/分钟，英文约 200 词/分钟
  const minutes = cjk / 400 + words / 200;
  return Math.max(1, Math.round(minutes));
}

/** 2026-02-14 这种格式，避免不同环境时区导致的日期漂移 */
export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  })
    .format(d)
    .replace(/\//g, '-');
}
