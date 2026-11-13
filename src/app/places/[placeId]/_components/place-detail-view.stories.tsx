import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { placeDetailFixture, placeDetailWithImagesFixture } from '../_model/place-detail';
import { PlaceDetailError, PlaceDetailLoading, PlaceDetailNotFound } from './place-detail-state';
import { PlaceDetailView } from './place-detail-view';

const meta = {
  title: 'App/Places/PlaceDetailView',
  component: PlaceDetailView,
  parameters: { layout: 'fullscreen' },
  args: { place: placeDetailFixture },
} satisfies Meta<typeof PlaceDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const likeButton = canvas.getByRole('button', { name: '장소 좋아요' });
    const bookmarkButton = canvas.getByRole('button', { name: '장소 스크랩' });

    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(likeButton);
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');

    await expect(bookmarkButton).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(bookmarkButton);
    await expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(canvas.getByRole('button', { name: '커피' }));
    await expect(canvas.getByRole('article', { name: '아메리카노' })).toBeVisible();
    await expect(canvas.queryByRole('article', { name: '레몬에이드' })).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: '다음 장소 사진' }));
    await expect(canvas.getByLabelText('사진 2 / 12')).toBeVisible();

    const courseSection = canvas.getByRole('region', { name: '이 장소가 포함된 코스 5' });
    await userEvent.click(within(courseSection).getByRole('button', { name: '모두 보기' }));
    await expect(within(courseSection).getByRole('button', { name: '접기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(within(courseSection).getAllByRole('article')).toHaveLength(5);
  },
};

export const Liked: Story = { args: { initialLiked: true } };

export const Bookmarked: Story = { args: { initialBookmarked: true } };

export const WithImages: Story = { args: { place: placeDetailWithImagesFixture } };

export const ScrapNotification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bookmark = canvas.getByRole('button', { name: '장소 스크랩' });
    await userEvent.click(bookmark);
    const action = await screen.findByRole('button', { name: '스크랩 목록 보기' });
    const actions = canvasElement.querySelector('[data-slot="place-detail-actions"]')!;
    await waitFor(() => {
      const toast = document.querySelector('[data-slot="toast"]')!.getBoundingClientRect();
      expect(Math.abs(toast.top - actions.getBoundingClientRect().bottom - 12)).toBeLessThan(1);
      expect(Math.abs(toast.right - actions.getBoundingClientRect().right)).toBeLessThan(1);
    });
    await expect(action).toHaveTextContent('스크랩했어요');
    await userEvent.click(bookmark);
    await waitFor(() =>
      expect(document.querySelector('[data-slot="toast"]')).toHaveTextContent(
        '스크랩을 취소했어요',
      ),
    );
    await userEvent.click(canvas.getByRole('button', { name: '장소 좋아요' }));
    await waitFor(
      () => expect(document.querySelector('[data-slot="toast"]')).not.toBeInTheDocument(),
      { timeout: 4000 },
    );
  },
};

export const NoPhotos: Story = {
  args: { place: { ...placeDetailFixture, photoCount: 0 } },
};

export const HoursUnconfirmed: Story = {
  args: { place: { ...placeDetailFixture, hours: null } },
};

export const MapError: Story = { args: { initialMapError: true } };

export const EmptyMenusAndCourses: Story = {
  args: { place: { ...placeDetailFixture, menus: [], courses: [] } },
};

export const LongText: Story = {
  args: {
    place: {
      ...placeDetailFixture,
      name: '블루엘리펀트 스페이스 성수의 긴 장소 이름과 소개 문구 줄바꿈 확인',
      address: '서울특별시 성동구 연무장길 53 / 성수동 상세 위치 안내 문구가 길어지는 경우',
      description: `${placeDetailFixture.description} ${placeDetailFixture.description} ${placeDetailFixture.description}`,
    },
  },
};

export const Loading: Story = {
  render: () => <PlaceDetailLoading />,
};

const retryCallback = fn();

export const Error: Story = {
  render: () => <PlaceDetailError onRetry={retryCallback} />,
  play: async ({ canvasElement }) => {
    retryCallback.mockClear();
    await userEvent.click(within(canvasElement).getByRole('button', { name: '다시 시도' }));
    await expect(retryCallback).toHaveBeenCalledOnce();
  },
};

export const NotFound: Story = {
  render: () => <PlaceDetailNotFound />,
};
