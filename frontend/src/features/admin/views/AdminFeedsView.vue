<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminFeedEditorDrawer from '@/features/admin/components/AdminFeedEditorDrawer.vue'
import { useAdminFeeds } from '@/features/admin/composables/useAdminFeeds'
import type { AdminFeedBatchPayload } from '@/features/feed/types'

const {
  records,
  total,
  page,
  totalPages,
  loading,
  saving,
  errorMessage,
  detail,
  detailLoading,
  detailErrorMessage,
  keyword,
  source,
  category,
  status,
  editorPick,
  featured,
  duplicateGroup,
  openDetail,
  saveDetail,
  hideFeed,
  restoreFeed,
  batchOperate,
  updateFilters,
  nextPage,
  prevPage,
} = useAdminFeeds()

const drawerOpen = ref(false)
const selectedIds = ref<number[]>([])

const sourceOptions = computed(() => Array.from(new Set(records.value.map((item) => item.source))).sort())
const categoryOptions = computed(() => {
  const values = new Set<string>()
  for (const item of records.value) {
    if (item.adminCategory) {
      values.add(item.adminCategory)
    }
    if (item.category) {
      values.add(item.category)
    }
  }
  return Array.from(values).sort()
})
const selectedCount = computed(() => selectedIds.value.length)
const allSelected = computed({
  get: () => records.value.length > 0 && selectedIds.value.length === records.value.length,
  set: (value: boolean) => {
    selectedIds.value = value ? records.value.map((item) => item.id) : []
  },
})

function formatDateTime(value?: string | null) {
  return value ? value.replace('T', ' ') : '-'
}

function toggleSelected(id: number, checked: boolean) {
  if (checked) {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id]
    }
    return
  }

  selectedIds.value = selectedIds.value.filter((item) => item !== id)
}

function handleSelectAll(event: Event) {
  allSelected.value = (event.target as HTMLInputElement).checked
}

function handleRowSelection(id: number, event: Event) {
  toggleSelected(id, (event.target as HTMLInputElement).checked)
}

function clearSelection() {
  selectedIds.value = []
}

function handleKeywordInput(event: Event) {
  updateFilters({ keyword: (event.target as HTMLInputElement).value })
}

function handleSourceChange(event: Event) {
  updateFilters({ source: (event.target as HTMLSelectElement).value })
}

function handleCategoryChange(event: Event) {
  updateFilters({ category: (event.target as HTMLSelectElement).value })
}

function handleStatusChange(event: Event) {
  updateFilters({ status: (event.target as HTMLSelectElement).value })
}

function handleEditorPickChange(event: Event) {
  updateFilters({ editorPick: (event.target as HTMLSelectElement).value })
}

function handleFeaturedChange(event: Event) {
  updateFilters({ featured: (event.target as HTMLSelectElement).value })
}

function handleDuplicateGroupInput(event: Event) {
  updateFilters({ duplicateGroup: (event.target as HTMLInputElement).value })
}

async function handleOpenDetail(id: number) {
  drawerOpen.value = true
  await openDetail(id)
}

async function handleSave(payload: Parameters<typeof saveDetail>[1]) {
  if (!detail.value) {
    return
  }
  await saveDetail(detail.value.id, payload)
}

async function runBatchAction(action: AdminFeedBatchPayload['action']) {
  if (selectedIds.value.length === 0) {
    return
  }
  await batchOperate({
    ids: selectedIds.value,
    action,
  })
  clearSelection()
}

onMounted(() => {
  drawerOpen.value = false
})
</script>

