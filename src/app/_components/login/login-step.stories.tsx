import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Logo, Modal } from '@/shared/ui';

import { LoginStep, type LoginStepProps } from './login-step';

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

function FailureInModal(args: LoginStepProps) {
  const [failureCount, setFailureCount] = useState(0);
  const [hasLoginError, setHasLoginError] = useState(false);

  return (
    <Modal defaultOpen logo={<Logo />}>
      <LoginStep
        {...args}
        failureCount={failureCount}
        failureCountTotal={5}
        loginError={hasLoginError ? 'invalid' : undefined}
        onSubmit={async (values) => {
          setHasLoginError(false);
          await args.onSubmit(values);
          setFailureCount((count) => count + 1);
          setHasLoginError(true);
        }}
      />
    </Modal>
  );
}

export const Default: Story = {
  render: (args) => (
    <Modal defaultOpen logo={<Logo />}>
      <LoginStep {...args} />
    </Modal>
  ),
};

export const InvalidCredentials: Story = {
  args: {
    loginError: 'invalid',
    failureCount: 1,
    failureCountTotal: 5,
  },
  render: (args) => (
    <Modal defaultOpen logo={<Logo />}>
      <LoginStep {...args} />
    </Modal>
  ),
};

export const Loading: Story = {
  args: {
    onSubmit: fn(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });
    }),
  },
  render: (args) => (
    <Modal defaultOpen logo={<Logo />}>
      <LoginStep {...args} />
    </Modal>
  ),
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const fields = within(dialog);
    const email = fields.getByRole('textbox', { name: '이메일' });
    const password = fields.getByLabelText('비밀번호', { exact: true });
    const submit = fields.getByRole('button', { name: '로그인' });

    await expect(submit).toBeDisabled();

    await userEvent.type(email, 'test@example.com');
    await userEvent.type(password, 'test1234');
    await expect(submit).toBeEnabled();

    await userEvent.click(submit);

    await waitFor(() => {
      expect(submit).toBeDisabled();
      expect(submit).toHaveAttribute('aria-busy', 'true');
      expect(args.onSubmit).toHaveBeenCalledTimes(1);
    });

    await userEvent.click(password);
    await userEvent.keyboard('{Enter}{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);

    await waitFor(
      () => {
        expect(submit).toBeEnabled();
        expect(submit).toHaveAttribute('aria-busy', 'false');
      },
      { timeout: 3000 },
    );

    await userEvent.click(submit);

    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalledTimes(2);
    });

    await waitFor(
      () => {
        expect(submit).toBeEnabled();
      },
      { timeout: 3000 },
    );
  },
};

export const FailureAndRetry: Story = {
  args: {
    onSubmit: fn(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });
    }),
  },
  render: (args) => <FailureInModal {...args} />,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const fields = within(dialog);
    const email = fields.getByRole('textbox', { name: '이메일' });
    const password = fields.getByLabelText('비밀번호', { exact: true });
    const submit = fields.getByRole('button', { name: '로그인' });

    await userEvent.type(email, 'test@example.com');
    await userEvent.type(password, 'test1234');
    await userEvent.click(submit);

    await expect(await fields.findByRole('alert')).toHaveTextContent(
      '이메일 또는 비밀번호가 일치하지 않아요. (1/5)',
    );
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(password).toHaveAttribute('aria-invalid', 'true');
    await expect(submit).toBeEnabled();
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);

    await expect(email).toHaveValue('test@example.com');
    await expect(password).toHaveValue('test1234');

    await userEvent.click(submit);

    await waitFor(() => {
      expect(fields.getByRole('alert')).toHaveTextContent(
        '이메일 또는 비밀번호가 일치하지 않아요. (2/5)',
      );
      expect(submit).toBeEnabled();
      expect(args.onSubmit).toHaveBeenCalledTimes(2);
    });
  },
};
