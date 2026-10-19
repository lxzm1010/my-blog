import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../utils/content';
import { SITE } from '../consts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? 'https://example.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      // 带上 base 前缀，否则部署在子路径时 RSS 里的链接会指向错的地方
      link: `${base}/blog/${post.id}/`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
