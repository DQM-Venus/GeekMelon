<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { AdminFeedDetailRecord, AdminFeedUpdatePayload } from '@/features/feed/types'

const props = defineProps<{
  open: boolean
  detail: AdminFeedDetailRecord | null
  loading: boolean
  saving: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  close: []
  save: [payload: AdminFeedUpdatePayload]
  hide: [id: number]
  restore: [id: number]
}>()

const formState = reactive({
  adminTitle: '',
  adminHighlight: '',
  adminSummary: '',
  adminCategory: '',
  adminSpicyIndex: 0,
  adminFeatured: false,
  adminFeaturedRank: 1,
  adminNote: '',
})

const isHidden = computed(() => props.detail?.status === 'hidden')

watch(
  () => props.detail,
  (detail) => {
    formState.adminTitle = detail?.adminTitle ?? ''
    formState.adminHighlight = detail?.adminHighlight ?? ''
    formState.adminSummary = detail?.adminSummary ?? ''
    formState.adminCategory = detail?.adminCategory ?? ''
    formState.adminSpicyIndex = detail?.adminSpicyIndex ?? 0
    formState.adminFeatured = Boolean(detail?.adminFeatured)
    formState.adminFeaturedRank = detail?.adminFeaturedRank ?? 1
    formState.adminNote = detail?.adminNote ?? ''
  },
  { immediate: true },
)

function handleSave() {
  emit('save', {
    adminTitle: formState.adminTitle,
    adminHighlight: formState.adminHighlight,
    adminSummary: formState.adminSummary,
    adminCategory: formState.adminCategory,
    adminSpicyIndex: formState.adminSpicyIndex > 0 ? formState.adminSpicyIndex : undefined,
    adminFeatured: formState.adminFeatured,
    adminFeaturedRank: formState.adminFeatured ? formState.adminFeaturedRank : undefined,
    adminNote: formState.adminNote,
  })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="admin-drawer">
      <aside v-if="props.open" class="admin-feed-drawer">
        <div class="admin-feed-drawer__backdrop" @click="emit('close')" />

        <section class="admin-feed-drawer__panel gm-section-card">
          <header class="admin-feed-drawer__header">
            <div>
              <p class="admin-feed-drawer__eyebrow">内容运营</p>
              <h3 class="admin-feed-drawer__title">{{ props.detail?.title || '加载中' }}</h3>
            </div>
            <button class="admin-feed-drawer__close" type="button" @click="emit('close')">关闭</button>
          </header>

          <div v-if="props.loading" class="admin-feed-drawer__state">正在加载内容详情...</div>
          <div v-else-if="props.errorMessage" class="admin-feed-drawer__state admin-feed-drawer__state--error">
            {{ props.errorMessage }}
          </div>
          <div v-else-if="props.detail" class="admin-feed-drawer__content">
            <section class="admin-feed-drawer__section">
              <h4 class="admin-feed-drawer__section-title">运营覆盖</h4>
              <label class="admin-feed-drawer__field">
                <span>运营标题</span>
                <input v-model="formState.adminTitle" type="text" placeholder="留空则回退原始标题" />
              </label>
              <label class="admin-feed-drawer__field">
                <span>运营爆点</span>
                <textarea v-model="formState.adminHighlight" rows="3" placeholder="留空则回退原始爆点" />
              </label>
              <label class="admin-feed-drawer__field">
                <span>运营摘要</span>
                <textarea v-model="formState.adminSummary" rows="4" placeholder="留空则回退原始摘要" />
              </label>
              <div class="admin-feed-drawer__grid">
                <label class="admin-feed-drawer__field">
                  <span>运营分类</span>
                  <input v-model="formState.adminCategory" type="text" placeholder="例如：争议舆情" />
                </label>
                <label class="admin-feed-drawer__field">
                  <span>运营辣度</span>
                  <input v-model.number="formState.adminSpicyIndex" type="number" min="0" max="10" />
                </label>
              </div>
              <div class="admin-feed-drawer__grid">
                <label class="admin-feed-drawer__checkbox">
                  <input v-model="formState.adminFeatured" type="checkbox" />
                  <span>加入人工精选</span>
                </label>
                <label class="admin-feed-drawer__field">
                  <span>精选排序</span>
                  <input v-model.number="formState.adminFeaturedRank" type="number" min="1" max="999" :disabled="!formState.adminFeatured" />
                </label>
              </div>
              <label class="admin-feed-drawer__field">
                <span>运营备注</span>
                <textarea v-model="formState.adminNote" rows="3" placeholder="记录为什么保留、为什么隐藏" />
              </label>
            </section>

            <section class="admin-feed-drawer__section">
              <h4 class="admin-feed-drawer__section-title">AI 结果与元数据</h4>
              <dl class="admin-feed-drawer__meta-grid">
                <div>
                  <dt>来源</dt>
                  <dd>{{ props.detail.source }}</dd>
                </div>
                <div>
                  <dt>状态</dt>
                  <dd>{{ props.detail.status }}</dd>
                </div>
                <div>
                  <dt>自动精选</dt>
                  <dd>{{ props.detail.editorPick ? '是' : '否' }}</dd>
                </div>
                <div>
                  <dt>重复归并</dt>
                  <dd>{{ props.detail.duplicateOfId ?? '-' }}</dd>
                </div>
                <div>
                  <dt>AI 模型</dt>
                  <dd>{{ props.detail.aiModel || '-' }}</dd>
                </div>
                <div>
                  <dt>Prompt 版本</dt>
                  <dd>{{ props.detail.aiPromptVersion || '-' }}</dd>
                </div>
              </dl>
              <div class="admin-feed-drawer__block">
                <strong>原始摘要</strong>
                <p>{{ props.detail.summary }}</p>
              </div>
              <div class="admin-feed-drawer__block">
                <strong>原始爆点</strong>
                <p>{{ props.detail.highlight }}</p>
              </div>
            </section>

            <section class="admin-feed-drawer__section">
              <h4 class="admin-feed-drawer__section-title">原始正文</h4>
              <p class="admin-feed-drawer__raw">{{ props.detail.rawContent }}</p>
              <a class="admin-feed-drawer__link" :href="props.detail.sourceUrl" target="_blank" rel="noreferrer">打开原文</a>
            </section>
          </div>

          <footer class="admin-feed-drawer__footer">
            <button class="admin-feed-drawer__action" type="button" :disabled="props.saving || !props.detail" @click="handleSave">
              {{ props.saving ? '保存中...' : '保存运营修改' }}
            </button>
            <button
              v-if="props.detail"
              class="admin-feed-drawer__action admin-feed-drawer__action--ghost"
              type="button"
              :disabled="props.saving"
              @click="isHidden ? emit('restore', props.detail.id) : emit('hide', props.detail.id)"
            >
              {{ isHidden ? '恢复内容' : '隐藏内容' }}
            </button>
          </footer>
        </section>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.admin-feed-drawer {
  position: fixed;
  inset: 0;
  z-index: 30;
}

.admin-feed-drawer__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(31, 35, 24, 0.4);
  backdrop-filter: blur(6px);
}

