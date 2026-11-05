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
        component:
          '기본 Chip은 시/군/구·컨셉의 복수 선택에 사용합니다. variant=radio는 시/도 단일 선택용 52×36px 칩이며, 단일 선택 상태는 부모에서 제어합니다.',
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
    className: 'pointer-events-none border-border-active bg-surface-default text-text-primary',
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
      <Chip className="pointer-events-none border-border-active bg-surface-default text-text-primary">
        호버
      </Chip>
      <Chip defaultPressed>선택됨</Chip>
      <Chip disabled>비활성화됨</Chip>
    </div>
  ),
};

export const RadioStates: Story = {
  render: () => (
    <div className="flex">
      <Chip variant="radio">서울</Chip>
      <Chip variant="radio" defaultPressed>
        부산
      </Chip>
      <Chip variant="radio" disabled>
        경기
      </Chip>
      <Chip variant="radio">전남광주</Chip>
    </div>
  ),
};
