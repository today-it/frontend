import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TopHeader } from './top-header';

const meta = {
  title: 'App/TopHeader',
  component: TopHeader,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TopHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GuestTabs: Story = {
  args: {
    auth: 'guest',
    navigation: 'tabs',
  },
};

export const MemberTabs: Story = {
  args: {
    auth: 'member',
    navigation: 'tabs',
  },
};

export const GuestSearch: Story = {
  args: {
    auth: 'guest',
    navigation: 'search',
  },
};

export const MemberSearch: Story = {
  args: {
    auth: 'member',
    navigation: 'search',
  },
};
