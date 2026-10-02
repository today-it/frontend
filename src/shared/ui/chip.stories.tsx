import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Chip } from './chip';

const meta = {
  title: 'Shared/UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '선택 가능한 공용 Chip 컴포넌트입니다.',
      },
    },
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

export const Hover: Story = {
  args: {
    className:
      'pointer-events-none bg-state-primary-subtle-hover [color:var(--td-color-text-primary)]',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-64">
      <Chip>기본</Chip>
      <Chip className="pointer-events-none bg-state-primary-subtle-hover [color:var(--td-color-text-primary)]">
        호버
      </Chip>
      <Chip defaultPressed>선택됨</Chip>
      <Chip disabled>비활성화됨</Chip>
    </div>
  ),
};
