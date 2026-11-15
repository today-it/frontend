import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, userEvent } from 'storybook/test';

import { Checkbox, type CheckboxProps } from './checkbox';

const meta = {
  title: 'Shared/UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '선택 여부를 전환하는 24px 공용 Checkbox 컴포넌트입니다. checked와 indeterminate로 미선택 / 선택 / 일부 선택(aria-checked="mixed", 12x2 대시 표시) 상태를 제어하며, Space 키로 전환하고 disabled에서는 입력을 차단합니다.',
      },
    },
  },
  args: {
    'aria-label': '선택',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Indeterminate: Story = {
  args: {
    'aria-label': '일부 선택',
    checked: false,
    indeterminate: true,
  },
  play: async ({ canvas, canvasElement }) => {
    const checkbox = canvas.getByRole('checkbox', { name: '일부 선택' });
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    await expect(checkbox).toHaveAttribute('data-indeterminate');

    const dash = canvasElement.querySelector('[data-slot="checkbox-indicator"] > span');
    if (!(dash instanceof HTMLElement)) throw new Error('indeterminate dash not rendered');
    const dashRect = dash.getBoundingClientRect();
    await expect([dashRect.width, dashRect.height]).toEqual([12, 2]);
    await expect(checkbox.getBoundingClientRect().width).toBe(24);
    await expect(getComputedStyle(dash).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(checkbox).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

function ControlledCheckbox({ onCheckedChange }: Pick<CheckboxProps, 'onCheckedChange'>) {
  const [state, setState] = useState<'indeterminate' | boolean>('indeterminate');

  return (
    <Checkbox
      aria-label="전체"
      checked={state === true}
      indeterminate={state === 'indeterminate'}
      onCheckedChange={(checked, details) => {
        onCheckedChange?.(checked, details);
        setState(checked);
      }}
    />
  );
}

export const ControlledIndeterminate: Story = {
  args: { onCheckedChange: fn() },
  render: (args) => <ControlledCheckbox onCheckedChange={args.onCheckedChange} />,
  play: async ({ args, canvas }) => {
    const checkbox = canvas.getByRole('checkbox', { name: '전체' });
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());

    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
    await expect(checkbox).not.toHaveAttribute('data-indeterminate');
  },
};

export const KeyboardAndDisabled: Story = {
  args: { onCheckedChange: fn() },
  render: (args) => (
    <div className="flex items-center gap-16">
      <Checkbox aria-label="키보드" onCheckedChange={args.onCheckedChange} />
      <Checkbox aria-label="비활성" disabled onCheckedChange={args.onCheckedChange} />
    </div>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.tab();
    const keyboard = canvas.getByRole('checkbox', { name: '키보드' });
    await expect(keyboard).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(keyboard).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);

    const disabled = canvas.getByRole('checkbox', { name: '비활성' });
    await userEvent.click(disabled, { pointerEventsCheck: 0 });
    await expect(disabled).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-16">
      <Checkbox aria-label="선택 안 됨" />
      <Checkbox aria-label="선택됨" defaultChecked />
      <Checkbox aria-label="일부 선택" checked={false} indeterminate />
      <Checkbox aria-label="비활성화됨" disabled />
    </div>
  ),
};
