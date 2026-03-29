import { computed, readonly, shallowRef, watch } from 'vue'
import type { ApiResponse, FeedPageResult, FeedRecord } from '@/features/feed/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

function formatDateLabel(dateValue: string | null | undefined, fallbackText: string) {
  if (!dateValue) {
    return fallbackText
  }

  const parsed = new Date(`${dateValue}T00:00:00+08:00`)
  if (Number.isNaN(parsed.getTime())) {
    return fallbackText
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(parsed)
}

function buildYesterdayLabel() {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(yesterday)
}

function compareByTimeDesc(left: FeedRecord, right: FeedRecord) {
  const leftTime = left.rawPublishTime || left.createdAt
  const rightTime = right.rawPublishTime || right.createdAt
  return new Date(rightTime).getTime() - new Date(leftTime).getTime()
}

function sortRecordsLocally(records: readonly FeedRecord[], sort: 'latest' | 'spicy') {
  if (sort === 'latest') {
    return [...records]
  }

  const featured = records.filter((item) => item.adminFeatured)
  const rest = records
    .filter((item) => !item.adminFeatured)
    .sort((left, right) => {
      const spicyDelta = (right.spicyIndex ?? 0) - (left.spicyIndex ?? 0)
      if (spicyDelta !== 0) {
        return spicyDelta
      }
      return compareByTimeDesc(left, right)
    })

  return [...featured, ...rest]
}

export function useFeedQuery() {
  const allRecords = shallowRef<FeedRecord[]>([])
  const page = shallowRef(1)
  const pageSize = shallowRef(10)
  const loading = shallowRef(false)
  const errorMessage = shallowRef('')
  const sort = shallowRef<'latest' | 'spicy'>('latest')
  const dateScope = shallowRef<'yesterday'>('yesterday')
  const effectiveDateScope = shallowRef<'yesterday' | 'fallback'>('yesterday')
  const effectiveDate = shallowRef<string | null>(null)
  const emptyFallback = shallowRef(false)

  const yesterdayLabel = computed(() => buildYesterdayLabel())
  const effectiveDateLabel = computed(() =>
    formatDateLabel(effectiveDate.value, yesterdayLabel.value),
  )

  const sortedRecords = computed(() => sortRecordsLocally(allRecords.value, sort.value))
  const total = computed(() => sortedRecords.value.length)
  const totalPages = computed(() => {
    if (total.value === 0) {
      return 1
    }
    return Math.ceil(total.value / pageSize.value)
  })
  const records = computed(() => {
    const fromIndex = (page.value - 1) * pageSize.value
    const toIndex = fromIndex + pageSize.value
    return sortedRecords.value.slice(fromIndex, toIndex)
  })
  const headlineRecords = computed(() => sortedRecords.value.slice(0, 5))

  async function fetchFeeds() {
    loading.value = true
    errorMessage.value = ''

    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('page_size', String(pageSize.value))
    params.set('sort', 'latest')
    params.set('date_scope', dateScope.value)
    params.set('fetch_all', 'true')

    try {
      const response = await fetch(`${API_BASE_URL}/feeds?${params.toString()}`)
      const payload = (await response.json()) as ApiResponse<FeedPageResult>
      if (!response.ok || payload.code !== 0) {
        throw new Error(payload.message || '列表加载失败')
      }

      allRecords.value = payload.data.records
      effectiveDateScope.value = payload.data.effectiveDateScope ?? 'yesterday'
      effectiveDate.value = payload.data.effectiveDate ?? null
      emptyFallback.value = Boolean(payload.data.emptyFallback)
      page.value = 1
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '列表加载失败'
      allRecords.value = []
      effectiveDateScope.value = 'yesterday'
      effectiveDate.value = null
      emptyFallback.value = false
      page.value = 1
    } finally {
      loading.value = false
    }
  }

  function updateFilters(next: Partial<{ sort: 'latest' | 'spicy' }>) {
    if (next.sort) {
      sort.value = next.sort
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

  watch(
    totalPages,
    (value) => {
      if (page.value > value) {
        page.value = value
      }
    },
    { immediate: true },
  )

  void fetchFeeds()

  return {
    records: readonly(records),
    headlineRecords: readonly(headlineRecords),
    total: readonly(total),
    page: readonly(page),
    pageSize: readonly(pageSize),
    totalPages: readonly(totalPages),
    loading: readonly(loading),
    errorMessage: readonly(errorMessage),
    sort: readonly(sort),
    dateScope: readonly(dateScope),
    yesterdayLabel,
    effectiveDateScope: readonly(effectiveDateScope),
    effectiveDate: readonly(effectiveDate),
    effectiveDateLabel,
    emptyFallback: readonly(emptyFallback),
    fetchFeeds,
    updateFilters,
    nextPage,
    prevPage,
  }
}
