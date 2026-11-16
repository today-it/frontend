import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { cn } from '@/shared/lib';

import { SearchBar } from './search-bar';

const meta = {
  title: 'Shared/UI/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-search-bar-width max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderFocused: Story['render'] = (args) => (
  <SearchBar {...args} className={cn(args.className, 'border-border-focus')} />
);

const focusEmpty: Story['play'] = async ({ canvasElement }) => {
  const input = within(canvasElement).getByRole('searchbox');
  await userEvent.click(input);
  await expect(input).toHaveFocus();
  await expect(input).toHaveValue('');
};

const typeValue: Story['play'] = async ({ canvasElement }) => {
  const input = within(canvasElement).getByRole('searchbox');
  await userEvent.clear(input);
  await userEvent.type(input, '성수');
  await expect(input).toHaveFocus();
  await expect(input).toHaveValue('성수');
};

export const Default: Story = {};

export const Focused: Story = {
  args: {
    autoFocus: true,
  },
  render: renderFocused,
  play: focusEmpty,
};

export const Typing: Story = {
  args: { autoFocus: true, defaultValue: '성수' },
  render: renderFocused,
  play: typeValue,
};

export const Filled: Story = {
  args: {
    defaultValue: '성수 맛집',
  },
};

export const WithoutSearchButton: Story = {
  args: {
    showButton: false,
  },
};

export const SearchDisabled: Story = {
  args: { searchDisabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: '검색 실행' })).toBeDisabled();
  },
};

export const DesignSpecVerification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole('search');
    const input = canvas.getByRole('searchbox');
    const button = canvas.getByRole('button', { name: '검색 실행' });

    const formRect = form.getBoundingClientRect();
    await expect(formRect.height).toBe(56);

    const buttonRect = button.getBoundingClientRect();
    await expect(buttonRect.width).toBe(40);
    await expect(buttonRect.height).toBe(40);

    const computedInputStyle = window.getComputedStyle(input);
    await expect(computedInputStyle.fontSize).toBe('16px');
  },
};
