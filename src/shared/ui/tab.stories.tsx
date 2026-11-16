import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

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

export const CompactContainer: Story = {
  render: () => (
    <div className="flex w-[375px] items-center justify-between px-16">
      <Tab active href="/places">
        장소
      </Tab>
      <Tab href="/courses">코스</Tab>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const placeTab = canvas.getByRole('link', { name: '장소' });
    const courseTab = canvas.getByRole('link', { name: '코스' });
    await expect(placeTab).toBeVisible();
    await expect(courseTab).toBeVisible();
  },
};
