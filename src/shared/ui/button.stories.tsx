import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './button';

const buttonSizes = ['lg', 'md', 'sm'] as const;

const meta = {
  title: 'Shared/UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '공용 Button 컴포넌트 입니다. hover, active, disabled 상태는 semantic color token을 사용합니다.',
      },
    },
  },
  args: {
    children: 'Button',
    size: 'lg',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: buttonSizes,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {buttonSizes.map((size) => (
        <Button key={size} size={size}>
          Button
        </Button>
      ))}
    </div>
  ),
};
