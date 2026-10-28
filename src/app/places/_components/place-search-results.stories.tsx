import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { emptyPlaceFilters } from '../_model/place-filters';
import { allPlaces } from '../_model/recommended-places';
import { PlaceSearchResults } from './place-search-results';

const meta = {
  title: 'App/Places/PlaceSearchResults',
  component: PlaceSearchResults,
  args: {
    allPlaces,
    filters: emptyPlaceFilters,
    query: '성수',
    onSearch: fn(),
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PlaceSearchResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadMore: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(8);
    await userEvent.click(canvas.getByRole('button', { name: '더 불러오기 8 / 13' }));
    await expect(canvas.getAllByRole('listitem')).toHaveLength(13);
    await expect(canvas.queryByRole('button', { name: /더 불러오기/ })).not.toBeInTheDocument();
  },
};

export const RemoveRegionAndReset: Story = {
  args: {
    filters: { regionId: 'seoul', districtIds: ['seongdong'], conceptIds: ['cafe'] },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
    await userEvent.click(canvas.getByRole('button', { name: '서울 필터 해제' }));
    await expect(args.onSearch).toHaveBeenCalledWith('성수', {
      regionId: null,
      districtIds: [],
      conceptIds: ['cafe'],
    });
    await userEvent.click(canvas.getByRole('button', { name: '전체 초기화' }));
    await expect(args.onSearch).toHaveBeenLastCalledWith('', emptyPlaceFilters);
  },
};

export const EmptyResults: Story = {
  args: {
    query: '존재하지않는장소',
    filters: { regionId: 'seoul', districtIds: ['seongdong'], conceptIds: ['cafe'] },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const emptyState = canvas.getByRole('region', { name: '조건에 맞는 장소가 없어요' });
    await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument();
    await userEvent.click(within(emptyState).getByRole('button', { name: '전체 초기화' }));
    await expect(args.onSearch).toHaveBeenCalledWith('', emptyPlaceFilters);
  },
};
