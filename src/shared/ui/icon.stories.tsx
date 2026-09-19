import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon, iconNames } from './icon';

const iconTones = ['default', 'muted', 'disabled', 'inherit'] as const;

const meta = {
  title: 'Shared/UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'SVG sprite 아이콘을 렌더링합니다. 색상은 `currentColor`를 따르며, 의미가 있는 아이콘에는 `label`을 제공하고 장식용 아이콘은 `label`을 생략합니다.',
      },
    },
  },
  args: {
    name: 'check',
    size: 24,
    tone: 'default',
  },
  argTypes: {
    name: {
      control: { type: 'select' },
      options: iconNames,
    },
    tone: {
      control: { type: 'select' },
      options: iconTones,
    },
    size: {
      control: { type: 'number', min: 12, step: 4 },
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
  args: {
    tone: 'muted',
  },
};

export const Disabled: Story = {
  args: {
    tone: 'disabled',
  },
};

export const CustomColor: Story = {
  args: {
    className: 'text-system-success',
    tone: 'inherit',
  },
};

export const Accessible: Story = {
  args: {
    label: '완료',
  },
};

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      {iconNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 text-caption-c2 text-text-secondary"
        >
          <Icon name={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