.admin-feed-drawer__panel {
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: min(780px, 100%);
  height: 100%;
  padding: 24px;
  border-radius: 28px 0 0 28px;
  background: var(--gm-surface-hero);
}

.admin-feed-drawer__header,
.admin-feed-drawer__footer,
.admin-feed-drawer__grid {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  justify-content: space-between;
}

.admin-feed-drawer__content {
  overflow: auto;
  display: grid;
  gap: 20px;
  padding-right: 8px;
}

.admin-feed-drawer__eyebrow {
  margin: 0 0 8px;
  color: var(--gm-muted);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-feed-drawer__title,
.admin-feed-drawer__section-title {
  margin: 0;
}

.admin-feed-drawer__section {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-radius-lg);
  background: var(--gm-surface-soft);
}

.admin-feed-drawer__field {
  display: grid;
  gap: 8px;
  flex: 1;
}

.admin-feed-drawer__field span {
  color: var(--gm-ink);
}

.admin-feed-drawer__field input,
.admin-feed-drawer__field textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 14px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
}

.admin-feed-drawer__checkbox {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  min-height: 48px;
}

.admin-feed-drawer__meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
  margin: 0;
}

.admin-feed-drawer__meta-grid dt {
  color: var(--gm-muted);
  font-size: 0.84rem;
}

.admin-feed-drawer__meta-grid dd,
.admin-feed-drawer__block p,
.admin-feed-drawer__raw {
  margin: 6px 0 0;
  line-height: 1.7;
  white-space: pre-wrap;
}

.admin-feed-drawer__link {
  color: var(--gm-melon-deep);
}

.admin-feed-drawer__close,
.admin-feed-drawer__action {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 999px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
  cursor: pointer;
}

.admin-feed-drawer__action {
  background: linear-gradient(135deg, var(--gm-melon), #a7d88d);
  color: #16210f;
}

.admin-feed-drawer__action--ghost {
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
}

.admin-feed-drawer__state {
  display: grid;
  place-items: center;
  color: var(--gm-muted);
}

.admin-feed-drawer__state--error {
  color: #ff9b73;
}

.admin-drawer-enter-active,
.admin-drawer-leave-active {
  transition: opacity 0.22s ease;
}

.admin-drawer-enter-active .admin-feed-drawer__panel,
.admin-drawer-leave-active .admin-feed-drawer__panel {
  transition: transform 0.22s ease;
}

.admin-drawer-enter-from,
.admin-drawer-leave-to {
  opacity: 0;
}

.admin-drawer-enter-from .admin-feed-drawer__panel,
.admin-drawer-leave-to .admin-feed-drawer__panel {
  transform: translateX(22px);
}

@media (max-width: 900px) {
  .admin-feed-drawer__panel {
    width: 100%;
    border-radius: 0;
  }

  .admin-feed-drawer__meta-grid,
  .admin-feed-drawer__grid,
  .admin-feed-drawer__footer {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
