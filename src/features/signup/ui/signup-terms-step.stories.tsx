import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import { Logo, Modal } from '@/shared/ui';

import { SignupTermsStep } from './signup-terms-step';

const meta = {
  title: 'Features/Signup/SignupTermsStep',
  component: SignupTermsStep,
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
    loginHref: '/login',
    onNext: fn(),
  },
} satisfies Meta<typeof SignupTermsStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RequiredAgreed: Story = {
  args: { defaultAgreedIds: ['service', 'privacy'] },
};

export const AllAgreed: Story = {
  args: { defaultAgreedIds: ['service', 'privacy', 'profile-image', 'preference'] },
};

export const AgreeAll: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const next = within(dialog).getByRole('button', { name: '다음' });

    await expect(next).toBeDisabled();

    await userEvent.click(within(dialog).getByRole('checkbox', { name: '전체 동의합니다' }));

    for (const checkbox of within(dialog).getAllByRole('checkbox')) {
      await expect(checkbox).toBeChecked();
    }

    await expect(next).toBeEnabled();

    await userEvent.click(next);
    await expect(args.onNext).toHaveBeenCalledTimes(1);
  },
};

export const RequiredOnly: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const next = within(dialog).getByRole('button', { name: '다음' });

    await userEvent.click(
      within(dialog).getByRole('checkbox', { name: '(필수) 서비스 이용약관 동의' }),
    );
    await expect(next).toBeDisabled();

    await userEvent.click(
      within(dialog).getByRole('checkbox', { name: '(필수) 개인정보 수집·이용 동의' }),
    );
    await expect(next).toBeEnabled();
    await expect(
      within(dialog).getByRole('checkbox', { name: '전체 동의합니다' }),
    ).not.toBeChecked();
  },
};

export const UncheckOptionalReleasesAll: Story = {
  args: { defaultAgreedIds: ['service', 'privacy', 'profile-image', 'preference'] },
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const all = within(dialog).getByRole('checkbox', { name: '전체 동의합니다' });

    await expect(all).toBeChecked();

    await userEvent.click(
      within(dialog).getByRole('checkbox', {
        name: '(선택) 프로필 이미지 수집·이용 동의',
      }),
    );

    await expect(all).not.toBeChecked();
    await expect(within(dialog).getByRole('button', { name: '다음' })).toBeEnabled();
  },
};

export const ExpandTerms: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const service = within(dialog).getByRole('button', { name: '서비스 이용약관 동의 전문 보기' });
    const privacy = within(dialog).getByRole('button', {
      name: '개인정보 수집·이용 동의 전문 보기',
    });

    await expect(service).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(service);
    await expect(service).toHaveAttribute('aria-expanded', 'true');
    await expect(within(dialog).getByText(/제1조\(목적\)/)).toBeVisible();

    // 하나를 열면 열려 있던 약관은 접혀 모달이 화면 높이를 넘지 않습니다.
    await userEvent.click(privacy);
    await expect(privacy).toHaveAttribute('aria-expanded', 'true');
    await expect(service).toHaveAttribute('aria-expanded', 'false');
    await expect(within(dialog).queryByText(/제1조\(목적\)/)).not.toBeInTheDocument();

    await userEvent.click(privacy);
    await expect(privacy).toHaveAttribute('aria-expanded', 'false');
  },
};

export const ExpandKeepsAgreement: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const service = within(dialog).getByRole('checkbox', { name: '(필수) 서비스 이용약관 동의' });

    await userEvent.click(
      within(dialog).getByRole('button', { name: '서비스 이용약관 동의 전문 보기' }),
    );
    await expect(service).not.toBeChecked();

    await userEvent.click(service);
    await expect(service).toBeChecked();
  },
};
