import { computed, readonly, shallowRef, watch } from 'vue';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
function buildYesterdayLabel() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return new Intl.DateTimeFormat('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    }).format(yesterday);
}
function compareByTimeDesc(left, right) {
    const leftTime = left.rawPublishTime || left.createdAt;
    const rightTime = right.rawPublishTime || right.createdAt;
    return new Date(rightTime).getTime() - new Date(leftTime).getTime();
}
function sortRecordsLocally(records, sort) {
    if (sort === 'latest') {
        return [...records];
    }
    const featured = records.filter((item) => item.adminFeatured);
    const rest = records
        .filter((item) => !item.adminFeatured)
        .sort((left, right) => {
        const spicyDelta = (right.spicyIndex ?? 0) - (left.spicyIndex ?? 0);
        if (spicyDelta !== 0) {
            return spicyDelta;
        }
        return compareByTimeDesc(left, right);
    });
    return [...featured, ...rest];
}
export function useFeedQuery() {
    const allRecords = shallowRef([]);
    const page = shallowRef(1);
    const pageSize = shallowRef(10);
    const loading = shallowRef(false);
    const errorMessage = shallowRef('');
    const sort = shallowRef('latest');
    const dateScope = shallowRef('yesterday');
    const yesterdayLabel = computed(() => buildYesterdayLabel());
    const sortedRecords = computed(() => sortRecordsLocally(allRecords.value, sort.value));
    const total = computed(() => sortedRecords.value.length);
    const totalPages = computed(() => {
        if (total.value === 0) {
            return 1;
        }
        return Math.ceil(total.value / pageSize.value);
    });
    const records = computed(() => {
        const fromIndex = (page.value - 1) * pageSize.value;
        const toIndex = fromIndex + pageSize.value;
        return sortedRecords.value.slice(fromIndex, toIndex);
    });
    async function fetchFeeds() {
        loading.value = true;
        errorMessage.value = '';
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('page_size', String(pageSize.value));
        params.set('sort', 'latest');
        params.set('date_scope', dateScope.value);
        params.set('fetch_all', 'true');
        try {
            const response = await fetch(`${API_BASE_URL}/feeds?${params.toString()}`);
            const payload = (await response.json());
            if (!response.ok || payload.code !== 0) {
                throw new Error(payload.message || '列表加载失败');
            }
            allRecords.value = payload.data.records;
            page.value = 1;
        }
        catch (error) {
            errorMessage.value = error instanceof Error ? error.message : '列表加载失败';
            allRecords.value = [];
            page.value = 1;
        }
        finally {
            loading.value = false;
        }
    }
    function updateFilters(next) {
        if (next.sort) {
            sort.value = next.sort;
        }
        page.value = 1;
    }
    function nextPage() {
        if (page.value < totalPages.value) {
            page.value += 1;
        }
    }
    function prevPage() {
        if (page.value > 1) {
            page.value -= 1;
        }
    }
    watch(totalPages, (value) => {
        if (page.value > value) {
            page.value = value;
        }
    }, { immediate: true });
    void fetchFeeds();
    return {
        records: readonly(records),
        total: readonly(total),
        page: readonly(page),
        pageSize: readonly(pageSize),
        totalPages: readonly(totalPages),
        loading: readonly(loading),
        errorMessage: readonly(errorMessage),
        sort: readonly(sort),
        dateScope: readonly(dateScope),
        yesterdayLabel,
        fetchFeeds,
        updateFilters,
        nextPage,
        prevPage,
    };
}
