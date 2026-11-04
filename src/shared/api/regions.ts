import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';

const regionSchema = z.object({
  sidoCode: z.string().regex(/^\d{2}$/),
  sidoName: z.string().min(1),
  sigungus: z.array(
    z.object({
      sigunguCode: z.string().regex(/^\d{3}$/),
      sigunguName: z.string().min(1),
    }),
  ),
});

const regionsResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(regionSchema),
});

export type Region = z.infer<typeof regionSchema>;

/**
 * 공개 지역 API에서 전국 시/도와 하위 시/군/구 목록을 일괄 조회합니다.
 * 응답을 Zod 스키마로 검증하고 지역 코드를 문자열로 보존합니다.
 *
 * @param options 요청 옵션. 생략하면 기본 옵션으로 조회합니다.
 * @param options.signal 요청 취소 신호. TanStack Query의 취소 신호를 전달할 수 있습니다.
 * @returns 응답 형식 검증을 통과한 지역 목록. 등록된 지역이 없으면 빈 배열입니다.
 * @throws API 서버 주소가 없거나 HTTP 응답이 성공 상태가 아니면 오류를 던집니다.
 * @throws 네트워크/요청 취소/JSON 파싱/스키마 검증 오류는 호출자에게 전파합니다.
 */
export async function getRegions({ signal }: { signal?: AbortSignal } = {}): Promise<Region[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error('API 서버 주소가 설정되지 않았습니다.');

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/regions`, { signal });
  if (!response.ok) throw new Error('지역 목록을 불러오지 못했습니다.');
  return regionsResponseSchema.parse(await response.json()).data;
}

/**
 * 전체 지역 목록을 `['regions']` 키로 공유하는 Query 설정입니다.
 * 데이터를 24시간 동안 최신으로 취급하고, 미사용 캐시도 24시간 보관합니다.
 * 조회 실패 시 한 번 재시도하며 창 포커스 복귀 시 자동 재조회는 하지 않습니다.
 *
 * @see getRegions
 */
export const regionQueryOptions = queryOptions({
  queryKey: ['regions'],
  queryFn: getRegions,
  staleTime: 24 * 60 * 60 * 1000,
  gcTime: 24 * 60 * 60 * 1000,
  retry: 1,
  refetchOnWindowFocus: false,
});