<template>
  <section class="admin-page">
    <header class="admin-page__header">
      <div>
        <p class="admin-page__eyebrow">内容运营</p>
        <h2 class="admin-page__title">内容管理</h2>
      </div>
      <div class="admin-page__stat">共 {{ total }} 条</div>
    </header>

    <section class="admin-feed-filters gm-section-card">
      <label class="admin-feed-filters__field admin-feed-filters__field--keyword">
        <span>关键词</span>
        <input :value="keyword" type="text" placeholder="搜标题、原文、链接" @input="handleKeywordInput" />
      </label>

      <label class="admin-feed-filters__field">
        <span>来源</span>
        <select :value="source" @change="handleSourceChange">
          <option value="">全部来源</option>
          <option v-for="item in sourceOptions" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>

      <label class="admin-feed-filters__field">
        <span>分类</span>
        <select :value="category" @change="handleCategoryChange">
          <option value="">全部分类</option>
          <option v-for="item in categoryOptions" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>

      <label class="admin-feed-filters__field">
        <span>状态</span>
        <select :value="status" @change="handleStatusChange">
          <option value="">全部状态</option>
          <option value="active">active</option>
          <option value="hidden">hidden</option>
        </select>
      </label>

      <label class="admin-feed-filters__field">
        <span>自动精选</span>
        <select :value="editorPick" @change="handleEditorPickChange">
          <option value="">全部</option>
          <option value="true">仅自动精选</option>
          <option value="false">排除自动精选</option>
        </select>
      </label>

      <label class="admin-feed-filters__field">
        <span>人工精选</span>
        <select :value="featured" @change="handleFeaturedChange">
          <option value="">全部</option>
          <option value="true">仅人工精选</option>
          <option value="false">排除人工精选</option>
        </select>
      </label>

      <label class="admin-feed-filters__field">
        <span>重复组</span>
        <input :value="duplicateGroup" type="text" placeholder="输入主记录 ID" @input="handleDuplicateGroupInput" />
      </label>
    </section>

    <p v-if="errorMessage" class="admin-page__error">{{ errorMessage }}</p>

    <section v-if="selectedCount > 0" class="admin-feed-batch gm-section-card">
      <div>
        <strong>已选 {{ selectedCount }} 条</strong>
        <p>批量操作只影响当前选中的记录，不会改原文和重复关系。</p>
      </div>
      <div class="admin-feed-batch__actions">
        <button type="button" :disabled="saving" @click="runBatchAction('hide')">批量隐藏</button>
        <button type="button" :disabled="saving" @click="runBatchAction('restore')">批量恢复</button>
        <button type="button" :disabled="saving" @click="runBatchAction('feature')">设为人工精选</button>
        <button type="button" :disabled="saving" @click="runBatchAction('unfeature')">取消人工精选</button>
        <button type="button" class="admin-feed-batch__ghost" :disabled="saving" @click="clearSelection">清空选择</button>
      </div>
    </section>

    <section class="admin-feed-table gm-section-card">
      <div class="admin-feed-table__head">
        <strong>内容列表</strong>
        <span>{{ loading ? '加载中...' : `第 ${page} / ${totalPages} 页` }}</span>
      </div>

      <div class="admin-feed-table__scroll">
        <table>
          <thead>
            <tr>
              <th class="admin-feed-table__checkbox">
                <input :checked="allSelected" type="checkbox" @change="handleSelectAll" />
              </th>
              <th>ID</th>
              <th>内容</th>
              <th>来源</th>
              <th>状态</th>
              <th>精选</th>
              <th>时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in records" :key="item.id">
              <td class="admin-feed-table__checkbox">
                <input
                  :checked="selectedIds.includes(item.id)"
                  type="checkbox"
                  @change="handleRowSelection(item.id, $event)"
                />
              </td>
              <td>#{{ item.id }}</td>
              <td>
                <strong>{{ item.adminTitle || item.title }}</strong>
                <p class="admin-feed-table__meta">{{ item.adminCategory || item.category }} · 辣度 {{ item.adminSpicyIndex || item.spicyIndex }}</p>
              </td>
              <td>{{ item.source }}</td>
              <td>
                <span class="admin-feed-table__status" :data-status="item.status">{{ item.status }}</span>
              </td>
              <td>
                <span v-if="item.adminFeatured" class="admin-feed-table__flag admin-feed-table__flag--manual">人工</span>
                <span v-if="item.editorPick" class="admin-feed-table__flag admin-feed-table__flag--auto">自动</span>
              </td>
              <td>{{ formatDateTime(item.updatedAt) }}</td>
              <td>
                <button class="admin-feed-table__action" type="button" @click="handleOpenDetail(item.id)">编辑</button>
              </td>
            </tr>
            <tr v-if="!loading && records.length === 0">
              <td colspan="8" class="admin-feed-table__empty">没有符合条件的内容。</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="admin-feed-table__footer">
        <button class="admin-feed-table__pager" type="button" :disabled="page <= 1 || loading" @click="prevPage">上一页</button>
        <button class="admin-feed-table__pager" type="button" :disabled="page >= totalPages || loading" @click="nextPage">下一页</button>
      </footer>
    </section>

    <AdminFeedEditorDrawer
      :open="drawerOpen"
      :detail="detail"
      :loading="detailLoading"
      :saving="saving"
      :error-message="detailErrorMessage"
      @close="drawerOpen = false"
      @save="handleSave"
      @hide="hideFeed"
      @restore="restoreFeed"
    />
  </section>
