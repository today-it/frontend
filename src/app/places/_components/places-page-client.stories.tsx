import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { getRouter } from '@storybook/nextjs-vite/navigation.mock';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { regionQueryOptions } from '@/shared/api';

import { emptyPlaceFilters } from '../_model/place-filters';
import { regionFixtures } from '../_model/regions.fixtures';
import { PlacesPageClient } from './places-page-client';

const meta = {
  title: 'App/Places/PlacesPageClient',
  component: PlacesPageClient,
  decorators: [
    (Story) => {
      const [client] = useState(() => {
        const queryClient = new QueryClient();
        queryClient.setQueryData(regionQueryOptions.queryKey, regionFixtures);
        return queryClient;
      });
      return (
        <QueryClientProvider client={client}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  args: {
    initialFilters: emptyPlaceFilters,
    initialQuery: '',
    sort: 'POPULAR',
    children: (
      <main>
        <button type="button">다른 영역</button>
      </main>
    ),
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PlacesPageClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RevealSuggestionsOnSearchFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: '검색어' });
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(search);
    const dialog = await screen.findByRole('dialog', { name: '장소 검색 제안' });
    await expect(within(dialog).getByRole('searchbox')).toHaveFocus();
    await expect(
      within(dialog).queryByRole('button', { name: '지역 필터' }),
    ).not.toBeInTheDocument();
    await expect(within(dialog).getByRole('status')).toHaveTextContent('장소 이름을 입력해주세요.');
    await expect(screen.getAllByRole('dialog')).toHaveLength(1);
    await expect(screen.getAllByRole('searchbox')).toHaveLength(1);
    await expect(screen.queryByRole('button', { name: '지역 필터' })).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(search).toHaveFocus());
    const backdrop = () => document.querySelector<HTMLElement>('[data-slot="modal-backdrop"]');
    for (let index = 0; index < 3; index += 1) {
      await userEvent.click(search);
      await screen.findByRole('dialog', { name: '장소 검색 제안' });
      const background = backdrop();
      if (!background) throw new Error('검색 제안 배경을 찾을 수 없습니다.');
      await userEvent.click(background);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      await waitFor(() => expect(search).toHaveFocus());
    }
  },
};

export const OpenModalFromRegionTabAndReclickClose: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regionTab = canvas.getByRole('button', { name: '지역 필터' });

    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(regionTab);

    const dialog = await screen.findByRole('dialog', { name: '장소 필터' });
    const modalRegionTab = within(dialog).getByRole('button', { name: '지역 필터' });
    await expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    await expect(dialog.getBoundingClientRect().top).toBe(158);
    const panel = dialog.lastElementChild!;
    await expect(panel.getBoundingClientRect().top).toBe(226);
    await waitFor(() => expect(modalRegionTab).toHaveFocus());
    await expect(modalRegionTab).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(modalRegionTab);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(regionTab).toHaveFocus());
  },
};

export const OpenModalFromCategoryTabAndReclickClose: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const categoryTab = canvas.getByRole('button', { name: '카테고리 필터' });

    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(categoryTab);

    const dialog = await screen.findByRole('dialog', { name: '장소 필터' });
    const modalCategoryTab = within(dialog).getByRole('button', { name: '카테고리 필터' });
    await expect(modalCategoryTab).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(modalCategoryTab).toHaveFocus());
    await expect(
      within(dialog).getByRole('button', { name: '카페·디저트 카테고리 선택' }),
    ).toBeInTheDocument();

    await userEvent.click(modalCategoryTab);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(categoryTab).toHaveFocus());
  },
};

