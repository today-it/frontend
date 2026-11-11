import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { Skeleton } from './skeleton';

const meta = {
  title: 'Shared/UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    className: 'h-24 w-160 rounded-md',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[data-slot="skeleton"]');

    await expect(skeleton).not.toBeNull();
    if (!skeleton) return;

    await expect(skeleton).toBeVisible();
    await expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
    await expect(getComputedStyle(skeleton).backgroundColor).toBe('rgb(224, 226, 228)');
  },
};

export const TextLines: Story = {
  render: () => (
    <div className="flex w-320 flex-col gap-12">
      <Skeleton className="h-24 w-2/3 rounded-md" />
      <Skeleton className="h-16 w-full rounded-sm" />
      <Skeleton className="h-16 w-5/6 rounded-sm" />
    </div>
  ),
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex w-320 flex-col gap-16">
      <Skeleton className="h-180 w-full rounded-xl" />
      <Skeleton className="h-24 w-3/4 rounded-md" />
      <Skeleton className="h-16 w-1/2 rounded-sm" />
    </div>
  ),
};
