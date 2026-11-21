import { afterEach, describe, expect, it, vi } from 'vitest';

import { getRegions, regionQueryOptions } from './regions';

const region = {
  sidoCode: '41',
  sidoName: '경기도',
  sigungus: [
    {
      sigunguCode: '130',
      sigunguName: '성남시',
      subRegions: [{ sigunguCode: '135', sigunguName: '분당구' }],
    },
  ],
};

function respond(data: unknown) {
  vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://regions.test');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: true, data })));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('지역 API 스키마', () => {
  it('하위 지역과 문자열 코드를 보존하고 취소 신호를 전달한다', async () => {
    respond([region]);
    const signal = new AbortController().signal;
    await expect(getRegions({ signal })).resolves.toEqual([region]);
    expect(fetch).toHaveBeenCalledWith(
      'https://regions.test/api/v1/regions',
      expect.objectContaining({ signal }),
    );
  });

  it('빈 지역 목록과 빈 하위 지역 목록을 허용한다', async () => {
    respond([]);
    await expect(getRegions()).resolves.toEqual([]);
    const flat = [{ ...region, sigungus: [{ ...region.sigungus[0], subRegions: [] }] }];
    respond(flat);
    await expect(getRegions()).resolves.toEqual(flat);
  });

  it.each([
    { sigunguCode: '130', sigunguName: '성남시' },
    { ...region.sigungus[0], subRegions: null },
    ...['13', '0135', 'abc', 135].map((sigunguCode) => ({
      ...region.sigungus[0],
      subRegions: [{ sigunguCode, sigunguName: '분당구' }],
    })),
    { ...region.sigungus[0], subRegions: [{ sigunguCode: '135', sigunguName: '' }] },
  ])('하위 지역 누락과 잘못된 하위 코드/이름을 거부한다: %j', async (district) => {
    respond([{ ...region, sigungus: [district] }]);
    await expect(getRegions()).rejects.toThrow();
  });

  it('구버전 메모리 캐시와 계층 응답의 키를 분리한다', () => {
    expect(regionQueryOptions.queryKey).toEqual(['regions', 'hierarchy']);
    expect(regionQueryOptions.staleTime).toBe(24 * 60 * 60 * 1000);
    expect(regionQueryOptions.gcTime).toBe(24 * 60 * 60 * 1000);
  });
});
