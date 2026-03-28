import FeedCard from '@/features/feed/components/FeedCard.vue';
const __VLS_props = defineProps();
const __VLS_emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['feed-list__subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__pager']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "feed-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "feed-list__header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "feed-list__eyebrow" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "feed-list__title" },
});
(__VLS_ctx.emptyFallback ? '最近一期值得一看的 AI 圈情报' : '昨天发布的 AI 圈新鲜事');
if (__VLS_ctx.emptyFallback && __VLS_ctx.effectiveDate) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "feed-list__subtitle" },
    });
    (__VLS_ctx.effectiveDate);
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feed-list__state feed-list__state--loading" },
    });
}
else if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feed-list__state feed-list__state--error" },
    });
    (__VLS_ctx.errorMessage);
}
else if (__VLS_ctx.records.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feed-list__state" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feed-list__items" },
    });
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.records))) {
        /** @type {[typeof FeedCard, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(FeedCard, new FeedCard({
            ...{ 'onOpenDetail': {} },
            key: (item.id),
            item: (item),
            index: (index),
        }));
        const __VLS_1 = __VLS_0({
            ...{ 'onOpenDetail': {} },
            key: (item.id),
            item: (item),
            index: (index),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        let __VLS_3;
        let __VLS_4;
        let __VLS_5;
        const __VLS_6 = {
            onOpenDetail: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.errorMessage))
                    return;
                if (!!(__VLS_ctx.records.length === 0))
                    return;
                __VLS_ctx.$emit('openDetail', item.id);
            }
        };
        var __VLS_2;
    }
}
if (__VLS_ctx.records.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
        ...{ class: "feed-list__footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.records.length > 0))
                    return;
                __VLS_ctx.$emit('prev');
            } },
        ...{ class: "feed-list__pager" },
        type: "button",
        disabled: (__VLS_ctx.page <= 1 || __VLS_ctx.loading),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "feed-list__page" },
    });
    (__VLS_ctx.page);
    (__VLS_ctx.totalPages);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.records.length > 0))
                    return;
                __VLS_ctx.$emit('next');
            } },
        ...{ class: "feed-list__pager" },
        type: "button",
        disabled: (__VLS_ctx.page >= __VLS_ctx.totalPages || __VLS_ctx.loading),
    });
}
/** @type {__VLS_StyleScopedClasses['feed-list']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__header']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__state']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__state--loading']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__state']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__state--error']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__state']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__items']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__footer']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__pager']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__page']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FeedCard: FeedCard,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
