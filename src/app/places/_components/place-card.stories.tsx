import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { LoginModalHost } from '@/app/_components/login-modal-host';
import { useLoginModalStore } from '@/app/_model/login-modal-store';

import { recommendedPlaces } from '../_model/recommended-places';
import { PlaceCard } from './place-card';

const meta = {
  title: 'App/Places/PlaceCard',
  component: PlaceCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <div className="p-24">
          <Story />
        </div>
        <LoginModalHost />
      </>
    ),
  ],
  args: { place: recommendedPlaces[0], onLikeClick: fn() },
} satisfies Meta<typeof PlaceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = { args: { size: 'lg' } };
export const Liked: Story = { args: { liked: true } };
export const LargeLiked: Story = { args: { size: 'lg', liked: true } };

export const FigmaVariants: Story = {
  decorators: [
    (Story) => (
      <div className="w-max max-w-full p-24">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-[repeat(2,var(--spacing-place-card-width))] items-start gap-40 bg-surface-subtle p-24">
      {(['md', 'lg'] as const).map((size) => (
        <PlaceCard
          key={size}
          onLikeClick={fn()}
          place={{
            ...recommendedPlaces[0],
            name: '장소명',
            category: '카테고리',
            neighborhood: '지역',
            imageSrc: undefined,
            rating: 0,
            reviewCount: 0,
            likeCount: 0,
          }}
          size={size}
        />
      ))}
      {(['md', 'lg'] as const).map((size) => (
        <PlaceCard
          key={size}
          onLikeClick={fn()}
          liked
          place={{
            ...recommendedPlaces[0],
            name: '장소명',
            category: '카테고리',
            neighborhood: '지역',
            imageSrc: undefined,
            rating: 0,
            reviewCount: 0,
            likeCount: 0,
          }}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cards = within(canvasElement).getAllByRole('article');
    const expectedHeights = [374, 458, 374, 458];
    for (const [index, card] of cards.entries()) {
      await expect(card.getBoundingClientRect().width).toBe(336);
      await expect(card.getBoundingClientRect().height).toBe(expectedHeights[index]);
    }
  },
};

export const ToggleLike: Story = {
  render: function ToggleExample(args) {
    const [liked, setLiked] = useState(false);
    return (
      <PlaceCard
        {...args}
        liked={liked}
        onLikeClick={() => setLiked((previous) => !previous)}
        place={{ ...args.place, likeCount: args.place.likeCount + Number(liked) }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: /좋아요/ });
    await expect(trigger).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-pressed', 'false');
  },
};

export const GuestLikeOpensLogin: Story = {
  render: function GuestCard(args) {
    const openLogin = useLoginModalStore((state) => state.openLogin);
    return <PlaceCard {...args} onLikeClick={openLogin} />;
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: /좋아요/ });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('dialog', { name: /^로그인$/ });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).toHaveTextContent('1.2K');
  },
};
