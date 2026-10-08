import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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

export const Default: Story = {};

export const Focused: Story = {
  args: {
    autoFocus: true,
  },
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
