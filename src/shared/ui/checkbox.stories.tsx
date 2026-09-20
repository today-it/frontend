import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from './checkbox';

const meta = {
  title: 'Shared/UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    'aria-label': '선택',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Checkbox aria-label="선택 안 됨" />
      <Checkbox aria-label="선택됨" defaultChecked />
      <Checkbox aria-label="비활성화됨" disabled />
    </div>
  ),
};
