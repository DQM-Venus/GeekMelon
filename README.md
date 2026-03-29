# Geek Melon

Geek Melon 是一个面向开发者与 AI 爱好者的资讯聚合项目，目标不是做“大而全”的新闻站，而是把值得摸鱼时扫一眼的模型更新、产品动作、公司动态和行业八卦压缩成更短的信息流。

当前系统已经打通了这条主链路：

`采集 -> 规则过滤 -> DeepSeek 提炼 -> 后端入库 -> 前端展示 -> 后台运营`

## 项目结构

- `crawler`
  Python 采集与规则过滤、DeepSeek 分析、数据推送。
- `backend`
  Spring Boot 后端，负责鉴权、入库、查询、后台管理接口。
- `frontend`
  Vue 3 前端，包含公开首页和后台运营台。
- `sql`
  数据库建表与迁移脚本。
- `scripts`
  部署、发布和定时任务相关脚本。
- `docs`
  设计文档、连接说明和阶段性记录。

## 核心能力

- 默认公开首页展示“昨天发布的 AI 圈新鲜事”。
- 当昨天没有合适内容时，会自动回退到最近一期有内容的日期。
- 首页支持本地排序切换与明暗主题。
- 后台支持单条运营、批量隐藏、批量恢复、人工精选。
- 后台支持来源开关、手动抓取、抓取预览、任务日志查看。
- 抓取规则会主动压制公文腔、泛财经、泛行业趋势稿和低价值营销稿。

## 当前数据源

默认公开抓取链路当前以中文资讯源为主：

- 财联社 AI 专题
- 量子位
- 36氪
- 掘金 AI

已接入但默认灰度关闭：

- AIBase 新闻
- 智东西头条
- 机器之心

## 技术栈

- `Python`
  采集、规则过滤、DeepSeek 调用、推送后端。
- `Spring Boot`
  后端 API、后台管理、任务调度入口。
- `MySQL`
  内容存储、任务日志、后台配置。
- `Vue 3 + Vite`
  公开首页与后台运营台。
- `Docker Compose`
  线上部署与服务编排。

## 本地开发

### 1. 启动数据库隧道

如果本地开发直接连接云服务器 MySQL，先建立 SSH 隧道：

```powershell
ssh -L 3307:127.0.0.1:3306 root@47.105.112.190
```

### 2. 启动后端

```powershell
cd D:\project\GeekMelon\backend
.\mvnw.cmd spring-boot:run
```

### 3. 启动前端

```powershell
cd D:\project\GeekMelon\frontend
npm install
npm run dev
```

### 4. 运行采集器

```powershell
cd D:\project\GeekMelon\crawler
python main.py --source china_mix
```

### 5. 预览某个来源

```powershell
cd D:\project\GeekMelon\crawler
python main.py --source aibase --preview
```

## 线上部署

项目当前已部署在阿里云服务器，并使用 Docker Compose 运行前端、后端和 crawler 容器；MySQL 保留在宿主机。

### 线上地址

- 公开首页：[http://47.105.112.190/](http://47.105.112.190/)
- 后台登录：[http://47.105.112.190/admin/login](http://47.105.112.190/admin/login)

### 服务器发布

服务器代码目录：

```text
/opt/geekmelon/app
```

环境变量文件：

```text
/opt/geekmelon/env/.env
```

更新代码后，服务器执行：

```bash
cd /opt/geekmelon/app
./scripts/deploy-refresh.sh
```

### 定时抓取

线上使用宿主机定时任务，每天凌晨 `02:00` 运行默认抓取链路，补采前一天内容。

## 后台功能

后台当前支持：

- 内容列表查询与单条编辑
- 批量隐藏 / 批量恢复
- 批量设为人工精选 / 取消人工精选
- 来源启停与抓取数量配置
- 手动抓取
- 抓取预览
- 任务日志查看

## 重要脚本

- [scripts/deploy-refresh.sh](D:/project/GeekMelon/scripts/deploy-refresh.sh)
  服务器代码更新与容器重启。
- [scripts/run-crawler-cron.sh](D:/project/GeekMelon/scripts/run-crawler-cron.sh)
  定时抓取入口脚本。

## 相关文档

- [docs/MVP技术设计文档.md](D:/project/GeekMelon/docs/MVP技术设计文档.md)
- [docs/后端本地启动与联调步骤.md](D:/project/GeekMelon/docs/后端本地启动与联调步骤.md)
- [docs/SSH隧道开发连接说明.md](D:/project/GeekMelon/docs/SSH隧道开发连接说明.md)

## 说明

这是一个仍在持续打磨中的 MVP 项目。当前最核心的优化方向是：

- 提升来源质量与规则稳定性
- 强化后台运营能力
- 让公开首页更像“每日一份情报流”，而不是传统资讯站
