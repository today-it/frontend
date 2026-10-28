import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { emptyPlaceFilters } from '../_model/place-filters';
import { allPlaces } from '../_model/recommended-places';
import { PlaceSearchExperience } from './place-search-experience';

const meta = {
  title: 'App/Places/PlaceSearchExperience',
  component: PlaceSearchExperience,
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
} satisfies Meta<typeof PlaceSearchExperience>;

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
