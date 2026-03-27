<script setup lang="ts">
const props = defineProps<{
  dateLabel: string
}>()
</script>

<template>
  <section class="feed-hero gm-section-card gm-noise">
    <div class="feed-hero__copy gm-stagger-enter">
      <p class="feed-hero__eyebrow gm-mono">昨日情报流 / GEEK MELON DOSSIER</p>
      <div class="feed-hero__headline-row">
        <h1 class="feed-hero__title">Geek Melon</h1>
        <span class="feed-hero__date-pill">{{ props.dateLabel }}</span>
      </div>
      <p class="feed-hero__summary">
        昨天的 AI 圈新鲜事，留给开发者摸鱼时一口看完。
      </p>
    </div>
  </section>
</template>

<style scoped>
.feed-hero {
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  padding: 24px 26px;
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
  max-width: 760px;
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

.feed-hero__summary {
  max-width: 560px;
  margin: 0;
  color: var(--gm-muted);
  font-size: 1rem;
  line-height: 1.75;
}

@media (max-width: 640px) {
  .feed-hero {
    padding: 20px 18px;
  }

  .feed-hero__title {
    font-size: 2.2rem;
  }
}
</style>
