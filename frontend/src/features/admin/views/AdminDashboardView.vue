<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AdminMetricCard from '@/features/admin/components/AdminMetricCard.vue'
import AdminTaskRunList from '@/features/admin/components/AdminTaskRunList.vue'
import { useAdminDashboard } from '@/features/admin/composables/useAdminDashboard'

const { dashboard, loading, errorMessage, fetchDashboard } = useAdminDashboard()

const systemCards = computed(() => {
  if (!dashboard.value) {
    return []
  }
  return [
    {
      label: '首页精选引擎',
      value: dashboard.value.editorialEnabled ? '已开启' : '已关闭',
      hint: dashboard.value.editorialModel,
      accent: dashboard.value.editorialEnabled ? 'melon' : 'ink',
    },
    {
      label: 'DeepSeek Key',
      value: dashboard.value.deepseekConfigured ? '已配置' : '未配置',
      hint: '这里只展示配置状态，不在后台编辑',
      accent: dashboard.value.deepseekConfigured ? 'gold' : 'pulp',
    },
    {
      label: 'Crawler 工作目录',
      value: dashboard.value.crawlerWorkingDirectory,
      hint: dashboard.value.crawlerPythonCommand,
      accent: 'ink',
    },
  ]
})

onMounted(fetchDashboard)
</script>

<template>
  <section class="admin-page">
    <header class="admin-page__header">
      <div>
        <p class="admin-page__eyebrow">运行概览</p>
        <h2 class="admin-page__title">后台总览</h2>
      </div>
      <button class="admin-page__refresh" type="button" :disabled="loading" @click="fetchDashboard">
        {{ loading ? '刷新中...' : '刷新概览' }}
      </button>
    </header>

    <p v-if="errorMessage" class="admin-page__error">{{ errorMessage }}</p>

    <section v-if="dashboard" class="admin-dashboard__metrics">
      <AdminMetricCard label="今日新增内容" :value="dashboard.todayNewCount" accent="melon" hint="当天新入库的内容数" />
      <AdminMetricCard label="当前隐藏内容" :value="dashboard.hiddenCount" accent="pulp" hint="已被后台回收的内容" />
      <AdminMetricCard label="人工精选内容" :value="dashboard.featuredCount" accent="gold" hint="会优先出现在首页前排" />
      <AdminMetricCard label="启用中的来源" :value="dashboard.activeSourceCount" accent="ink" hint="后台可手动抓取的来源数" />
    </section>

    <section v-if="dashboard" class="admin-dashboard__grid">
      <div class="admin-dashboard__system">
        <AdminMetricCard
          v-for="card in systemCards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
          :hint="card.hint"
          :accent="card.accent as 'melon' | 'gold' | 'pulp' | 'ink'"
        />
      </div>

      <AdminTaskRunList :runs="dashboard.recentRuns" />
    </section>
  </section>
</template>

<style scoped>
.admin-page {
  display: grid;
  gap: 18px;
}

.admin-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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
  font-size: 1.8rem;
}

.admin-page__refresh {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 999px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
  cursor: pointer;
}

.admin-page__error {
  margin: 0;
  color: #ff9b73;
}

.admin-dashboard__metrics,
.admin-dashboard__system,
.admin-dashboard__grid {
  display: grid;
  gap: 16px;
}

.admin-dashboard__metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.admin-dashboard__grid {
  grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
}

@media (max-width: 1160px) {
  .admin-dashboard__metrics,
  .admin-dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
