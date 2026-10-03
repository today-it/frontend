import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import { Logo, Modal } from '@/shared/ui';

import { SignupEmailStep, type SignupEmailStepProps } from './signup-email-step';

const meta = {
  title: 'App/Signup/SignupEmailStep',
  component: SignupEmailStep,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    phase: 'email',
    email: '',
    code: '',
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

function StepInModal({ code: initialCode, email: initialEmail, ...args }: SignupEmailStepProps) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialCode);

  return (
    <Modal defaultOpen logo={<Logo />}>
      <SignupEmailStep
        {...args}
        code={code}
        email={email}
        onCodeChange={(nextCode) => {
          setCode(nextCode);
          args.onCodeChange(nextCode);
        }}
        onEmailChange={(nextEmail) => {
          setEmail(nextEmail);
          args.onEmailChange(nextEmail);
        }}
      />
    </Modal>
  );
}

const render: Story['render'] = (args) => <StepInModal {...args} />;

export const Default: Story = { render };

export const EmailFilled: Story = {
  args: { email: 'wowowoooo@gmail.com' },
  render,
};

export const EmailFormatError: Story = {
  render,
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
  render,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.type(
      within(dialog).getByRole('textbox', { name: '이메일' }),
      'wowowoooo@gmail.com{Enter}',
    );

    await expect(args.onRequestCode).toHaveBeenCalledTimes(1);
  },
};

export const EmailAlreadyRegistered: Story = {
  args: { email: 'poppop@gmail.com', emailError: 'registered' },
  render,
};

export const EmailRegisteredWithSocial: Story = {
  args: { email: 'poppop@gmail.com', emailError: 'social' },
  render,
};

export const CodeRequested: Story = {
  args: { phase: 'code', email: 'wowowoooo@gmail.com', timerSeconds: 300 },
  render,
};

export const CodeFilled: Story = {
  args: { phase: 'code', email: 'wowowoooo@gmail.com', code: '123456', timerSeconds: 272 },
  render,
};

export const CodeInvalid: Story = {
  args: {
    phase: 'code',
    email: 'wowowoooo@gmail.com',
    code: '010000',
    codeError: 'invalid',
    timerSeconds: 272,
  },
  render,
};

export const CodeExpired: Story = {
  args: {
    phase: 'code',
    email: 'wowowoooo@gmail.com',
    code: '000000',
    codeError: 'expired',
    timerSeconds: 0,
  },
  render,
};

export const VerifyCode: Story = {
  args: { phase: 'code', email: 'wowowoooo@gmail.com', timerSeconds: 300 },
  render,
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
    await expect(args.onVerifyCode).toHaveBeenCalledTimes(1);

    await userEvent.click(within(dialog).getByRole('button', { name: '재전송' }));
    await expect(args.onResendCode).toHaveBeenCalledTimes(1);
  },
};
