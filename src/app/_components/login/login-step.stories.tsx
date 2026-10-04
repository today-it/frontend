import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { Logo, Modal } from '@/shared/ui';

import { LoginStep } from './login-step';

const meta = {
  title: 'App/Login/LoginStep',
  component: LoginStep,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onPasswordReset: fn(),
    onSignup: fn(),
    onSocialLogin: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof LoginStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Modal defaultOpen logo={<Logo />}>
      <LoginStep {...args} />
    </Modal>
  ),
};
