import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { LoginModalHost } from '@/app/_components/login-modal-host';
import { TopHeader } from '@/app/_components/top-header';

import { placeSections } from '../_model/place-sections';
import { PlaceCollectionView } from './place-collection-view';

const meta = {
  title: 'App/Places/PlaceCollectionView',
  component: PlaceCollectionView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <>
        <TopHeader activeSection="places" auth="guest" />
        <Story />
        <LoginModalHost />
      </>
    ),
  ],
  args: { section: placeSections[0] },
} satisfies Meta<typeof PlaceCollectionView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Recommended: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: '당신을 위한 추천 장소', level: 1 }),
    ).toBeVisible();
    await expect(canvas.getAllByRole('article')).toHaveLength(8);
    const loadMore = canvas.getByRole('button', { name: /더 불러오기/ });
    await expect(loadMore).toHaveTextContent('8 / 13');

    await userEvent.click(loadMore);
    await expect(canvas.getAllByRole('article')).toHaveLength(13);
    await expect(canvas.queryByRole('button', { name: /더 불러오기/ })).not.toBeInTheDocument();

    const likeButton = canvas.getAllByRole('button', { name: /좋아요/ })[0];
    await userEvent.click(likeButton);
    await screen.findByRole('dialog', { name: /^로그인$/ });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(likeButton).toHaveFocus();
  },
};

export const TopicalCollection: Story = {
  args: { section: placeSections[2] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: '비 오는 날 가기 좋은 실내 데이트', level: 1 }),
    ).toBeVisible();
    await expect(canvas.getAllByRole('article')).toHaveLength(5);
    await expect(canvas.queryByRole('button', { name: /더 불러오기/ })).not.toBeInTheDocument();
  },
};
