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
    children: '태그',
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Category: Story = {
  args: {
    type: 'category',
  },
};
