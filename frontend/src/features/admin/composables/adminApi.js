const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
export async function adminFetch(path, init) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
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
