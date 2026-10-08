import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { FilterTab } from './filter-tab';

const meta = {
  title: 'Shared/UI/FilterTab',
  component: FilterTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '공용 FilterTab 컴포넌트입니다.',
      },
    },
  },
  args: {
    label: '지역',
  },
} satisfies Meta<typeof FilterTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
};

export const Active: Story = {
  args: {
    defaultPressed: true,
  },
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
};

export const Filled: Story = {
  args: {
    filled: true,
    label: '성수',
  },
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-20">
      <FilterTab className="w-[450px] flex-none" label="기본" />
      <FilterTab className="w-[450px] flex-none" defaultPressed label="활성" />
      <FilterTab className="w-[450px] flex-none" filled label="선택됨" />
    </div>
  ),
};
