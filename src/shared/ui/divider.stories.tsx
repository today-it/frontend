import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Divider } from './divider';

const meta = {
  title: 'Shared/UI/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    label: '계속하기',
  },
};
