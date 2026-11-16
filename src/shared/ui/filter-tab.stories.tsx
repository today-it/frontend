import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

import { FilterTab } from './filter-tab';

const meta = {
  title: 'Shared/UI/FilterTab',
  component: FilterTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '필터 패널을 여닫는 56px 높이의 공용 FilterTab 컴포넌트입니다. 활성(pressed) 상태에서 회색 배경(bg-surface-subtle)과 기본 텍스트 색을 적용하며, count 전달 시 라벨 옆에 14px regular 개수를 표시합니다. chevron 아이콘은 열린 활성(pressed) 상태에서 위쪽(180도 회전), 닫힌 상태에서 아래쪽을 향하며, count나 filled 상태만으로는 회전하지 않습니다.',
      },
    },
  },
  args: {
    label: '지역',
  },
} satisfies Meta<typeof FilterTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
  play: async ({ canvas }) => {
    const tab = canvas.getByRole('button', { name: /지역/ });
    const icon = tab.querySelector('svg');
    await expect(tab).toHaveAttribute('aria-pressed', 'false');
    await expect(icon).not.toBeNull();
    await expect(getComputedStyle(icon!).rotate).toBe('none');
  },
};

export const Active: Story = {
  args: {
    defaultPressed: true,
  },
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
  play: async ({ canvas }) => {
    const tab = canvas.getByRole('button', { name: /지역/ });
    const icon = tab.querySelector('svg');
    await expect(tab).toHaveAttribute('aria-pressed', 'true');
    await expect(icon).not.toBeNull();
    await expect(getComputedStyle(icon!).rotate).toBe('180deg');
  },
};

export const Filled: Story = {
  args: {
    filled: true,
    label: '성수',
  },
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
  play: async ({ canvas }) => {
    const tab = canvas.getByRole('button', { name: /성수/ });
    const icon = tab.querySelector('svg');
    await expect(tab).toHaveAttribute('aria-pressed', 'false');
    await expect(icon).not.toBeNull();
    await expect(getComputedStyle(icon!).rotate).toBe('none');
  },
};

export const WithCount: Story = {
  args: {
    count: 2,
  },
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
};

export const ActiveWithCount: Story = {
  args: {
    count: 2,
    defaultPressed: true,
  },
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    count: 1,
  },
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
};

export const TogglesWithKeyboard: Story = {
  args: {
    count: 3,
    onPressedChange: fn(),
  },
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
  play: async ({ args, canvas }) => {
    const tab = canvas.getByRole('button', { name: /지역/ });
    const icon = tab.querySelector('svg');
    await expect(icon).not.toBeNull();
    await expect(tab.getBoundingClientRect().height).toBe(56);
    await expect(tab).toHaveAttribute('aria-pressed', 'false');
    await expect(getComputedStyle(tab).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(icon!).rotate).toBe('none');

    const label = canvas.getByText('지역');
    const count = canvas.getByText('3');
    await expect(getComputedStyle(label).fontSize).toBe('16px');
    await expect(getComputedStyle(count).fontSize).toBe('14px');
    await expect(getComputedStyle(count).fontWeight).toBe('400');

    await userEvent.click(tab);
    await expect(tab).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(getComputedStyle(tab).backgroundColor).not.toBe('rgba(0, 0, 0, 0)'));
    await waitFor(() =>
      expect(getComputedStyle(label).color).not.toBe(getComputedStyle(count).color),
    );
    await expect(getComputedStyle(icon!).rotate).toBe('180deg');

    await userEvent.keyboard('{Enter}');
    await expect(tab).toHaveAttribute('aria-pressed', 'false');
    await expect(getComputedStyle(icon!).rotate).toBe('none');

    await userEvent.keyboard(' ');
    await expect(tab).toHaveAttribute('aria-pressed', 'true');
    await expect(getComputedStyle(icon!).rotate).toBe('180deg');
    await expect(args.onPressedChange).toHaveBeenCalledTimes(3);
  },
};

export const DisabledBlocksToggle: Story = {
  args: { disabled: true, onPressedChange: fn() },
  render: (args) => <FilterTab className="w-[450px] flex-none" {...args} />,
  play: async ({ args, canvas }) => {
    const tab = canvas.getByRole('button', { name: /지역/ });
    await userEvent.click(tab, { pointerEventsCheck: 0 });
    await expect(tab).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onPressedChange).not.toHaveBeenCalled();
  },
};

export const MobileNarrowWidth: Story = {
  args: {
    label: '카테고리',
    count: 9,
  },
  render: (args) => (
    <div className="w-[171px]">
      <FilterTab {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const tab = canvas.getByRole('button', { name: /카테고리/ });
    await expect(tab).toBeVisible();
    await expect(canvas.getByText('카테고리')).toBeVisible();
    await expect(canvas.getByText('9')).toBeVisible();
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-20">
      <FilterTab className="w-[450px] flex-none" label="기본" />
      <FilterTab className="w-[450px] flex-none" defaultPressed label="활성" />
      <FilterTab className="w-[450px] flex-none" filled label="선택됨" />
      <FilterTab className="w-[450px] flex-none" count={2} label="개수" />
      <FilterTab className="w-[450px] flex-none" count={2} defaultPressed label="활성 개수" />
    </div>
  ),
};
