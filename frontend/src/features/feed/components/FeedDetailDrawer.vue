<script setup lang="ts">
import { computed } from 'vue'
import type { FeedDetailRecord, RelatedSourceRecord } from '@/features/feed/types'

const props = defineProps<{
  open: boolean
  detail: FeedDetailRecord | null
  loading: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  close: []
  openDetail: [id: number]
}>()

const tags = computed(() => props.detail?.tags ?? [])
const relatedSources = computed(() => props.detail?.relatedSources ?? [])
const rawPublishTimeLabel = computed(() => formatDateTime(props.detail?.rawPublishTime))
const updatedAtLabel = computed(() => formatDateTime(props.detail?.updatedAt))

function formatDateTime(value?: string) {
  return value ? value.replace('T', ' ') : ''
}

function getRelatedTimeLabel(item: RelatedSourceRecord) {
  return formatDateTime(item.rawPublishTime || item.createdAt)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div v-if="props.open" class="feed-drawer">
        <button class="feed-drawer__backdrop" type="button" aria-label="关闭详情抽屉" @click="emit('close')" />

        <Transition name="drawer-panel">
          <aside v-if="props.open" class="feed-drawer__panel gm-noise">
            <header class="feed-drawer__header">
              <div>
                <p class="feed-drawer__eyebrow gm-mono">FULL BRIEF</p>
                <h2 class="feed-drawer__title">详情拆解</h2>
              </div>
              <button class="feed-drawer__close" type="button" @click="emit('close')">收起</button>
            </header>

            <div v-if="props.loading" class="feed-drawer__state">
              正在加载完整内容...
            </div>

            <div v-else-if="props.errorMessage" class="feed-drawer__state feed-drawer__state--error">
              {{ props.errorMessage }}
            </div>

            <article v-else-if="props.detail" class="feed-drawer__content">
              <div class="feed-drawer__pill-row">
                <span class="feed-drawer__pill feed-drawer__pill--source gm-mono">{{ props.detail.source }}</span>
                <span class="feed-drawer__pill feed-drawer__pill--category">{{ props.detail.category }}</span>
                <span class="feed-drawer__pill">{{ props.detail.verdict }}</span>
              </div>

              <h3 class="feed-drawer__headline">{{ props.detail.title }}</h3>
              <p class="feed-drawer__highlight">{{ props.detail.highlight }}</p>

              <dl class="feed-drawer__meta">
                <div class="feed-drawer__meta-item">
                  <dt class="gm-mono">作者</dt>
                  <dd>{{ props.detail.authorName || '匿名' }}</dd>
                </div>
                <div class="feed-drawer__meta-item">
                  <dt class="gm-mono">发布时间</dt>
                  <dd>{{ rawPublishTimeLabel }}</dd>
                </div>
                <div class="feed-drawer__meta-item">
                  <dt class="gm-mono">最近更新</dt>
                  <dd>{{ updatedAtLabel }}</dd>
                </div>
                <div class="feed-drawer__meta-item">
                  <dt class="gm-mono">辣度</dt>
                  <dd>🔥 {{ props.detail.spicyIndex }}</dd>
                </div>
              </dl>

              <section class="feed-drawer__block">
                <h4 class="feed-drawer__block-title">AI 摘要</h4>
                <p class="feed-drawer__summary">{{ props.detail.summary }}</p>
              </section>

              <section class="feed-drawer__block">
                <h4 class="feed-drawer__block-title">原始正文</h4>
                <p class="feed-drawer__raw">{{ props.detail.rawContent }}</p>
              </section>

              <section class="feed-drawer__block">
                <h4 class="feed-drawer__block-title">标签与模型</h4>
                <div class="feed-drawer__tag-list">
                  <span v-for="item in tags" :key="item" class="feed-drawer__tag">
                    {{ item }}
                  </span>
                </div>
                <p class="feed-drawer__model gm-mono">
                  {{ props.detail.aiModel }} / {{ props.detail.aiPromptVersion }}
                </p>
              </section>

              <section class="feed-drawer__block">
                <div class="feed-drawer__block-head">
                  <h4 class="feed-drawer__block-title">同事件其他来源</h4>
                  <span class="feed-drawer__count">{{ relatedSources.length }} 条</span>
                </div>

                <div v-if="relatedSources.length" class="feed-drawer__related-list">
                  <article
                    v-for="item in relatedSources"
                    :key="item.id"
                    class="feed-drawer__related-card"
                  >
                    <div class="feed-drawer__related-pills">
                      <span class="feed-drawer__pill feed-drawer__pill--source gm-mono">{{ item.source }}</span>
                      <span v-if="item.primarySource" class="feed-drawer__pill feed-drawer__pill--primary">
                        主记录
                      </span>
                      <span class="feed-drawer__pill">🔥 {{ item.spicyIndex }}</span>
                    </div>

                    <h5 class="feed-drawer__related-title">{{ item.title }}</h5>
                    <p class="feed-drawer__related-meta">
                      {{ item.authorName || '匿名' }} / {{ getRelatedTimeLabel(item) }}
                    </p>

                    <div class="feed-drawer__related-actions">
                      <button
                        class="feed-drawer__related-button"
                        type="button"
                        @click="emit('openDetail', item.id)"
                      >
                        查看这条
                      </button>
                      <a
                        class="feed-drawer__related-link"
                        :href="item.sourceUrl"
                        target="_blank"
                        rel="noreferrer"
                      >
                        打开原文
                      </a>
                    </div>
                  </article>
                </div>

                <p v-else class="feed-drawer__empty">
                  目前只有这一条来源，后续抓到同事件内容后会显示在这里。
                </p>
              </section>

              <a class="feed-drawer__link" :href="props.detail.sourceUrl" target="_blank" rel="noreferrer">
                前往原文
              </a>
            </article>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.feed-drawer {
  position: fixed;
  inset: 0;
  z-index: 1200;
}

.feed-drawer__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(19, 21, 14, 0.42);
  backdrop-filter: blur(6px);
}

