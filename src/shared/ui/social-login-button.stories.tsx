import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SocialLoginButton } from './social-login-button';

const meta = {
  title: 'Shared/UI/SocialLoginButton',
  component: SocialLoginButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    provider: 'google',
  },
  argTypes: {
    provider: {
      control: { type: 'select' },
      options: ['google', 'kakao'],
    },
  },
} satisfies Meta<typeof SocialLoginButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Google: Story = {};

export const Kakao: Story = {
  args: {
    provider: 'kakao',
  },
};

export const AllProviders: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <SocialLoginButton provider="google" />
      <SocialLoginButton provider="kakao" />
    </div>
  ),
};
