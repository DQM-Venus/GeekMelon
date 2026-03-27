import { computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useAdminSession } from '@/features/admin/composables/useAdminSession';
const route = useRoute();
const router = useRouter();
const { currentUser, logout, loading } = useAdminSession();
const navItems = [
    { label: '概览', to: '/admin/dashboard' },
    { label: '内容管理', to: '/admin/feeds' },
    { label: '来源与抓取', to: '/admin/sources' },
];
const activePath = computed(() => route.path);
async function handleLogout() {
    await logout();
    await router.replace('/admin/login');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['admin-shell__nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__logout']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__nav-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__logout']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__logout']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__footer']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__title']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-shell" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "admin-shell__sidebar gm-section-card gm-noise" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-shell__brand" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "admin-shell__eyebrow" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "admin-shell__title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "admin-shell__subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "admin-shell__nav" },
    'aria-label': "后台菜单",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.navItems))) {
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        key: (item.to),
        to: (item.to),
        ...{ class: "admin-shell__nav-link" },
        dataActive: (__VLS_ctx.activePath.startsWith(item.to)),
    }));
    const __VLS_2 = __VLS_1({
        key: (item.to),
        to: (item.to),
        ...{ class: "admin-shell__nav-link" },
        dataActive: (__VLS_ctx.activePath.startsWith(item.to)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: "admin-shell__nav-dot" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.label);
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-shell__footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-shell__user" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "admin-shell__user-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.currentUser?.displayName || __VLS_ctx.currentUser?.username);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleLogout) },
    ...{ class: "admin-shell__logout" },
    type: "button",
    disabled: (__VLS_ctx.loading),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "admin-shell__main" },
});
const __VLS_4 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
/** @type {__VLS_StyleScopedClasses['admin-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-noise']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__brand']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__nav']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__nav-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__footer']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__user']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__user-label']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__logout']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-shell__main']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterLink: RouterLink,
            RouterView: RouterView,
            currentUser: currentUser,
            loading: loading,
            navItems: navItems,
            activePath: activePath,
            handleLogout: handleLogout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
