import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CarouselIndicator } from './carousel-indicator';

const meta = {
  title: 'Shared/UI/CarouselIndicator',
  component: CarouselIndicator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { current: 1, total: 12 },
  argTypes: {
    current: { control: { type: 'number', min: 1, step: 1 } },
    total: { control: { type: 'number', min: 1, step: 1 } },
  },
} satisfies Meta<typeof CarouselIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SinglePhoto: Story = { args: { current: 1, total: 1 } };
export const LastPhoto: Story = { args: { current: 12, total: 12 } };
export const LargeCount: Story = { args: { current: 123, total: 999 } };
