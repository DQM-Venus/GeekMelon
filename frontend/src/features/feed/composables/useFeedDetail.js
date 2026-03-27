import { readonly, shallowRef } from 'vue';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
export function useFeedDetail() {
    const selectedId = shallowRef(null);
    const detail = shallowRef(null);
    const loading = shallowRef(false);
    const errorMessage = shallowRef('');
    const open = shallowRef(false);
    async function openDetail(id) {
        selectedId.value = id;
        open.value = true;
        loading.value = true;
        errorMessage.value = '';
        try {
            const response = await fetch(`${API_BASE_URL}/feeds/${id}`);
            const payload = (await response.json());
            if (!response.ok || payload.code !== 0) {
                throw new Error(payload.message || '详情加载失败');
            }
            detail.value = payload.data;
        }
        catch (error) {
            detail.value = null;
            errorMessage.value = error instanceof Error ? error.message : '详情加载失败';
        }
        finally {
            loading.value = false;
        }
    }
    function closeDetail() {
        open.value = false;
    }
    return {
        selectedId: readonly(selectedId),
        detail: readonly(detail),
        loading: readonly(loading),
        errorMessage: readonly(errorMessage),
        open: readonly(open),
        openDetail,
        closeDetail,
    };
}
