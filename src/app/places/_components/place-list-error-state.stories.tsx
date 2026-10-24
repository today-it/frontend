import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { LoginModalHost } from '@/app/_components/login-modal-host';
import { TopHeader } from '@/app/_components/top-header';
import { Footer } from '@/shared/ui';

import { PlaceListErrorState } from './place-list-error-state';

const meta = {
  title: 'App/Places/PlaceListErrorState',
  component: PlaceListErrorState,
  parameters: { layout: 'fullscreen' },
  args: { onRetry: fn() },
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
} satisfies Meta<typeof PlaceListErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const retryButton = canvas.getByRole('button', { name: '다시 시도' });

    await expect(canvas.getByRole('button', { name: /^로그인$/ })).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: '장소를 불러오지 못했어요', level: 1 }),
    ).toBeVisible();
    await expect(
      canvas.getByText('요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'),
    ).toBeVisible();
    await expect(canvas.getByRole('alert')).toBeVisible();
    await expect(canvas.getByRole('contentinfo')).toBeVisible();

    const bounds = retryButton.getBoundingClientRect();
    await expect(bounds.height).toBe(48);
    await userEvent.click(retryButton);
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};
