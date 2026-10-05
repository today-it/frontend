import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { signupRequestErrorMessage } from '@/features/signup/model/signup-api';
import { createMockSignupApi } from '@/features/signup/model/signup-mock-api';
import { Button } from '@/shared/ui';

import { SignupModal, type SignupModalProps } from './signup-modal';

const meta = {
  title: 'Features/Signup/SignupModal',
  component: SignupModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    open: true,
    onOpenChange: fn(),
    loginHref: '/login',
    onComplete: fn(),
    api: createMockSignupApi({ delayMs: 0 }),
  },
} satisfies Meta<typeof SignupModal>;

export default meta;

type Story = StoryObj<typeof meta>;

function ModalWithTrigger({ open: initialOpen, onOpenChange, ...args }: SignupModalProps) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="md">
        시작하기
      </Button>
      <SignupModal
        {...args}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          onOpenChange(nextOpen);
        }}
        open={open}
      />
    </>
  );
}

const render: Story['render'] = (args) => <ModalWithTrigger {...args} />;

async function agreeAndGoToEmail(dialog: HTMLElement) {
  await userEvent.click(within(dialog).getByRole('checkbox', { name: '전체 동의합니다' }));
  await userEvent.click(within(dialog).getByRole('button', { name: '다음' }));
}

export const Default: Story = { render };

export const FullFlow: Story = {
  render,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await agreeAndGoToEmail(dialog);

    await userEvent.type(
      await within(dialog).findByRole('textbox', { name: '이메일' }),
      'user@test.com{Enter}',
    );

    await userEvent.type(
      await within(dialog).findByRole('textbox', { name: '인증코드' }),
      '123456{Enter}',
    );

    await userEvent.type(
      await within(dialog).findByRole('textbox', { name: '닉네임' }),
      '또르끄막두',
    );
    await within(dialog).findByText('사용 가능한 닉네임이에요.', {}, { timeout: 3000 });

    await userEvent.type(
      within(dialog).getByLabelText('비밀번호', { selector: 'input' }),
      'godari13620{Enter}',
    );

    await userEvent.click(await within(dialog).findByRole('link', { name: '나중에 설정할게요' }));

    await waitFor(() => expect(args.onComplete).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const ResetWhenReopened: Story = {
  render,
  play: async () => {
    const dialog = await screen.findByRole('dialog');

    await agreeAndGoToEmail(dialog);
    await userEvent.type(
      await within(dialog).findByRole('textbox', { name: '이메일' }),
      'user@test.com',
    );

    await userEvent.click(within(dialog).getByRole('button', { name: '닫기' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: '시작하기' }));

    const reopened = await screen.findByRole('dialog');

    await within(reopened).findByText('회원가입을 위해 약관에 동의해주세요');
    for (const checkbox of within(reopened).getAllByRole('checkbox')) {
      await expect(checkbox).not.toBeChecked();
    }

    await agreeAndGoToEmail(reopened);
    await expect(await within(reopened).findByRole('textbox', { name: '이메일' })).toHaveValue('');
  },
};

export const RetryAfterRequestError: Story = {
  render,
  play: async () => {
    const dialog = await screen.findByRole('dialog');

    await agreeAndGoToEmail(dialog);

    const email = await within(dialog).findByRole('textbox', { name: '이메일' });

    await userEvent.type(email, 'error@test.com{Enter}');
    await expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      signupRequestErrorMessage,
    );
    await expect(within(dialog).getByRole('button', { name: '다음' })).toBeEnabled();

    await userEvent.clear(email);
    await userEvent.type(email, 'user@test.com{Enter}');

    await within(dialog).findByRole('textbox', { name: '인증코드' });
    await expect(within(dialog).queryByText(signupRequestErrorMessage)).not.toBeInTheDocument();
  },
};

export const IgnoreDuplicateClicks: Story = {
  args: {
    api: {
      ...createMockSignupApi({ delayMs: 0 }),
      requestCode: fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return 'sent' as const;
      }),
    },
  },
  render,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await agreeAndGoToEmail(dialog);
    await userEvent.type(
      await within(dialog).findByRole('textbox', { name: '이메일' }),
      'user@test.com',
    );

    const next = within(dialog).getByRole('button', { name: '다음' });

    await userEvent.dblClick(next);
    await expect(next).toBeDisabled();

    await within(dialog).findByRole('textbox', { name: '인증코드' });
    await expect(args.api?.requestCode).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardOnly: Story = {
  render,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    // 열리면 포커스가 모달 안으로 들어옵니다.
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

    // 전체 동의 체크박스에서 스페이스로 선택하고, Tab으로 다음 버튼까지 이동해 Enter로 진행합니다.
    await expect(document.activeElement).toBe(
      within(dialog).getByRole('checkbox', { name: '전체 동의합니다' }),
    );
    await userEvent.keyboard(' ');

    const next = within(dialog).getByRole('button', { name: '다음' });

    for (let count = 0; count < 20 && document.activeElement !== next; count += 1) {
      await userEvent.tab();
    }

    await expect(document.activeElement).toBe(next);
    await userEvent.keyboard('{Enter}');

    // 이메일 단계의 입력창에서 바로 입력하고 Enter로 제출합니다.
    const email = await within(dialog).findByRole('textbox', { name: '이메일' });

    email.focus();
    await userEvent.keyboard('user@test.com{Enter}');
    await within(dialog).findByRole('textbox', { name: '인증코드' });

    // ESC로 닫히고, 닫힌 뒤 다시 열면 포커스가 모달 안으로 들어옵니다.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);

    const trigger = screen.getByRole('button', { name: '시작하기' });

    await userEvent.click(trigger);

    const reopened = await screen.findByRole('dialog');

    await waitFor(() => expect(reopened).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  },
};