export const PreserveQueryAndFiltersOnClose: Story = {
  args: {
    initialFilters: {
      regions: [{ regionId: '11', districtIds: ['200'] }],
      conceptIds: ['cafe'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: '검색어' });
    const regionTab = canvas.getByRole('button', { name: '지역 필터' });
    const categoryTab = canvas.getByRole('button', { name: '카테고리 필터' });

    await expect(within(regionTab).getByText('1')).toBeInTheDocument();
    await expect(within(categoryTab).getByText('1')).toBeInTheDocument();

    await userEvent.click(search);
    const dialog1 = await screen.findByRole('dialog', { name: '장소 검색 제안' });
    const modalSearch1 = within(dialog1).getByRole('searchbox', { name: '검색어' });
    await userEvent.type(modalSearch1, '성수 카페');
    await expect(modalSearch1).toHaveValue('성수 카페');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(search).toHaveFocus());
    await expect(search).toHaveValue('성수 카페');

    await userEvent.click(regionTab);
    const dialog2 = await screen.findByRole('dialog', { name: '장소 필터' });
    await expect(within(dialog2).getByRole('button', { name: '지역 필터' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(within(dialog2).queryByRole('searchbox')).not.toBeInTheDocument();
    await userEvent.click(within(dialog2).getByRole('button', { name: '부산' }));
    await userEvent.click(within(dialog2).getByRole('checkbox', { name: '중구' }));
    await expect(
      within(dialog2).getByRole('button', { name: '중구 필터 해제' }),
    ).toBeInTheDocument();
    await expect(
      within(dialog2).queryByRole('button', { name: '성동구 필터 해제' }),
    ).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(regionTab).toHaveFocus());

    await userEvent.click(categoryTab);
    const dialog3 = await screen.findByRole('dialog', { name: '장소 필터' });
    await expect(within(dialog3).getByRole('button', { name: '카테고리 필터' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    const backdrop = document.querySelector('[data-slot="modal-backdrop"]');
    await expect(backdrop).toBeInTheDocument();
    if (!backdrop) throw new Error('modal-backdrop not found');
    await userEvent.click(backdrop);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(categoryTab).toHaveFocus());

    await expect(search).toHaveValue('성수 카페');
    await expect(within(regionTab).getByText('1')).toBeInTheDocument();
    await expect(within(categoryTab).getByText('1')).toBeInTheDocument();

    await userEvent.click(regionTab);
    const reopenedDialog = await screen.findByRole('dialog', { name: '장소 필터' });
    await expect(
      within(reopenedDialog).getByRole('button', { name: '성동구 필터 해제' }),
    ).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const FilterCountDisplay: Story = {
  args: {
    initialFilters: {
      regions: [{ regionId: '11', districtIds: ['200'] }],
      conceptIds: ['cafe', 'restaurant'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regionTab = canvas.getByRole('button', { name: '지역 필터' });
    const categoryTab = canvas.getByRole('button', { name: '카테고리 필터' });

    await expect(within(regionTab).getByText('1')).toBeInTheDocument();
    await expect(within(categoryTab).getByText('2')).toBeInTheDocument();
  },
};

export const HeaderFilterControlsVisible: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: '검색어' });
    const regionTab = canvas.getByRole('button', { name: '지역 필터' });
    const categoryTab = canvas.getByRole('button', { name: '카테고리 필터' });

    await expect(search).toBeVisible();
    await expect(regionTab).toBeVisible();
    await expect(categoryTab).toBeVisible();
  },
};

export const RestoreLastValidServerRegion: Story = {
  args: {
    initialFilters: { regions: [{ regionId: '99', districtIds: [] }], conceptIds: [] },
    filterParams: { region: ['11', '99'], district: ['11:200'] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('button', { name: '성동구 필터 해제' })).toBeVisible();
    await expect(canvas.getByText('13곳을 찾았어요')).toBeVisible();
  },
};

export const SubmitSearchKeepsAppliedFiltersOnly: Story = {
  args: {
    initialFilters: {
      regions: [{ regionId: '11', districtIds: ['200'] }],
      conceptIds: ['cafe'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    getRouter().push.mockClear();
    await userEvent.click(canvas.getByRole('button', { name: '지역 필터' }));
    const filter = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await userEvent.click(filter.getByRole('button', { name: '부산' }));
    await userEvent.click(filter.getByRole('checkbox', { name: '중구' }));
    await expect(filter.getByRole('button', { name: '중구 필터 해제' })).toBeInTheDocument();
    await expect(
      filter.queryByRole('button', { name: '성동구 필터 해제' }),
    ).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('searchbox'));
    const search = within(await screen.findByRole('dialog', { name: '장소 검색 제안' }));
    await userEvent.type(search.getByRole('searchbox'), '서울숲');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(getRouter().push).toHaveBeenCalledTimes(1));
    const href = getRouter().push.mock.calls[0][0];
    const params = new URL(href, 'http://localhost').searchParams;
    await expect(params.get('q')).toBe('서울숲');
    await expect(params.getAll('region')).toEqual(['11']);
    await expect(params.getAll('district')).toEqual(['11:200']);
    await expect(params.getAll('concept')).toEqual(['cafe']);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const ApplyFiltersKeepsQueryDraft: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    getRouter().push.mockClear();
    await userEvent.click(canvas.getByRole('searchbox'));
    const search = within(await screen.findByRole('dialog', { name: '장소 검색 제안' }));
    await userEvent.type(search.getByRole('searchbox'), '서울숲');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: '지역 필터' }));
    const filter = within(await screen.findByRole('dialog', { name: '장소 필터' }));
    await userEvent.click(filter.getByRole('button', { name: '서울' }));
    await userEvent.click(filter.getByRole('checkbox', { name: '전체' }));
    await userEvent.click(filter.getByRole('button', { name: /장소 \d+곳 보기/ }));
    await waitFor(() => expect(getRouter().push).toHaveBeenCalledTimes(1));
    const href = getRouter().push.mock.calls[0][0];
    const params = new URL(href, 'http://localhost').searchParams;
    await expect(params.get('q')).toBe('서울숲');
    await expect(params.getAll('region')).toEqual(['11']);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('searchbox')).toHaveValue('서울숲');
  },
};

