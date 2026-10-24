import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';

import { LoginModalHost } from './login-modal-host';
import { TopHeader } from './top-header';

const meta = {
  title: 'App/TopHeader',
  component: TopHeader,
  decorators: [
    (Story) => (
      <>
        <Story />
        <LoginModalHost />
      </>
    ),
  ],
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

export const ScrollDirection: Story = {
  render: (args) => (
    <>
      <TopHeader {...args} />
      <div aria-hidden="true" className="h-[200vh]" />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    window.scrollTo(0, 0);
    await waitFor(() => expect(canvas.getByRole('searchbox')).toBeInTheDocument());
    await expect(canvas.getByRole('search').getBoundingClientRect().top).toBe(132);
    window.scrollTo(0, 500);
    await waitFor(() => expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument());
    window.scrollTo(0, 200);
    await waitFor(() => expect(canvas.getByRole('searchbox')).toBeInTheDocument());
    await expect(window.scrollY).toBeGreaterThan(0);
    window.scrollTo(0, 600);
    await waitFor(() => expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument());
    window.scrollTo(0, 0);
    await waitFor(() => expect(canvas.getByRole('searchbox')).toBeInTheDocument());
  },
};
