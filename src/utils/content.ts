import { getCollection } from 'astro:content';

/** 生产构建时过滤掉 draft: true 的文章；本地开发时全部可见 */
const visible = (draft: boolean) => !import.meta.env.PROD || !draft;

/** 笔记：按日期倒序 */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => visible(data.draft));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 项目：精选在前，其余按时间段倒序 */
export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.period.localeCompare(a.data.period);
  });
}

/** 按年份分桶，用于"2026 / 2025"这种年份标题 */
export function groupByYear<T>(items: T[], getDate: (item: T) => Date) {
  const buckets = new Map<string, T[]>();
  for (const item of items) {
    const year = String(getDate(item).getUTCFullYear());
    const list = buckets.get(year);
    if (list) list.push(item);
    else buckets.set(year, [item]);
  }
  return [...buckets.entries()]
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, list]) => ({ year, items: list }));
}

/** 统计所有标签及出现次数，次数多的排前面 */
export async function getAllTags() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const counts = new Map<string, number>();
  for (const entry of [...posts, ...projects]) {
    for (const tag of entry.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));
}
