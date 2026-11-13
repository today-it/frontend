import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { ScrollTopButton } from './scroll-top-button';

const meta = {
  title: 'Shared/UI/ScrollTopButton',
  component: ScrollTopButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '공용 ScrollTopButton 컴포넌트입니다.',
      },
    },
  },
} satisfies Meta<typeof ScrollTopButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: '160px',
      },
    },
  },
};

export const Hover: Story = {
  args: {
    className: 'static bg-state-inverse-hover shadow-lg',
  },
};

export const Pressed: Story = {
  args: {
    className: 'static bg-state-inverse-pressed shadow-sm',
  },
};

export const InLongList: Story = {
  render: () => (
    <div className="w-full p-24">
      <p className="text-body-b1 text-text-primary">검색 결과</p>
      <div aria-hidden="true" className="mt-24 flex flex-col gap-16">
        {Array.from({ length: 18 }, (_, index) => (
          <div className="h-48 rounded-md bg-surface-subtle" key={index} />
        ))}
      </div>
      <ScrollTopButton />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-24">
      <ScrollTopButton className="static" />
      <ScrollTopButton className="static bg-state-inverse-hover shadow-lg" />
      <ScrollTopButton className="static bg-state-inverse-pressed shadow-sm" />
    </div>
  ),
};

export const ScrollableOnly: Story = {
  render: function ScrollableExample() {
    const [expanded, setExpanded] = useState(false);
    return (
      <div>
        <button type="button" onClick={() => setExpanded((current) => !current)}>
          {expanded ? '내용 줄이기' : '내용 늘리기'}
        </button>
        {expanded && <div aria-hidden="true" className="h-[200vh]" />}
        <ScrollTopButton hideWhenNotScrollable />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: '맨 위로 이동' })).not.toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByRole('button', { name: '내용 늘리기' }));
    const button = await canvas.findByRole('button', { name: '맨 위로 이동' });
    const before = button.getBoundingClientRect();
    window.scrollTo(0, 300);
    await waitFor(() => expect(window.scrollY).toBeGreaterThan(0));
    const after = button.getBoundingClientRect();
    await expect(after.top).toBe(before.top);
    await expect(after.left).toBe(before.left);
    await expect(window.innerHeight - after.bottom).toBe(24);
    await userEvent.click(button);
    await waitFor(() => expect(window.scrollY).toBe(0));
    await userEvent.click(canvas.getByRole('button', { name: '내용 줄이기' }));
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: '맨 위로 이동' })).not.toBeInTheDocument(),
    );
  },
};
