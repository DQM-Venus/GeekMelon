import { computed } from 'vue';
const props = defineProps();
const normalizedRuns = computed(() => props.runs ?? []);
function formatDateTime(value) {
    if (!value) {
        return '-';
    }
    return value.replace('T', ' ');
}
function statusLabel(status) {
    if (status === 'success') {
        return '成功';
    }
    if (status === 'failed') {
        return '失败';
    }
    if (status === 'running') {
        return '运行中';
    }
    return status;
}
function errorCategoryLabel(category) {
    if (!category) {
        return '';
    }
    const categoryMap = {
        SOURCE_FETCH: '抓源失败',
        PUBLISH_WINDOW: '发布时间过滤',
        ANALYZE_NETWORK: '分析网络异常',
        ANALYZE_PARSE: '分析结果解析失败',
        PUBLISH_REQUEST: '推送后端失败',
        PROCESS_EXIT: '子进程异常退出',
        UNEXPECTED: '未知异常',
    };
    return categoryMap[category] ?? category;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['admin-task-list__run-id']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__category']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__error']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__status']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__status']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__status']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "admin-task-list gm-section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "admin-task-list__header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "admin-task-list__title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "admin-task-list__meta" },
});
(__VLS_ctx.normalizedRuns.length);
if (__VLS_ctx.normalizedRuns.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "admin-task-list__empty" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "admin-task-list__items" },
    });
    for (const [run] of __VLS_getVForSourceType((__VLS_ctx.normalizedRuns))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (run.id),
            ...{ class: "admin-task-list__item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "admin-task-list__top" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "admin-task-list__headline" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (run.sourceKey);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "admin-task-list__run-id gm-mono" },
        });
        (run.runId);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "admin-task-list__status" },
            'data-status': (run.status),
        });
        (__VLS_ctx.statusLabel(run.status));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "admin-task-list__summary" },
        });
        (run.createdCount);
        (run.updatedCount);
        (run.skippedCount);
        (run.filteredCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "admin-task-list__time" },
        });
        (__VLS_ctx.formatDateTime(run.startedAt));
        if (run.endedAt) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.formatDateTime(run.endedAt));
        }
        if (run.errorCategory) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "admin-task-list__category" },
            });
            (__VLS_ctx.errorCategoryLabel(run.errorCategory));
        }
        if (run.errorDetail) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "admin-task-list__error" },
            });
            (run.errorDetail);
        }
    }
}
/** @type {__VLS_StyleScopedClasses['admin-task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__meta']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__empty']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__items']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__item']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__top']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__headline']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__run-id']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__status']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__summary']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__time']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__category']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-task-list__error']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            normalizedRuns: normalizedRuns,
            formatDateTime: formatDateTime,
            statusLabel: statusLabel,
            errorCategoryLabel: errorCategoryLabel,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
