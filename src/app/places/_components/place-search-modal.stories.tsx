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
  const [draftQuery, setDraftQuery] = useState(initialQuery);
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
          allPlaces={allPlaces}
          initialFilters={appliedFilters}
          onClose={() => setOpen(false)}
          onQueryChange={setDraftQuery}
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

    const dialog = await screen.findByRole('dialog', { name: '장소 검색 및 필터' });
    await userEvent.click(within(dialog).getByRole('button', { name: '서울 지역 선택' }));
    await userEvent.click(within(dialog).getByRole('button', { name: '성동구 선택' }));
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
    const dialog = within(await screen.findByRole('dialog', { name: '장소 검색 및 필터' }));
    await userEvent.click(dialog.getByRole('button', { name: '서울 지역 선택' }));
    for (const district of ['종로구', '중구', '용산구']) {
      await userEvent.click(dialog.getByRole('button', { name: `${district} 선택` }));
    }
    await expect(dialog.getByText('3/12')).toBeInTheDocument();
    await expect(dialog.getByRole('button', { name: '성동구 선택' })).toBeDisabled();
    await expect(dialog.queryByRole('button', { name: '서울 필터 해제' })).toBeNull();
    await userEvent.click(dialog.getByRole('button', { name: '용산구 필터 해제' }));
    await expect(dialog.getByRole('button', { name: '성동구 선택' })).toBeEnabled();
    await userEvent.click(dialog.getByRole('button', { name: '성동구 선택' }));
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
    const dialog = within(await screen.findByRole('dialog', { name: '장소 검색 및 필터' }));
    await expect(dialog.getByRole('button', { name: '장소 보기' })).toBeDisabled();
    await expect(dialog.getByRole('button', { name: '검색 실행' })).toBeDisabled();
    await userEvent.type(dialog.getByRole('searchbox'), '성수 카페');
    await expect(dialog.getByRole('button', { name: /장소 \d+곳 보기/ })).toBeEnabled();
    await expect(dialog.getByRole('button', { name: '검색 실행' })).toBeEnabled();
    await userEvent.click(dialog.getByRole('button', { name: /장소 \d+곳 보기/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const SelectedFilterAreaKeepsItsHeight: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '필터 열기' }));

    const dialog = await screen.findByRole('dialog', { name: '장소 검색 및 필터' });
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
    const dialog = within(await screen.findByRole('dialog', { name: '장소 검색 및 필터' }));
    const province = dialog.getByRole('button', { name: '경기 지역 선택' });
    await userEvent.click(province);
    await expect(dialog.getByText('1개 선택')).toBeVisible();
    await expect(province).toHaveAttribute('data-variant', 'radio');
    await expect(province).toHaveTextContent(/^경기$/);
    await expect(province.getBoundingClientRect().width).toBe(52);
    await expect(province.getBoundingClientRect().height).toBe(36);
    await expect(dialog.getByRole('button', { name: '경기 필터 해제' })).toBeInTheDocument();
    await expect(
      dialog.queryByRole('button', { name: '경기 전체 지역 선택' }),
    ).not.toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: '수원시 선택' }));
    await userEvent.click(dialog.getByRole('button', { name: '고양시 선택' }));
    await userEvent.click(dialog.getByRole('button', { name: '서울 지역 선택' }));
    await expect(
      dialog.queryByRole('button', { name: '수원시 필터 해제' }),
    ).not.toBeInTheDocument();
    await expect(
      dialog.queryByRole('button', { name: '고양시 필터 해제' }),
    ).not.toBeInTheDocument();
    await expect(dialog.getByRole('button', { name: '서울 필터 해제' })).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: '성동구 선택' }));
    await userEvent.click(dialog.getByRole('button', { name: '성동구 선택' }));
    await expect(dialog.getByRole('button', { name: '서울 필터 해제' })).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: '성동구 선택' }));
    await userEvent.click(dialog.getByRole('button', { name: '성동구 필터 해제' }));
    await expect(dialog.getByRole('button', { name: '서울 필터 해제' })).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: '서울 필터 해제' }));
    await expect(dialog.getByText('시/도를 먼저 선택해주세요')).toBeInTheDocument();
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
    const restored = normalizePlaceFilters({
      region: ['41', '11'],
      district: ['41:110', '11:200'],
    });
    await expect(restored.regions).toEqual([{ regionId: '11', districtIds: ['200'] }]);
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
    const dialog = within(await screen.findByRole('dialog', { name: '장소 검색 및 필터' }));
    await userEvent.click(dialog.getByRole('button', { name: '세종 지역 선택' }));
    await expect(
      dialog.getByText('선택할 시/군/구가 없어요. 시/도 전체로 검색할 수 있어요.'),
    ).toBeVisible();
    await expect(dialog.getByRole('button', { name: '세종 필터 해제' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: '장소 0곳 보기' })).toBeEnabled();
  },
};
