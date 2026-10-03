import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import { type SignupTermId } from '@/app/_model/signup-terms';
import { Logo, Modal } from '@/shared/ui';

import { SignupTermsStep, type SignupTermsStepProps } from './signup-terms-step';

const meta = {
  title: 'App/Signup/SignupTermsStep',
  component: SignupTermsStep,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    agreedIds: [],
    loginHref: '/login',
    onAgreedIdsChange: fn(),
    onNext: fn(),
    onViewTerms: fn(),
  },
} satisfies Meta<typeof SignupTermsStep>;

export default meta;

type Story = StoryObj<typeof meta>;

function StepInModal({ agreedIds: initialAgreedIds, ...args }: SignupTermsStepProps) {
  const [agreedIds, setAgreedIds] = useState<SignupTermId[]>([...initialAgreedIds]);

  return (
    <Modal defaultOpen logo={<Logo />}>
      <SignupTermsStep
        {...args}
        agreedIds={agreedIds}
        onAgreedIdsChange={(nextAgreedIds) => {
          setAgreedIds(nextAgreedIds);
          args.onAgreedIdsChange(nextAgreedIds);
        }}
      />
    </Modal>
  );
}

const render: Story['render'] = (args) => <StepInModal {...args} />;

export const Default: Story = { render };

export const RequiredAgreed: Story = {
  args: { agreedIds: ['service', 'privacy'] },
  render,
};

export const AllAgreed: Story = {
  args: { agreedIds: ['service', 'privacy', 'profile-image', 'preference'] },
  render,
};

export const AgreeAll: Story = {
  render,
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
  render,
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
  args: { agreedIds: ['service', 'privacy', 'profile-image', 'preference'] },
  render,
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

export const ViewTerms: Story = {
  render,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.click(
      within(dialog).getByRole('button', { name: '서비스 이용약관 동의 전문 보기' }),
    );

    await expect(args.onViewTerms).toHaveBeenCalledWith('service');
  },
};
