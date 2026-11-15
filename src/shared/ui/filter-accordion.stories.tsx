import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, userEvent } from 'storybook/test';

import { FilterAccordion } from './filter-accordion';

const meta = {
  title: 'Shared/UI/FilterAccordion',
  component: FilterAccordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '선택한 필터 목록 등 접이식 패널을 여닫는 36px 높이의 공용 FilterAccordion 컴포넌트입니다. open과 onOpenChange로 열림 상태를 부모에서 제어하며, aria-expanded가 자동 반영되고 연결할 패널 id는 aria-controls로 전달합니다.',
      },
    },
  },
  args: {
    count: 4,
    label: '선택한 필터',
    onOpenChange: fn(),
    open: false,
  },
} satisfies Meta<typeof FilterAccordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = {
  args: { open: true },
};

export const WithoutCount: Story = {
  args: { count: undefined },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllStates: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-16">
      <FilterAccordion {...args} />
      <FilterAccordion {...args} open />
      <FilterAccordion {...args} count={undefined} />
      <FilterAccordion {...args} disabled />
    </div>
  ),
};

function Harness({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-[300px] flex-col">
      <FilterAccordion
        aria-controls="filter-accordion-panel"
        count={4}
        label="선택한 필터"
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
        open={open}
      />
      <div hidden={!open} id="filter-accordion-panel">
        선택한 필터 목록
      </div>
    </div>
  );
}

export const TogglesPanel: Story = {
  render: (args) => <Harness onOpenChange={args.onOpenChange} />,
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole('button', { name: /선택한 필터/ });
    const style = getComputedStyle(trigger);
    await expect(trigger.getBoundingClientRect().height).toBe(36);
    await expect([style.columnGap, style.fontSize]).toEqual(['6px', '14px']);
    await expect(trigger.querySelector('svg')?.getBoundingClientRect().width).toBe(20);
    await expect(trigger).toHaveAttribute('aria-controls', 'filter-accordion-panel');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('선택한 필터 목록')).not.toBeVisible();

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('선택한 필터 목록')).toBeVisible();

    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onOpenChange).toHaveBeenCalledTimes(3);
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
  },
};

export const DisabledDoesNotToggle: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole('button', { name: /선택한 필터/ });
    await userEvent.click(trigger, { pointerEventsCheck: 0 });
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