export const SelectSuggestionOpensDetail: Story = {
  args: {
    initialQuery: '성수',
    initialFilters: {
      regions: [{ regionId: '11', districtIds: ['200'] }],
      conceptIds: ['cafe'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const initialLocation = window.location.href;
    getRouter().push.mockClear();
    getRouter().replace.mockClear();
    for (const activation of ['click', 'enter', 'space']) {
      await userEvent.click(canvas.getByRole('searchbox'));
      const dialog = within(await screen.findByRole('dialog', { name: '장소 검색 제안' }));
      const search = dialog.getByRole('searchbox');
      await userEvent.clear(search);
      await userEvent.type(search, '블루엘리펀트');
      const suggestion = await dialog.findByRole('button', { name: /블루엘리펀트 스페이스 성수/ });
      await waitFor(() => expect(suggestion).toBeEnabled());
      if (activation === 'click') {
        await userEvent.click(suggestion);
      } else {
        await userEvent.tab();
        await userEvent.tab();
        await expect(suggestion).toHaveFocus();
        await userEvent.keyboard(activation === 'enter' ? '{Enter}' : ' ');
      }
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      await expect(getRouter().push).toHaveBeenLastCalledWith('/places/blue-elephant-seongsu');
      await expect(getRouter().replace).not.toHaveBeenCalled();
      await expect(window.location.href).toBe(initialLocation);
      await expect(canvas.getByRole('searchbox')).toHaveValue('블루엘리펀트');
      await expect(
        within(canvas.getByRole('button', { name: '지역 필터' })).getByText('1'),
      ).toBeVisible();
      await expect(
        within(canvas.getByRole('button', { name: '카테고리 필터' })).getByText('1'),
      ).toBeVisible();
    }
    await expect(getRouter().push).toHaveBeenCalledTimes(3);
  },
};

export const EncodeSuggestionPlaceId: Story = {
  args: {
    initialQuery: '도예 원데이 클래스',
  },
  play: async ({ canvasElement }) => {
    getRouter().push.mockClear();
    await userEvent.click(within(canvasElement).getByRole('searchbox'));
    const dialog = within(await screen.findByRole('dialog', { name: '장소 검색 제안' }));
    await userEvent.click(dialog.getByRole('button', { name: /도예 원데이 클래스/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(getRouter().push).toHaveBeenCalledWith('/places/1');
  },
};
