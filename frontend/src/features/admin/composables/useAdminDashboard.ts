import { readonly, shallowRef } from 'vue'
import { adminFetch } from '@/features/admin/composables/adminApi'
import type { AdminDashboardRecord } from '@/features/feed/types'

export function useAdminDashboard() {
  const dashboard = shallowRef<AdminDashboardRecord | null>(null)
  const loading = shallowRef(false)
  const errorMessage = shallowRef('')

  async function fetchDashboard() {
    loading.value = true
    errorMessage.value = ''
    try {
      dashboard.value = await adminFetch<AdminDashboardRecord>('/admin/dashboard')
    } catch (error) {
      dashboard.value = null
      errorMessage.value = error instanceof Error ? error.message : '加载后台概览失败'
    } finally {
      loading.value = false
    }
  }

  return {
    dashboard: readonly(dashboard),
    loading: readonly(loading),
    errorMessage: readonly(errorMessage),
    fetchDashboard,
  }
}
