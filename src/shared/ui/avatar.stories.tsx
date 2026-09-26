import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar } from './avatar';

const avatarSizes = ['xl', 'lg', 'md', 'sm'] as const;

const meta = {
  title: 'Shared/UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    initials: 'TI',
    size: 'xl',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: avatarSizes,
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-32">
      {avatarSizes.map((size) => (
        <Avatar key={size} initials="TI" size={size} />
      ))}
    </div>
  ),
};
