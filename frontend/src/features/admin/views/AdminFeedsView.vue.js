import { computed, onMounted, shallowRef } from 'vue';
import AdminFeedEditorDrawer from '@/features/admin/components/AdminFeedEditorDrawer.vue';
import { useAdminFeeds } from '@/features/admin/composables/useAdminFeeds';
const { records, total, page, totalPages, loading, saving, errorMessage, detail, detailLoading, detailErrorMessage, keyword, source, category, status, editorPick, featured, duplicateGroup, openDetail, saveDetail, hideFeed, restoreFeed, updateFilters, nextPage, prevPage, } = useAdminFeeds();
const drawerOpen = shallowRef(false);
const sourceOptions = computed(() => Array.from(new Set(records.value.map((item) => item.source))).sort());
const categoryOptions = computed(() => {
    const values = new Set();
    for (const item of records.value) {
        if (item.adminCategory) {
            values.add(item.adminCategory);
        }
        if (item.category) {
            values.add(item.category);
        }
    }
    return Array.from(values).sort();
});
function formatDateTime(value) {
    return value ? value.replace('T', ' ') : '-';
}
function handleKeywordInput(event) {
    updateFilters({ keyword: event.target.value });
}
function handleSourceChange(event) {
    updateFilters({ source: event.target.value });
}
function handleCategoryChange(event) {
    updateFilters({ category: event.target.value });
}
function handleStatusChange(event) {
    updateFilters({ status: event.target.value });
}
function handleEditorPickChange(event) {
    updateFilters({ editorPick: event.target.value });
}
function handleFeaturedChange(event) {
    updateFilters({ featured: event.target.value });
}
function handleDuplicateGroupInput(event) {
    updateFilters({ duplicateGroup: event.target.value });
}
async function handleOpenDetail(id) {
    drawerOpen.value = true;
    await openDetail(id);
}
async function handleSave(payload) {
    if (!detail.value) {
        return;
    }
    await saveDetail(detail.value.id, payload);
}
async function handleHide(id) {
    await hideFeed(id);
}
async function handleRestore(id) {
    await restoreFeed(id);
}
onMounted(() => {
    drawerOpen.value = false;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__head']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__status']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__status']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field--keyword']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field--keyword']} */ ;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-page__stat" },
});
(__VLS_ctx.total);
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "admin-feed-filters gm-section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "admin-feed-filters__field admin-feed-filters__field--keyword" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.handleKeywordInput) },
    value: (__VLS_ctx.keyword),
    type: "text",
    placeholder: "搜标题、原文、链接",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "admin-feed-filters__field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    ...{ onChange: (__VLS_ctx.handleSourceChange) },
    value: (__VLS_ctx.source),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.sourceOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "admin-feed-filters__field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    ...{ onChange: (__VLS_ctx.handleCategoryChange) },
    value: (__VLS_ctx.category),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.categoryOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
        value: (item),
    });
    (item);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "admin-feed-filters__field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    ...{ onChange: (__VLS_ctx.handleStatusChange) },
    value: (__VLS_ctx.status),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "active",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "hidden",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "admin-feed-filters__field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    ...{ onChange: (__VLS_ctx.handleEditorPickChange) },
    value: (__VLS_ctx.editorPick),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "false",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "admin-feed-filters__field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    ...{ onChange: (__VLS_ctx.handleFeaturedChange) },
    value: (__VLS_ctx.featured),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "true",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "false",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "admin-feed-filters__field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.handleDuplicateGroupInput) },
    value: (__VLS_ctx.duplicateGroup),
    type: "text",
    placeholder: "输入主记录 ID",
});
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "admin-page__error" },
    });
    (__VLS_ctx.errorMessage);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "admin-feed-table gm-section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-feed-table__head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.loading ? '加载中...' : `第 ${__VLS_ctx.page} / ${__VLS_ctx.totalPages} 页`);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-feed-table__scroll" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.records))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        key: (item.id),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    (item.id);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (item.adminTitle || item.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "admin-feed-table__meta" },
    });
    (item.adminCategory || item.category);
    (item.adminSpicyIndex || item.spicyIndex);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    (item.source);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "admin-feed-table__status" },
        'data-status': (item.status),
    });
    (item.status);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    if (item.adminFeatured) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "admin-feed-table__flag admin-feed-table__flag--manual" },
        });
    }
    if (item.editorPick) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "admin-feed-table__flag admin-feed-table__flag--auto" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    (__VLS_ctx.formatDateTime(item.updatedAt));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleOpenDetail(item.id);
            } },
        ...{ class: "admin-feed-table__action" },
        type: "button",
    });
}
if (!__VLS_ctx.loading && __VLS_ctx.records.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        colspan: "7",
        ...{ class: "admin-feed-table__empty" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
    ...{ class: "admin-feed-table__footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.prevPage) },
    ...{ class: "admin-feed-table__pager" },
    type: "button",
    disabled: (__VLS_ctx.page <= 1 || __VLS_ctx.loading),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.nextPage) },
    ...{ class: "admin-feed-table__pager" },
    type: "button",
    disabled: (__VLS_ctx.page >= __VLS_ctx.totalPages || __VLS_ctx.loading),
});
/** @type {[typeof AdminFeedEditorDrawer, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AdminFeedEditorDrawer, new AdminFeedEditorDrawer({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    ...{ 'onHide': {} },
    ...{ 'onRestore': {} },
    open: (__VLS_ctx.drawerOpen),
    detail: (__VLS_ctx.detail),
    loading: (__VLS_ctx.detailLoading),
    saving: (__VLS_ctx.saving),
    errorMessage: (__VLS_ctx.detailErrorMessage),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    ...{ 'onHide': {} },
    ...{ 'onRestore': {} },
    open: (__VLS_ctx.drawerOpen),
    detail: (__VLS_ctx.detail),
    loading: (__VLS_ctx.detailLoading),
    saving: (__VLS_ctx.saving),
    errorMessage: (__VLS_ctx.detailErrorMessage),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onClose: (...[$event]) => {
        __VLS_ctx.drawerOpen = false;
    }
};
const __VLS_7 = {
    onSave: (__VLS_ctx.handleSave)
};
const __VLS_8 = {
    onHide: (__VLS_ctx.handleHide)
};
const __VLS_9 = {
    onRestore: (__VLS_ctx.handleRestore)
};
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['admin-page']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__stat']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field--keyword']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-filters__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-page__error']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__head']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__meta']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__status']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__flag']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__flag--manual']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__flag']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__flag--auto']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__action']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__empty']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__footer']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__pager']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-feed-table__pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AdminFeedEditorDrawer: AdminFeedEditorDrawer,
            records: records,
            total: total,
            page: page,
            totalPages: totalPages,
            loading: loading,
            saving: saving,
            errorMessage: errorMessage,
            detail: detail,
            detailLoading: detailLoading,
            detailErrorMessage: detailErrorMessage,
            keyword: keyword,
            source: source,
            category: category,
            status: status,
            editorPick: editorPick,
            featured: featured,
            duplicateGroup: duplicateGroup,
            nextPage: nextPage,
            prevPage: prevPage,
            drawerOpen: drawerOpen,
            sourceOptions: sourceOptions,
            categoryOptions: categoryOptions,
            formatDateTime: formatDateTime,
            handleKeywordInput: handleKeywordInput,
            handleSourceChange: handleSourceChange,
            handleCategoryChange: handleCategoryChange,
            handleStatusChange: handleStatusChange,
            handleEditorPickChange: handleEditorPickChange,
            handleFeaturedChange: handleFeaturedChange,
            handleDuplicateGroupInput: handleDuplicateGroupInput,
            handleOpenDetail: handleOpenDetail,
            handleSave: handleSave,
            handleHide: handleHide,
            handleRestore: handleRestore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
