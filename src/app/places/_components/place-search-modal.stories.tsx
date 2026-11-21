import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/shared/ui';

import {
  emptyPlaceFilters,
  filterPlaces,
  getPlaceFilterCount,
  getPlaceSearchHref,
  normalizePlaceFilters,
  type PlaceFilterState,
} from '../_model/place-filters';
import { allPlaces } from '../_model/recommended-places';
import { placeRegionFixtures } from '../_model/regions.fixtures';
import { PlaceSearchModal } from './place-search-modal';

function PlaceSearchModalHarness({ initialQuery = '성수 카페' }: { initialQuery?: string }) {
  const [open, setOpen] = useState(false);
  const draftQuery = initialQuery;
  const [appliedFilters, setAppliedFilters] = useState<PlaceFilterState>(emptyPlaceFilters);

  return (
    <div className="p-24">
      <Button onClick={() => setOpen(true)} size="sm">
        필터 열기
      </Button>
      <p aria-live="polite" className="mt-16" data-testid="applied-filter-count">
        필터 {getPlaceFilterCount(appliedFilters)}개 적용
      </p>
      {open ? (
        <PlaceSearchModal
          regions={placeRegionFixtures}
          initialFilters={appliedFilters}
          onClose={() => setOpen(false)}
          onSubmit={(_, filters) => {
            setAppliedFilters(filters);
            setOpen(false);
          }}
          query={draftQuery}
        />
      ) : null}
    </div>
  );
}

const meta = {
  title: 'App/Places/PlaceSearchModal',
  render: () => <PlaceSearchModalHarness />,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ApplyCombinedFilters: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '필터 열기' }));

    const dialog = await screen.findByRole('dialog', { name: '장소 필터' });
    await userEvent.click(within(dialog).getByRole('button', { name: '서울' }));
    await userEvent.click(within(dialog).getByRole('checkbox', { name: '성동구' }));
    await userEvent.click(within(dialog).getByRole('button', { name: '카테고리 필터' }));
    await userEvent.click(
      within(dialog).getByRole('button', { name: '카페·디저트 카테고리 선택' }),
    );

    await waitFor(() => expect(within(dialog).getByText('2/12')).toBeInTheDocument());
    await expect(within(dialog).getByRole('button', { name: '장소 2곳 보기' })).toBeEnabled();
    await userEvent.click(within(dialog).getByRole('button', { name: '장소 2곳 보기' }));

    await waitFor(() =>
      expect(canvas.getByTestId('applied-filter-count')).toHaveTextContent('필터 2개 적용'),
    );
  },
};

