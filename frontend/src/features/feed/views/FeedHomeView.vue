<script setup lang="ts">
import FeedDetailDrawer from '@/features/feed/components/FeedDetailDrawer.vue'
import FeedHero from '@/features/feed/components/FeedHero.vue'
import FeedList from '@/features/feed/components/FeedList.vue'
import FeedToolbar from '@/features/feed/components/FeedToolbar.vue'
import { useFeedDetail } from '@/features/feed/composables/useFeedDetail'
import { useFeedQuery } from '@/features/feed/composables/useFeedQuery'
import { useThemePreference } from '@/composables/useThemePreference'

const {
  records,
  page,
  totalPages,
  loading,
  errorMessage,
  sort,
  effectiveDateLabel,
  effectiveDate,
  emptyFallback,
  updateFilters,
  nextPage,
  prevPage,
} = useFeedQuery()

const { currentTheme, setTheme } = useThemePreference()

const {
  detail,
  loading: detailLoading,
  errorMessage: detailErrorMessage,
  open: detailOpen,
  openDetail,
  closeDetail,
} = useFeedDetail()
</script>

<template>
  <main class="feed-home gm-page-shell">
    <FeedHero
      :date-label="effectiveDateLabel"
      :empty-fallback="emptyFallback"
      :effective-date="effectiveDate"
    />

    <FeedToolbar
      :sort="sort"
      :theme="currentTheme"
      @update-sort="updateFilters({ sort: $event })"
      @update-theme="setTheme"
    />

    <FeedList
      :records="records"
      :loading="loading"
      :error-message="errorMessage"
      :page="page"
      :total-pages="totalPages"
      :effective-date="effectiveDate"
      :empty-fallback="emptyFallback"
      @prev="prevPage"
      @next="nextPage"
      @open-detail="openDetail"
    />

    <FeedDetailDrawer
      :open="detailOpen"
      :detail="detail"
      :loading="detailLoading"
      :error-message="detailErrorMessage"
      @close="closeDetail"
      @open-detail="openDetail"
    />
  </main>
</template>

<style scoped>
.feed-home {
  padding-bottom: 40px;
}
</style>
