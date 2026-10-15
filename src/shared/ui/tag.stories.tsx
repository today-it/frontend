import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

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
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('태그')).toHaveStyle({ fontSize: '12px' });
  },
};