export const CapsDistrictsAtThree: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '필터 열기' }));
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await userEvent.click(dialog.getByRole('button', { name: '서울' }));
    for (const district of ['종로구', '중구', '용산구']) {
      await userEvent.click(dialog.getByRole('checkbox', { name: district }));
    }
    await expect(dialog.getByText('3/12')).toBeInTheDocument();
    await expect(dialog.getByRole('checkbox', { name: '성동구' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await userEvent.click(dialog.getByRole('button', { name: '부산' }));
    await expect(dialog.getByRole('button', { name: '종로구 필터 해제' })).toBeInTheDocument();
    await expect(dialog.getByRole('checkbox', { name: '중구' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await userEvent.click(dialog.getByRole('button', { name: '서울' }));
    await expect(dialog.queryByRole('button', { name: '서울 필터 해제' })).toBeNull();
    await userEvent.click(dialog.getByRole('button', { name: '용산구 필터 해제' }));
    await expect(dialog.getByRole('checkbox', { name: '성동구' })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await userEvent.click(dialog.getByRole('checkbox', { name: '성동구' }));
    await userEvent.click(dialog.getByRole('button', { name: '카테고리 필터' }));
    for (const concept of [
      '음식점',
      '카페·디저트',
      '전시·박물관',
      '공연',
      '체험',
      '놀이·레저',
      '자연·산책',
      '쇼핑',
      '명소·전망',
    ]) {
      await userEvent.click(dialog.getByRole('button', { name: `${concept} 카테고리 선택` }));
    }
    await expect(dialog.getByText('12/12')).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: '선택 초기화' }));
    await expect(dialog.getByText('0/12')).toBeInTheDocument();
  },
};

export const EmptyAndQueryOnly: Story = {
  render: () => <PlaceSearchModalHarness initialQuery="" />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '필터 열기' }));
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await expect(dialog.getByRole('button', { name: '장소 보기' })).toBeDisabled();
    await expect(dialog.queryByRole('searchbox')).not.toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: '서울' }));
    await expect(dialog.getByRole('button', { name: '장소 보기' })).toBeDisabled();
    await userEvent.click(dialog.getByRole('checkbox', { name: '전체' }));
    await expect(dialog.getByRole('button', { name: /장소 \d+곳 보기/ })).toBeEnabled();
    await userEvent.click(dialog.getByRole('button', { name: /장소 \d+곳 보기/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const SelectedFilterAreaKeepsItsHeight: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '필터 열기' }));

    const dialog = await screen.findByRole('dialog', { name: '장소 필터' });
    const selectedSection = dialog.querySelector('[data-slot="selected-filter-section"]');
    const selectedFilters = dialog.querySelector('[data-slot="selected-filters"]');
    const viewButton = within(dialog).getByRole('button', { name: /장소 \d+곳 보기/ });
    await expect(selectedSection).not.toBeNull();
    await expect(selectedFilters).not.toBeNull();

    await userEvent.click(within(dialog).getByRole('button', { name: '카테고리 필터' }));
    const sectionHeight = selectedSection?.getBoundingClientRect().height;
    const reservedHeight = selectedFilters?.getBoundingClientRect().height;
    const viewButtonTop = viewButton.getBoundingClientRect().top;
    await expect(sectionHeight).toBe(114);
    await expect(reservedHeight).toBe(84);

    for (const concept of [
      '음식점',
      '카페·디저트',
      '전시·박물관',
      '공연',
      '체험',
      '놀이·레저',
      '자연·산책',
    ]) {
      await userEvent.click(
        within(dialog).getByRole('button', { name: `${concept} 카테고리 선택` }),
      );
    }

    await expect(selectedSection?.getBoundingClientRect().height).toBe(sectionHeight);
    await expect(selectedFilters?.getBoundingClientRect().height).toBe(reservedHeight);
    await expect(viewButton.getBoundingClientRect().top).toBe(viewButtonTop);
  },
};

export const SingleProvinceSelection: Story = {
  render: () => <PlaceSearchModalHarness initialQuery="" />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '필터 열기' }));
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await userEvent.click(dialog.getByRole('button', { name: '경기' }));
    await userEvent.click(dialog.getByRole('checkbox', { name: '수원시' }));
    await expect(dialog.getByRole('button', { name: '수원시 필터 해제' })).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: '서울' }));
    await expect(dialog.getByRole('button', { name: '수원시 필터 해제' })).toBeInTheDocument();
    await expect(dialog.getByRole('checkbox', { name: '성동구' })).not.toBeChecked();
    await userEvent.click(dialog.getByRole('checkbox', { name: '성동구' }));
    await expect(
      dialog.queryByRole('button', { name: '수원시 필터 해제' }),
    ).not.toBeInTheDocument();
    await expect(dialog.getByRole('button', { name: '성동구 필터 해제' })).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: '성동구 필터 해제' }));
    await expect(dialog.getByText('0/12')).toBeInTheDocument();
    await expect(dialog.getByRole('checkbox', { name: '전체' })).not.toBeChecked();
    const filters: PlaceFilterState = {
      regions: [{ regionId: '41', districtIds: ['110', '280'] }],
      conceptIds: ['cafe'],
    };
    const params = new URL(getPlaceSearchHref('', filters), 'http://localhost').searchParams;
    await expect(
      normalizePlaceFilters({
        region: params.getAll('region'),
        district: params.getAll('district'),
        concept: params.getAll('concept'),
      }),
    ).toEqual(filters);
    await expect(
      filterPlaces(
        [
          { ...allPlaces[0], regionId: '41', districtId: '110', category: '카페' },
          { ...allPlaces[0], id: 'excluded', regionId: '11', districtId: '200' },
        ],
        '',
        filters,
      ),
    ).toHaveLength(1);
  },
};

