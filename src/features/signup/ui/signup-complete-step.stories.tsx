import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import { Logo, Modal } from '@/shared/ui';

import { SignupCompleteStep } from './signup-complete-step';

const meta = {
  title: 'Features/Signup/SignupCompleteStep',
  component: SignupCompleteStep,
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
    onStartPreference: fn(),
    onSkip: fn(),
  },
} satisfies Meta<typeof SignupCompleteStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StartPreference: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await expect(
      within(dialog).getByRole('heading', { name: '회원가입이 완료되었어요' }),
    ).toBeVisible();

    await userEvent.click(within(dialog).getByRole('button', { name: '취향 알려주기' }));
    await expect(args.onStartPreference).toHaveBeenCalledTimes(1);
    await expect(args.onSkip).not.toHaveBeenCalled();
  },
};

export const Skip: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.click(within(dialog).getByRole('link', { name: '나중에 설정할게요' }));
    await expect(args.onSkip).toHaveBeenCalledTimes(1);
    await expect(args.onStartPreference).not.toHaveBeenCalled();
  },
};
