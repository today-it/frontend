import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Divider } from './divider';

const meta = {
  title: 'Shared/UI/Divider',
  component: Divider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-form-width max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    type: 'label',
    label: '계속하기',
  },
};

export const Vertical: Story = {
  args: {
    type: 'vertical',
  },
  decorators: [
    (Story) => (
      <div className="flex h-64 items-center">
        <Story />
      </div>
    ),
  ],
};
