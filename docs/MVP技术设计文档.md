# Geek Melon MVP 技术设计文档

## 1. 文档目标

本文档用于把现有项目设想收敛成一版可直接开工的 MVP 技术方案，目标是优先打通如下最小闭环：

1. Python 抓取一个稳定数据源。
2. 调用 DeepSeek 对内容做过滤、分类和摘要。
3. 将标准化结果通过 HTTP 推送给 Java 后端。
4. Java 后端完成鉴权、去重、入库与查询。
5. Vue 前端按时间和热度展示信息流。

MVP 阶段不追求复杂微服务治理，不做过早抽象，优先验证内容质量与用户感知价值。

## 2. MVP 范围

### 2.1 首期推荐范围

- 主数据源：`V2EX` 的 AI 相关节点。
- 辅数据源：`RSSHub` 转换后的优质公众号或资讯源。
- AI 能力：只做 `是否收录`、`一句话爆点`、`摘要`、`吃瓜指数`、`分类标签`。
- 前端能力：只做信息流列表页与基础筛选。

### 2.2 暂不纳入 MVP

- 用户登录、收藏、评论、推送订阅。
- 复杂推荐算法。
- 多模型切换与模型路由。
- 分布式任务调度、消息队列、服务注册发现。
- 多语言国际化。

## 3. 总体架构

## 3.1 架构原则

- Python 负责采集、清洗、AI 提炼。
- Java 负责统一数据入口、鉴权、持久化、查询接口。
- Vue 负责用户浏览与简单交互。
- 三层之间通过 REST API 通信。

### 3.2 逻辑链路

```text
定时任务
  -> Python 爬虫抓取原始内容
  -> 文本清洗与去噪
  -> DeepSeek 输出结构化结果
  -> Python POST 标准 JSON 到 Spring Boot
  -> Spring Boot 鉴权、校验、去重、入库
  -> Vue 前端拉取信息流列表并展示
```

### 3.3 MVP 阶段模块边界

#### Python 侧

- `collector`：抓取原始数据
- `normalizer`：清洗与标准化
- `ai_editor`：调用 DeepSeek
- `publisher`：推送到 Java 后端
- `scheduler`：被 Crontab 调度执行

#### Java 侧

- `ingest`：接收 Python 推送
- `feed`：列表查询与详情查询
- `auth`：简单 Token 校验
- `persistence`：MySQL 落库

#### Vue 侧

- `feed-list`：信息流列表
- `feed-card`：资讯卡片
- `filter-bar`：按来源、分类、热度过滤

## 4. 数据模型设计

### 4.1 表名

推荐使用：`ai_news_feed`

### 4.2 建表目标

- 同时存储原始内容和 AI 提炼结果。
- 支持幂等去重。
- 支持后续按来源、时间、热度、分类检索。
- 为后续扩展审核状态、重新分析、人工修订留空间。

### 4.3 字段设计

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| `id` | bigint | 主键 |
| `source` | varchar(50) | 来源平台，如 `v2ex`、`jike`、`zhihu`、`rsshub` |
| `source_post_id` | varchar(128) | 来源侧唯一帖子 ID |
| `source_url` | varchar(500) | 原文链接 |
| `title` | varchar(300) | 标题 |
| `author_name` | varchar(100) | 作者名称 |
| `raw_content` | mediumtext | 清洗后的正文 |
| `raw_publish_time` | datetime | 原始发布时间 |
| `summary` | text | AI 三点摘要或短摘要 |
| `highlight` | varchar(500) | 一句话爆点 |
| `category` | varchar(50) | 内容分类，如 `产品发布`、`融资动态`、`模型评测` |
| `tags` | varchar(255) | 标签列表，逗号分隔或 JSON 字符串 |
| `spicy_index` | tinyint | 吃瓜指数，范围建议 `1-10` |
| `verdict` | varchar(20) | AI 判断结果，如 `keep`、`drop` |
| `drop_reason` | varchar(255) | 丢弃原因 |
| `ai_model` | varchar(100) | 使用的模型标识 |
| `ai_prompt_version` | varchar(50) | Prompt 版本号 |
| `ingest_token_name` | varchar(50) | 推送令牌标识，便于审计 |
| `status` | varchar(20) | 状态，如 `active`、`hidden` |
| `created_at` | datetime | 创建时间 |
| `updated_at` | datetime | 更新时间 |

### 4.4 关键约束

