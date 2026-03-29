<script setup lang="ts">
import type { FeedRecord } from '@/features/feed/types'

const props = defineProps<{
  dateLabel: string
  effectiveDate?: string | null
  emptyFallback?: boolean
  headlines?: readonly FeedRecord[]
}>()

defineEmits<{
  openDetail: [id: number]
}>()

function resolveHeadlineTitle(item: FeedRecord) {
  return item.displayTitle?.trim() || item.title
}

function resolveHeadlineMeta(item: FeedRecord) {
  return [item.source?.trim(), item.category?.trim()].filter(Boolean).join(' / ')
}

function buildHeadlineRank(index: number) {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <section class="feed-hero gm-section-card gm-noise">
    <div class="feed-hero__copy gm-stagger-enter">
      <p class="feed-hero__eyebrow">昨日情报流 / GEEK MELON DOSSIER</p>
      <div class="feed-hero__headline-row">
        <h1 class="feed-hero__title">Geek Melon</h1>
        <span class="feed-hero__date-pill">{{ dateLabel }}</span>
      </div>
      <p class="feed-hero__summary">
        {{
          emptyFallback
            ? '昨天暂无公开内容，当前展示最近一期值得一看的 AI 情报。'
            : '昨天的 AI 圈新鲜事，留给开发者摸鱼时一口看完。'
        }}
      </p>
      <p v-if="emptyFallback && effectiveDate" class="feed-hero__fallback">
        当前展示日期：{{ effectiveDate }}
      </p>
    </div>

    <div v-if="props.headlines?.length" class="feed-hero__spotlight gm-stagger-enter">
      <div class="feed-hero__spotlight-header">
        <p class="feed-hero__spotlight-eyebrow">热点一览</p>
        <p class="feed-hero__spotlight-note">先扫标题，再决定点开哪一条。</p>
      </div>

      <div class="feed-hero__spotlight-list">
        <button
          v-for="(item, index) in props.headlines"
          :key="item.id"
          class="feed-hero__headline-card"
          type="button"
          @click="$emit('openDetail', item.id)"
        >
          <span class="feed-hero__headline-rank">{{ buildHeadlineRank(index) }}</span>
          <span class="feed-hero__headline-main">
            <span class="feed-hero__headline-title">{{ resolveHeadlineTitle(item) }}</span>
            <span v-if="resolveHeadlineMeta(item)" class="feed-hero__headline-meta">
              {{ resolveHeadlineMeta(item) }}
            </span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feed-hero {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 18px;
  margin-top: 20px;
  padding: 24px 26px 26px;
  border-radius: var(--gm-radius-xl);
  background: var(--gm-surface-hero);
}

.feed-hero::before {
  position: absolute;
  inset: -40px -80px auto auto;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  content: '';
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0) 48%),
    radial-gradient(circle at 60% 60%, rgba(126, 203, 105, 0.3), rgba(126, 203, 105, 0) 68%);
  filter: blur(16px);
  opacity: 0.85;
}

.feed-hero__copy {
  position: relative;
  display: grid;
  gap: 10px;
  max-width: 780px;
}

.feed-hero__eyebrow {
  margin: 0;
  color: var(--gm-melon-deep);
  font-size: 0.76rem;
  letter-spacing: 0.18em;
}

.feed-hero__headline-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.feed-hero__title {
  margin: 0;
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: clamp(2.4rem, 6vw, 4.1rem);
  line-height: 0.98;
}

.feed-hero__date-pill {
  padding: 8px 14px;
  border: 1px solid rgba(30, 38, 26, 0.12);
  border-radius: 999px;
  background: var(--gm-surface-soft);
  color: var(--gm-ink);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
}

.feed-hero__summary,
.feed-hero__fallback {
  margin: 0;
  max-width: 640px;
  color: var(--gm-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.feed-hero__fallback {
  color: var(--gm-melon-deep);
  font-size: 0.88rem;
}

.feed-hero__spotlight {
  position: relative;
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--gm-line);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.54), rgba(255, 255, 255, 0.18)),
    var(--gm-surface-soft);
}

.feed-hero__spotlight-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.feed-hero__spotlight-eyebrow,
.feed-hero__spotlight-note {
  margin: 0;
}

.feed-hero__spotlight-eyebrow {
  color: var(--gm-ink);
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.feed-hero__spotlight-note {
  color: var(--gm-muted);
  font-size: 0.88rem;
}

.feed-hero__spotlight-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.feed-hero__headline-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: 14px 15px;
  border: 1px solid var(--gm-line);
  border-radius: 18px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.feed-hero__headline-card:hover {
  transform: translateY(-2px);
  border-color: rgba(126, 203, 105, 0.35);
  box-shadow: 0 14px 30px rgba(24, 34, 19, 0.1);
  background:
    linear-gradient(135deg, rgba(126, 203, 105, 0.08), rgba(255, 132, 89, 0.06)),
    var(--gm-surface-strong);
}

.feed-hero__headline-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  min-height: 42px;
  border-radius: 14px;
  background: rgba(126, 203, 105, 0.14);
  color: var(--gm-melon-deep);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.88rem;
  font-weight: 600;
}

.feed-hero__headline-main {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.feed-hero__headline-title {
  font-size: 1.02rem;
  line-height: 1.55;
  font-weight: 700;
}

.feed-hero__headline-meta {
  color: var(--gm-muted);
  font-size: 0.8rem;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .feed-hero {
    padding: 20px 18px;
  }

  .feed-hero__title {
    font-size: 2.2rem;
  }

  .feed-hero__spotlight {
    padding: 14px;
  }

  .feed-hero__spotlight-list {
    grid-template-columns: 1fr;
  }
}
</style>
