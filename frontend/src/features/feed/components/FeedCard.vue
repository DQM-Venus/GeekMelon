<script setup lang="ts">
import { computed } from 'vue'
import type { FeedRecord } from '@/features/feed/types'

const props = defineProps<{
  item: FeedRecord
  index: number
}>()

const emit = defineEmits<{
  openDetail: [id: number]
}>()

const tagText = computed(() => props.item.tags.join(' / '))
const displayTitle = computed(() => props.item.displayTitle || props.item.title)
const displayHighlight = computed(() => props.item.displayHighlight || props.item.highlight)
const displaySummary = computed(() => props.item.displaySummary || props.item.summary)
const spicyStyle = computed(() => ({
  width: `${Math.min(props.item.spicyIndex, 10) * 10}%`,
}))
const publishTimeText = computed(() => (props.item.rawPublishTime || '').replace('T', ' '))
</script>

<template>
  <article class="feed-card gm-section-card gm-noise gm-stagger-enter" :style="{ animationDelay: `${0.06 * props.index}s` }">
    <div class="feed-card__header">
      <div class="feed-card__meta">
        <span class="feed-card__meta-tag feed-card__meta-tag--source gm-mono">{{ props.item.source }}</span>
        <span class="feed-card__meta-tag feed-card__meta-tag--category">{{ props.item.category }}</span>
        <span v-if="props.item.editorPick" class="feed-card__meta-tag feed-card__meta-tag--pick">主编精选</span>
      </div>
      <time class="feed-card__time gm-mono">{{ publishTimeText }}</time>
    </div>

    <button class="feed-card__title-link" type="button" @click="emit('openDetail', props.item.id)">
      <h3 class="feed-card__title">{{ displayTitle }}</h3>
    </button>

    <p class="feed-card__highlight">{{ displayHighlight }}</p>
    <p class="feed-card__summary">{{ displaySummary }}</p>

    <div class="feed-card__footer">
      <div class="feed-card__spicy">
        <span class="feed-card__spicy-label gm-mono">吃瓜指数</span>
        <div class="feed-card__spicy-bar">
          <span class="feed-card__spicy-fill" :style="spicyStyle" />
        </div>
        <strong class="feed-card__spicy-value">🔥 {{ props.item.spicyIndex }}</strong>
      </div>

      <div class="feed-card__aside">
        <span class="feed-card__author">作者：{{ props.item.authorName || '匿名' }}</span>
        <span class="feed-card__tags">{{ tagText }}</span>
      </div>
    </div>

    <div class="feed-card__actions">
      <button class="feed-card__action-button" type="button" @click="emit('openDetail', props.item.id)">
        查看详情
      </button>
      <a class="feed-card__action-link gm-mono" :href="props.item.sourceUrl" target="_blank" rel="noreferrer">
        打开原文
      </a>
    </div>
  </article>
</template>

<style scoped>
.feed-card {
  display: grid;
  gap: 14px;
  padding: 20px;
  border-radius: 24px;
  background: var(--gm-surface-tinted);
}

.feed-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.feed-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.feed-card__meta-tag {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
}

.feed-card__meta-tag--source {
  background: var(--gm-pill-source-bg);
  color: var(--gm-pill-source-text);
}

.feed-card__meta-tag--category {
  background: var(--gm-pill-category-bg);
  color: var(--gm-pill-category-text);
}

.feed-card__meta-tag--pick {
  background: var(--gm-pill-pick-bg);
  color: var(--gm-pill-pick-text);
}

.feed-card__time {
  color: var(--gm-muted);
  font-size: 0.75rem;
}

.feed-card__title {
  margin: 0;
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 1.6rem;
  line-height: 1.25;
}

.feed-card__title-link {
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.feed-card__title-link:hover .feed-card__title {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-decoration-color: rgba(255, 132, 89, 0.6);
}

.feed-card__highlight {
  margin: 0;
  padding: 14px 16px;
  border-left: 4px solid var(--gm-pulp);
  border-radius: 0 16px 16px 0;
  background: var(--gm-surface-highlight);
  color: var(--gm-accent-ink);
  font-size: 1rem;
  line-height: 1.7;
}

.feed-card__summary {
  margin: 0;
  color: var(--gm-muted);
  line-height: 1.75;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.feed-card__footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.feed-card__spicy {
  min-width: 220px;
}

.feed-card__spicy-label {
  display: block;
  color: var(--gm-muted);
  font-size: 0.74rem;
  letter-spacing: 0.12em;
}

.feed-card__spicy-bar {
  overflow: hidden;
  height: 10px;
  margin-top: 8px;
  border-radius: 999px;
  background: var(--gm-surface-muted);
}

.feed-card__spicy-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--gm-gold), var(--gm-pulp), #cf3b2c);
}

.feed-card__spicy-value {
  display: inline-block;
  margin-top: 10px;
}

.feed-card__aside {
  display: grid;
  gap: 6px;
  justify-items: end;
  color: var(--gm-muted);
  font-size: 0.9rem;
}

.feed-card__tags {
  max-width: 480px;
  text-align: right;
}

.feed-card__actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.feed-card__action-button,
.feed-card__action-link {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border-radius: 999px;
}

.feed-card__action-button {
  border: 1px solid var(--gm-line-strong);
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
  cursor: pointer;
}

.feed-card__action-link {
  color: var(--gm-muted);
}

@media (max-width: 640px) {
  .feed-card {
    padding: 18px;
  }

  .feed-card__title {
    font-size: 1.38rem;
  }

  .feed-card__time,
  .feed-card__aside {
    justify-items: start;
    text-align: left;
  }

  .feed-card__actions {
    align-items: stretch;
  }
}
</style>
