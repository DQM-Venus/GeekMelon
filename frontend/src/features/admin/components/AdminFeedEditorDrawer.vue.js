import { computed, reactive, watch } from 'vue';
const props = defineProps();
const emit = defineEmits();
const formState = reactive({
    adminTitle: '',
    adminHighlight: '',
    adminSummary: '',
    adminCategory: '',
    adminSpicyIndex: 0,
    adminFeatured: false,
    adminFeaturedRank: 1,
    adminNote: '',
});
const isHidden = computed(() => props.detail?.status === 'hidden');
watch(() => props.detail, (detail) => {
    formState.adminTitle = detail?.adminTitle ?? '';
    formState.adminHighlight = detail?.adminHighlight ?? '';
    formState.adminSummary = detail?.adminSummary ?? '';
    formState.adminCategory = detail?.adminCategory ?? '';
    formState.adminSpicyIndex = detail?.adminSpicyIndex ?? 0;
    formState.adminFeatured = Boolean(detail?.adminFeatured);
    formState.adminFeaturedRank = detail?.adminFeaturedRank ?? 1;
    formState.adminNote = detail?.adminNote ?? '';
}, { immediate: true });
function handleSave() {
    emit('save', {
        adminTitle: formState.adminTitle,
        adminHighlight: formState.adminHighlight,
        adminSummary: formState.adminSummary,
        adminCategory: formState.adminCategory,
        adminSpicyIndex: formState.adminSpicyIndex > 0 ? formState.adminSpicyIndex : undefined,
        adminFeatured: formState.adminFeatured,
        adminFeaturedRank: formState.adminFeatured ? formState.adminFeaturedRank : undefined,
        adminNote: formState.adminNote,
    });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__meta-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__meta-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__action']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-drawer-enter-active']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-drawer-leave-active']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-drawer-enter-from']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-drawer-leave-to']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__meta-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__footer']} */ ;
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
    name: "admin-drawer",
}));
const __VLS_6 = __VLS_5({
    name: "admin-drawer",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
if (props.open) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
        ...{ class: "admin-feed-drawer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(props.open))
                    return;
                __VLS_ctx.emit('close');
            } },
        ...{ class: "admin-feed-drawer__backdrop" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "admin-feed-drawer__panel gm-section-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
        ...{ class: "admin-feed-drawer__header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "admin-feed-drawer__eyebrow" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "admin-feed-drawer__title" },
    });
    (props.detail?.title || '加载中');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(props.open))
                    return;
                __VLS_ctx.emit('close');
            } },
        ...{ class: "admin-feed-drawer__close" },
        type: "button",
    });
    if (props.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "admin-feed-drawer__state" },
        });
    }
    else if (props.errorMessage) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "admin-feed-drawer__state admin-feed-drawer__state--error" },
        });
        (props.errorMessage);
    }
    else if (props.detail) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "admin-feed-drawer__content" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "admin-feed-drawer__section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "admin-feed-drawer__section-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "admin-feed-drawer__field" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            value: (__VLS_ctx.formState.adminTitle),
            type: "text",
            placeholder: "留空则回退原始标题",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "admin-feed-drawer__field" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)({
            value: (__VLS_ctx.formState.adminHighlight),
            rows: "3",
            placeholder: "留空则回退原始爆点",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "admin-feed-drawer__field" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)({
            value: (__VLS_ctx.formState.adminSummary),
            rows: "4",
            placeholder: "留空则回退原始摘要",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "admin-feed-drawer__grid" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "admin-feed-drawer__field" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            value: (__VLS_ctx.formState.adminCategory),
            type: "text",
            placeholder: "例如：争议舆情",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "admin-feed-drawer__field" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            type: "number",
            min: "0",
            max: "10",
        });
        (__VLS_ctx.formState.adminSpicyIndex);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "admin-feed-drawer__grid" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "admin-feed-drawer__checkbox" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            type: "checkbox",
        });
        (__VLS_ctx.formState.adminFeatured);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "admin-feed-drawer__field" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            type: "number",
            min: "1",
            max: "999",
            disabled: (!__VLS_ctx.formState.adminFeatured),
        });
        (__VLS_ctx.formState.adminFeaturedRank);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "admin-feed-drawer__field" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)({
            value: (__VLS_ctx.formState.adminNote),
            rows: "3",
            placeholder: "记录为什么保留、为什么隐藏",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "admin-feed-drawer__section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "admin-feed-drawer__section-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dl, __VLS_intrinsicElements.dl)({
            ...{ class: "admin-feed-drawer__meta-grid" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
        (props.detail.source);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
        (props.detail.status);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
        (props.detail.editorPick ? '是' : '否');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
        (props.detail.duplicateOfId ?? '-');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
        (props.detail.aiModel || '-');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dt, __VLS_intrinsicElements.dt)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.dd, __VLS_intrinsicElements.dd)({});
        (props.detail.aiPromptVersion || '-');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "admin-feed-drawer__block" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (props.detail.summary);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "admin-feed-drawer__block" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (props.detail.highlight);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "admin-feed-drawer__section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "admin-feed-drawer__section-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "admin-feed-drawer__raw" },
        });
        (props.detail.rawContent);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
            ...{ class: "admin-feed-drawer__link" },
            href: (props.detail.sourceUrl),
            target: "_blank",
            rel: "noreferrer",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
        ...{ class: "admin-feed-drawer__footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleSave) },
        ...{ class: "admin-feed-drawer__action" },
        type: "button",
        disabled: (props.saving || !props.detail),
    });
    (props.saving ? '保存中...' : '保存运营修改');
    if (props.detail) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(props.open))
                        return;
                    if (!(props.detail))
                        return;
                    __VLS_ctx.isHidden ? __VLS_ctx.emit('restore', props.detail.id) : __VLS_ctx.emit('hide', props.detail.id);
                } },
            ...{ class: "admin-feed-drawer__action admin-feed-drawer__action--ghost" },
            type: "button",
            disabled: (props.saving),
        });
        (__VLS_ctx.isHidden ? '恢复内容' : '隐藏内容');
    }
}
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__backdrop']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__panel']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__close']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__state']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__state']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__state--error']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__content']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__section']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__section']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__meta-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__block']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__block']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__section']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__raw']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__link']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__footer']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__action']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__action']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-drawer__action--ghost']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emit: emit,
            formState: formState,
            isHidden: isHidden,
            handleSave: handleSave,
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
