import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import { ToastProvider, useToast } from './toast';

const action = fn();

function ToastExample({ linked = false }: { linked?: boolean }) {
  const toast = useToast();
  return (
    <div className="flex min-h-[300px] justify-end p-48">
      <Button
        size="md"
        onClick={(event) =>
          toast.add({
            id: 'preview',
            title: '스크랩했어요',
            positionerProps: {
              anchor: event.currentTarget,
              side: 'bottom',
              align: 'end',
              sideOffset: 12,
            },
            ...(linked
              ? { actionProps: { 'aria-label': '스크랩 목록 보기', onClick: action } }
              : {}),
          })
        }
      >
        알림 표시
      </Button>
    </div>
  );
}

const meta = {
  title: 'Shared/UI/Toast',
  component: ToastProvider,
  args: { children: null },
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => (
    <ToastProvider>
      <ToastExample />
    </ToastProvider>
  ),
} satisfies Meta<typeof ToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '알림 표시' }));
    await waitFor(() =>
      expect(document.querySelector('[data-slot="toast"]')).toHaveTextContent('스크랩했어요'),
    );
    await userEvent.click(within(canvasElement).getByRole('button', { name: '알림 표시' }));
    await expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(1);
    await waitFor(
      () => expect(document.querySelector('[data-slot="toast"]')).not.toBeInTheDocument(),
      { timeout: 4000 },
    );
  },
};
export const WithAction: Story = {
  render: () => (
    <ToastProvider>
      <ToastExample linked />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    action.mockClear();
    await userEvent.click(within(canvasElement).getByRole('button', { name: '알림 표시' }));
    await userEvent.click(await screen.findByRole('button', { name: '스크랩 목록 보기' }));
    await expect(action).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(document.querySelector('[data-slot="toast"]')).not.toBeInTheDocument(),
    );
  },
};
