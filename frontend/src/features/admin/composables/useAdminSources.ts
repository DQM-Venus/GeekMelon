import { readonly, shallowRef } from 'vue'
import { adminFetch } from '@/features/admin/composables/adminApi'
import type { AdminSourceRecord, AdminTaskRunRecord } from '@/features/feed/types'

export function useAdminSources() {
  const sources = shallowRef<AdminSourceRecord[]>([])
  const runs = shallowRef<AdminTaskRunRecord[]>([])
  const loading = shallowRef(false)
  const saving = shallowRef(false)
  const errorMessage = shallowRef('')

  async function fetchSources() {
    loading.value = true
    errorMessage.value = ''
    try {
      const [sourceRecords, runRecords] = await Promise.all([
        adminFetch<AdminSourceRecord[]>('/admin/sources'),
        adminFetch<AdminTaskRunRecord[]>('/admin/tasks/runs'),
      ])
      sources.value = sourceRecords
      runs.value = runRecords
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '加载来源配置失败'
      sources.value = []
      runs.value = []
    } finally {
      loading.value = false
    }
  }

  async function saveSource(sourceKey: string, payload: Partial<Pick<AdminSourceRecord, 'enabled' | 'maxItems' | 'runOrder'>>) {
    saving.value = true
    errorMessage.value = ''
    try {
      const updated = await adminFetch<AdminSourceRecord>(`/admin/sources/${sourceKey}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      sources.value = sources.value.map((item) => (item.sourceKey === sourceKey ? updated : item))
      return updated
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '保存来源配置失败'
      throw error
    } finally {
      saving.value = false
    }
  }

  async function runCollect(sourceKey: string) {
    saving.value = true
    errorMessage.value = ''
    try {
      const log = await adminFetch<AdminTaskRunRecord>('/admin/tasks/collect', {
        method: 'POST',
        body: JSON.stringify({ sourceKey }),
      })
      runs.value = [log, ...runs.value.filter((item) => item.id !== log.id)].slice(0, 20)
      return log
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '手动抓取失败'
      throw error
    } finally {
      saving.value = false
    }
  }

  return {
    sources: readonly(sources),
    runs: readonly(runs),
    loading: readonly(loading),
    saving: readonly(saving),
    errorMessage: readonly(errorMessage),
    fetchSources,
    saveSource,
    runCollect,
  }
}
