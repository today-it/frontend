import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { PlaceFilterBar } from './place-filter-bar';

const meta = {
  title: 'App/Places/PlaceFilterBar',
  component: PlaceFilterBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '장소 검색 영역과 검색 모달 내부에서 사용하는 지역 / 카테고리 필터 탭 바 컴포넌트입니다. 전달받은 필터 개수가 1개 이상일 때 각 탭에 개수를 표시하고, 탭 클릭 시 `onTabClick` 콜백을 호출합니다.',
      },
    },
  },
  args: {
    onTabClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[900px] max-w-full p-24">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlaceFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultClosed: Story = {
  args: {
    regionCount: 0,
    categoryCount: 0,
  },
};

export const ClosedWithCounts: Story = {
  args: {
    regionCount: 2,
    categoryCount: 3,
  },
};

export const ActiveRegion: Story = {
  args: {
    activeTab: 'region',
    regionCount: 1,
    categoryCount: 2,
  },
};

export const ActiveCategory: Story = {
  args: {
    activeTab: 'category',
    regionCount: 1,
    categoryCount: 2,
  },
};
