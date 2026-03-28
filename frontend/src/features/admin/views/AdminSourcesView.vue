<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import AdminTaskRunList from '@/features/admin/components/AdminTaskRunList.vue'
import { useAdminSources } from '@/features/admin/composables/useAdminSources'
import type { AdminSourceRecord } from '@/features/feed/types'

const { sources, runs, loading, saving, errorMessage, fetchSources, saveSource, runCollect } = useAdminSources()

const draftMap = reactive<Record<string, { enabled: boolean; maxItems: number; runOrder: number }>>({})
const collectingSourceKey = ref('')

function ensureDraft(sourceKey: string, enabled: boolean, maxItems: number, runOrder: number) {
  if (!draftMap[sourceKey]) {
    draftMap[sourceKey] = { enabled, maxItems, runOrder }
  }
  return draftMap[sourceKey]
}

function findSource(sourceKey: string) {
  return sources.value.find((item) => item.sourceKey === sourceKey)
}

function hasUnsavedChanges(source: AdminSourceRecord) {
  const draft = draftMap[source.sourceKey]
  if (!draft) {
    return false
  }
  return (
    draft.enabled !== source.enabled
    || draft.maxItems !== source.maxItems
    || draft.runOrder !== source.runOrder
  )
}

async function handleSave(sourceKey: string) {
  const draft = draftMap[sourceKey]
  if (!draft) {
    return
  }
  await saveSource(sourceKey, draft)
}

async function handleCollect(sourceKey: string) {
  const source = findSource(sourceKey)
  const draft = draftMap[sourceKey]
  if (!source || !draft) {
    return
  }

  collectingSourceKey.value = sourceKey
  try {
    if (hasUnsavedChanges(source)) {
      await saveSource(sourceKey, draft)
    }
    await runCollect(sourceKey)
    await fetchSources()
  } finally {
    collectingSourceKey.value = ''
  }
}

onMounted(async () => {
  await fetchSources()
})

watch(
  sources,
  (items) => {
    for (const source of items) {
      draftMap[source.sourceKey] = {
        enabled: source.enabled,
        maxItems: source.maxItems,
        runOrder: source.runOrder,
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="admin-page">
    <header class="admin-page__header">
      <div>
        <p class="admin-page__eyebrow">来源与抓取</p>
        <h2 class="admin-page__title">来源配置</h2>
      </div>
      <button class="admin-page__refresh" type="button" :disabled="loading" @click="fetchSources">
        {{ loading ? '刷新中...' : '刷新来源' }}
      </button>
    </header>

    <p v-if="errorMessage" class="admin-page__error">{{ errorMessage }}</p>

    <section class="admin-source-grid">
      <article v-for="item in sources" :key="item.sourceKey" class="admin-source-card gm-section-card">
        <header class="admin-source-card__header">
          <div>
            <strong>{{ item.displayName }}</strong>
            <p>{{ item.sourceKey }}</p>
          </div>
          <label class="admin-source-card__switch">
            <input v-model="ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).enabled" type="checkbox" />
            <span>启用</span>
          </label>
        </header>

        <div class="admin-source-card__grid">
          <label class="admin-source-card__field">
            <span>抓取数量</span>
            <input v-model.number="ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).maxItems" type="number" min="1" max="50" />
          </label>
          <label class="admin-source-card__field">
            <span>排序权重</span>
            <input v-model.number="ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).runOrder" type="number" min="1" max="999" />
          </label>
        </div>

        <p class="admin-source-card__meta">最近更新时间：{{ item.updatedAt.replace('T', ' ') }}</p>

        <footer class="admin-source-card__footer">
          <button class="admin-source-card__action" type="button" :disabled="saving" @click="handleSave(item.sourceKey)">
            保存
          </button>
          <button
            class="admin-source-card__action admin-source-card__action--ghost"
            type="button"
            :disabled="saving || collectingSourceKey === item.sourceKey || !ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).enabled"
            @click="handleCollect(item.sourceKey)"
          >
            {{ collectingSourceKey === item.sourceKey ? '抓取中...' : '手动抓取' }}
          </button>
        </footer>
      </article>
    </section>

    <AdminTaskRunList :runs="runs" />
  </section>
</template>

<style scoped>
.admin-page {
  display: grid;
  gap: 18px;
}

.admin-page__header,
.admin-source-card__header,
.admin-source-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.admin-page__eyebrow {
  margin: 0 0 8px;
  color: var(--gm-muted);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-page__title {
  margin: 0;
}

.admin-page__refresh,
.admin-source-card__action {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 999px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
  cursor: pointer;
}

.admin-page__refresh:disabled,
.admin-source-card__action:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.admin-source-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.admin-source-card {
  display: grid;
  gap: 16px;
  padding: 18px;
  border-radius: var(--gm-radius-lg);
  background: var(--gm-surface-tinted);
}

.admin-source-card__header p,
.admin-source-card__meta,
.admin-page__error {
  margin: 6px 0 0;
  color: var(--gm-muted);
  font-size: 0.88rem;
}

.admin-source-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.admin-source-card__field {
  display: grid;
  gap: 8px;
}

.admin-source-card__field span {
  color: var(--gm-ink);
}

.admin-source-card__field input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 14px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
}

.admin-source-card__switch {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}

.admin-source-card__action--ghost {
  background: var(--gm-surface-soft);
}

.admin-page__error {
  color: #ff9b73;
}

@media (max-width: 1000px) {
  .admin-source-grid,
  .admin-source-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>
