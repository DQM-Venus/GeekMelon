import { readonly, shallowRef } from 'vue';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const currentUser = shallowRef(null);
const loading = shallowRef(false);
const initialized = shallowRef(false);
async function requestJson(input, init) {
    const response = await fetch(input, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
        ...init,
    });
    let payload = null;
    try {
        payload = (await response.json());
    }
    catch {
        payload = null;
    }
    if (!response.ok || !payload || payload.code !== 0) {
        throw new Error(payload?.message || '后台请求失败');
    }
    return payload.data;
}
export function useAdminSession() {
    async function refreshSession(force = false) {
        if (loading.value) {
            return currentUser.value;
        }
        if (initialized.value && !force) {
            return currentUser.value;
        }
        loading.value = true;
        try {
            currentUser.value = await requestJson(`${API_BASE_URL}/admin/auth/me`);
            initialized.value = true;
            return currentUser.value;
        }
        catch {
            currentUser.value = null;
            initialized.value = true;
            return null;
        }
        finally {
            loading.value = false;
        }
    }
    async function login(username, password) {
        loading.value = true;
        try {
            currentUser.value = await requestJson(`${API_BASE_URL}/admin/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            initialized.value = true;
            return currentUser.value;
        }
        finally {
            loading.value = false;
        }
    }
    async function logout() {
        loading.value = true;
        try {
            await requestJson(`${API_BASE_URL}/admin/auth/logout`, {
                method: 'POST',
            });
            currentUser.value = null;
            initialized.value = true;
        }
        finally {
            loading.value = false;
        }
    }
    return {
        currentUser: readonly(currentUser),
        loading: readonly(loading),
        initialized: readonly(initialized),
        refreshSession,
        login,
        logout,
    };
}