- 唯一索引：`uk_source_post` (`source`, `source_post_id`)
- 普通索引：`idx_created_at` (`created_at`)
- 普通索引：`idx_spicy_index` (`spicy_index`)
- 普通索引：`idx_category` (`category`)
- 普通索引：`idx_status_created_at` (`status`, `created_at`)

### 4.5 建表示例 SQL

```sql
CREATE TABLE ai_news_feed (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    source VARCHAR(50) NOT NULL COMMENT '来源平台',
    source_post_id VARCHAR(128) NOT NULL COMMENT '来源帖子唯一标识',
    source_url VARCHAR(500) NOT NULL COMMENT '原文链接',
    title VARCHAR(300) NOT NULL COMMENT '标题',
    author_name VARCHAR(100) DEFAULT NULL COMMENT '作者名称',
    raw_content MEDIUMTEXT COMMENT '清洗后的正文',
    raw_publish_time DATETIME DEFAULT NULL COMMENT '原始发布时间',
    summary TEXT COMMENT 'AI 摘要',
    highlight VARCHAR(500) DEFAULT NULL COMMENT '一句话爆点',
    category VARCHAR(50) DEFAULT NULL COMMENT '内容分类',
    tags VARCHAR(255) DEFAULT NULL COMMENT '标签列表',
    spicy_index TINYINT DEFAULT NULL COMMENT '吃瓜指数，1 到 10',
    verdict VARCHAR(20) DEFAULT 'keep' COMMENT 'AI 判定结果',
    drop_reason VARCHAR(255) DEFAULT NULL COMMENT '丢弃原因',
    ai_model VARCHAR(100) DEFAULT NULL COMMENT '模型标识',
    ai_prompt_version VARCHAR(50) DEFAULT NULL COMMENT 'Prompt 版本',
    ingest_token_name VARCHAR(50) DEFAULT NULL COMMENT '推送令牌标识',
    status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '记录状态',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_source_post (source, source_post_id),
    KEY idx_created_at (created_at),
    KEY idx_spicy_index (spicy_index),
    KEY idx_category (category),
    KEY idx_status_created_at (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI 资讯聚合信息流';
```

## 5. Python 与 Java 的接口契约

### 5.1 设计原则

- Python 只推送结构化结果，不把业务判断放到 Java 层重复做一遍。
- Java 以校验和持久化为主，尽量保持入站接口简单稳定。
- 接口必须支持幂等去重。
- 接口字段命名统一采用 `snake_case` 或 `camelCase` 二选一，建议全链路统一为 `snake_case`，便于 Python 侧处理。

### 5.2 入站接口

- 方法：`POST`
- 路径：`/api/internal/feeds/ingest`
- 认证方式：Header 携带固定 Token

请求头示例：

```http
Content-Type: application/json; charset=UTF-8
X-GeekMelon-Token: your-ingest-token
```

### 5.3 请求体示例

```json
{
  "source": "v2ex",
  "source_post_id": "123456",
  "source_url": "https://www.v2ex.com/t/123456",
  "title": "某开源 AI IDE 发布新版本",
  "author_name": "melon_user",
  "raw_content": "正文清洗后的纯文本内容",
  "raw_publish_time": "2026-03-26T10:00:00+08:00",
  "summary": "1. 发布了新版本。\n2. 强化了 Agent 能力。\n3. 社区反馈偏积极。",
  "highlight": "AI IDE 开始从补全工具卷向全流程开发助手。",
  "category": "产品发布",
  "tags": ["AI IDE", "Agent", "开发工具"],
  "spicy_index": 8,
  "verdict": "keep",
  "drop_reason": null,
  "ai_model": "deepseek-chat",
  "ai_prompt_version": "v1.0"
}
```

### 5.4 响应体示例

```json
{
  "code": 0,
  "message": "接收成功",
  "data": {
    "id": 1001,
    "action": "created"
  }
}
```

### 5.5 幂等规则

- 若 `source + source_post_id` 不存在，则新增。
- 若已存在且本次内容更完整，可按策略更新。
- MVP 推荐默认策略：`存在即跳过`，先保证稳定。

### 5.6 建议状态码

- `200`：新增成功或幂等命中
- `400`：参数缺失或格式非法
- `401`：Token 无效
- `409`：唯一键冲突但未按幂等逻辑处理
- `500`：服务端异常

## 6. DeepSeek 结构化输出设计

### 6.1 目标

让模型承担“主编”角色，但输出必须足够收敛，避免前后端消费不稳定。

### 6.2 模型职责

- 判断内容是否值得收录。
- 将冗长原文提炼成短摘要。
- 找出真正能吸引用户点开的爆点。
- 识别内容属于哪一类。
- 为内容打一个可排序的“吃瓜指数”。

