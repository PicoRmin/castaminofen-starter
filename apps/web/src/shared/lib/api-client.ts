import { getAccessToken } from '@/lib/auth-token';
import { getApiBaseUrl } from '@/shared/lib/env';
import { ApiError, normalizeError } from '@/shared/lib/errors';

export interface ApiFetchOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
}

export function buildApiUrl(path: string, query?: Record<string, unknown>) {
  const normalizedPath = path.replace(/^\//, '');
  const url = new URL(`${getApiBaseUrl()}/${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

async function parseJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, query, headers, ...rest } = options;
  const url = buildApiUrl(path, query);
  const accessToken = getAccessToken();

  const requestHeaders: Record<string, string> = {
    ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(headers ?? {}),
  };

  if (accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    const payload = await parseJson(response);

    if (!response.ok) {
      const message =
        typeof payload === 'object' && payload !== null && 'message' in payload
          ? String((payload as { message?: string }).message)
          : response.statusText;

      throw new ApiError(message || `Request failed with status ${response.status}`, response.status, payload);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (payload as T) ?? ({} as T);
  } catch (error) {
    throw normalizeError(error);
  }
}

export { ApiError, normalizeError } from '@/shared/lib/errors';
