<script setup lang="ts">
import { computed } from 'vue'
import type { AdminTaskRunRecord } from '@/features/feed/types'

const props = defineProps<{
  runs: readonly AdminTaskRunRecord[]
  compact?: boolean
}>()

const normalizedRuns = computed(() => props.runs ?? [])

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-'
  }
  return value.replace('T', ' ')
}

function statusLabel(status: string) {
  if (status === 'success') {
    return '成功'
  }
  if (status === 'failed') {
    return '失败'
  }
  if (status === 'running') {
    return '运行中'
  }
  return status
}

function errorCategoryLabel(category?: string | null) {
  if (!category) {
    return ''
  }

  const categoryMap: Record<string, string> = {
    SOURCE_FETCH: '抓源失败',
    PUBLISH_WINDOW: '发布时间过滤',
    ANALYZE_NETWORK: '分析网络异常',
    ANALYZE_PARSE: '分析结果解析失败',
    PUBLISH_REQUEST: '推送后端失败',
    PROCESS_EXIT: '子进程异常退出',
    UNEXPECTED: '未知异常',
  }

  return categoryMap[category] ?? category
}
</script>

<template>
  <section class="admin-task-list gm-section-card">
    <header class="admin-task-list__header">
      <h3 class="admin-task-list__title">最近任务</h3>
      <span class="admin-task-list__meta">{{ normalizedRuns.length }} 条</span>
    </header>

    <div v-if="normalizedRuns.length === 0" class="admin-task-list__empty">
      暂无抓取任务记录。
    </div>

    <ul v-else class="admin-task-list__items">
      <li v-for="run in normalizedRuns" :key="run.id" class="admin-task-list__item">
        <div class="admin-task-list__top">
          <div class="admin-task-list__headline">
            <strong>{{ run.sourceKey }}</strong>
            <span class="admin-task-list__run-id gm-mono">{{ run.runId }}</span>
          </div>
          <span class="admin-task-list__status" :data-status="run.status">{{ statusLabel(run.status) }}</span>
        </div>

        <p class="admin-task-list__summary">
          新增 {{ run.createdCount }} / 更新 {{ run.updatedCount }} / 跳过 {{ run.skippedCount }} / 过滤 {{ run.filteredCount }}
        </p>

        <p class="admin-task-list__time">
          {{ formatDateTime(run.startedAt) }}
          <span v-if="run.endedAt">→ {{ formatDateTime(run.endedAt) }}</span>
        </p>

        <p v-if="run.errorCategory" class="admin-task-list__category">
          错误分类：{{ errorCategoryLabel(run.errorCategory) }}
        </p>

        <p v-if="run.errorDetail" class="admin-task-list__error">{{ run.errorDetail }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.admin-task-list {
  display: grid;
  gap: 16px;
  padding: 20px;
  border-radius: var(--gm-radius-lg);
  background: var(--gm-surface-tinted);
}

.admin-task-list__header,
.admin-task-list__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.admin-task-list__headline {
  display: grid;
  gap: 6px;
}

.admin-task-list__title {
  margin: 0;
  font-size: 1.1rem;
}

.admin-task-list__meta,
.admin-task-list__time,
.admin-task-list__run-id,
.admin-task-list__category {
  color: var(--gm-muted);
  font-size: 0.88rem;
}

.admin-task-list__run-id {
  word-break: break-all;
}

.admin-task-list__items {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.admin-task-list__item {
  padding: 14px 16px;
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-radius-md);
  background: var(--gm-surface-soft);
}

.admin-task-list__summary,
.admin-task-list__error,
.admin-task-list__category {
  margin: 8px 0 0;
  font-size: 0.92rem;
  line-height: 1.6;
}

.admin-task-list__error {
  color: #ff9b73;
}

.admin-task-list__status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.admin-task-list__status[data-status='success'] {
  background: var(--gm-pill-source-bg);
  color: var(--gm-pill-source-text);
}

.admin-task-list__status[data-status='failed'] {
  background: rgba(255, 132, 89, 0.18);
  color: #ff9b73;
}

.admin-task-list__status[data-status='running'] {
  background: var(--gm-pill-category-bg);
  color: var(--gm-pill-category-text);
}

.admin-task-list__empty {
  color: var(--gm-muted);
}
</style>
