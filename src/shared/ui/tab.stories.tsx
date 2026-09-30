import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tab } from './tab';

const meta = {
  title: 'Shared/UI/Tab',
  component: Tab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '공용 Tab 컴포넌트입니다.',
      },
    },
  },
  args: {
    children: '장소',
    href: '/places',
  },
} satisfies Meta<typeof Tab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'text-text-secondary',
  },
};

export const Active: Story = {
  args: {
    active: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <nav aria-label="장소 탐색" className="flex">
      <Tab className="text-text-secondary" href="/places">
        호버
      </Tab>
      <Tab href="/places">장소</Tab>
      <Tab active href="/courses">
        코스
      </Tab>
    </nav>
  ),
};
