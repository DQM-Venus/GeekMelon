import { computed, onMounted } from 'vue';
import AdminMetricCard from '@/features/admin/components/AdminMetricCard.vue';
import AdminTaskRunList from '@/features/admin/components/AdminTaskRunList.vue';
import { useAdminDashboard } from '@/features/admin/composables/useAdminDashboard';
const { dashboard, loading, errorMessage, fetchDashboard } = useAdminDashboard();
const systemCards = computed(() => {
    if (!dashboard.value) {
        return [];
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
    ];
});
onMounted(fetchDashboard);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['admin-dashboard__metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-dashboard__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-dashboard__metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-dashboard__grid']} */ ;
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
    ...{ onClick: (__VLS_ctx.fetchDashboard) },
    ...{ class: "admin-page__refresh" },
    type: "button",
    disabled: (__VLS_ctx.loading),
});
(__VLS_ctx.loading ? '刷新中...' : '刷新概览');
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "admin-page__error" },
    });
    (__VLS_ctx.errorMessage);
}
if (__VLS_ctx.dashboard) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "admin-dashboard__metrics" },
    });
    /** @type {[typeof AdminMetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(AdminMetricCard, new AdminMetricCard({
        label: "今日新增内容",
        value: (__VLS_ctx.dashboard.todayNewCount),
        accent: "melon",
        hint: "当天新入库的内容数",
    }));
    const __VLS_1 = __VLS_0({
        label: "今日新增内容",
        value: (__VLS_ctx.dashboard.todayNewCount),
        accent: "melon",
        hint: "当天新入库的内容数",
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    /** @type {[typeof AdminMetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(AdminMetricCard, new AdminMetricCard({
        label: "当前隐藏内容",
        value: (__VLS_ctx.dashboard.hiddenCount),
        accent: "pulp",
        hint: "已被后台回收的内容",
    }));
    const __VLS_4 = __VLS_3({
        label: "当前隐藏内容",
        value: (__VLS_ctx.dashboard.hiddenCount),
        accent: "pulp",
        hint: "已被后台回收的内容",
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    /** @type {[typeof AdminMetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(AdminMetricCard, new AdminMetricCard({
        label: "人工精选内容",
        value: (__VLS_ctx.dashboard.featuredCount),
        accent: "gold",
        hint: "会优先出现在首页前排",
    }));
    const __VLS_7 = __VLS_6({
        label: "人工精选内容",
        value: (__VLS_ctx.dashboard.featuredCount),
        accent: "gold",
        hint: "会优先出现在首页前排",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    /** @type {[typeof AdminMetricCard, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(AdminMetricCard, new AdminMetricCard({
        label: "启用中的来源",
        value: (__VLS_ctx.dashboard.activeSourceCount),
        accent: "ink",
        hint: "后台可手动抓取的来源数",
    }));
    const __VLS_10 = __VLS_9({
        label: "启用中的来源",
        value: (__VLS_ctx.dashboard.activeSourceCount),
        accent: "ink",
        hint: "后台可手动抓取的来源数",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
if (__VLS_ctx.dashboard) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "admin-dashboard__grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "admin-dashboard__system" },
    });
    for (const [card] of __VLS_getVForSourceType((__VLS_ctx.systemCards))) {
        /** @type {[typeof AdminMetricCard, ]} */ ;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(AdminMetricCard, new AdminMetricCard({
            key: (card.label),
            label: (card.label),
            value: (card.value),
            hint: (card.hint),
            accent: card.accent,
        }));
        const __VLS_13 = __VLS_12({
            key: (card.label),
            label: (card.label),
            value: (card.value),
            hint: (card.hint),
            accent: card.accent,
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    }
    /** @type {[typeof AdminTaskRunList, ]} */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(AdminTaskRunList, new AdminTaskRunList({
        runs: (__VLS_ctx.dashboard.recentRuns),
    }));
    const __VLS_16 = __VLS_15({
        runs: (__VLS_ctx.dashboard.recentRuns),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
}
/** @type {__VLS_StyleScopedClasses['admin-page']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__refresh']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__error']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-dashboard__metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-dashboard__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-dashboard__system']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AdminMetricCard: AdminMetricCard,
            AdminTaskRunList: AdminTaskRunList,
            dashboard: dashboard,
            loading: loading,
            errorMessage: errorMessage,
            fetchDashboard: fetchDashboard,
            systemCards: systemCards,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
