import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Logo, Modal } from '@/shared/ui';

import { SignupProfileStep } from './signup-profile-step';

const meta = {
  title: 'Features/Signup/SignupProfileStep',
  component: SignupProfileStep,
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
    docs: { story: { inline: false, iframeHeight: 720 } },
  },
  args: {
    onAvatarChange: fn(),
    onNicknameChange: fn(),
    onCheckNickname: fn(),
    onPasswordChange: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof SignupProfileStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NicknameAvailable: Story = {
  args: { defaultNickname: '또르끄막두', nicknameStatus: 'available' },
};

export const NicknameChecking: Story = {
  args: { defaultNickname: '또르끄막두', nicknameStatus: 'checking' },
};

export const NicknameLengthError: Story = {
  args: { defaultNickname: '아아아아아아아아아' },
};

export const NicknameCharsError: Story = {
  args: { defaultNickname: '!@#$$(@' },
};

export const NicknameSpaceError: Story = {
  args: { defaultNickname: '또르끄 막두' },
};

export const NicknameDuplicated: Story = {
  args: { defaultNickname: '또르끄막두', nicknameStatus: 'duplicated' },
};

export const NicknameForbidden: Story = {
  args: { defaultNickname: '시스템관리자', nicknameStatus: 'forbidden' },
};

export const PasswordFilled: Story = {
  args: {
    defaultNickname: '또르끄막두',
    nicknameStatus: 'available',
    defaultPassword: 'godari1362!0',
  },
};

export const PasswordBlocked: Story = {
  args: {
    defaultNickname: '또르끄막두',
    nicknameStatus: 'available',
    defaultPassword: 'Password123!',
    passwordError: 'blocked',
  },
};

export const NicknameValidation: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const nickname = within(dialog).getByRole('textbox', { name: '닉네임' });

    await userEvent.type(nickname, '또');
    await expect(within(dialog).getByRole('alert')).toHaveTextContent(
      '닉네임은 2~8자로 입력해 주세요.',
    );
    await expect(nickname).toHaveAttribute('aria-invalid', 'true');

    await userEvent.type(nickname, '!');
    await expect(within(dialog).getByRole('alert')).toHaveTextContent(
      '한글, 영문, 숫자만 사용할 수 있어요.',
    );

    await userEvent.clear(nickname);
    await userEvent.type(nickname, '또르 끄');
    await expect(within(dialog).getByRole('alert')).toHaveTextContent(
      '닉네임에는 공백을 사용할 수 없어요.',
    );

    await userEvent.clear(nickname);
    await userEvent.type(nickname, '또르끄막두또르끄막');
    await expect(within(dialog).getByRole('alert')).toHaveTextContent(
      '닉네임은 2~8자로 입력해 주세요.',
    );
  },
};

export const CheckNicknameAfterTyping: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const nickname = within(dialog).getByRole('textbox', { name: '닉네임' });

    await userEvent.type(nickname, '또르끄막두');
    await expect(args.onCheckNickname).not.toHaveBeenCalled();

    await waitFor(() => expect(args.onCheckNickname).toHaveBeenCalledTimes(1), { timeout: 2000 });
    await expect(args.onCheckNickname).toHaveBeenCalledWith('또르끄막두');
  },
};

export const SubmitProfile: Story = {
  args: { defaultNickname: '또르끄막두', nicknameStatus: 'available' },
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const submit = within(dialog).getByRole('button', { name: '회원가입' });
    const password = within(dialog).getByLabelText('비밀번호', { selector: 'input' });

    await expect(submit).toBeDisabled();

    await userEvent.type(password, '1234');
    await expect(submit).toBeEnabled();

    await userEvent.click(submit);
    await expect(within(dialog).getByRole('alert')).toHaveTextContent(
      '영문, 숫자, 특수문자를 각각 포함해 10자 이상 입력해 주세요.',
    );
    await expect(args.onSubmit).not.toHaveBeenCalled();

    await userEvent.type(password, 'abcdef{Enter}');
    await expect(within(dialog).getByRole('alert')).toHaveTextContent(
      '영문, 숫자, 특수문자를 각각 포함해 10자 이상 입력해 주세요.',
    );
    await expect(args.onSubmit).not.toHaveBeenCalled();

    await userEvent.type(password, '!{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith({
      nickname: '또르끄막두',
      password: '1234abcdef!',
    });
  },
};

export const PasswordWithSpaceAndSymbols: Story = {
  args: { defaultNickname: '또르끄막두', nicknameStatus: 'available' },
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const password = within(dialog).getByLabelText('비밀번호', { selector: 'input' });

    // 공백이 있어도 규칙에 맞으면 값을 그대로 제출합니다.
    await userEvent.type(password, 'my pass 1 word!!{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith({
      nickname: '또르끄막두',
      password: 'my pass 1 word!!',
    });
  },
};

export const Submitting: Story = {
  args: {
    defaultNickname: '또르끄막두',
    nicknameStatus: 'available',
    defaultPassword: 'godari1362!0',
    isSubmitting: true,
  },
};

export const RequestError: Story = {
  args: {
    defaultNickname: '또르끄막두',
    nicknameStatus: 'available',
    defaultPassword: 'godari1362!0',
    requestError: true,
  },
};

// 1x1 투명 PNG입니다. 실제로 불러올 수 있는 이미지여야 Avatar가 미리보기를 표시합니다.
const pixelPng = Uint8Array.from(
  atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  ),
  (char) => char.charCodeAt(0),
);

export const SelectAvatar: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const input = dialog.querySelector<HTMLInputElement>('input[type="file"]');
    const image = new File([pixelPng], 'avatar.png', { type: 'image/png' });

    await expect(within(dialog).getByRole('button', { name: '프로필 이미지 선택' })).toBeVisible();
    await expect(dialog.querySelector('img')).toBeNull();

    await userEvent.upload(input as HTMLInputElement, image);

    await expect(args.onAvatarChange).toHaveBeenCalledWith(image);
    await waitFor(() =>
      expect(dialog.querySelector('img')).toHaveAttribute('src', expect.stringMatching(/^blob:/)),
    );
    await expect(within(dialog).getByRole('img', { name: '선택한 프로필 이미지' })).toBeVisible();
  },
};

export const IgnoreNonImageFile: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const input = dialog.querySelector<HTMLInputElement>('input[type="file"]');

    await userEvent.upload(
      input as HTMLInputElement,
      new File(['text'], 'note.txt', { type: 'text/plain' }),
      { applyAccept: false },
    );

    await expect(args.onAvatarChange).not.toHaveBeenCalled();
    await expect(dialog.querySelector('img')).toBeNull();
  },
};
