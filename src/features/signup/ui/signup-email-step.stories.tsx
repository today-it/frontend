import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import { SIGNUP_CODE_EXPIRES_SECONDS } from '@/features/signup/model/signup-email';
import { Logo, Modal } from '@/shared/ui';

import { SignupEmailStep } from './signup-email-step';

const meta = {
  title: 'Features/Signup/SignupEmailStep',
  component: SignupEmailStep,
  tags: ['autodocs'],
  decorators: [
    (StoryComponent) => (
      <Modal defaultOpen logo={<Logo />}>
        <StoryComponent />
      </Modal>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    phase: 'email',
    loginHref: '/login',
    onEmailChange: fn(),
    onCodeChange: fn(),
    onRequestCode: fn(),
    onVerifyCode: fn(),
    onResendCode: fn(),
    onSocialLogin: fn(),
  },
} satisfies Meta<typeof SignupEmailStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmailFilled: Story = {
  args: { defaultEmail: 'wowowoooo@gmail.com' },
};

export const EmailFormatError: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const email = within(dialog).getByRole('textbox', { name: '이메일' });
    const next = within(dialog).getByRole('button', { name: '다음' });

    await expect(next).toBeDisabled();

    await userEvent.type(email, 'wowowoooo');
    await expect(next).toBeEnabled();

    await userEvent.click(next);
    await expect(within(dialog).getByRole('alert')).toHaveTextContent(
      '이메일 형식이 올바르지 않아요.',
    );
    await expect(email).toHaveAttribute('aria-invalid', 'true');

    await userEvent.type(email, '@gmail.com');
    await expect(within(dialog).queryByRole('alert')).not.toBeInTheDocument();
  },
};

export const RequestCode: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.type(
      within(dialog).getByRole('textbox', { name: '이메일' }),
      'wowowoooo@gmail.com{Enter}',
    );

    await expect(args.onRequestCode).toHaveBeenCalledWith('wowowoooo@gmail.com');
  },
};

export const EmailAlreadyRegistered: Story = {
  args: { defaultEmail: 'poppop@gmail.com', emailError: 'registered' },
};

export const EmailRegisteredWithSocial: Story = {
  args: { defaultEmail: 'poppop@gmail.com', emailError: 'social' },
};

export const CodeRequested: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    timerSeconds: SIGNUP_CODE_EXPIRES_SECONDS,
  },
};

export const CodeFilled: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    defaultCode: '123456',
    timerSeconds: 272,
  },
};

export const CodeInvalid: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    defaultCode: '010000',
    codeError: 'invalid',
    timerSeconds: 272,
  },
};

export const CodeExpired: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    defaultCode: '000000',
    codeError: 'expired',
    timerSeconds: 0,
  },
};

export const VerifyCode: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    timerSeconds: SIGNUP_CODE_EXPIRES_SECONDS,
  },
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const next = within(dialog).getByRole('button', { name: '다음' });
    const code = within(dialog).getByRole('textbox', { name: '인증코드' });

    await expect(next).toBeDisabled();

    await userEvent.type(code, '12345');
    await expect(next).toBeDisabled();

    await userEvent.type(code, '6');
    await expect(code).toHaveValue('123 - 456');
    await expect(next).toBeEnabled();

    await userEvent.click(next);
    await expect(args.onVerifyCode).toHaveBeenCalledWith('123 - 456');

    await userEvent.click(within(dialog).getByRole('button', { name: '재전송' }));
    await expect(args.onResendCode).toHaveBeenCalledTimes(1);
    await expect(code).toHaveValue('');
  },
};

export const Submitting: Story = {
  args: { defaultEmail: 'wowowoooo@gmail.com', isSubmitting: true },
};

export const RequestError: Story = {
  args: { defaultEmail: 'wowowoooo@gmail.com', requestError: true },
};
