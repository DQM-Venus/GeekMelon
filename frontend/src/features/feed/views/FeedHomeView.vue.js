import FeedDetailDrawer from '@/features/feed/components/FeedDetailDrawer.vue';
import FeedHero from '@/features/feed/components/FeedHero.vue';
import FeedList from '@/features/feed/components/FeedList.vue';
import FeedToolbar from '@/features/feed/components/FeedToolbar.vue';
import { useFeedDetail } from '@/features/feed/composables/useFeedDetail';
import { useFeedQuery } from '@/features/feed/composables/useFeedQuery';
import { useThemePreference } from '@/composables/useThemePreference';
const { records, page, totalPages, loading, errorMessage, sort, effectiveDateLabel, effectiveDate, emptyFallback, updateFilters, nextPage, prevPage, } = useFeedQuery();
const { currentTheme, setTheme } = useThemePreference();
const { detail, loading: detailLoading, errorMessage: detailErrorMessage, open: detailOpen, openDetail, closeDetail, } = useFeedDetail();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "feed-home gm-page-shell" },
});
/** @type {[typeof FeedHero, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FeedHero, new FeedHero({
    dateLabel: (__VLS_ctx.effectiveDateLabel),
    emptyFallback: (__VLS_ctx.emptyFallback),
    effectiveDate: (__VLS_ctx.effectiveDate),
}));
const __VLS_1 = __VLS_0({
    dateLabel: (__VLS_ctx.effectiveDateLabel),
    emptyFallback: (__VLS_ctx.emptyFallback),
    effectiveDate: (__VLS_ctx.effectiveDate),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof FeedToolbar, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(FeedToolbar, new FeedToolbar({
    ...{ 'onUpdateSort': {} },
    ...{ 'onUpdateTheme': {} },
    sort: (__VLS_ctx.sort),
    theme: (__VLS_ctx.currentTheme),
}));
const __VLS_4 = __VLS_3({
    ...{ 'onUpdateSort': {} },
    ...{ 'onUpdateTheme': {} },
    sort: (__VLS_ctx.sort),
    theme: (__VLS_ctx.currentTheme),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
let __VLS_6;
let __VLS_7;
let __VLS_8;
const __VLS_9 = {
    onUpdateSort: (...[$event]) => {
        __VLS_ctx.updateFilters({ sort: $event });
    }
};
const __VLS_10 = {
    onUpdateTheme: (__VLS_ctx.setTheme)
};
var __VLS_5;
/** @type {[typeof FeedList, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(FeedList, new FeedList({
    ...{ 'onPrev': {} },
    ...{ 'onNext': {} },
    ...{ 'onOpenDetail': {} },
    records: (__VLS_ctx.records),
    loading: (__VLS_ctx.loading),
    errorMessage: (__VLS_ctx.errorMessage),
    page: (__VLS_ctx.page),
    totalPages: (__VLS_ctx.totalPages),
    effectiveDate: (__VLS_ctx.effectiveDate),
    emptyFallback: (__VLS_ctx.emptyFallback),
}));
const __VLS_12 = __VLS_11({
    ...{ 'onPrev': {} },
    ...{ 'onNext': {} },
    ...{ 'onOpenDetail': {} },
    records: (__VLS_ctx.records),
    loading: (__VLS_ctx.loading),
    errorMessage: (__VLS_ctx.errorMessage),
    page: (__VLS_ctx.page),
    totalPages: (__VLS_ctx.totalPages),
    effectiveDate: (__VLS_ctx.effectiveDate),
    emptyFallback: (__VLS_ctx.emptyFallback),
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
let __VLS_14;
let __VLS_15;
let __VLS_16;
const __VLS_17 = {
    onPrev: (__VLS_ctx.prevPage)
};
const __VLS_18 = {
    onNext: (__VLS_ctx.nextPage)
};
const __VLS_19 = {
    onOpenDetail: (__VLS_ctx.openDetail)
};
var __VLS_13;
/** @type {[typeof FeedDetailDrawer, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(FeedDetailDrawer, new FeedDetailDrawer({
    ...{ 'onClose': {} },
    ...{ 'onOpenDetail': {} },
    open: (__VLS_ctx.detailOpen),
    detail: (__VLS_ctx.detail),
    loading: (__VLS_ctx.detailLoading),
    errorMessage: (__VLS_ctx.detailErrorMessage),
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClose': {} },
    ...{ 'onOpenDetail': {} },
    open: (__VLS_ctx.detailOpen),
    detail: (__VLS_ctx.detail),
    loading: (__VLS_ctx.detailLoading),
    errorMessage: (__VLS_ctx.detailErrorMessage),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_23;
let __VLS_24;
let __VLS_25;
const __VLS_26 = {
    onClose: (__VLS_ctx.closeDetail)
};
const __VLS_27 = {
    onOpenDetail: (__VLS_ctx.openDetail)
};
var __VLS_22;
/** @type {__VLS_StyleScopedClasses['feed-home']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-page-shell']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FeedDetailDrawer: FeedDetailDrawer,
            FeedHero: FeedHero,
            FeedList: FeedList,
            FeedToolbar: FeedToolbar,
            records: records,
            page: page,
            totalPages: totalPages,
            loading: loading,
            errorMessage: errorMessage,
            sort: sort,
            effectiveDateLabel: effectiveDateLabel,
            effectiveDate: effectiveDate,
            emptyFallback: emptyFallback,
            updateFilters: updateFilters,
            nextPage: nextPage,
            prevPage: prevPage,
            currentTheme: currentTheme,
            setTheme: setTheme,
            detail: detail,
            detailLoading: detailLoading,
            detailErrorMessage: detailErrorMessage,
            detailOpen: detailOpen,
            openDetail: openDetail,
            closeDetail: closeDetail,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
