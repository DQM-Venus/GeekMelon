const props = defineProps();
const emit = defineEmits();
const sortOptions = [
    { label: '按最新', value: 'latest' },
    { label: '按辣度', value: 'spicy' },
];
const themeOptions = [
    { label: '浅色', value: 'light' },
    { label: '夜间', value: 'dark' },
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segment']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segment']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segment']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segment']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__controls']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__controls']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segmented']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segment']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "feed-toolbar gm-section-card gm-noise" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-toolbar__intro" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "feed-toolbar__eyebrow gm-mono" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "feed-toolbar__title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-toolbar__controls" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-toolbar__group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "feed-toolbar__label gm-mono" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-toolbar__segmented" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.sortOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.emit('updateSort', item.value);
            } },
        key: (item.value),
        ...{ class: "feed-toolbar__segment" },
        type: "button",
        'data-active': (props.sort === item.value),
    });
    (item.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-toolbar__group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "feed-toolbar__label gm-mono" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feed-toolbar__segmented" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.themeOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.emit('updateTheme', item.value);
            } },
        key: (item.value),
        ...{ class: "feed-toolbar__segment" },
        type: "button",
        'data-active': (props.theme === item.value),
    });
    (item.label);
}
/** @type {__VLS_StyleScopedClasses['feed-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-noise']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__intro']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__controls']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__group']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__label']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segmented']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segment']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__group']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__label']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segmented']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-toolbar__segment']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emit: emit,
            sortOptions: sortOptions,
            themeOptions: themeOptions,
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
