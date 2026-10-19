import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { placeSections } from '../_model/place-sections';
import { PlaceListLoadingView } from './place-list-loading-view';

const meta = {
  title: 'App/Places/PlaceListLoadingView',
  component: PlaceListLoadingView,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PlaceListLoadingView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: /^로그인$/ })).toBeVisible();

    for (const section of placeSections) {
      const sectionRegion = canvas.getByRole('region', { name: section.title });
      await expect(sectionRegion).toHaveAttribute('aria-busy', 'true');
      await expect(
        sectionRegion.querySelectorAll('[data-slot="place-card-skeleton"]'),
      ).toHaveLength(4);
    }
  },
};
