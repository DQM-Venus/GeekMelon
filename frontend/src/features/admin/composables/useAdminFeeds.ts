import { readonly, shallowRef, watch } from 'vue'
import { adminFetch } from '@/features/admin/composables/adminApi'
import type {
  AdminFeedDetailRecord,
  AdminFeedPageResult,
  AdminFeedQueryParams,
  AdminFeedUpdatePayload,
} from '@/features/feed/types'

export function useAdminFeeds() {
  const records = shallowRef<AdminFeedPageResult['records']>([])
  const total = shallowRef(0)
  const page = shallowRef(1)
  const pageSize = shallowRef(20)
  const totalPages = shallowRef(1)
  const loading = shallowRef(false)
  const saving = shallowRef(false)
  const errorMessage = shallowRef('')
  const detail = shallowRef<AdminFeedDetailRecord | null>(null)
  const detailLoading = shallowRef(false)
  const detailErrorMessage = shallowRef('')
  const keyword = shallowRef('')
  const source = shallowRef('')
  const category = shallowRef('')
  const status = shallowRef('')
  const editorPick = shallowRef('')
  const featured = shallowRef('')
  const duplicateGroup = shallowRef('')

  async function fetchFeeds() {
    loading.value = true
    errorMessage.value = ''

    const params = new URLSearchParams()
    params.set('page', String(page.value))
    params.set('page_size', String(pageSize.value))
    if (keyword.value) {
      params.set('keyword', keyword.value)
    }
    if (source.value) {
      params.set('source', source.value)
    }
    if (category.value) {
      params.set('category', category.value)
    }
    if (status.value) {
      params.set('status', status.value)
    }
    if (editorPick.value) {
      params.set('editor_pick', editorPick.value)
    }
    if (featured.value) {
      params.set('featured', featured.value)
    }
    if (duplicateGroup.value) {
      params.set('duplicate_group', duplicateGroup.value)
    }

    try {
      const result = await adminFetch<AdminFeedPageResult>(`/admin/feeds?${params.toString()}`)
      records.value = result.records
      total.value = result.total
      totalPages.value = result.totalPages || 1
    } catch (error) {
      records.value = []
      total.value = 0
      totalPages.value = 1
      errorMessage.value = error instanceof Error ? error.message : '加载内容列表失败'
    } finally {
      loading.value = false
    }
  }

  async function openDetail(id: number) {
    detailLoading.value = true
    detailErrorMessage.value = ''
    try {
      detail.value = await adminFetch<AdminFeedDetailRecord>(`/admin/feeds/${id}`)
    } catch (error) {
      detail.value = null
      detailErrorMessage.value = error instanceof Error ? error.message : '加载内容详情失败'
    } finally {
      detailLoading.value = false
    }
  }

  async function saveDetail(id: number, payload: AdminFeedUpdatePayload) {
    saving.value = true
    try {
      detail.value = await adminFetch<AdminFeedDetailRecord>(`/admin/feeds/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      await fetchFeeds()
      return detail.value
    } finally {
      saving.value = false
    }
  }

  async function hideFeed(id: number) {
    saving.value = true
    try {
      detail.value = await adminFetch<AdminFeedDetailRecord>(`/admin/feeds/${id}/hide`, {
        method: 'POST',
      })
      await fetchFeeds()
    } finally {
      saving.value = false
    }
  }

  async function restoreFeed(id: number) {
    saving.value = true
    try {
      detail.value = await adminFetch<AdminFeedDetailRecord>(`/admin/feeds/${id}/restore`, {
        method: 'POST',
      })
      await fetchFeeds()
    } finally {
      saving.value = false
    }
  }

  function updateFilters(next: Partial<AdminFeedQueryParams>) {
    if (typeof next.keyword === 'string') {
      keyword.value = next.keyword
    }
    if (typeof next.source === 'string') {
      source.value = next.source
    }
    if (typeof next.category === 'string') {
      category.value = next.category
    }
    if (typeof next.status === 'string') {
      status.value = next.status
    }
    if (typeof next.editorPick === 'string') {
      editorPick.value = next.editorPick
    }
    if (typeof next.featured === 'string') {
      featured.value = next.featured
    }
    if (typeof next.duplicateGroup === 'string') {
      duplicateGroup.value = next.duplicateGroup
    }
    page.value = 1
  }

  function nextPage() {
    if (page.value < totalPages.value) {
      page.value += 1
    }
  }

  function prevPage() {
    if (page.value > 1) {
      page.value -= 1
    }
  }

  watch([page, pageSize, keyword, source, category, status, editorPick, featured, duplicateGroup], fetchFeeds, {
    immediate: true,
  })

  return {
    records: readonly(records),
    total: readonly(total),
    page: readonly(page),
    pageSize: readonly(pageSize),
    totalPages: readonly(totalPages),
    loading: readonly(loading),
    saving: readonly(saving),
    errorMessage: readonly(errorMessage),
    detail: readonly(detail),
    detailLoading: readonly(detailLoading),
    detailErrorMessage: readonly(detailErrorMessage),
    keyword: readonly(keyword),
    source: readonly(source),
    category: readonly(category),
    status: readonly(status),
    editorPick: readonly(editorPick),
    featured: readonly(featured),
    duplicateGroup: readonly(duplicateGroup),
    fetchFeeds,
    openDetail,
    saveDetail,
    hideFeed,
    restoreFeed,
    updateFilters,
    nextPage,
    prevPage,
  }
}
