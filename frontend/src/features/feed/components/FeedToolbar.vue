<script setup lang="ts">
import type { ThemeMode } from '@/composables/useThemePreference'

const props = defineProps<{
  sort: 'latest' | 'spicy'
  theme: ThemeMode
}>()

const emit = defineEmits<{
  updateSort: [value: 'latest' | 'spicy']
  updateTheme: [value: ThemeMode]
}>()

const sortOptions = [
  { label: '按最新', value: 'latest' },
  { label: '按辣度', value: 'spicy' },
] as const

const themeOptions = [
  { label: '浅色', value: 'light' },
  { label: '夜间', value: 'dark' },
] as const
</script>

<template>
  <section class="feed-toolbar gm-section-card gm-noise">
    <div class="feed-toolbar__intro">
      <p class="feed-toolbar__eyebrow gm-mono">YESTERDAY ONLY</p>
      <h2 class="feed-toolbar__title">只保留昨天值得刷一眼的消息</h2>
    </div>

    <div class="feed-toolbar__controls">
      <div class="feed-toolbar__group">
        <span class="feed-toolbar__label gm-mono">排序</span>
        <div class="feed-toolbar__segmented">
          <button
            v-for="item in sortOptions"
            :key="item.value"
            class="feed-toolbar__segment"
            type="button"
            :data-active="props.sort === item.value"
            @click="emit('updateSort', item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <div class="feed-toolbar__group">
        <span class="feed-toolbar__label gm-mono">主题</span>
        <div class="feed-toolbar__segmented">
          <button
            v-for="item in themeOptions"
            :key="item.value"
            class="feed-toolbar__segment"
            type="button"
            :data-active="props.theme === item.value"
            @click="emit('updateTheme', item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feed-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 16px;
  padding: 16px 18px;
  border-radius: var(--gm-radius-lg);
}

.feed-toolbar__intro {
  display: grid;
  gap: 6px;
}

.feed-toolbar__eyebrow {
  margin: 0;
  color: var(--gm-melon-deep);
  font-size: 0.76rem;
  letter-spacing: 0.14em;
}

.feed-toolbar__title {
  margin: 0;
  font-size: 1.08rem;
  line-height: 1.45;
}

.feed-toolbar__controls {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.feed-toolbar__group {
  display: grid;
  gap: 8px;
}

.feed-toolbar__label {
  color: var(--gm-muted);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
}

.feed-toolbar__segmented {
  display: inline-flex;
  padding: 4px;
  border: 1px solid var(--gm-line);
  border-radius: 999px;
  background: var(--gm-surface-soft);
}

.feed-toolbar__segment {
  min-width: 82px;
  min-height: 38px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--gm-muted);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.feed-toolbar__segment:hover {
  transform: translateY(-1px);
}

.feed-toolbar__segment[data-active='true'] {
  background: linear-gradient(135deg, rgba(126, 203, 105, 0.2), rgba(255, 132, 89, 0.16));
  color: var(--gm-ink);
}

:global(:root[data-theme='dark']) .feed-toolbar__segment {
  color: var(--gm-muted);
}

:global(:root[data-theme='dark']) .feed-toolbar__segment[data-active='true'] {
  background: linear-gradient(135deg, rgba(126, 203, 105, 0.28), rgba(255, 132, 89, 0.22));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

@media (max-width: 860px) {
  .feed-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .feed-toolbar__controls {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .feed-toolbar__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .feed-toolbar__segmented {
    width: 100%;
  }

  .feed-toolbar__segment {
    flex: 1;
  }
}
</style>
