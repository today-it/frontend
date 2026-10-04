import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useRef, useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button, Logo, Modal } from '@/shared/ui';

import { LoginStep, type LoginStepProps } from './login-step';

type LoginStoryArgs = LoginStepProps & {
  onComplete: () => void;
};

const meta = {
  title: 'App/Login/LoginStep',
  component: LoginStep,
  render: (args: LoginStoryArgs) => <SuccessInModal {...args} />,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onPasswordReset: fn(),
    onSignup: fn(),
    onSocialLogin: fn(),
    onSubmit: fn(),
    onComplete: fn(),
  },
} satisfies Meta<LoginStoryArgs>;

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

function SuccessInModal({ onComplete, ...args }: LoginStoryArgs) {
  const [open, setOpen] = useState(false);
  const openCycleRef = useRef(0);

  return (
    <>
      <Button
        onClick={() => {
          openCycleRef.current += 1;
          setOpen(true);
        }}
      >
        로그인
      </Button>

      <Modal logo={<Logo />} onOpenChange={setOpen} open={open}>
        <LoginStep
          {...args}
          onSubmit={async (values) => {
            const openCycle = openCycleRef.current;

            await args.onSubmit(values);

            if (openCycle === openCycleRef.current) {
              setOpen(false);
            }

            onComplete();
          }}
        />
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: (args) => (
    <Modal defaultOpen logo={<Logo />}>
      <LoginStep {...args} />
    </Modal>
  ),
};

export const Filled: Story = {
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
    await expect(submit).toBeDisabled();

    await userEvent.type(password, 'test1234');

    await expect(submit).toBeEnabled();
    await expect(fields.queryByRole('alert')).not.toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const EmailFormatError: Story = {
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

    await userEvent.type(email, 'invalid-email');
    await userEvent.type(password, 'test1234');
    await userEvent.click(submit);

    await expect(await fields.findByRole('alert')).toHaveTextContent(
      '이메일 형식이 올바르지 않아요.',
    );
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
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

export const Success: Story = {
  args: {
    onSubmit: fn(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });
    }),
  },
  render: (args: LoginStoryArgs) => <SuccessInModal {...args} />,
  play: async ({ args }) => {
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const openButton = screen.getByRole('button', { name: '로그인' });
    await userEvent.click(openButton);

    const dialog = await screen.findByRole('dialog');
    const fields = within(dialog);

    await userEvent.type(fields.getByRole('textbox', { name: '이메일' }), 'test@example.com');
    await userEvent.type(fields.getByLabelText('비밀번호', { exact: true }), 'test1234');
    await userEvent.click(fields.getByRole('button', { name: '로그인' }));

    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(args.onSubmit).toHaveBeenCalledTimes(1);
        expect(args.onComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 },
    );
  },
};

export const CloseAndReopen: Story = {
  render: (args) => <SuccessInModal {...args} />,
  play: async ({ args }) => {
    const openButton = screen.getByRole('button', { name: '로그인' });

    await userEvent.click(openButton);

    const dialog = await screen.findByRole('dialog');
    const fields = within(dialog);

    await userEvent.type(fields.getByRole('textbox', { name: '이메일' }), 'test@example.com');
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(openButton).toHaveFocus();
    });

    await userEvent.click(openButton);

    const reopenedDialog = await screen.findByRole('dialog');
    const reopenedFields = within(reopenedDialog);

    await expect(reopenedFields.getByRole('textbox', { name: '이메일' })).toHaveValue('');
    await expect(reopenedFields.getByLabelText('비밀번호', { exact: true })).toHaveValue('');

    await userEvent.click(reopenedFields.getByRole('button', { name: '닫기' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(openButton).toHaveFocus();
    });

    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(args.onComplete).not.toHaveBeenCalled();
  },
};

export const KeyboardNavigation: Story = {
  render: (args) => <SuccessInModal {...args} />,
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    const dialog = await screen.findByRole('dialog');
    const email = within(dialog).getByRole('textbox', { name: '이메일' });

    await waitFor(() => {
      expect(email).toHaveFocus();
    });

    for (let index = 0; index < 12; index += 1) {
      await userEvent.tab();
      await expect(dialog.contains(dialog.ownerDocument.activeElement)).toBe(true);
    }

    for (let index = 0; index < 12; index += 1) {
      await userEvent.tab({ shift: true });
      await expect(dialog.contains(dialog.ownerDocument.activeElement)).toBe(true);
    }
  },
};

export const ReopenWhileSubmitting: Story = {
  args: {
    onSubmit: fn(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });
    }),
  },
  render: (args) => <SuccessInModal {...args} />,
  play: async ({ args }) => {
    const openButton = screen.getByRole('button', { name: '로그인' });

    await userEvent.click(openButton);

    const dialog = await screen.findByRole('dialog');
    const fields = within(dialog);

    await userEvent.type(fields.getByRole('textbox', { name: '이메일' }), 'test@example.com');
    await userEvent.type(fields.getByLabelText('비밀번호', { exact: true }), 'test1234');

    const submit = fields.getByRole('button', { name: '로그인' });
    await userEvent.click(submit);

    await waitFor(() => {
      expect(submit).toBeDisabled();
      expect(args.onSubmit).toHaveBeenCalledTimes(1);
    });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await userEvent.click(openButton);
    const reopenedDialog = await screen.findByRole('dialog');

    await waitFor(
      () => {
        expect(args.onComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 },
    );

    await expect(reopenedDialog).toHaveAttribute('data-open');
  },
};

export const PasswordVisibility: Story = {
  render: (args) => (
    <Modal defaultOpen logo={<Logo />}>
      <LoginStep {...args} />
    </Modal>
  ),
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const fields = within(dialog);
    const password = fields.getByLabelText('비밀번호', { exact: true });

    await userEvent.type(password, 'test1234');

    await expect(password).toHaveAttribute('type', 'password');
    await expect(password).toHaveValue('test1234');

    await userEvent.click(fields.getByRole('button', { name: '비밀번호 보기' }));

    await expect(password).toHaveAttribute('type', 'text');
    await expect(password).toHaveValue('test1234');

    await userEvent.click(fields.getByRole('button', { name: '비밀번호 숨기기' }));

    await expect(password).toHaveAttribute('type', 'password');
    await expect(password).toHaveValue('test1234');
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const ActionCallbacks: Story = {
  render: (args) => (
    <Modal defaultOpen logo={<Logo />}>
      <LoginStep {...args} />
    </Modal>
  ),
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const fields = within(dialog);

    await userEvent.click(fields.getByRole('button', { name: 'Google로 로그인' }));
    await expect(args.onSocialLogin).toHaveBeenNthCalledWith(1, 'google');

    await userEvent.click(fields.getByRole('button', { name: '카카오로 로그인' }));
    await expect(args.onSocialLogin).toHaveBeenNthCalledWith(2, 'kakao');
    await expect(args.onSocialLogin).toHaveBeenCalledTimes(2);

    await userEvent.click(fields.getByRole('button', { name: '회원가입' }));
    await expect(args.onSignup).toHaveBeenCalledTimes(1);

    await userEvent.click(fields.getByRole('button', { name: '비밀번호를 잊으셨나요?' }));
    await expect(args.onPasswordReset).toHaveBeenCalledTimes(1);

    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(args.onComplete).not.toHaveBeenCalled();
  },
};