</template>

<style scoped>
.admin-page {
  display: grid;
  gap: 18px;
}

.admin-page__header,
.admin-feed-table__head,
.admin-feed-table__footer,
.admin-feed-batch {
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

.admin-page__title,
.admin-feed-table__head strong {
  margin: 0;
}

.admin-feed-filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  padding: 18px;
  border-radius: var(--gm-radius-lg);
  background: var(--gm-surface-tinted);
}

.admin-feed-filters__field {
  display: grid;
  gap: 8px;
}

.admin-feed-filters__field span {
  color: var(--gm-ink);
}

.admin-feed-filters__field--keyword {
  grid-column: span 2;
}

.admin-feed-filters__field input,
.admin-feed-filters__field select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 14px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
}

.admin-feed-batch {
  padding: 16px 18px;
  border-radius: var(--gm-radius-lg);
  background: var(--gm-surface-tinted);
}

.admin-feed-batch p {
  margin: 6px 0 0;
  color: var(--gm-muted);
  font-size: 0.9rem;
}

.admin-feed-batch__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-feed-batch__actions button,
.admin-feed-table__action,
.admin-feed-table__pager {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 999px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
  cursor: pointer;
}

.admin-feed-batch__ghost {
  background: var(--gm-surface-soft);
}

.admin-feed-table {
  display: grid;
  gap: 16px;
  padding: 18px;
  border-radius: var(--gm-radius-lg);
  background: var(--gm-surface-tinted);
}

.admin-feed-table__scroll {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid var(--gm-line);
  text-align: left;
  vertical-align: top;
}

.admin-feed-table__checkbox {
  width: 42px;
  text-align: center;
}

th {
  color: var(--gm-ink);
}

.admin-feed-table__meta,
.admin-page__stat {
  margin: 6px 0 0;
  color: var(--gm-muted);
  font-size: 0.88rem;
}

.admin-feed-table__status,
.admin-feed-table__flag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.admin-feed-table__status[data-status='active'] {
  background: var(--gm-pill-source-bg);
  color: var(--gm-pill-source-text);
}

.admin-feed-table__status[data-status='hidden'] {
  background: rgba(255, 132, 89, 0.14);
  color: #ff9b73;
}

.admin-feed-table__flag--manual {
  background: var(--gm-pill-category-bg);
  color: var(--gm-pill-category-text);
}

.admin-feed-table__flag--auto {
  margin-left: 6px;
  background: var(--gm-pill-pick-bg);
  color: var(--gm-pill-pick-text);
}

.admin-feed-table__empty,
.admin-page__error {
  color: #ff9b73;
}

@media (max-width: 1160px) {
  .admin-feed-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-feed-filters__field--keyword {
    grid-column: span 2;
  }

  .admin-feed-batch {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 720px) {
  .admin-feed-filters {
    grid-template-columns: 1fr;
  }

  .admin-feed-filters__field--keyword {
    grid-column: auto;
  }
}
</style>
