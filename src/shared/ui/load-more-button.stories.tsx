import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { LoadMoreButton } from './load-more-button';

const meta = {
  title: 'Shared/UI/LoadMoreButton',
  component: LoadMoreButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: '더 불러오기',
    count: '8 / 20',
    showCount: true,
  },
} satisfies Meta<typeof LoadMoreButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: '더 불러오기 8 / 20' });
    const label = canvas.getByText('더 불러오기');
    const count = canvas.getByText('8 / 20');

    await expect(button).toBeVisible();
    await expect(count).toBeVisible();
    const bounds = button.getBoundingClientRect();
    await expect(Math.round(bounds.width)).toBeGreaterThanOrEqual(183);
    await expect(Math.round(bounds.width)).toBeLessThanOrEqual(190);
    await expect(bounds.height).toBe(48);
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(255, 255, 255)');
    await expect(getComputedStyle(button).borderTopColor).toBe('rgb(198, 198, 198)');
    await expect(getComputedStyle(label).color).toBe('rgb(28, 28, 28)');
    await expect(getComputedStyle(count).color).toBe('rgb(71, 71, 71)');
    await expect(getComputedStyle(button).fontWeight).toBe('500');
  },
};

export const Hover: Story = {
  args: {
    className: 'pointer-events-none bg-state-hover',
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: '더 불러오기 8 / 20' });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(226, 226, 226)');
  },
};

export const Pressed: Story = {
  args: {
    className: 'pointer-events-none bg-state-pressed',
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: '더 불러오기 8 / 20' });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(198, 198, 198)');
  },
};

export const CountHidden: Story = {
  args: {
    showCount: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: '더 불러오기' })).toBeVisible();
    await expect(canvas.queryByText('8 / 20')).not.toBeInTheDocument();
  },
};
