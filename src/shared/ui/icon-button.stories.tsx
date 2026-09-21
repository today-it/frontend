import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { iconNames } from './icon';
import { IconButton } from './icon-button';

const meta = {
  title: 'Shared/UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    icon: 'close',
    label: '닫기',
  },
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: iconNames,
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'bg-state-hover',
  },
};

export const Pressed: Story = {
  args: {
    className: 'bg-state-pressed',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-32">
      <IconButton icon="close" label="기본 닫기" />
      <IconButton className="bg-state-hover" icon="close" label="호버 닫기" />
      <IconButton className="bg-state-pressed" icon="close" label="눌린 닫기" />
    </div>
  ),
};
