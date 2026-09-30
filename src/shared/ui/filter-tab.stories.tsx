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

function FilterBarFrame({ children }: { children: React.ReactNode }) {
  return <div className="w-search-bar-width max-w-full">{children}</div>;
}

export const Default: Story = {
  render: (args) => (
    <FilterBarFrame>
      <FilterTab className="w-1/2 flex-none" {...args} />
    </FilterBarFrame>
  ),
};

export const Hover: Story = {
  render: (args) => (
    <FilterBarFrame>
      <FilterTab className="w-1/2 flex-none bg-state-hover" {...args} />
    </FilterBarFrame>
  ),
};

export const Active: Story = {
  args: {
    defaultPressed: true,
  },
  render: (args) => (
    <FilterBarFrame>
      <FilterTab className="w-1/2 flex-none" {...args} />
    </FilterBarFrame>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex w-search-bar-width max-w-full flex-col">
      <FilterTab className="w-1/2 flex-none" label="기본" />
      <FilterTab className="w-1/2 flex-none bg-state-hover" label="호버" />
      <FilterTab className="w-1/2 flex-none" defaultPressed label="활성" />
    </div>
  ),
};
