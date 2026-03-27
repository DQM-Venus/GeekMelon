<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string | number
  accent?: 'melon' | 'gold' | 'pulp' | 'ink'
  hint?: string
}>()
</script>

<template>
  <article class="admin-metric-card gm-section-card">
    <span class="admin-metric-card__label">{{ props.label }}</span>
    <strong class="admin-metric-card__value" :data-accent="props.accent ?? 'ink'">{{ props.value }}</strong>
    <p v-if="props.hint" class="admin-metric-card__hint">{{ props.hint }}</p>
  </article>
</template>

<style scoped>
.admin-metric-card {
  display: grid;
  gap: 10px;
  min-height: 146px;
  padding: 20px;
  border-radius: var(--gm-radius-lg);
  background: var(--gm-surface-tinted);
}

.admin-metric-card__label {
  color: var(--gm-muted);
  font-size: 0.86rem;
}

.admin-metric-card__value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
}

.admin-metric-card__value[data-accent='melon'] {
  color: var(--gm-melon-deep);
}

.admin-metric-card__value[data-accent='gold'] {
  color: var(--gm-pill-category-text);
}

.admin-metric-card__value[data-accent='pulp'] {
  color: #ff9b73;
}

.admin-metric-card__hint {
  margin: 0;
  color: var(--gm-muted);
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>
