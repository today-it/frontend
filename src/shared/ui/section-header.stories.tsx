import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SectionHeader } from './section-header';

const meta = {
  title: 'Shared/UI/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { title: '당신을 위한 추천 장소' },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dropdown: Story = {
  args: { type: 'Dropdown' },
};

export const More: Story = {
  args: {
    type: 'More',
    description: '선호 지역과 컨셉을 바탕으로 골랐어요',
  },
};

export const MoreWithoutDescription: Story = {
  args: {
    type: 'More',
    showDescription: false,
  },
};
