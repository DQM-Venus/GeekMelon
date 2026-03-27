import FeedCard from '@/features/feed/components/FeedCard.vue';
const props = defineProps();
const emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['feed-list__pager-button']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__pager']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "feed-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "feed-list__header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "feed-list__eyebrow gm-mono" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "feed-list__title" },
});
if (props.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feed-list__state gm-section-card" },
    });
}
else if (props.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feed-list__state feed-list__state--error gm-section-card" },
    });
    (props.errorMessage);
}
else if (props.records.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feed-list__state gm-section-card" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feed-list__grid" },
    });
    for (const [item, index] of __VLS_getVForSourceType((props.records))) {
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
                if (!!(props.loading))
                    return;
                if (!!(props.errorMessage))
                    return;
                if (!!(props.records.length === 0))
                    return;
                __VLS_ctx.emit('openDetail', $event);
            }
        };
        var __VLS_2;
    }
}
if (props.totalPages > 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
        ...{ class: "feed-list__pager gm-section-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(props.totalPages > 1))
                    return;
                __VLS_ctx.emit('prev');
            } },
        ...{ class: "feed-list__pager-button" },
        type: "button",
        disabled: (props.page <= 1),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "feed-list__pager-text gm-mono" },
    });
    (props.page);
    (props.totalPages);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(props.totalPages > 1))
                    return;
                __VLS_ctx.emit('next');
            } },
        ...{ class: "feed-list__pager-button" },
        type: "button",
        disabled: (props.page >= props.totalPages),
    });
}
/** @type {__VLS_StyleScopedClasses['feed-list']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__header']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__state']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__state']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__state--error']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__state']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__pager']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__pager-button']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__pager-text']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-list__pager-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FeedCard: FeedCard,
            emit: emit,
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
