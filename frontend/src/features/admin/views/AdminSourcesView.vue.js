import { computed, onMounted, reactive, ref, watch } from 'vue';
import AdminTaskRunList from '@/features/admin/components/AdminTaskRunList.vue';
import { useAdminSources } from '@/features/admin/composables/useAdminSources';
const { sources, runs, loading, saving, errorMessage, fetchSources, saveSource, runCollect, previewSource } = useAdminSources();
const draftMap = reactive({});
const collectingSourceKey = ref('');
const previewingSourceKey = ref('');
const previewOpen = ref(false);
const previewResult = ref(null);
function ensureDraft(sourceKey, enabled, maxItems, runOrder) {
    if (!draftMap[sourceKey]) {
        draftMap[sourceKey] = { enabled, maxItems, runOrder };
    }
    return draftMap[sourceKey];
}
function findSource(sourceKey) {
    return sources.value.find((item) => item.sourceKey === sourceKey);
}
function hasUnsavedChanges(source) {
    const draft = draftMap[source.sourceKey];
    if (!draft) {
        return false;
    }
    return (draft.enabled !== source.enabled
        || draft.maxItems !== source.maxItems
        || draft.runOrder !== source.runOrder);
}
const previewKeepCount = computed(() => previewResult.value?.items.filter((item) => item.decision === 'keep').length ?? 0);
async function handleSave(sourceKey) {
    const draft = draftMap[sourceKey];
    if (!draft) {
        return;
    }
    await saveSource(sourceKey, draft);
}
async function handleCollect(sourceKey) {
    const source = findSource(sourceKey);
    const draft = draftMap[sourceKey];
    if (!source || !draft) {
        return;
    }
    collectingSourceKey.value = sourceKey;
    try {
        if (hasUnsavedChanges(source)) {
            await saveSource(sourceKey, draft);
        }
        await runCollect(sourceKey);
        await fetchSources();
    }
    finally {
        collectingSourceKey.value = '';
    }
}
async function handlePreview(sourceKey) {
    previewingSourceKey.value = sourceKey;
    previewOpen.value = true;
    previewResult.value = null;
    try {
        previewResult.value = await previewSource(sourceKey);
    }
    finally {
        previewingSourceKey.value = '';
    }
}
function closePreview() {
    previewOpen.value = false;
}
onMounted(async () => {
    await fetchSources();
});
watch(sources, (items) => {
    for (const source of items) {
        draftMap[source.sourceKey] = {
            enabled: source.enabled,
            maxItems: source.maxItems,
            runOrder: source.runOrder,
        };
    }
}, { immediate: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['admin-page__refresh']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__action']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__error']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__stats']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__stats']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__decision']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__decision']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__stats']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "admin-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "admin-page__header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "admin-page__eyebrow" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "admin-page__title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.fetchSources) },
    ...{ class: "admin-page__refresh" },
    type: "button",
    disabled: (__VLS_ctx.loading),
});
(__VLS_ctx.loading ? '刷新中...' : '刷新来源');
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "admin-page__error" },
    });
    (__VLS_ctx.errorMessage);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "admin-source-grid" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.sources))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        key: (item.sourceKey),
        ...{ class: "admin-source-card gm-section-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
        ...{ class: "admin-source-card__header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (item.displayName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (item.sourceKey);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "admin-source-card__switch" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "checkbox",
    });
    (__VLS_ctx.ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).enabled);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "admin-source-card__grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "admin-source-card__field" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "number",
        min: "1",
        max: "50",
    });
    (__VLS_ctx.ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).maxItems);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "admin-source-card__field" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "number",
        min: "1",
        max: "999",
    });
    (__VLS_ctx.ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).runOrder);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "admin-source-card__meta" },
    });
    (item.updatedAt.replace('T', ' '));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
        ...{ class: "admin-source-card__footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleSave(item.sourceKey);
            } },
        ...{ class: "admin-source-card__action" },
        type: "button",
        disabled: (__VLS_ctx.saving),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "admin-source-card__actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handlePreview(item.sourceKey);
            } },
        ...{ class: "admin-source-card__action admin-source-card__action--ghost" },
        type: "button",
        disabled: (__VLS_ctx.saving || __VLS_ctx.previewingSourceKey === item.sourceKey),
    });
    (__VLS_ctx.previewingSourceKey === item.sourceKey ? '预览中...' : '预览抓取');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleCollect(item.sourceKey);
            } },
        ...{ class: "admin-source-card__action admin-source-card__action--ghost" },
        type: "button",
        disabled: (__VLS_ctx.saving || __VLS_ctx.collectingSourceKey === item.sourceKey || !__VLS_ctx.ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).enabled),
    });
    (__VLS_ctx.collectingSourceKey === item.sourceKey ? '抓取中...' : '手动抓取');
}
/** @type {[typeof AdminTaskRunList, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AdminTaskRunList, new AdminTaskRunList({
    runs: (__VLS_ctx.runs),
}));
const __VLS_1 = __VLS_0({
    runs: (__VLS_ctx.runs),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
const __VLS_3 = {}.Teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.Teleport, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    to: "body",
}));
const __VLS_5 = __VLS_4({
    to: "body",
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
const __VLS_7 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    name: "preview-drawer",
}));
const __VLS_9 = __VLS_8({
    name: "preview-drawer",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_10.slots.default;
if (__VLS_ctx.previewOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
        ...{ class: "preview-drawer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.closePreview) },
        ...{ class: "preview-drawer__backdrop" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "preview-drawer__panel gm-section-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
        ...{ class: "preview-drawer__header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "preview-drawer__eyebrow" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "preview-drawer__title" },
    });
    (__VLS_ctx.previewResult?.sourceKey || __VLS_ctx.previewingSourceKey || '来源预览');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closePreview) },
        ...{ class: "preview-drawer__close" },
        type: "button",
    });
    if (__VLS_ctx.previewingSourceKey && !__VLS_ctx.previewResult) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "preview-drawer__state" },
        });
    }
    else if (__VLS_ctx.errorMessage) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "preview-drawer__state preview-drawer__state--error" },
        });
        (__VLS_ctx.errorMessage);
    }
    else if (__VLS_ctx.previewResult) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "preview-drawer__content" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "preview-drawer__stats" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.previewResult.previewCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.previewKeepCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.previewResult.filteredCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ class: "preview-drawer__items" },
        });
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.previewResult.items))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: (`${item.sourceUrl}-${index}`),
                ...{ class: "preview-drawer__item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "preview-drawer__top" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "preview-drawer__decision" },
                'data-decision': (item.decision),
            });
            (item.decision === 'keep' ? '将保留' : '将过滤');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "preview-drawer__time" },
            });
            (item.rawPublishTime?.replace('T', ' ') || '-');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
            (item.title);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "preview-drawer__meta" },
            });
            (item.category);
            (item.spicyIndex);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "preview-drawer__summary" },
            });
            (item.highlight || item.summary || '暂无摘要预览。');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
                ...{ class: "preview-drawer__link" },
                href: (item.sourceUrl),
                target: "_blank",
                rel: "noreferrer",
            });
        }
    }
}
var __VLS_10;
var __VLS_6;
/** @type {__VLS_StyleScopedClasses['admin-page']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__refresh']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__error']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__switch']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__meta']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__footer']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__action']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__actions']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__action']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__action--ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__action']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__action--ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__backdrop']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__header']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__title']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__close']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__state']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__state']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__state--error']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__stats']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__items']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__item']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__top']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__decision']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__time']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__meta']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__summary']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-drawer__link']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AdminTaskRunList: AdminTaskRunList,
            sources: sources,
            runs: runs,
            loading: loading,
            saving: saving,
            errorMessage: errorMessage,
            fetchSources: fetchSources,
            collectingSourceKey: collectingSourceKey,
            previewingSourceKey: previewingSourceKey,
            previewOpen: previewOpen,
            previewResult: previewResult,
            ensureDraft: ensureDraft,
            previewKeepCount: previewKeepCount,
            handleSave: handleSave,
            handleCollect: handleCollect,
            handlePreview: handlePreview,
            closePreview: closePreview,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
