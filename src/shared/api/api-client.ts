type QueryValue = string | number | boolean;

export interface ApiRequestOptions {
  method?: 'GET' | 'POST';
  /** 쿼리 문자열로 전달할 값. 인코딩은 이 함수가 처리합니다. */
  query?: Record<string, QueryValue>;
  /** JSON으로 전송할 본문 */
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * 서버가 `success: false`로 응답했거나 응답 형식이 올바르지 않을 때 던지는 오류입니다.
 * 네트워크 오류처럼 응답 자체를 받지 못한 경우는 `fetch`의 오류가 그대로 전달됩니다.
 */
export class ApiError extends Error {
  readonly status: number;
  /** 서버가 내려준 오류 코드. 응답 본문에 없으면 `undefined`입니다. */
  readonly code: string | undefined;
  /** 서버가 내려준 응답 본문. `failureCount`처럼 오류별로 추가되는 값을 읽을 때 사용합니다. */
  readonly body: Record<string, unknown> | undefined;

  constructor(
    status: number,
    code: string | undefined,
    message: string,
    body?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

/** 상태 코드와 서버 오류 코드(생략하면 상태 코드만)가 일치하는 `ApiError`인지 확인합니다. */
export function isApiError(error: unknown, status: number, code?: string): error is ApiError {
  return (
    error instanceof ApiError &&
    error.status === status &&
    (code === undefined || error.code === code)
  );
}

type ApiEnvelope = Record<string, unknown> & {
  success?: boolean;
  data?: unknown;
  code?: string;
  message?: string;
};

async function readEnvelope(response: Response): Promise<ApiEnvelope | undefined> {
  try {
    const parsed: unknown = await response.json();

    return typeof parsed === 'object' && parsed !== null ? (parsed as ApiEnvelope) : undefined;
  } catch {
    return undefined;
  }
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API 서버 주소가 설정되지 않았습니다.');
  }

  const url = `${baseUrl.replace(/\/$/, '')}${path}`;

  if (!query) {
    return url;
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    params.set(key, String(value));
  }

  return `${url}?${params.toString()}`;
}

/**
 * `{ success, data }` 형태의 JSON API를 호출하고 `data`를 반환합니다.
 * 서버 주소는 `NEXT_PUBLIC_API_BASE_URL` 환경변수를 따르며, `path`는 `/api/...`로 시작합니다.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, signal } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  const envelope = await readEnvelope(response);

  if (!response.ok || envelope?.success !== true) {
    throw new ApiError(
      response.status,
      envelope?.code,
      envelope?.message ?? `요청이 실패했습니다. (${response.status})`,
      envelope,
    );
  }

  return envelope.data as T;
}
