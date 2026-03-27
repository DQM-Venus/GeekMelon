import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboardView from '@/features/admin/views/AdminDashboardView.vue'
import AdminFeedsView from '@/features/admin/views/AdminFeedsView.vue'
import AdminLoginView from '@/features/admin/views/AdminLoginView.vue'
import AdminSourcesView from '@/features/admin/views/AdminSourcesView.vue'
import AdminShellLayout from '@/features/admin/views/AdminShellLayout.vue'
import FeedHomeView from '@/features/feed/views/FeedHomeView.vue'
import { useAdminSession } from '@/features/admin/composables/useAdminSession'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'feed-home',
      component: FeedHomeView,
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
    },
    {
      path: '/admin',
      component: AdminShellLayout,
      meta: { requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboardView,
        },
        {
          path: 'feeds',
          name: 'admin-feeds',
          component: AdminFeedsView,
        },
        {
          path: 'sources',
          name: 'admin-sources',
          component: AdminSourcesView,
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const adminSession = useAdminSession()
  const needsAdminCheck = Boolean(to.meta.requiresAdmin) || to.name === 'admin-login'
  const user = needsAdminCheck ? await adminSession.refreshSession() : null

  if (to.meta.requiresAdmin && !user) {
    return {
      name: 'admin-login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.name === 'admin-login' && user) {
    return { name: 'admin-dashboard' }
  }

  return true
})

export default router
