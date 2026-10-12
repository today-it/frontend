import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { CarouselButton } from './carousel-button';

const meta = {
  title: 'Shared/UI/CarouselButton',
  component: CarouselButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    direction: 'left',
  },
} satisfies Meta<typeof CarouselButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: '이전' });
    await expect(button).toBeVisible();
    const bounds = button.getBoundingClientRect();
    await expect(bounds.width).toBe(48);
    await expect(bounds.height).toBe(48);
  },
};

export const Right: Story = {
  args: {
    direction: 'right',
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: '다음' })).toBeVisible();
  },
};

export const Hover: Story = {
  args: {
    className: 'pointer-events-none bg-state-hover',
  },
};
