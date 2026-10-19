---
title: 汽车销售数据可视化大屏
summary: 把 20 万条销售流水压成一块能投屏看的大屏，从数据清洗、指标口径到最后答辩现场的三轮改版。
period: '2026'
status: 已完成
featured: true
stack: ['Python', 'pandas', 'matplotlib', 'ECharts']
accent: violet
icon: '▤'
tags: ['数据可视化', 'Python', '答辩']
---

## 想解决的问题

原始数据是一份 20 多万行的销售流水导出表，字段混乱：日期有 `2026/3/5`、`2026-03-05`、`20260305` 三种写法，
金额字段里混着 `￥`、千分位逗号和全角的负号。老板的需求只有一句："做得好看一点，能投到大屏上。"

## 技术选型

| 环节 | 用的东西 | 为什么 |
| --- | --- | --- |
| 清洗 | pandas | 处理 20 万行毫无压力，而且能直接 `resample` 按月聚合 |
| 静态图表 | matplotlib | 答辩 PPT 里需要矢量图，导出 PDF 不失真 |
| 大屏 | ECharts | 交互和动效是现成的，省掉手写 canvas 的时间 |

## 卡住的地方

最大的坑不是画图，是**口径**。同一个月，"销售额"按付款时间算和按开票时间算是两个不同的数，
差了将近 7%。第一版大屏做完之后才发现这个问题，意味着所有环比、同比都要重算。

最后的做法是把口径写进代码而不是写在文档里：

```python
def month_revenue(df, basis="paid_at"):
    """basis 只允许两个值，避免口径靠口头传递"""
    if basis not in ("paid_at", "invoiced_at"):
        raise ValueError(f"未知口径: {basis}")
    return (
        df.assign(month=df[basis].dt.to_period("M"))
        .groupby("month")["amount"]
        .sum()
    )
```

这样别人想换口径必须显式传参，代码里搜索 `basis=` 就能查清所有调用点。

## 现在的样子

大屏总共四块：左上角是月度趋势，右上角是价格带分布环形图，下方左侧是车型排名表格，
底部一条是区域热力。配色从最初的饱和红换成了暖橙，具体原因写在
[这篇笔记](/blog/dashboard-color-palette) 里。
