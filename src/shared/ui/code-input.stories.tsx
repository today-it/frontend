import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { cn } from '@/shared/lib';

import { CodeInput } from './code-input';

const meta = {
  title: 'Shared/UI/CodeInput',
  component: CodeInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    'aria-label': '인증 코드',
  },
} satisfies Meta<typeof CodeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderFocused: Story['render'] = (args) => (
  <CodeInput {...args} className={cn(args.className, 'border-border-focus')} />
);

const focusEmpty: Story['play'] = async ({ canvasElement }) => {
  const input = within(canvasElement).getByRole('textbox');
  await userEvent.click(input);
  await expect(input).toHaveFocus();
  await expect(input).toHaveValue('');
};

const typeValue: Story['play'] = async ({ canvasElement }) => {
  const input = within(canvasElement).getByRole('textbox');
  await userEvent.clear(input);
  await userEvent.type(input, '123456');
  await expect(input).toHaveFocus();
  await expect(input).toHaveValue('123 - 456');
};

export const Default: Story = {};

export const Focused: Story = {
  args: { autoFocus: true, timerSeconds: 300 },
  render: renderFocused,
  play: focusEmpty,
};

export const Typing: Story = {
  args: {
    autoFocus: true,
    defaultValue: '123456',
    timerSeconds: 179,
  },
  render: renderFocused,
  play: typeValue,
};

export const Error: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: '123456',
    timerSeconds: 179,
  },
};

export const Success: Story = {
  args: {
    success: true,
    defaultValue: '123456',
    timerSeconds: 179,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center gap-16">
      <CodeInput aria-label="기본 인증 코드" />
      <CodeInput
        aria-label="발송 직후 인증 코드"
        autoFocus
        className="border-border-focus"
        timerSeconds={300}
      />
      <CodeInput aria-label="입력 중인 인증 코드" defaultValue="123456" timerSeconds={179} />
      <CodeInput
        success
        aria-label="검증 성공 인증 코드"
        defaultValue="123456"
        timerSeconds={179}
      />
      <CodeInput
        aria-invalid
        aria-label="오류 인증 코드"
        defaultValue="123456"
        timerSeconds={179}
      />
    </div>
  ),
};
