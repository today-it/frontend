import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import { Confetti } from './confetti';

const meta = {
  title: 'Shared/UI/Confetti',
  component: Confetti,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '공용 Confetti 컴포넌트입니다.',
      },
    },
  },
  args: {
    active: true,
  },
  render: (args) => (
    <div className="w-[min(480px,90vw)]">
      <Confetti {...args} />
    </div>
  ),
} satisfies Meta<typeof Confetti>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Start: Story = {
  args: {
    active: false,
  },
};

function ReplayDemo() {
  const [run, setRun] = useState(0);

  return (
    <div className="flex flex-col items-center gap-24">
      <div data-run={run} data-testid="confetti-replay-stage" className="w-[min(480px,90vw)]">
        <Confetti key={run} />
      </div>
      <Button onClick={() => setRun((current) => current + 1)} size="md">
        다시 재생
      </Button>
    </div>
  );
}

async function waitForFigmaEndFrame(stage: HTMLElement) {
  await waitFor(() => {
    const confetti = stage.querySelector<HTMLElement>('[data-slot="confetti"]');
    const { height = 0, width = 0 } = confetti?.getBoundingClientRect() ?? {};

    expect(confetti).toHaveAttribute('data-state', 'end');
    expect(width).toBeGreaterThan(0);
    expect(width).toBeLessThanOrEqual(480);
    expect(height).toBeCloseTo((width * 7) / 24, 0);
    expect(confetti?.querySelector('img')?.naturalWidth).toBe(480);
  });
}

export const Replay: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => <ReplayDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stage = canvas.getByTestId('confetti-replay-stage');

    await waitForFigmaEndFrame(stage);
    await userEvent.click(canvas.getByRole('button', { name: '다시 재생' }));
    await waitFor(() => expect(stage).toHaveAttribute('data-run', '1'));
    await waitForFigmaEndFrame(stage);
  },
};
