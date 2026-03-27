import { computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const tagText = computed(() => props.item.tags.join(' / '));
const displayTitle = computed(() => props.item.displayTitle || props.item.title);
const displayHighlight = computed(() => props.item.displayHighlight || props.item.highlight);
const displaySummary = computed(() => props.item.displaySummary || props.item.summary);
const spicyStyle = computed(() => ({
    width: `${Math.min(props.item.spicyIndex, 10) * 10}%`,
}));
const publishTimeText = computed(() => (props.item.rawPublishTime || '').replace('T', ' '));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['feed-card__title-link']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__action-link']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__time']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__aside']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__actions']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "feed-card gm-section-card gm-noise gm-stagger-enter" },
    ...{ style: ({ animationDelay: `${0.06 * props.index}s` }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-card__header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-card__meta" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "feed-card__meta-tag feed-card__meta-tag--source gm-mono" },
});
(props.item.source);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "feed-card__meta-tag feed-card__meta-tag--category" },
});
(props.item.category);
if (props.item.editorPick) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "feed-card__meta-tag feed-card__meta-tag--pick" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.time, __VLS_intrinsicElements.time)({
    ...{ class: "feed-card__time gm-mono" },
});
(__VLS_ctx.publishTimeText);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.emit('openDetail', props.item.id);
        } },
    ...{ class: "feed-card__title-link" },
    type: "button",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "feed-card__title" },
});
(__VLS_ctx.displayTitle);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "feed-card__highlight" },
});
(__VLS_ctx.displayHighlight);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "feed-card__summary" },
});
(__VLS_ctx.displaySummary);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-card__footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-card__spicy" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "feed-card__spicy-label gm-mono" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-card__spicy-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
    ...{ class: "feed-card__spicy-fill" },
    ...{ style: (__VLS_ctx.spicyStyle) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
    ...{ class: "feed-card__spicy-value" },
});
(props.item.spicyIndex);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-card__aside" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "feed-card__author" },
});
(props.item.authorName || '匿名');
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "feed-card__tags" },
});
(__VLS_ctx.tagText);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-card__actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.emit('openDetail', props.item.id);
        } },
    ...{ class: "feed-card__action-button" },
    type: "button",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    ...{ class: "feed-card__action-link gm-mono" },
    href: (props.item.sourceUrl),
    target: "_blank",
    rel: "noreferrer",
});
/** @type {__VLS_StyleScopedClasses['feed-card']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-noise']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-stagger-enter']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__header']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__meta']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__meta-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__meta-tag--source']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__meta-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__meta-tag--category']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__meta-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__meta-tag--pick']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__time']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__title-link']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__summary']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__footer']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__spicy']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__spicy-label']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__spicy-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__spicy-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__spicy-value']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__aside']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__author']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__tags']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__actions']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-card__action-link']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emit: emit,
            tagText: tagText,
            displayTitle: displayTitle,
            displayHighlight: displayHighlight,
            displaySummary: displaySummary,
            spicyStyle: spicyStyle,
            publishTimeText: publishTimeText,
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
