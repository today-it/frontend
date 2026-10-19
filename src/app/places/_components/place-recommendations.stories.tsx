import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { LoginModalHost } from '@/app/_components/login-modal-host';
import { TopHeader } from '@/app/_components/top-header';

import { recommendedPlaces } from '../_model/recommended-places';
import { PlaceRecommendations } from './place-recommendations';

function DesktopFrame({ children }: { children: ReactNode }) {
  return <div className="min-w-[var(--spacing-header-width)]">{children}</div>;
}

const meta = {
  title: 'App/Places/PlaceRecommendations',
  component: PlaceRecommendations,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <>
        <main className="mx-auto w-full max-w-[calc(var(--spacing-header-width)+48px)] p-24">
          <Story />
        </main>
        <LoginModalHost />
      </>
    ),
  ],
  args: { places: recommendedPlaces },
} satisfies Meta<typeof PlaceRecommendations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DesktopFrame>
      <PlaceRecommendations {...args} />
    </DesktopFrame>
  ),
};

export const CarouselPaging: Story = {
  args: { places: recommendedPlaces },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    let currentSlide = canvas.getByRole('group', { name: '장소 1–4 / 13' });

    await expect(within(currentSlide).getAllByRole('listitem')).toHaveLength(4);
    await expect(canvas.queryByRole('button', { name: '이전' })).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: '다음' }));
    currentSlide = canvas.getByRole('group', { name: '장소 5–8 / 13' });
    await expect(within(currentSlide).getAllByRole('listitem')).toHaveLength(4);
    await expect(canvas.getByRole('button', { name: '이전' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: '다음' }));
    currentSlide = canvas.getByRole('group', { name: '장소 9–12 / 13' });
    await expect(within(currentSlide).getAllByRole('listitem')).toHaveLength(4);

    await userEvent.click(canvas.getByRole('button', { name: '다음' }));
    currentSlide = canvas.getByRole('group', { name: '장소 13–13 / 13' });
    await expect(within(currentSlide).getAllByRole('listitem')).toHaveLength(1);
    await expect(canvas.queryByRole('button', { name: '다음' })).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: '이전' }));
    await expect(canvas.getByRole('group', { name: '장소 9–12 / 13' })).toBeVisible();
  },
};

export const SharedLoginModal: Story = {
  render: (args) => (
    <>
      <TopHeader />
      <PlaceRecommendations {...args} />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const headerTrigger = canvas.getByRole('button', { name: /^로그인$/ });
    await userEvent.click(headerTrigger);
    let dialog = await screen.findByRole('dialog', { name: /^로그인$/ });
    await expect(screen.getAllByRole('dialog')).toHaveLength(1);
    await userEvent.click(within(dialog).getByRole('button', { name: '닫기' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(headerTrigger).toHaveFocus());

    const likeTrigger = canvas.getAllByRole('button', { name: /좋아요/ })[0];
    await userEvent.click(likeTrigger);
    dialog = await screen.findByRole('dialog', { name: /^로그인$/ });
    await expect(screen.getAllByRole('dialog')).toHaveLength(1);
    await userEvent.click(within(dialog).getByRole('button', { name: '회원가입' }));
    dialog = await screen.findByRole('dialog', { name: '회원가입을 위해 약관에 동의해주세요' });
    await userEvent.click(within(dialog).getByRole('link', { name: '로그인' }));
    await screen.findByRole('dialog', { name: /^로그인$/ });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(likeTrigger).toHaveFocus());
    await expect(likeTrigger).toHaveAttribute('aria-pressed', 'false');
    await expect(likeTrigger).toHaveTextContent('1.2K');

    await userEvent.click(likeTrigger);
    dialog = await screen.findByRole('dialog', { name: /^로그인$/ });
    await userEvent.click(within(dialog).getByRole('button', { name: '회원가입' }));
    dialog = await screen.findByRole('dialog', { name: '회원가입을 위해 약관에 동의해주세요' });
    await userEvent.click(within(dialog).getByRole('button', { name: '닫기' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(likeTrigger).toHaveFocus());
  },
};
