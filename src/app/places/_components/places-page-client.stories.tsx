import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { regionQueryOptions } from '@/shared/api';

import { emptyPlaceFilters } from '../_model/place-filters';
import { allPlaces } from '../_model/recommended-places';
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
    allPlaces,
    initialFilters: emptyPlaceFilters,
    initialQuery: '',
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

export const RevealFiltersOnSearchFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: '검색어' });

    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(search);
    const dialog = await screen.findByRole('dialog', { name: '장소 검색 및 필터' });
    await expect(document.querySelector('[data-slot="modal-backdrop"]')).toBeVisible();
    await expect(within(dialog).getByRole('searchbox', { name: '검색어' })).toHaveFocus();
    await expect(within(dialog).getByRole('button', { name: '지역 필터' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(within(dialog).getByRole('button', { name: '카테고리 필터' })).toBeInTheDocument();

    const backdrop = document.querySelector<HTMLElement>('[data-slot="modal-backdrop"]');
    if (!backdrop) throw new Error('검색 모달의 배경을 찾을 수 없습니다.');
    await userEvent.click(backdrop);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await userEvent.click(search);
    const reopened = await screen.findByRole('dialog', { name: '장소 검색 및 필터' });
    await userEvent.click(within(reopened).getByRole('button', { name: '카테고리 필터' }));
    await expect(
      within(reopened).getByRole('button', { name: '카페·디저트 카테고리 선택' }),
    ).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: '다른 영역' }));
    await userEvent.tab({ shift: true });
    await expect(
      await screen.findByRole('dialog', { name: '장소 검색 및 필터' }),
    ).toBeInTheDocument();
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