export const ProvinceWithoutDistricts: Story = {
  render: () => <PlaceSearchModalHarness initialQuery="" />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '필터 열기' }));
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await userEvent.click(dialog.getByRole('button', { name: '세종' }));
    await expect(
      dialog.getByText('선택할 시/군/구가 없어요. 시/도 전체로 검색할 수 있어요.'),
    ).toBeVisible();
    await expect(dialog.getByRole('checkbox', { name: '전체' })).toBeEnabled();
    await userEvent.click(dialog.getByRole('checkbox', { name: '전체' }));
    await expect(dialog.getByRole('button', { name: '세종 필터 해제' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: '장소 0곳 보기' })).toBeEnabled();
  },
};

function RegionsLoadingHarness() {
  const [open, setOpen] = useState(true);
  const query = '성수';

  return (
    <div className="p-24">
      {open ? (
        <PlaceSearchModal
          initialFilters={emptyPlaceFilters}
          onClose={() => setOpen(false)}
          onSubmit={() => {}}
          query={query}
          regionNotice={
            <div className="py-16 text-center text-caption-c2 text-text-tertiary" role="status">
              <p>지역 정보를 불러오고 있어요.</p>
            </div>
          }
          regions={[]}
          regionsReady={false}
        />
      ) : null}
    </div>
  );
}

export const RegionsLoadingState: Story = {
  render: () => <RegionsLoadingHarness />,
  play: async () => {
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await expect(dialog.getByRole('status')).toHaveTextContent('지역 정보를 불러오고 있어요.');
    const submitButton = dialog.getByRole('button', { name: '지역 정보 확인 중' });
    await expect(submitButton).toBeDisabled();
    await expect(dialog.queryByRole('searchbox')).not.toBeInTheDocument();
    await expect(dialog.getByRole('button', { name: '지역 필터' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: '카테고리 필터' })).toBeVisible();
  },
};

function RegionsArriveHarness() {
  const [ready, setReady] = useState(false);
  return (
    <div className="p-24">
      <PlaceSearchModal
        initialFilters={emptyPlaceFilters}
        onClose={() => {}}
        onSubmit={() => {}}
        query=""
        regionNotice={
          !ready ? (
            <Button onClick={() => setReady(true)} size="sm">
              지역 데이터 도착
            </Button>
          ) : null
        }
        regions={ready ? placeRegionFixtures : []}
        regionsReady={ready}
      />
    </div>
  );
}

