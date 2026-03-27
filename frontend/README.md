# Geek Melon 前端

## 1. 技术方案

当前前端使用：

- Vue 3
- Composition API
- `<script setup lang="ts">`
- Vite

## 2. 组件边界

当前首页信息流按以下结构拆分：

- `App.vue`：应用挂载壳子
- `FeedHomeView.vue`：页面编排层
- `FeedHero.vue`：顶部品牌区与概览
- `FeedToolbar.vue`：筛选与刷新操作区
- `FeedList.vue`：列表、空态、分页
- `FeedCard.vue`：单条资讯卡片
- `useFeedQuery.ts`：接口请求与筛选状态

## 3. 本地启动

```powershell
cd D:\project\GeekMelon\frontend
npm install
npm run dev
```

默认访问地址：

`http://127.0.0.1:5173`

## 4. 接口说明

开发模式下，Vite 已代理：

- `/api` -> `http://127.0.0.1:8080`

因此后端本地启动后，前端可以直接请求 `/api/feeds`。

## 5. 当前页面能力

- 展示 AI 资讯信息流
- 支持来源筛选
- 支持分类筛选
- 支持最低吃瓜指数筛选
- 支持最新 / 辣度排序
- 默认隐藏弱去重后的重复从记录
