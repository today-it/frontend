import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Chip } from './chip';

const meta = {
  title: 'Shared/UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Chip',
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    defaultPressed: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-32">
      <Chip>기본</Chip>
      <Chip defaultPressed>선택됨</Chip>
      <Chip disabled>비활성화됨</Chip>
    </div>
  ),
};
