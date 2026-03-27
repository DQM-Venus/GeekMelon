# Geek Melon Python 推送端

## 1. 当前目标

当前 Python 侧先实现最小可用链路：

1. 采集 `财联社 AI 专题`、`36氪`、`今日头条热榜`、`掘金 AI` 等中文源。
2. 优先保留公司动作、产品发布、平台接入、融资收购、裁员争议、人物发言等更像“吃瓜流”的内容。
3. 过滤纯教程、纯论文、纯 benchmark、纯股市播报等偏枯燥内容。
4. 标准化成后端 ingest 接口需要的 JSON。
5. 可选调用 DeepSeek 做结构化提炼和二次过滤。

## 2. 目录结构

```text
crawler/
  main.py
  app_config.py
  content_utils.py
  editorial_rules.py
  feed_item.py
  publisher.py
  requirements.txt
  analyzers/
    deepseek_analyzer.py
    rule_based_analyzer.py
  sources/
    cls_ai_source.py
    juejin_ai_source.py
    kr36_source.py
    mock_source.py
    rss_source.py
    toutiao_hot_source.py
  scripts/
    cleanup_hidden_feeds.py
```

## 3. 运行前提

### 3.1 保持后端服务已启动

默认使用本地后端地址 `http://127.0.0.1:8080`。

### 3.2 如需修改配置，可设置环境变量

```powershell
$env:GM_API_BASE_URL='http://127.0.0.1:8080'
$env:GM_INGEST_TOKEN='geekmelon-dev-token'
```

## 4. 启动方式

默认数据源已经切到 `china_mix`，也就是：

- `财联社 AI 专题`
- `36氪热榜 + 36氪快讯`
- `今日头条热榜（只保留 AI/科技/公司动态相关话题）`
- `掘金 AI 分类`

```powershell
cd D:\project\GeekMelon\crawler
python main.py
```

如需只跑财联社 AI 专题：

```powershell
cd D:\project\GeekMelon\crawler
python main.py --source cls_ai
```

如需只跑 36 氪：

```powershell
cd D:\project\GeekMelon\crawler
python main.py --source kr36
```

如需只跑掘金 AI：

```powershell
cd D:\project\GeekMelon\crawler
python main.py --source juejin_ai
```

如需只跑今日头条热榜：

```powershell
cd D:\project\GeekMelon\crawler
python main.py --source toutiao_hot
```

如需切回 RSS：

```powershell
cd D:\project\GeekMelon\crawler
python main.py --source rss
```

也可以通过环境变量切换默认数据源：

```powershell
$env:GM_SOURCE='china_mix'
$env:GM_CLS_AI_PAGE_URL='https://www.cls.cn/subject/1321'
$env:GM_CLS_AI_MAX_ITEMS='8'
$env:GM_36KR_PAGE_URL='https://www.36kr.com/newsflashes/catalog/2'
$env:GM_36KR_MAX_HOT_ITEMS='5'
$env:GM_36KR_MAX_FLASH_ITEMS='6'
$env:GM_JUEJIN_AI_CATE_ID='6809637767543259144'
$env:GM_JUEJIN_AI_MAX_ITEMS='8'
$env:GM_TOUTIAO_HOT_API_URL='https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc'
$env:GM_TOUTIAO_HOT_MAX_ITEMS='20'
```

## 5. DeepSeek 可选增强

默认使用规则版分析器。

如需启用 DeepSeek：

```powershell
$env:GM_ENABLE_DEEPSEEK='true'
$env:DEEPSEEK_API_KEY='你的 DeepSeek API Key'
$env:GM_DEEPSEEK_MODEL='deepseek-chat'
```

当前 prompt 已经改成更偏“吃瓜流”：

- 优先保留公司动作、产品发布、融资、争议、裁员、平台接入。
- 主动过滤纯教程、纯论文、纯 benchmark、纯股市播报。

## 6. 当前默认抓取规则

### 6.1 财联社 AI 专题

- 直接抓 `https://www.cls.cn/subject/1321`
- 优先拿 AI、芯片、算力、机器人、公司动态相关内容
- 更偏“新闻型资讯流”，用来压低掘金观点帖的占比

### 6.2 36氪热榜与快讯

- 优先保留更像“行业八卦”和“公司动作”的标题
- 会补抓详情页 `meta description` 作为正文摘要
- 适合抓产品停服、平台接入、裁员、融资、IPO、争议等事件

### 6.3 掘金 AI 分类

- 直接走掘金推荐接口，不依赖页面解析
- 更适合补充开发者圈讨论和情绪侧风向
- 在后端排序里会比新闻型来源权重更低

### 6.4 今日头条热榜

- 走官方热榜接口
- 只保留 AI、科技公司、平台产品、行业争议相关话题
- 会主动过滤大部分国际、民生、娱乐、泛社会新闻

### 6.5 规则过滤

规则版分析器会优先丢弃：

- A 股、沪深指数、成交额、盘前盘后播报
- 教程、论文解读、benchmark、实现细节
- 没有信息增量的口水内容

## 7. 历史脏数据清洗

仓库内置了历史清洗脚本，会把明显不符合“吃瓜流”的旧记录标记为 `hidden`，不会直接删除：

```powershell
cd D:\project\GeekMelon\crawler
python scripts\cleanup_hidden_feeds.py
python scripts\cleanup_hidden_feeds.py --apply
```

当前默认命中的规则包括：

- 剩余所有历史 `rss` 活跃记录
- `mock` 和 `v2ex` 测试数据
- 明显偏公文腔或偏泛财经的旧 36 氪快讯

## 8. 下一步建议

1. 继续优化 DeepSeek prompt，把“吃瓜指数”调得更稳。
2. 给服务器定时任务补日志、失败告警和重试。
3. 再补 1 到 2 个更偏中文科技新闻的源，继续压缩博主观点帖占比。
