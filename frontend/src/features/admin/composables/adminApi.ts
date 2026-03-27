import type { ApiResponse } from '@/features/feed/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  let payload: ApiResponse<T> | null = null
  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    payload = null
  }

  if (!response.ok || !payload || payload.code !== 0) {
    throw new Error(payload?.message || '后台请求失败')
  }
  return payload.data
}
