---
title: 招标信息采集与清洗
summary: 每天定时抓取多个站点的招标公告，去重、抽取关键字段后写入 SQLite，早上八点生成一份摘要。
period: '2026'
status: 已完成
featured: true
stack: ['Python', 'requests', 'BeautifulSoup', 'SQLite']
accent: emerald
icon: '◈'
tags: ['Python', '爬虫', '自动化']
---

## 需求

每天下午六点之后，几个站点的招标公告会更新。人工翻一遍大概要四十分钟，
而且容易漏。目标很简单：**每天早上八点，邮箱里已经躺着一份昨天新增的摘要。**

## 流程

```python
# 极简版骨架
for site in SITES:
    html = fetch(site.url, headers=site.headers)
    items = site.parser(html)              # 站点差异收敛在 parser 里
    for item in items:
        if store.exists(item["fingerprint"]):   # 用标题+发布日期哈希去重
            continue
        store.save(item)
```

## 三个实际踩到的坑

<ol>
<li><strong>去重不能用标题全等。</strong>同一个公告在不同站点标题会多加一个空格或者括号全半角差异。最后用"标题去掉所有空白和标点后再哈希"。</li>
<li><strong>分页有隐藏上限。</strong>某个站点的第 4 页之后返回的是空列表而不是 404，一开始误以为抓完了。</li>
<li><strong>定时任务要能重入。</strong>脚本中途被杀掉再跑，不能产生重复数据，所以每个站点都单独提交事务。</li>
</ol>

## 结果

稳定跑了两个多月，每天新增公告 40~120 条，重复率从第一版的 18% 降到 0。
代码里每个站点的解析器都是独立的几十行，某个站改版只影响那一个文件。
