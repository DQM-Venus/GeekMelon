import { computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const tags = computed(() => props.detail?.tags ?? []);
const relatedSources = computed(() => props.detail?.relatedSources ?? []);
const rawPublishTimeLabel = computed(() => formatDateTime(props.detail?.rawPublishTime));
const updatedAtLabel = computed(() => formatDateTime(props.detail?.updatedAt));
function formatDateTime(value) {
    return value ? value.replace('T', ' ') : '';
}
function getRelatedTimeLabel(item) {
    return formatDateTime(item.rawPublishTime || item.createdAt);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['feed-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__raw']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-button']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-link']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__meta']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.Teleport, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "body",
}));
const __VLS_2 = __VLS_1({
    to: "body",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    name: "drawer-fade",
}));
const __VLS_6 = __VLS_5({
    name: "drawer-fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
if (props.open) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feed-drawer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(props.open))
                    return;
                __VLS_ctx.emit('close');
            } },
        ...{ class: "feed-drawer__backdrop" },
        type: "button",
        'aria-label': "关闭详情抽屉",
    });
    const __VLS_8 = {}.Transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        name: "drawer-panel",
    }));
    const __VLS_10 = __VLS_9({
        name: "drawer-panel",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    if (props.open) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
            ...{ class: "feed-drawer__panel gm-noise" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
            ...{ class: "feed-drawer__header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "feed-drawer__eyebrow gm-mono" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
            ...{ class: "feed-drawer__title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(props.open))
                        return;
                    if (!(props.open))
                        return;
                    __VLS_ctx.emit('close');
                } },
            ...{ class: "feed-drawer__close" },
            type: "button",
        });
        if (props.loading) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feed-drawer__state" },
            });
        }
        else if (props.errorMessage) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feed-drawer__state feed-drawer__state--error" },
            });
            (props.errorMessage);
        }
        else if (props.detail) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
                ...{ class: "feed-drawer__content" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feed-drawer__pill-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "feed-drawer__pill feed-drawer__pill--source gm-mono" },
            });
            (props.detail.source);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "feed-drawer__pill feed-drawer__pill--category" },
            });
            (props.detail.category);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "feed-drawer__pill" },
            });
            (props.detail.verdict);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                ...{ class: "feed-drawer__headline" },
            });
            (props.detail.title);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "feed-drawer__highlight" },
            });
            (props.detail.highlight);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.dl, __VLS_intrinsicElements.dl)({
                ...{ class: "feed-drawer__meta" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feed-drawer__meta-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({
                ...{ class: "gm-mono" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
            (props.detail.authorName || '匿名');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feed-drawer__meta-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({
                ...{ class: "gm-mono" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
            (__VLS_ctx.rawPublishTimeLabel);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feed-drawer__meta-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({
                ...{ class: "gm-mono" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
            (__VLS_ctx.updatedAtLabel);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feed-drawer__meta-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({
                ...{ class: "gm-mono" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
            (props.detail.spicyIndex);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
                ...{ class: "feed-drawer__block" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
                ...{ class: "feed-drawer__block-title" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "feed-drawer__summary" },
            });
            (props.detail.summary);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
                ...{ class: "feed-drawer__block" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
                ...{ class: "feed-drawer__block-title" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "feed-drawer__raw" },
            });
            (props.detail.rawContent);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
                ...{ class: "feed-drawer__block" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
                ...{ class: "feed-drawer__block-title" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feed-drawer__tag-list" },
            });
            for (const [item] of __VLS_getVForSourceType((__VLS_ctx.tags))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    key: (item),
                    ...{ class: "feed-drawer__tag" },
                });
                (item);
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "feed-drawer__model gm-mono" },
            });
            (props.detail.aiModel);
            (props.detail.aiPromptVersion);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
                ...{ class: "feed-drawer__block" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feed-drawer__block-head" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
                ...{ class: "feed-drawer__block-title" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "feed-drawer__count" },
            });
            (__VLS_ctx.relatedSources.length);
            if (__VLS_ctx.relatedSources.length) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "feed-drawer__related-list" },
                });
                for (const [item] of __VLS_getVForSourceType((__VLS_ctx.relatedSources))) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
                        key: (item.id),
                        ...{ class: "feed-drawer__related-card" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "feed-drawer__related-pills" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "feed-drawer__pill feed-drawer__pill--source gm-mono" },
                    });
                    (item.source);
                    if (item.primarySource) {
                        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                            ...{ class: "feed-drawer__pill feed-drawer__pill--primary" },
                        });
                    }
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "feed-drawer__pill" },
                    });
                    (item.spicyIndex);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
                        ...{ class: "feed-drawer__related-title" },
                    });
                    (item.title);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                        ...{ class: "feed-drawer__related-meta" },
                    });
                    (item.authorName || '匿名');
                    (__VLS_ctx.getRelatedTimeLabel(item));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "feed-drawer__related-actions" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!(props.open))
                                    return;
                                if (!(props.open))
                                    return;
                                if (!!(props.loading))
                                    return;
                                if (!!(props.errorMessage))
                                    return;
                                if (!(props.detail))
                                    return;
                                if (!(__VLS_ctx.relatedSources.length))
                                    return;
                                __VLS_ctx.emit('openDetail', item.id);
                            } },
                        ...{ class: "feed-drawer__related-button" },
                        type: "button",
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
                        ...{ class: "feed-drawer__related-link" },
                        href: (item.sourceUrl),
                        target: "_blank",
                        rel: "noreferrer",
                    });
                }
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "feed-drawer__empty" },
                });
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
                ...{ class: "feed-drawer__link" },
                href: (props.detail.sourceUrl),
                target: "_blank",
                rel: "noreferrer",
            });
        }
    }
    var __VLS_11;
}
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['feed-drawer']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__backdrop']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-noise']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__header']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__close']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__state']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__state']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__state--error']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__content']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill-row']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill--source']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill--category']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__headline']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__meta']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__block']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__summary']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__block']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__raw']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__block']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__tag-list']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__tag']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__model']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__block']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__block-head']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__count']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-list']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-card']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-pills']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill--source']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill--primary']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__pill']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-title']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-button']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__related-link']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__empty']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-drawer__link']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emit: emit,
            tags: tags,
            relatedSources: relatedSources,
            rawPublishTimeLabel: rawPublishTimeLabel,
            updatedAtLabel: updatedAtLabel,
            getRelatedTimeLabel: getRelatedTimeLabel,
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