.feed-drawer__panel {
  position: absolute;
  top: 0;
  right: 0;
  width: min(680px, 100%);
  height: 100%;
  padding: 26px 22px 30px;
  overflow-y: auto;
  border-left: 1px solid var(--gm-line);
  background:
    linear-gradient(180deg, rgba(255, 251, 244, 0.98), rgba(245, 238, 229, 0.95)),
    radial-gradient(circle at top right, rgba(126, 203, 105, 0.22), transparent 22%);
  box-shadow: -24px 0 64px rgba(25, 27, 22, 0.18);
}

:global(:root[data-theme='dark']) .feed-drawer__panel {
  background:
    linear-gradient(180deg, rgba(18, 25, 20, 0.98), rgba(20, 28, 23, 0.96)),
    radial-gradient(circle at top right, rgba(126, 203, 105, 0.16), transparent 22%);
  box-shadow: -24px 0 64px rgba(0, 0, 0, 0.42);
}

.feed-drawer__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: start;
}

.feed-drawer__eyebrow {
  margin: 0;
  color: var(--gm-melon-deep);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
}

.feed-drawer__title {
  margin: 8px 0 0;
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 2.1rem;
}

.feed-drawer__close {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid var(--gm-line-strong);
  border-radius: 999px;
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
  cursor: pointer;
}

.feed-drawer__state {
  margin-top: 18px;
  padding: 18px;
  border-radius: 18px;
  background: var(--gm-surface-soft);
  color: var(--gm-muted);
}

.feed-drawer__state--error {
  color: #8b2d25;
  background: rgba(255, 132, 89, 0.14);
}

.feed-drawer__content {
  display: grid;
  gap: 18px;
  margin-top: 18px;
}

.feed-drawer__pill-row,
.feed-drawer__tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feed-drawer__pill,
.feed-drawer__tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--gm-surface-muted);
  font-size: 0.82rem;
}

.feed-drawer__pill--source {
  background: var(--gm-pill-source-bg);
  color: var(--gm-pill-source-text);
}

.feed-drawer__pill--category {
  background: var(--gm-pill-category-bg);
  color: var(--gm-pill-category-text);
}

.feed-drawer__pill--primary {
  background: var(--gm-pill-pick-bg);
  color: var(--gm-pill-pick-text);
}

.feed-drawer__headline {
  margin: 0;
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 2rem;
  line-height: 1.26;
}

.feed-drawer__highlight {
  margin: 0;
  padding: 16px 18px;
  border-left: 4px solid var(--gm-pulp);
  border-radius: 0 16px 16px 0;
  background: var(--gm-surface-highlight);
  color: var(--gm-accent-ink);
  line-height: 1.8;
}

.feed-drawer__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 0;
}

.feed-drawer__meta-item {
  padding: 14px;
  border: 1px solid var(--gm-line);
  border-radius: 18px;
  background: var(--gm-surface-soft);
}

.feed-drawer__meta-item dt {
  color: var(--gm-muted);
  font-size: 0.74rem;
  letter-spacing: 0.12em;
}

.feed-drawer__meta-item dd {
  margin: 8px 0 0;
}

.feed-drawer__block {
  display: grid;
  gap: 10px;
}

.feed-drawer__block-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.feed-drawer__block-title {
  margin: 0;
  font-size: 1rem;
}

.feed-drawer__count {
  color: var(--gm-muted);
  font-size: 0.82rem;
}

.feed-drawer__summary,
.feed-drawer__raw {
  margin: 0;
  color: var(--gm-muted);
  line-height: 1.9;
  white-space: pre-line;
}

.feed-drawer__raw {
  padding: 16px;
  border-radius: 18px;
  background: var(--gm-surface-muted);
  color: var(--gm-ink);
}

.feed-drawer__model {
  margin: 4px 0 0;
  color: var(--gm-muted);
  font-size: 0.8rem;
}

.feed-drawer__related-list {
  display: grid;
  gap: 12px;
}

.feed-drawer__related-card {
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid rgba(30, 38, 26, 0.1);
  border-radius: 20px;
  background: var(--gm-surface-tinted);
}

.feed-drawer__related-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feed-drawer__related-title {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
}

.feed-drawer__related-meta,
.feed-drawer__empty {
  margin: 0;
  color: var(--gm-muted);
  line-height: 1.7;
}

.feed-drawer__related-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feed-drawer__related-button,
.feed-drawer__related-link {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 0.88rem;
}

.feed-drawer__related-button {
  border: 1px solid var(--gm-line-strong);
  background: var(--gm-surface-strong);
  color: var(--gm-ink);
  cursor: pointer;
}

.feed-drawer__related-link {
  background: var(--gm-surface-muted);
  color: var(--gm-ink);
}

.feed-drawer__link {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--gm-melon), var(--gm-pulp));
  color: #16210f;
  font-weight: 700;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.22s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-panel-enter-active,
.drawer-panel-leave-active {
  transition: transform 0.26s ease, opacity 0.26s ease;
}

.drawer-panel-enter-from,
.drawer-panel-leave-to {
  transform: translateX(34px);
  opacity: 0;
}

@media (max-width: 720px) {
  .feed-drawer__panel {
    width: 100%;
    padding: 20px 16px 26px;
  }

  .feed-drawer__meta {
    grid-template-columns: 1fr;
  }
}
</style>
