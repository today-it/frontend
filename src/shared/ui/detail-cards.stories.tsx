import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Card, CardContent } from './card';
import { Icon } from './icon';
import { InfoCard } from './info-card';
import { InfoTag } from './info-tag';
import { MenuCard } from './menu-card';

const meta = {
  title: 'Shared/UI/DetailCards',
  component: MenuCard,
  tags: ['autodocs'],
  args: { name: '아메리카노', price: '4,500원', signature: true },
  decorators: [
    (Story) => (
      <div className="w-[458px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MenuCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article', { name: '아메리카노' });
    await expect(within(card).getByText('대표')).toBeVisible();
    await expect(within(card).getByText('4,500원')).toBeVisible();
    await expect(card.getBoundingClientRect().height).toBe(138);
  },
};
export const MenuWithoutBadge: Story = { args: { signature: false } };
export const LongMenu: Story = {
  args: { name: '긴 이름으로 등록된 시그니처 스페셜 블렌드 아메리카노' },
};
export const Amenity: Story = { render: () => <InfoTag icon="parking">주차 가능</InfoTag> };
export const Information: Story = {
  render: () => (
    <InfoCard
      label="이용 정보"
      map={
        <div className="flex h-[220px] items-center justify-center rounded-2xl bg-surface-placeholder">
          <Icon name="map" />
        </div>
      }
      rows={[
        { label: '위치', value: '성수역 3번 출구' },
        { label: '영업시간', value: '매일 10:00 ~ 22:00' },
        { label: '전화', value: '1644-2624' },
      ]}
      action={<span>안내 영역</span>}
    />
  ),
};
export const Surface: Story = {
  render: () => (
    <Card>
      <CardContent>카드 내용</CardContent>
    </Card>
  ),
};
