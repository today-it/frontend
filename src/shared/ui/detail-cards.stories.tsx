import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Card, CardContent } from './card';
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
export const Surface: Story = {
  render: () => (
    <Card>
      <CardContent>카드 내용</CardContent>
    </Card>
  ),
};
