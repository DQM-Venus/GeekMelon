import { onMounted, reactive, watch } from 'vue';
import AdminTaskRunList from '@/features/admin/components/AdminTaskRunList.vue';
import { useAdminSources } from '@/features/admin/composables/useAdminSources';
const { sources, runs, loading, saving, errorMessage, fetchSources, saveSource, runCollect } = useAdminSources();
const draftMap = reactive({});
function ensureDraft(sourceKey, enabled, maxItems, runOrder) {
    if (!draftMap[sourceKey]) {
        draftMap[sourceKey] = { enabled, maxItems, runOrder };
    }
    return draftMap[sourceKey];
}
async function handleSave(sourceKey) {
    const draft = draftMap[sourceKey];
    if (!draft) {
        return;
    }
    await saveSource(sourceKey, draft);
}
async function handleCollect(sourceKey) {
    await runCollect(sourceKey);
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
/** @type {__VLS_StyleScopedClasses['admin-source-card__header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__error']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__grid']} */ ;
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleCollect(item.sourceKey);
            } },
        ...{ class: "admin-source-card__action admin-source-card__action--ghost" },
        type: "button",
        disabled: (__VLS_ctx.saving || !__VLS_ctx.ensureDraft(item.sourceKey, item.enabled, item.maxItems, item.runOrder).enabled),
    });
}
/** @type {[typeof AdminTaskRunList, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AdminTaskRunList, new AdminTaskRunList({
    runs: (__VLS_ctx.runs),
}));
const __VLS_1 = __VLS_0({
    runs: (__VLS_ctx.runs),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
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
/** @type {__VLS_StyleScopedClasses['admin-source-card__action']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-source-card__action--ghost']} */ ;
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
            ensureDraft: ensureDraft,
            handleSave: handleSave,
            handleCollect: handleCollect,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
