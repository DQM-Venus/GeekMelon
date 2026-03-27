import { shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminSession } from '@/features/admin/composables/useAdminSession';
const router = useRouter();
const route = useRoute();
const { login, loading } = useAdminSession();
const username = shallowRef('admin');
const password = shallowRef('geekmelon-admin');
const errorMessage = shallowRef('');
async function handleSubmit() {
    errorMessage.value = '';
    try {
        await login(username.value, password.value);
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin/dashboard';
        await router.replace(redirect);
    }
    catch (error) {
        errorMessage.value = error instanceof Error ? error.message : '登录失败';
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['admin-login__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__error']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "admin-login" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "admin-login__card gm-section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-login__hero" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "admin-login__eyebrow" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "admin-login__title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "admin-login__copy" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
    ...{ class: "admin-login__form" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "admin-login__field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    value: (__VLS_ctx.username),
    type: "text",
    autocomplete: "username",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "admin-login__field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "password",
    autocomplete: "current-password",
});
(__VLS_ctx.password);
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "admin-login__error" },
    });
    (__VLS_ctx.errorMessage);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "admin-login__submit" },
    type: "submit",
    disabled: (__VLS_ctx.loading),
});
(__VLS_ctx.loading ? '登录中...' : '进入后台');
/** @type {__VLS_StyleScopedClasses['admin-login']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__card']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__hero']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__title']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__copy']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__form']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__field']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__error']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-login__submit']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            username: username,
            password: password,
            errorMessage: errorMessage,
            handleSubmit: handleSubmit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
