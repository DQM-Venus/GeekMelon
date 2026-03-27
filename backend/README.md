# Geek Melon 后端

## 1. 当前进度

当前后端已经完成最小骨架，包括：

- Spring Boot 工程基础结构
- MySQL 数据源配置
- `POST /api/internal/feeds/ingest` 入站接口
- `GET /api/feeds` 列表查询接口
- `GET /api/feeds/{id}` 详情查询接口
- 基础 Token 鉴权
- 按 `source + source_post_id` 幂等去重
- 基于 `content_hash` 的 `created / skipped / updated` 更新时间策略

## 2. 本地启动前提

### 2.1 先建立 SSH 隧道

```powershell
ssh -L 3307:127.0.0.1:3306 root@47.105.112.190
```

### 2.2 准备环境变量

可选环境变量如下：

```powershell
$env:GM_DB_URL='jdbc:mysql://127.0.0.1:3307/geek_melon?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false'
$env:GM_DB_USERNAME='geekmelon_app'
$env:GM_DB_PASSWORD='Gm2026#Tunnel#DB9xP4q'
$env:GM_INGEST_TOKEN='geekmelon-dev-token'
```

## 3. 当前项目结构

```text
backend/
  pom.xml
  src/main/java/com/geekmelon/backend
  src/main/resources/application.yml
```

## 4. 下一步建议

建议按以下顺序继续：

1. 补 Maven Wrapper，确保本机可以直接启动
2. 本地启动 Spring Boot
3. 用 Postman 或 curl 测试 ingest 接口
4. 再补列表查询接口

## 5. 去重与更新时间策略

当前 `ai_news_feed` 已增加以下字段：

- `normalized_url`
- `content_hash`
- `first_seen_at`
- `last_seen_at`

当前 ingest 规则如下：

1. `source + source_post_id` 不存在时，返回 `created`
2. 若记录已存在且 `content_hash` 相同，只更新 `last_seen_at`，返回 `skipped`
3. 若记录已存在但 `content_hash` 不同，则更新正文与 AI 结果，同时更新 `updated_at` 和 `last_seen_at`，返回 `updated`

## 6. 跨源弱去重

当前系统已增加：

- `event_fingerprint`
- `duplicate_of_id`

处理规则如下：

1. 后端根据 `event_fingerprint` 查找同一事件的主记录
2. 第一条主记录保留 `duplicate_of_id = null`
3. 后续命中的相近事件记录会写入 `duplicate_of_id = 主记录ID`
4. 列表接口默认只返回 `duplicate_of_id is null` 的主记录

当前策略的目标是“标记并隐藏明显重复项”，而不是物理删除记录。