### 6.3 建议输出 JSON 结构

```json
{
  "verdict": "keep",
  "drop_reason": "",
  "category": "产品发布",
  "tags": ["AI IDE", "Agent", "开发工具"],
  "highlight": "AI IDE 开始从补全工具卷向全流程开发助手。",
  "summary": [
    "发布了新版本并新增多项 Agent 能力。",
    "强调从代码补全升级为端到端开发协作。",
    "社区讨论集中在效率提升与可控性。"
  ],
  "spicy_index": 8
}
```

### 6.4 输出约束

- `verdict` 只允许 `keep` 或 `drop`
- `spicy_index` 只允许 `1-10` 的整数
- `summary` 固定为 `3` 条，单条不超过 `50` 字
- `highlight` 不超过 `60` 字
- `drop_reason` 只有在 `drop` 时填写
- 不允许输出 Markdown
- 不允许输出解释性前缀
- 必须返回合法 JSON

### 6.5 建议 Prompt 模板

```text
你是 Geek Melon 的 AI 主编，负责从科技社区内容中筛选真正值得开发者关注的 AI 资讯。

请根据输入内容完成以下任务：
1. 判断该内容是否值得收录到“AI 前沿吃瓜信息流”。
2. 如果不值得收录，给出简短丢弃原因。
3. 如果值得收录，输出一句话爆点、3 条摘要、内容分类、标签和吃瓜指数。

收录标准：
- 优先收录 AI 产品发布、模型能力变化、行业动向、平台策略、重大评测、开发者高价值讨论。
- 过滤纯广告、空洞公文、泛泛而谈、无信息增量的转载、与 AI 关系弱的内容。

输出要求：
- 只输出 JSON。
- 字段必须包含：verdict, drop_reason, category, tags, highlight, summary, spicy_index。
- spicy_index 为 1 到 10 的整数。
- summary 固定输出 3 条简明摘要。

待分析内容如下：
标题：{{title}}
正文：{{content}}
来源：{{source}}
```

### 6.6 建议补充机制

- 增加模型返回解析失败的重试逻辑。
- 对 `spicy_index >= 8` 的内容优先展示。
- 将 `ai_prompt_version` 落库，方便后续回溯效果。

## 7. 数据采集策略

### 7.1 推荐顺序

#### 第一优先级

- `V2EX`
- `RSSHub`

原因：抓取门槛相对更低，结构更稳定，适合先验证流程。

#### 第二优先级

- `知乎热榜`
- `即刻`

原因：数据价值高，但抓取稳定性和维护成本通常更高。

### 7.2 Python 采集标准化字段

爬虫层应先统一输出如下字段，再进入 AI 分析步骤：

```json
{
  "source": "v2ex",
  "source_post_id": "123456",
  "source_url": "https://www.v2ex.com/t/123456",
  "title": "帖子标题",
  "author_name": "作者",
  "raw_content": "清洗后的正文",
  "raw_publish_time": "2026-03-26T10:00:00+08:00"
}
```

### 7.3 去噪建议

- 去掉 HTML 标签、脚本、样式。
- 去掉无意义空白行和重复分隔符。
- 保留列表、代码块的基本语义，但必要时压缩。
- 对超长正文可做截断，建议保留前 `3000-5000` 字供模型分析。

## 8. Java 后端设计建议

### 8.1 模块划分

- `controller`：对外暴露接口
- `service`：鉴权、校验、幂等、业务编排
- `repository` 或 `mapper`：数据库访问
- `model`：请求对象、响应对象、实体对象

### 8.2 MVP 必备接口

- `POST /api/internal/feeds/ingest`
- `GET /api/feeds`
- `GET /api/feeds/{id}`

### 8.3 列表接口建议参数

- `page`
- `page_size`
- `source`
- `category`
- `min_spicy_index`
- `sort`

建议默认排序：

1. `created_at desc`
2. 后续可增加 `spicy_index desc, created_at desc`

### 8.4 鉴权建议

- 内部推送接口使用固定 Token 即可。
- Token 存放在环境变量或配置中心，不要硬编码。
- 可增加 `X-GeekMelon-Token-Name` 便于日志审计。

### 8.5 基础校验建议

- 校验必填字段是否为空。
- 校验 `spicy_index` 是否在合法范围内。
- 校验 URL 格式是否合法。
- 校验时间格式是否可解析。

## 9. Vue 前端 MVP 设计建议

