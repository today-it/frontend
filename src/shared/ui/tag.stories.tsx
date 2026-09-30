import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tag } from './tag';

const meta = {
  title: 'Shared/UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '공용 Tag 컴포넌트입니다.',
      },
    },
  },
  args: {
    children: '카페',
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongLabel: Story = {
  args: {
    children: '브런치와 디저트를 함께 즐길 수 있는 카페',
  },
};
