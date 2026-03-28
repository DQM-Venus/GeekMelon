import { readonly, shallowRef } from 'vue';
import { adminFetch } from '@/features/admin/composables/adminApi';
export function useAdminSources() {
    const sources = shallowRef([]);
    const runs = shallowRef([]);
    const loading = shallowRef(false);
    const saving = shallowRef(false);
    const errorMessage = shallowRef('');
    async function fetchSources() {
        loading.value = true;
        errorMessage.value = '';
        try {
            const [sourceRecords, runRecords] = await Promise.all([
                adminFetch('/admin/sources'),
                adminFetch('/admin/tasks/runs'),
            ]);
            sources.value = sourceRecords;
            runs.value = runRecords;
        }
        catch (error) {
            errorMessage.value = error instanceof Error ? error.message : '加载来源配置失败';
            sources.value = [];
            runs.value = [];
        }
        finally {
            loading.value = false;
        }
    }
    async function saveSource(sourceKey, payload) {
        saving.value = true;
        errorMessage.value = '';
        try {
            const updated = await adminFetch(`/admin/sources/${sourceKey}`, {
                method: 'PATCH',
                body: JSON.stringify(payload),
            });
            sources.value = sources.value.map((item) => (item.sourceKey === sourceKey ? updated : item));
            return updated;
        }
        catch (error) {
            errorMessage.value = error instanceof Error ? error.message : '保存来源配置失败';
            throw error;
        }
        finally {
            saving.value = false;
        }
    }
    async function runCollect(sourceKey) {
        saving.value = true;
        errorMessage.value = '';
        try {
            const log = await adminFetch('/admin/tasks/collect', {
                method: 'POST',
                body: JSON.stringify({ sourceKey }),
            });
            runs.value = [log, ...runs.value.filter((item) => item.id !== log.id)].slice(0, 20);
            return log;
        }
        catch (error) {
            errorMessage.value = error instanceof Error ? error.message : '手动抓取失败';
            throw error;
        }
        finally {
            saving.value = false;
        }
    }
    async function previewSource(sourceKey) {
        saving.value = true;
        errorMessage.value = '';
        try {
            return await adminFetch('/admin/tasks/preview', {
                method: 'POST',
                body: JSON.stringify({ sourceKey }),
            });
        }
        catch (error) {
            errorMessage.value = error instanceof Error ? error.message : '预览抓取失败';
            throw error;
        }
        finally {
            saving.value = false;
        }
    }
    return {
        sources: readonly(sources),
        runs: readonly(runs),
        loading: readonly(loading),
        saving: readonly(saving),
        errorMessage: readonly(errorMessage),
        fetchSources,
        saveSource,
        runCollect,
        previewSource,
    };
}
