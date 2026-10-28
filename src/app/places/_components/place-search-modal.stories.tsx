import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/shared/ui';

import {
  emptyPlaceFilters,
  getPlaceFilterCount,
  type PlaceFilterState,
} from '../_model/place-filters';
import { allPlaces } from '../_model/recommended-places';
import { PlaceSearchModal } from './place-search-modal';

function PlaceSearchModalHarness() {
  const [open, setOpen] = useState(false);
  const [draftQuery, setDraftQuery] = useState('성수 카페');
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

    await waitFor(() => expect(within(dialog).getByText('3/7')).toBeInTheDocument());
    await expect(within(dialog).getByRole('button', { name: '장소 2곳 보기' })).toBeEnabled();
    await userEvent.click(within(dialog).getByRole('button', { name: '장소 2곳 보기' }));

    await waitFor(() =>
      expect(canvas.getByTestId('applied-filter-count')).toHaveTextContent('필터 3개 적용'),
    );
  },
};

export const CapsSelectionsAtSeven: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '필터 열기' }));

    const dialog = await screen.findByRole('dialog', { name: '장소 검색 및 필터' });
    await userEvent.click(within(dialog).getByRole('button', { name: '서울 지역 선택' }));

    for (const district of ['종로구', '중구', '용산구', '성동구', '광진구', '동대문구']) {
      await userEvent.click(within(dialog).getByRole('button', { name: `${district} 선택` }));
    }

    await waitFor(() => expect(within(dialog).getByText('7/7')).toBeInTheDocument());
    await expect(within(dialog).getByRole('button', { name: '중랑구 선택' })).toBeDisabled();

    await userEvent.click(within(dialog).getByRole('button', { name: '카테고리 필터' }));
    await expect(
      within(dialog).getByRole('button', { name: '카페·디저트 카테고리 선택' }),
    ).toBeDisabled();

    await userEvent.click(within(dialog).getByRole('button', { name: '지역 필터' }));
    await userEvent.click(within(dialog).getByRole('button', { name: '동대문구 필터 해제' }));
    await expect(within(dialog).getByText('6/7')).toBeInTheDocument();
    await expect(within(dialog).getByRole('button', { name: '중랑구 선택' })).toBeEnabled();

    await userEvent.click(within(dialog).getByRole('button', { name: '선택 초기화' }));
    await userEvent.click(within(dialog).getByRole('button', { name: '카테고리 필터' }));
    for (const concept of [
      '음식점',
      '카페·디저트',
      '전시·박물관',
      '공연',
      '체험',
      '놀거리·레저',
      '자연·산책',
    ]) {
      await userEvent.click(
        within(dialog).getByRole('button', { name: `${concept} 카테고리 선택` }),
      );
    }
    await userEvent.click(within(dialog).getByRole('button', { name: '지역 필터' }));
    await expect(within(dialog).getByText('7/7')).toBeInTheDocument();
    await expect(within(dialog).getByRole('button', { name: '서울 지역 선택' })).toBeDisabled();
    await expect(within(dialog).getByRole('button', { name: '부산 지역 선택' })).toBeDisabled();
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
    await expect(sectionHeight).toBe(66);
    await expect(reservedHeight).toBe(36);

    for (const concept of [
      '음식점',
      '카페·디저트',
      '전시·박물관',
      '공연',
      '체험',
      '놀거리·레저',
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
