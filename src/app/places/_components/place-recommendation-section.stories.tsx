import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { LoginModalHost } from '@/app/_components/login-modal-host';
import { TopHeader } from '@/app/_components/top-header';

import { rainyDayPlaces, recommendedPlaces, trendingPlaces } from '../_model/recommended-places';
import { PlaceRecommendationSection } from './place-recommendation-section';

function DesktopFrame({ children }: { children: ReactNode }) {
  return <div className="min-w-[var(--spacing-header-width)]">{children}</div>;
}

const meta = {
  title: 'App/Places/PlaceRecommendationSection',
  component: PlaceRecommendationSection,
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
} satisfies Meta<typeof PlaceRecommendationSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DesktopFrame>
      <PlaceRecommendationSection {...args} />
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

export const TopicalSections: Story = {
  render: (args) => (
    <DesktopFrame>
      <div className="flex flex-col gap-96">
        <PlaceRecommendationSection
          {...args}
          description="이번 주 좋아요가 가장 많이 늘어난 곳이에요"
          places={trendingPlaces}
          title="지금 뜨는 성수 핫플"
        />
        <PlaceRecommendationSection
          {...args}
          description="날씨 걱정 없이 둘러볼 수 있는 곳만 모았어요"
          places={rainyDayPlaces}
          title="비 오는 날 가기 좋은 실내 데이트"
        />
      </div>
    </DesktopFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trendingSection = canvas.getByRole('group', { name: '지금 뜨는 성수 핫플' });
    const rainyDaySection = canvas.getByRole('group', { name: '비 오는 날 가기 좋은 실내 데이트' });

    await expect(
      within(trendingSection).getByRole('group', { name: '장소 1–4 / 5' }),
    ).toBeVisible();
    await expect(
      within(rainyDaySection).getByRole('group', { name: '장소 1–4 / 5' }),
    ).toBeVisible();

    await userEvent.click(within(trendingSection).getByRole('button', { name: '다음' }));
    await expect(
      within(trendingSection).getByRole('group', { name: '장소 5–5 / 5' }),
    ).toBeVisible();
    await expect(
      within(rainyDaySection).getByRole('group', { name: '장소 1–4 / 5' }),
    ).toBeVisible();
    await expect(within(trendingSection).queryByRole('button', { name: '다음' })).toBeNull();

    await userEvent.click(within(rainyDaySection).getByRole('button', { name: '다음' }));
    await expect(
      within(rainyDaySection).getByRole('group', { name: '장소 5–5 / 5' }),
    ).toBeVisible();
    await userEvent.click(within(trendingSection).getByRole('button', { name: '이전' }));
    await expect(
      within(trendingSection).getByRole('group', { name: '장소 1–4 / 5' }),
    ).toBeVisible();
  },
};

export const SharedLoginModal: Story = {
  render: (args) => (
    <>
      <TopHeader />
      <PlaceRecommendationSection {...args} />
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
