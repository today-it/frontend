import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, userEvent } from 'storybook/test';

import { RegionRow } from './region-row';

const meta = {
  title: 'Shared/UI/RegionRow',
  component: RegionRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '지역 선택 열에 사용하는 48px 높이의 공용 RegionRow 컴포넌트입니다. checked 전달 시 체크박스와 라벨 영역은 선택(onCheckedChange), onNavigate가 있을 때만 표시되는 독립 chevron 버튼은 하위 지역 탐색(onNavigate)을 담당하며 checkDisabled 상태에서도 탐색은 허용됩니다. checked가 없으면 행 전체가 탐색 버튼으로 동작합니다.',
      },
    },
  },
  args: {
    label: '성남시',
    onCheckedChange: fn(),
    onNavigate: fn(),
  },
  decorators: [
    (StoryComponent) => (
      <div className="w-[268px]">
        <StoryComponent />
      </div>
    ),
  ],
} satisfies Meta<typeof RegionRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const SingleSelected: Story = {
  args: { selected: true },
};

export const Unchecked: Story = {
  args: { checked: false, onNavigate: undefined },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Partial: Story = {
  args: { checked: 'indeterminate' },
};

export const SelectedChecked: Story = {
  args: { checked: true, selected: true },
};

export const CheckDisabled: Story = {
  args: { checked: false, checkDisabled: true },
};

export const CheckOnly: Story = {
  args: { checked: false, onNavigate: undefined },
};

export const AllStates: Story = {
  render: (args) => (
    <div className="flex flex-col">
      <RegionRow {...args} label="탐색 전용" />
      <RegionRow {...args} label="탐색 중" selected />
      <RegionRow {...args} checked={false} label="선택 안 됨" onNavigate={undefined} />
      <RegionRow {...args} checked label="선택됨" />
      <RegionRow {...args} checked="indeterminate" label="일부 선택" />
      <RegionRow {...args} checked label="탐색 중 선택됨" selected />
      <RegionRow {...args} checked={false} checkDisabled label="선택 불가" />
    </div>
  ),
};

export const SeparatesCheckAndNavigate: Story = {
  args: { checked: false },
  play: async ({ args, canvas }) => {
    const row = canvas
      .getByRole('checkbox', { name: '성남시' })
      .closest('[data-slot="region-row"]');
    if (!(row instanceof HTMLElement)) throw new Error('row not found');
    const rowStyle = getComputedStyle(row);
    await expect(row.getBoundingClientRect().height).toBe(48);
    await expect([rowStyle.paddingLeft, rowStyle.paddingRight, rowStyle.columnGap]).toEqual([
      '16px',
      '16px',
      '12px',
    ]);
    await expect(getComputedStyle(canvas.getByText('성남시')).fontSize).toBe('16px');

    await userEvent.click(canvas.getByRole('checkbox', { name: '성남시' }));
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await expect(args.onNavigate).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: '성남시 하위 지역 보기' }));
    await expect(args.onNavigate).toHaveBeenCalledTimes(1);
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByText('성남시'));
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await expect(args.onNavigate).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardOrder: Story = {
  args: { checked: false },
  play: async ({ args, canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('checkbox', { name: '성남시' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
    await expect(args.onNavigate).not.toHaveBeenCalled();

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: '성남시 하위 지역 보기' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onNavigate).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(args.onNavigate).toHaveBeenCalledTimes(2);
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
  },
};

export const NavigatesWhenCheckDisabled: Story = {
  args: { checked: false, checkDisabled: true },
  play: async ({ args, canvas }) => {
    const checkbox = canvas.getByRole('checkbox', { name: '성남시' });
    await expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(checkbox, { pointerEventsCheck: 0 });
    await expect(args.onCheckedChange).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: '성남시 하위 지역 보기' }));
    await expect(args.onNavigate).toHaveBeenCalledTimes(1);
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

export const SingleNavigates: Story = {
  args: {},
  play: async ({ args, canvas }) => {
    await expect(canvas.queryByRole('checkbox')).toBeNull();
    const button = canvas.getByRole('button', { name: '성남시' });
    await expect(button.getBoundingClientRect().width).toBe(268);
    await userEvent.click(button);
    await expect(args.onNavigate).toHaveBeenCalledTimes(1);
  },
};

export const CheckOnlyLabelToggles: Story = {
  args: { checked: false, onNavigate: undefined },
  play: async ({ args, canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    await userEvent.click(canvas.getByText('성남시'));
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
  },
};

function Harness() {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <RegionRow
      checked={checked}

      label="성남시"
      onCheckedChange={setChecked}
      onNavigate={() => {}}
    />
  );
}

export const ControlledPartialBecomesChecked: Story = {
  render: () => <Harness />,
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole('checkbox', { name: '성남시' });
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};
