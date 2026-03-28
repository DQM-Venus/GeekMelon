<script setup lang="ts">
import FeedCard from '@/features/feed/components/FeedCard.vue'
import type { FeedRecord } from '@/features/feed/types'

defineProps<{
  records: readonly FeedRecord[]
  loading: boolean
  errorMessage: string
  page: number
  totalPages: number
  effectiveDate?: string | null
  emptyFallback?: boolean
}>()

defineEmits<{
  prev: []
  next: []
  openDetail: [id: number]
}>()
</script>

<template>
  <section class="feed-list">
    <header class="feed-list__header">
      <p class="feed-list__eyebrow">YESTERDAY FILES</p>
      <h2 class="feed-list__title">
        {{ emptyFallback ? '最近一期值得一看的 AI 圈情报' : '昨天发布的 AI 圈新鲜事' }}
      </h2>
      <p v-if="emptyFallback && effectiveDate" class="feed-list__subtitle">
        昨天空窗，当前展示最近一期情报：{{ effectiveDate }}
      </p>
    </header>

    <div v-if="loading" class="feed-list__state feed-list__state--loading">
      正在整理情报流...
    </div>
    <div v-else-if="errorMessage" class="feed-list__state feed-list__state--error">
      {{ errorMessage }}
    </div>
    <div v-else-if="records.length === 0" class="feed-list__state">
      暂时还没有可公开展示的情报。
    </div>
    <div v-else class="feed-list__items">
      <FeedCard
        v-for="(item, index) in records"
        :key="item.id"
        :item="item"
        :index="index"
        @open-detail="$emit('openDetail', item.id)"
      />
    </div>

    <footer v-if="records.length > 0" class="feed-list__footer">
      <button class="feed-list__pager" type="button" :disabled="page <= 1 || loading" @click="$emit('prev')">
        上一页
      </button>
      <span class="feed-list__page">{{ page }} / {{ totalPages }}</span>
      <button class="feed-list__pager" type="button" :disabled="page >= totalPages || loading" @click="$emit('next')">
        下一页
      </button>
    </footer>
  </section>
</template>

<style scoped>
.feed-list {
  display: grid;
  gap: 18px;
}

.feed-list__header {
  display: grid;
  gap: 10px;
}

.feed-list__eyebrow {
  margin: 0;
  color: var(--gm-melon-deep);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
}

.feed-list__title,
.feed-list__subtitle {
  margin: 0;
}

.feed-list__subtitle {
  color: var(--gm-muted);
  font-size: 0.95rem;
}

.feed-list__items {
  display: grid;
  gap: 18px;
}

.feed-list__state {
  padding: 18px 20px;
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-radius-lg);
  background: var(--gm-surface-soft);
  color: var(--gm-muted);
}

.feed-list__state--error {
  color: #ff9b73;
}

.feed-list__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.feed-list__pager {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 999px;
  background: var(--gm-surface-soft);
  color: var(--gm-ink);
  cursor: pointer;
}

.feed-list__pager:disabled {
  cursor: not-allowed;
  opacity: 0.56;
}

.feed-list__page {
  color: var(--gm-muted);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
}
</style>
