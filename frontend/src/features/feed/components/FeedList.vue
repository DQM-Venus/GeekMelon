<script setup lang="ts">
import FeedCard from '@/features/feed/components/FeedCard.vue'
import type { FeedRecord } from '@/features/feed/types'

const props = defineProps<{
  records: readonly FeedRecord[]
  loading: boolean
  errorMessage: string
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  prev: []
  next: []
  openDetail: [id: number]
}>()
</script>

<template>
  <section class="feed-list">
    <header class="feed-list__header">
      <div>
        <p class="feed-list__eyebrow gm-mono">YESTERDAY FILES</p>
        <h2 class="feed-list__title">昨天发布的 AI 圈新鲜事</h2>
      </div>
    </header>

    <div v-if="props.loading" class="feed-list__state gm-section-card">
      正在整理昨天的资讯流...
    </div>

    <div v-else-if="props.errorMessage" class="feed-list__state feed-list__state--error gm-section-card">
      {{ props.errorMessage }}
    </div>

    <div v-else-if="props.records.length === 0" class="feed-list__state gm-section-card">
      昨天没有抓到适合公开展示的新内容，今晚补采后会自动更新。
    </div>

    <div v-else class="feed-list__grid">
      <FeedCard
        v-for="(item, index) in props.records"
        :key="item.id"
        :item="item"
        :index="index"
        @open-detail="emit('openDetail', $event)"
      />
    </div>

    <footer v-if="props.totalPages > 1" class="feed-list__pager gm-section-card">
      <button class="feed-list__pager-button" type="button" :disabled="props.page <= 1" @click="emit('prev')">
        上一页
      </button>
      <span class="feed-list__pager-text gm-mono">第 {{ props.page }} / {{ props.totalPages }} 页</span>
      <button class="feed-list__pager-button" type="button" :disabled="props.page >= props.totalPages" @click="emit('next')">
        下一页
      </button>
    </footer>
  </section>
</template>

<style scoped>
.feed-list {
  margin-top: 20px;
  padding-bottom: 42px;
}

.feed-list__header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: end;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.feed-list__eyebrow {
  margin: 0;
  color: var(--gm-melon-deep);
  font-size: 0.76rem;
  letter-spacing: 0.14em;
}

.feed-list__title {
  margin: 8px 0 0;
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 1.9rem;
}

.feed-list__grid {
  display: grid;
  gap: 18px;
}

.feed-list__state {
  padding: 22px;
  border-radius: 24px;
  color: var(--gm-muted);
}

.feed-list__state--error {
  color: #892d25;
  background: rgba(255, 132, 89, 0.12);
}

.feed-list__pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding: 14px 18px;
  border-radius: 24px;
}

.feed-list__pager-button {
  min-width: 108px;
  min-height: 42px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
  color: var(--gm-ink);
  cursor: pointer;
}

.feed-list__pager-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.feed-list__pager-text {
  color: var(--gm-muted);
  font-size: 0.84rem;
}

@media (max-width: 720px) {
  .feed-list__pager {
    flex-direction: column;
  }
}
</style>
