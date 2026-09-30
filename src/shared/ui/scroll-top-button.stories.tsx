import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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

export const Default: Story = {};

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