export const RegionsArriveAfterLoading: Story = {
  render: () => <RegionsArriveHarness />,
  play: async () => {
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await expect(dialog.queryByRole('button', { name: '서울' })).not.toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: '지역 데이터 도착' }));
    await expect(await dialog.findByRole('button', { name: '서울' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(dialog.getByRole('checkbox', { name: '종로구' })).toBeInTheDocument();
  },
};

function RegionsEmptyHarness() {
  const [open, setOpen] = useState(true);
  const query = '';

  return (
    <div className="p-24">
      {open ? (
        <PlaceSearchModal
          initialFilters={emptyPlaceFilters}
          onClose={() => setOpen(false)}
          onSubmit={() => {}}
          query={query}
          regionNotice={
            <div className="py-16 text-center text-caption-c2 text-text-tertiary" role="status">
              <p>등록된 지역 정보가 없어요.</p>
            </div>
          }
          regions={[]}
          regionsReady={true}
        />
      ) : null}
    </div>
  );
}

export const RegionsEmptyState: Story = {
  render: () => <RegionsEmptyHarness />,
  play: async () => {
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await expect(dialog.getByRole('status')).toHaveTextContent('등록된 지역 정보가 없어요.');
    await expect(dialog.queryByRole('searchbox')).not.toBeInTheDocument();
    await expect(dialog.getByRole('button', { name: '지역 필터' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: '카테고리 필터' })).toBeVisible();
  },
};

function RegionsErrorRetryHarness() {
  const [open, setOpen] = useState(true);
  const [isError, setIsError] = useState(true);
  const query = '성수';

  return (
    <div className="p-24">
      {open ? (
        <PlaceSearchModal
          initialFilters={emptyPlaceFilters}
          onClose={() => setOpen(false)}
          onSubmit={() => {}}
          query={query}
          regionNotice={
            isError ? (
              <div
                className="flex flex-col items-center justify-center gap-12 py-16 text-caption-c2 text-text-tertiary"
                role="alert"
              >
                <p>지역 정보를 불러오지 못했어요.</p>
                <Button onClick={() => setIsError(false)} size="sm">
                  다시 시도
                </Button>
              </div>
            ) : null
          }
          regions={isError ? [] : placeRegionFixtures}
          regionsReady={!isError}
        />
      ) : null}
    </div>
  );
}

export const RegionsErrorRetryState: Story = {
  render: () => <RegionsErrorRetryHarness />,
  play: async () => {
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await expect(dialog.getByRole('alert')).toHaveTextContent('지역 정보를 불러오지 못했어요.');
    const retryButton = dialog.getByRole('button', { name: '다시 시도' });
    await expect(retryButton).toBeVisible();

    await userEvent.click(retryButton);
    await waitFor(() => expect(dialog.queryByRole('alert')).not.toBeInTheDocument());
    await expect(await dialog.findByRole('button', { name: '서울' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: '장소 13곳 보기' })).toBeEnabled();
  },
};

export const GroupedDistricts: Story = {
  render: () => <PlaceSearchModalHarness initialQuery="" />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '필터 열기' }));
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await userEvent.click(dialog.getByRole('button', { name: '경기' }));
    await expect(dialog.queryByRole('checkbox', { name: '성남시 분당구' })).toBeNull();
    await userEvent.click(dialog.getByRole('button', { name: '성남시 하위 지역 보기' }));
    await userEvent.click(dialog.getByRole('checkbox', { name: '분당구' }));
    await expect(
      dialog.getByRole('button', { name: '성남시 분당구 필터 해제' }),
    ).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('checkbox', { name: '수정구' }));
    await userEvent.click(dialog.getByRole('checkbox', { name: '중원구' }));
    await expect(dialog.getByRole('button', { name: '성남시 필터 해제' })).toBeInTheDocument();
    await expect(dialog.getByText('1/12')).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('checkbox', { name: '분당구' }));
    await expect(
      dialog.getByRole('button', { name: '성남시 분당구 필터 해제' }),
    ).toBeInTheDocument();
  },
};

export const RestoredDistrictKeepsExplorationOnClear: Story = {
  render: () => (
    <PlaceSearchModal
      initialFilters={normalizePlaceFilters(
        { region: '41', district: '41:135' },
        placeRegionFixtures,
      )}
      onClose={() => {}}
      onSubmit={() => {}}
      query=""
      regions={placeRegionFixtures}
    />
  ),
  play: async () => {
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    const child = dialog.getByRole('checkbox', { name: '분당구' });
    child.focus();
    await userEvent.keyboard(' ');
    await expect(child).toHaveFocus();
    await expect(child).not.toBeChecked();
    await expect(dialog.getByText('0/12')).toBeInTheDocument();
    await expect(dialog.getByRole('button', { name: '성남시 하위 지역 보기' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await userEvent.keyboard(' ');
    await expect(child).toBeChecked();
    await userEvent.click(dialog.getByRole('button', { name: '성남시 분당구 필터 해제' }));
    await expect(child).toBeInTheDocument();
    await expect(child).not.toBeChecked();
    await expect(dialog.getByRole('button', { name: '성남시 하위 지역 보기' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  },
};

export const FourChildrenRespectDistrictLimit: Story = {
  render: () => <PlaceSearchModalHarness initialQuery="" />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '필터 열기' }));
    const dialog = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await userEvent.click(dialog.getByRole('button', { name: '경기' }));
    await userEvent.click(dialog.getByRole('button', { name: '수원시 하위 지역 보기' }));
    for (const name of ['장안구', '권선구', '팔달구']) {
      await userEvent.click(dialog.getByRole('checkbox', { name }));
    }
    await expect(dialog.getByRole('checkbox', { name: '영통구' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await expect(dialog.getByText('3/12')).toBeInTheDocument();
    await expect(
      dialog.getByRole('button', { name: '수원시 팔달구 필터 해제' }),
    ).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('checkbox', { name: '장안구' }));
    await expect(dialog.getByRole('checkbox', { name: '영통구' })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
  },
};
