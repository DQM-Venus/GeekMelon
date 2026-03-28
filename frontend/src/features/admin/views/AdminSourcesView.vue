<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AdminTaskRunList from '@/features/admin/components/AdminTaskRunList.vue'
import { useAdminSources } from '@/features/admin/composables/useAdminSources'
import type { AdminSourceRecord, AdminTaskPreviewRecord } from '@/features/feed/types'

const { sources, runs, loading, saving, errorMessage, fetchSources, saveSource, runCollect, previewSource } = useAdminSources()

const draftMap = reactive<Record<string, { enabled: boolean; maxItems: number; runOrder: number }>>({})
const collectingSourceKey = ref('')
const previewingSourceKey = ref('')
const previewOpen = ref(false)
const previewResult = ref<AdminTaskPreviewRecord | null>(null)

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

const previewKeepCount = computed(() =>
  previewResult.value?.items.filter((item) => item.decision === 'keep').length ?? 0,
)

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

async function handlePreview(sourceKey: string) {
  previewingSourceKey.value = sourceKey
  previewOpen.value = true
  previewResult.value = null
  try {
    previewResult.value = await previewSource(sourceKey)
  } finally {
    previewingSourceKey.value = ''
  }
}

function closePreview() {
  previewOpen.value = false
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
          <div class="admin-source-card__actions">
            <button
              class="admin-source-card__action admin-source-card__action--ghost"
              type="button"
              :disabled="saving || previewingSourceKey === item.sourceKey"
              @click="handlePreview(item.sourceKey)"
            >
              {{ previewingSourceKey === item.sourceKey ? '预览中...' : '预览抓取' }}
            </button>
            <button
              class="admin-source-card__action admin-source-card__action--ghost"
              type="button"
              :disabled="saving || collectingSourceKey === item.sourceKey || !ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).enabled"
              @click="handleCollect(item.sourceKey)"
            >
              {{ collectingSourceKey === item.sourceKey ? '抓取中...' : '手动抓取' }}
            </button>
          </div>
        </footer>
      </article>
    </section>

    <AdminTaskRunList :runs="runs" />

    <Teleport to="body">
      <Transition name="preview-drawer">
        <aside v-if="previewOpen" class="preview-drawer">
          <div class="preview-drawer__backdrop" @click="closePreview" />
          <section class="preview-drawer__panel gm-section-card">
            <header class="preview-drawer__header">
              <div>
                <p class="preview-drawer__eyebrow">抓取预览</p>
                <h3 class="preview-drawer__title">{{ previewResult?.sourceKey || previewingSourceKey || '来源预览' }}</h3>
              </div>
              <button class="preview-drawer__close" type="button" @click="closePreview">关闭</button>
            </header>

            <div v-if="previewingSourceKey && !previewResult" class="preview-drawer__state">
              正在生成候选预览...
            </div>
            <div v-else-if="errorMessage" class="preview-drawer__state preview-drawer__state--error">
              {{ errorMessage }}
            </div>
            <div v-else-if="previewResult" class="preview-drawer__content">
              <section class="preview-drawer__stats">
                <div>
                  <span>候选数</span>
                  <strong>{{ previewResult.previewCount }}</strong>
                </div>
                <div>
                  <span>将保留</span>
                  <strong>{{ previewKeepCount }}</strong>
                </div>
                <div>
                  <span>将过滤</span>
                  <strong>{{ previewResult.filteredCount }}</strong>
                </div>
              </section>

              <ul class="preview-drawer__items">
                <li v-for="(item, index) in previewResult.items" :key="`${item.sourceUrl}-${index}`" class="preview-drawer__item">
                  <div class="preview-drawer__top">
                    <span class="preview-drawer__decision" :data-decision="item.decision">
                      {{ item.decision === 'keep' ? '将保留' : '将过滤' }}
                    </span>
                    <span class="preview-drawer__time">{{ item.rawPublishTime?.replace('T', ' ') || '-' }}</span>
                  </div>
                  <strong>{{ item.title }}</strong>
                  <p class="preview-drawer__meta">{{ item.category }} · 辣度 {{ item.spicyIndex }}</p>
                  <p class="preview-drawer__summary">{{ item.highlight || item.summary || '暂无摘要预览。' }}</p>
                  <a class="preview-drawer__link" :href="item.sourceUrl" target="_blank" rel="noreferrer">打开原文</a>
                </li>
              </ul>
            </div>
          </section>
        </aside>
      </Transition>
    </Teleport>
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
.admin-source-card__action,
.preview-drawer__close {
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

.admin-source-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-source-card__action--ghost {
  background: var(--gm-surface-soft);
}

.admin-page__error {
  color: #ff9b73;
}

.preview-drawer {
  position: fixed;
  inset: 0;
  z-index: 35;
}

.preview-drawer__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(31, 35, 24, 0.42);
  backdrop-filter: blur(6px);
}

.preview-drawer__panel {
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  width: min(720px, 100%);
  height: 100%;
  padding: 24px;
  border-radius: 28px 0 0 28px;
  background: var(--gm-surface-hero);
}

.preview-drawer__header,
.preview-drawer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.preview-drawer__eyebrow {
  margin: 0 0 8px;
  color: var(--gm-muted);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-drawer__title {
  margin: 0;
}

.preview-drawer__state,
.preview-drawer__content {
  overflow: auto;
  margin-top: 18px;
}

.preview-drawer__state--error {
  color: #ff9b73;
}

.preview-drawer__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.preview-drawer__stats div {
  display: grid;
  gap: 6px;
  padding: 14px;
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-radius-md);
  background: var(--gm-surface-soft);
}

.preview-drawer__stats span,
.preview-drawer__time,
.preview-drawer__meta {
  color: var(--gm-muted);
  font-size: 0.86rem;
}

.preview-drawer__items {
  display: grid;
  gap: 14px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.preview-drawer__item {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-radius-lg);
  background: var(--gm-surface-soft);
}

.preview-drawer__decision {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.preview-drawer__decision[data-decision='keep'] {
  background: var(--gm-pill-source-bg);
  color: var(--gm-pill-source-text);
}

.preview-drawer__decision[data-decision='drop'] {
  background: rgba(255, 132, 89, 0.14);
  color: #ff9b73;
}

.preview-drawer__summary {
  margin: 0;
  color: var(--gm-ink);
  line-height: 1.7;
}

.preview-drawer__link {
  color: var(--gm-melon-deep);
}

@media (max-width: 1000px) {
  .admin-source-grid,
  .admin-source-card__grid {
    grid-template-columns: 1fr;
  }

  .preview-drawer__stats {
    grid-template-columns: 1fr;
  }
}
</style>
