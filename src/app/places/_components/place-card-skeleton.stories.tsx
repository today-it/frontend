import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { PlaceCardSkeleton } from './place-card-skeleton';

const meta = {
  title: 'App/Places/PlaceCardSkeleton',
  component: PlaceCardSkeleton,
  args: { size: 'md' },
  decorators: [
    (Story) => (
      <div className="w-max max-w-full p-24">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlaceCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = { args: { size: 'lg' } };

export const SizeVariants: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(2,var(--spacing-place-card-width))] items-start gap-40 bg-surface-subtle p-24">
      <PlaceCardSkeleton />
      <PlaceCardSkeleton size="lg" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cards = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[data-slot="place-card-skeleton"]'),
    );
    const expectedHeights = [376, 460];
    const expectedThumbnailHeights = [252, 336];

    await expect(cards).toHaveLength(2);

    for (const [index, card] of cards.entries()) {
      await expect(card.getBoundingClientRect().width).toBe(336);
      await expect(card.getBoundingClientRect().height).toBe(expectedHeights[index]);
      await expect(card.firstElementChild!.getBoundingClientRect().height).toBe(
        expectedThumbnailHeights[index],
      );
      await expect(card.lastElementChild!.getBoundingClientRect().height).toBe(124);
    }
  },
};
