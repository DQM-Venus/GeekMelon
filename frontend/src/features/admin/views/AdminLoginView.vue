<script setup lang="ts">
import { shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminSession } from '@/features/admin/composables/useAdminSession'

const router = useRouter()
const route = useRoute()
const { login, loading } = useAdminSession()

const username = shallowRef('admin')
const password = shallowRef('geekmelon-admin')
const errorMessage = shallowRef('')

async function handleSubmit() {
  errorMessage.value = ''
  try {
    await login(username.value, password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin/dashboard'
    await router.replace(redirect)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败'
  }
}
</script>

<template>
  <main class="admin-login">
    <section class="admin-login__card gm-section-card">
      <div class="admin-login__hero">
        <p class="admin-login__eyebrow">Geek Melon</p>
        <h1 class="admin-login__title">后台管理入口</h1>
        <p class="admin-login__copy">在这里处理内容保留、人工精选、来源开关和手动抓取。</p>
      </div>

      <form class="admin-login__form" @submit.prevent="handleSubmit">
        <label class="admin-login__field">
          <span>管理员账号</span>
          <input v-model="username" type="text" autocomplete="username" />
        </label>

        <label class="admin-login__field">
          <span>管理员密码</span>
          <input v-model="password" type="password" autocomplete="current-password" />
        </label>

        <p v-if="errorMessage" class="admin-login__error">{{ errorMessage }}</p>

        <button class="admin-login__submit" type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '进入后台' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.admin-login {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
}

.admin-login__card {
  display: grid;
  gap: 28px;
  width: min(100%, 520px);
  padding: 32px;
  border-radius: 30px;
  background: var(--gm-surface-hero);
}

.admin-login__eyebrow {
  margin: 0 0 8px;
  color: var(--gm-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-login__title {
  margin: 0;
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: clamp(2rem, 6vw, 3rem);
}

.admin-login__copy,
.admin-login__error {
  margin: 10px 0 0;
  line-height: 1.7;
}

.admin-login__form {
  display: grid;
  gap: 16px;
}

.admin-login__field {
  display: grid;
  gap: 8px;
}

.admin-login__field span {
  color: var(--gm-ink);
}

.admin-login__field input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 16px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
}

.admin-login__submit {
  min-height: 50px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--gm-melon), #b8de88);
  color: #16210f;
  cursor: pointer;
}

.admin-login__error {
  color: #ff9b73;
}
</style>
