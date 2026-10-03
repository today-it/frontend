import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import { Logo } from './logo';
import { Modal, ModalTitle } from './modal';

const meta = {
  title: 'Shared/UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: null,
    defaultOpen: true,
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Modal {...args} logo={<Logo />}>
      <ModalTitle>회원가입을 위해 약관에 동의해주세요</ModalTitle>
      <Button>다음</Button>
    </Modal>
  ),
};

export const WithoutLogo: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalTitle>로고 없이 표시해요</ModalTitle>
      <Button>확인</Button>
    </Modal>
  ),
};

export const OpenAndClose: Story = {
  args: {
    defaultOpen: false,
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <div className="p-24">
        <Button onClick={() => setOpen(true)} size="md">
          Modal 열기
        </Button>
        <Modal {...args} onOpenChange={setOpen} open={open}>
          <ModalTitle>회원가입을 위해 약관에 동의해주세요</ModalTitle>
          <Button onClick={() => setOpen(false)}>다음</Button>
        </Modal>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const opener = within(canvasElement).getByRole('button', { name: 'Modal 열기' });

    await userEvent.click(opener);

    const dialog = await screen.findByRole('dialog', {
      name: '회원가입을 위해 약관에 동의해주세요',
    });

    await waitFor(() => expect(dialog).toBeVisible());

    await userEvent.click(within(dialog).getByRole('button', { name: '닫기' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  },
};

export const CloseWithEscape: Story = {
  args: {
    defaultOpen: false,
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <div className="p-24">
        <Button onClick={() => setOpen(true)} size="md">
          Modal 열기
        </Button>
        <Modal {...args} onOpenChange={setOpen} open={open}>
          <ModalTitle>ESC로 닫기</ModalTitle>
          <Button>확인</Button>
        </Modal>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Modal 열기' }));
    await screen.findByRole('dialog', { name: 'ESC로 닫기' });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const KeepOpenOnScrimClick: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalTitle>바깥을 눌러도 닫히지 않아요</ModalTitle>
      <Button>확인</Button>
    </Modal>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: '바깥을 눌러도 닫히지 않아요' });

    const backdrop = document.querySelector<HTMLElement>('[data-slot="modal-backdrop"]');

    if (!backdrop) {
      throw new Error('Modal 스크림을 찾을 수 없어요.');
    }

    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(backdrop);

    // 닫힘 애니메이션(150ms)이 끝나고도 열려 있는지 확인합니다.
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(dialog).toBeInTheDocument();
    await expect(dialog).toBeVisible();
  },
};
