import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { ChipRemovable } from './chip-removable';

const meta = {
  title: 'Shared/UI/ChipRemovable',
  component: ChipRemovable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '선택된 필터를 표시하고 해제하는 36px 높이의 공용 ChipRemovable 컴포넌트입니다. 토글 선택용 공용 Chip과 별개로 분리된 해제 전용 버튼이며, 클릭 / Enter / Space 키 입력 시 onRemove를 호출하고 disabled에서는 동작하지 않습니다.',
      },
    },
  },
  args: {
    label: '성남시',
    onRemove: fn(),
  },
} satisfies Meta<typeof ChipRemovable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const LongLabel: Story = {
  args: { label: '경기도 성남시 분당구' },
};

export const AllStates: Story = {
  render: (args) => (
    <div className="flex items-center gap-16">
      <ChipRemovable {...args} label="기본" />
      <ChipRemovable {...args} className="bg-state-inverse-hover" label="호버" />
      <ChipRemovable {...args} disabled label="비활성화됨" />
    </div>
  ),
};

export const RemovesWithPointerAndKeyboard: Story = {
  play: async ({ args, canvas }) => {
    const chip = canvas.getByRole('button', { name: '성남시 필터 해제' });
    const style = getComputedStyle(chip);
    await expect(chip.getBoundingClientRect().height).toBe(36);
    await expect([style.paddingLeft, style.paddingRight, style.columnGap]).toEqual([
      '20px',
      '20px',
      '6px',
    ]);
    await expect(style.fontSize).toBe('14px');

    const icon = chip.querySelector('svg');
    await expect(icon?.getBoundingClientRect().width).toBe(16);

    await userEvent.click(chip);
    await expect(args.onRemove).toHaveBeenCalledTimes(1);

    await expect(chip).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onRemove).toHaveBeenCalledTimes(3);
  },
};

export const DisabledDoesNotRemove: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const chip = canvas.getByRole('button', { name: '성남시 필터 해제' });
    await expect(chip).toBeDisabled();
    await userEvent.click(chip, { pointerEventsCheck: 0 });
    await expect(args.onRemove).not.toHaveBeenCalled();
  },
};
