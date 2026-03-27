<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAdminSession } from '@/features/admin/composables/useAdminSession'

const route = useRoute()
const router = useRouter()
const { currentUser, logout, loading } = useAdminSession()

const navItems = [
  { label: '概览', to: '/admin/dashboard' },
  { label: '内容管理', to: '/admin/feeds' },
  { label: '来源与抓取', to: '/admin/sources' },
]

const activePath = computed(() => route.path)

async function handleLogout() {
  await logout()
  await router.replace('/admin/login')
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-shell__sidebar gm-section-card gm-noise">
      <div class="admin-shell__brand">
        <p class="admin-shell__eyebrow">Geek Melon</p>
        <h1 class="admin-shell__title">后台运营台</h1>
        <p class="admin-shell__subtitle">内容运营、抓取控制和运行概览都收在这里。</p>
      </div>

      <nav class="admin-shell__nav" aria-label="后台菜单">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="admin-shell__nav-link"
          :data-active="activePath.startsWith(item.to)"
        >
          <span class="admin-shell__nav-dot" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="admin-shell__footer">
        <div class="admin-shell__user">
          <span class="admin-shell__user-label">当前登录</span>
          <strong>{{ currentUser?.displayName || currentUser?.username }}</strong>
        </div>
        <button class="admin-shell__logout" type="button" :disabled="loading" @click="handleLogout">
          退出登录
        </button>
      </div>
    </aside>

    <main class="admin-shell__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
  width: min(100% - 24px, 1480px);
  margin: 18px auto;
}

.admin-shell__sidebar {
  position: sticky;
  top: 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-self: start;
  min-height: calc(100vh - 36px);
  padding: 22px;
  border-radius: 28px;
  background: var(--gm-surface-hero);
}

.admin-shell__brand {
  display: grid;
  gap: 8px;
}

.admin-shell__eyebrow {
  margin: 0;
  color: var(--gm-muted);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-shell__title {
  margin: 0;
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: clamp(2rem, 4vw, 2.6rem);
  line-height: 0.98;
}

.admin-shell__subtitle {
  margin: 0;
  color: var(--gm-muted);
  font-size: 0.96rem;
  line-height: 1.65;
}

.admin-shell__nav {
  display: grid;
  gap: 10px;
  grid-auto-rows: max-content;
  align-content: start;
}

.admin-shell__nav-link,
.admin-shell__logout {
  min-height: 52px;
  padding: 0 16px;
  border: 1px solid var(--gm-line);
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.admin-shell__nav-link:hover,
.admin-shell__logout:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(44, 125, 70, 0.26);
  box-shadow: 0 10px 24px rgba(61, 52, 37, 0.08);
}

.admin-shell__nav-link[data-active='true'] {
  border-color: rgba(44, 125, 70, 0.35);
  background: linear-gradient(135deg, rgba(126, 203, 105, 0.2), rgba(255, 247, 224, 0.92));
  color: var(--gm-melon-deep);
  box-shadow: 0 14px 32px rgba(95, 139, 74, 0.14);
}

.admin-shell__nav-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(33, 44, 24, 0.2);
  flex: 0 0 auto;
}

.admin-shell__nav-link[data-active='true'] .admin-shell__nav-dot {
  background: var(--gm-melon-deep);
  box-shadow: 0 0 0 6px rgba(126, 203, 105, 0.16);
}

.admin-shell__footer {
  margin-top: auto;
  display: grid;
  gap: 12px;
  padding-top: 8px;
}

.admin-shell__user {
  display: grid;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid var(--gm-line);
  background: var(--gm-surface-soft);
}

.admin-shell__user-label {
  color: var(--gm-muted);
  font-size: 0.82rem;
}

.admin-shell__logout {
  justify-content: center;
  cursor: pointer;
}

.admin-shell__logout:disabled {
  cursor: wait;
  opacity: 0.7;
}

.admin-shell__main {
  min-width: 0;
}

:global(:root[data-theme='dark']) .admin-shell__nav-link[data-active='true'] {
  background: linear-gradient(135deg, rgba(126, 203, 105, 0.24), rgba(255, 132, 89, 0.16));
  color: var(--gm-ink);
}

@media (max-width: 980px) {
  .admin-shell {
    grid-template-columns: 1fr;
  }

  .admin-shell__sidebar {
    position: static;
    min-height: auto;
  }

  .admin-shell__footer {
    margin-top: 0;
  }
}

@media (max-width: 640px) {
  .admin-shell {
    width: min(100% - 14px, 1480px);
    margin: 12px auto;
  }

  .admin-shell__sidebar {
    padding: 18px;
    border-radius: 24px;
  }

  .admin-shell__title {
    font-size: 1.9rem;
  }
}
</style>