### 9.1 页面范围

只做一个首页信息流页面即可。

### 9.2 卡片建议字段

- 标题
- 吃瓜指数
- 一句话爆点
- 三点摘要
- 来源标签
- 分类标签
- 发布时间
- 原文跳转链接

### 9.3 交互建议

- 按来源筛选
- 按分类筛选
- 按吃瓜指数过滤
- 点击卡片跳原文

### 9.4 展示优先级

- 标题和爆点放在最醒目位置
- `spicy_index` 用火焰感视觉标识
- 来源、分类、时间作为次级信息

## 10. 阶段拆解

### 10.1 阶段一：数据底座与通信打通

目标：完成后端基建与接口打通。

任务清单：

1. 创建 MySQL 表 `ai_news_feed`
2. 初始化 Spring Boot 工程
3. 完成 `POST /api/internal/feeds/ingest`
4. 完成基础 Token 鉴权
5. 完成入库逻辑与唯一键去重
6. 用 Postman 或 curl 完成联调验证

验收标准：

- 手工发送一条标准 JSON 能成功落库
- 重复发送同一 `source + source_post_id` 不会产生脏数据

### 10.2 阶段二：智能爬虫与 AI 主编上线

目标：打通自动抓取、提炼、推送流程。

任务清单：

1. 用 Python 完成 V2EX 或 RSSHub 采集
2. 完成正文清洗
3. 接入 DeepSeek API
4. 将模型输出转换为固定 JSON
5. 推送到 Java 后端
6. 接入 Crontab 定时执行

验收标准：

- 定时任务可以自动抓取、分析、入库
- 至少一个数据源可稳定运行数天

### 10.3 阶段三：前端展示

目标：让用户能直接消费信息流。

任务清单：

1. 初始化 Vue 工程
2. 对接列表接口
3. 实现信息流卡片
4. 实现基础筛选
5. 优化移动端显示

验收标准：

- 首页可正常展示近期入库内容
- 卡片能清楚表达标题、爆点、吃瓜指数和来源

## 11. 风险点与规避建议

### 11.1 数据源不稳定

风险：页面结构变动、反爬、访问频率限制。

建议：

- 先做结构稳定的数据源。
- 每个数据源独立成采集器，避免耦合。
- 抓取失败要有日志和重试机制。

### 11.2 AI 输出不稳定

风险：JSON 格式错误、摘要风格漂移、打分不一致。

建议：

- 严格限制输出格式。
- 加解析失败重试。
- 记录 Prompt 版本和模型版本。

### 11.3 内容重复或质量偏低

风险：不同来源转发同一事件，信息流噪声高。

建议：

- 第一层按 `source + source_post_id` 去重。
- 第二层后续可增加标题相似度或链接归一化去重。
- 对 `drop` 内容可先不入库，或只保留日志。

### 11.4 架构过早复杂化

风险：大量时间花在工程组织和部署，而不是内容验证。

建议：

- MVP 阶段不引入 MQ、不拆更多服务。
- 所有核心流程先跑在单机可用环境。

## 12. 推荐目录结构

```text
GeekMelon/
  docs/
    MVP技术设计文档.md
  backend/
  crawler/
  frontend/
```

后续可进一步细化为：

```text
backend/
  src/
  pom.xml

crawler/
  collectors/
  ai_editor/
  publisher/
  main.py

frontend/
  src/
  package.json
```

## 13. 下一步建议

建议按以下顺序直接开工：

1. 先建表，冻结第一版字段。
2. 搭 Spring Boot，完成入站接口。
3. 用 Postman 或 curl 验证接口。
4. 用 Python 对接一个最简单数据源。
5. 接入 DeepSeek 并固定 JSON 输出。
6. 最后再做前端页面。

如果要进一步缩小首周目标，建议只做这一条：

`V2EX -> DeepSeek -> Spring Boot -> MySQL`

只要这条链路跑通，Geek Melon 的 MVP 就成立了。

## 14. 数据质量策略补充

### 14.1 强去重

- 唯一键：`source + source_post_id`
- 内容指纹：`content_hash`
- 时间策略：
  - 首次写入：`created`
  - 内容未变：`skipped`，仅更新 `last_seen_at`
  - 内容变化：`updated`，更新正文与 AI 结果

### 14.2 跨源弱去重

- 事件指纹：`event_fingerprint`
- 主从关系：`duplicate_of_id`

策略说明：

- 同一事件的第一条记录作为主记录
- 后续命中的相似记录标记为重复从记录
- 信息流列表默认只展示主记录
