import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { iconNames } from './icon';
import { IconButton } from './icon-button';

const meta = {
  title: 'Shared/UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    icon: 'close',
    label: '닫기',
  },
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: iconNames,
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['default', 'round'],
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: '닫기' });
    const bounds = button.getBoundingClientRect();

    await expect(bounds.width).toBe(32);
    await expect(bounds.height).toBe(32);
  },
};

export const Round: Story = {
  args: {
    icon: 'share',
    label: '장소 공유',
    variant: 'round',
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: '장소 공유' });
    const bounds = button.getBoundingClientRect();

    await expect(bounds.width).toBe(48);
    await expect(bounds.height).toBe(48);
    await expect(getComputedStyle(button).borderTopWidth).toBe('1px');
    await expect(getComputedStyle(button).borderRadius).toBe('100px');
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(255, 255, 255)');
  },
};

export const Hover: Story = {
  args: {
    className: 'bg-state-hover',
  },
};

export const Pressed: Story = {
  args: {
    'aria-pressed': true,
    className: 'text-icon-liked',
    icon: 'favorite-filled',
    label: '장소 좋아요',
    variant: 'round',
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: '장소 좋아요' });

    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(getComputedStyle(button).color).toBe('rgb(247, 104, 67)');
  },
};

export const KeyboardFocus: Story = {
  args: {
    icon: 'share',
    label: '장소 공유',
    variant: 'round',
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: '장소 공유' });

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(getComputedStyle(button).boxShadow).not.toBe('none');
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: fn(),
    variant: 'round',
  },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: '닫기' });

    await expect(button).toBeDisabled();
    button.click();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-64">
      <IconButton icon="close" label="기본 닫기" />
      <IconButton className="bg-state-hover" icon="close" label="호버 닫기" />
      <IconButton className="bg-state-pressed" icon="close" label="눌린 닫기" />
      <IconButton icon="share" label="장소 공유" variant="round" />
    </div>
  ),
};
