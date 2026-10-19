import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { LoginModalHost } from '@/app/_components/login-modal-host';
import { TopHeader } from '@/app/_components/top-header';
import { Footer } from '@/shared/ui';

import { PlaceListEmptyState } from './place-list-empty-state';

const meta = {
  title: 'App/Places/PlaceListEmptyState',
  component: PlaceListEmptyState,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="flex min-h-screen flex-col">
        <TopHeader activeSection="places" auth="guest" />
        <Story />
        <Footer
          contactHref="mailto:contact@example.com"
          privacyHref="/privacy"
          termsHref="/terms"
        />
        <LoginModalHost />
      </div>
    ),
  ],
} satisfies Meta<typeof PlaceListEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: /^로그인$/ })).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: '아직 보여드릴 장소가 없어요', level: 1 }),
    ).toBeVisible();
    await expect(canvas.getByText('조건에 맞는 장소가 생기면 이곳에 표시돼요.')).toBeVisible();
    await expect(canvas.getByRole('region', { name: '아직 보여드릴 장소가 없어요' })).toBeVisible();
    await expect(canvas.getByRole('contentinfo')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: '다음' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: '모두 보기' })).not.toBeInTheDocument();
  },
};
