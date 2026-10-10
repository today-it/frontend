import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { cn } from '@/shared/lib';

import { PasswordInput } from './password-input';

const meta = {
  title: 'Shared/UI/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    placeholder: '비밀번호를 입력해주세요',
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderFocused: Story['render'] = (args) => (
  <PasswordInput {...args} className={cn(args.className, 'border-border-focus')} />
);

const focusEmpty: Story['play'] = async ({ canvasElement }) => {
  const input = within(canvasElement).getByPlaceholderText('비밀번호를 입력해주세요');
  await userEvent.click(input);
  await expect(input).toHaveFocus();
  await expect(input).toHaveValue('');
};

const typeValue: Story['play'] = async ({ canvasElement }) => {
  const input = within(canvasElement).getByPlaceholderText('비밀번호를 입력해주세요');
  await userEvent.clear(input);
  await userEvent.type(input, 'pass');
  await expect(input).toHaveFocus();
  await expect(input).toHaveValue('pass');
};

export const Default: Story = {};

export const Visible: Story = {
  args: {
    defaultValue: 'password',
    defaultVisible: true,
  },
};

export const Focused: Story = {
  args: {
    autoFocus: true,
  },
  render: renderFocused,
  play: focusEmpty,
};

export const FocusedVisible: Story = {
  args: { autoFocus: true, defaultVisible: true },
  render: renderFocused,
  play: focusEmpty,
};
export const Typing: Story = {
  args: { autoFocus: true, defaultValue: 'pass' },
  render: renderFocused,
  play: typeValue,
};
export const TypingVisible: Story = {
  args: { autoFocus: true, defaultValue: 'pass', defaultVisible: true },
  render: renderFocused,
  play: typeValue,
};
export const Filled: Story = { args: { defaultValue: 'password' } };
export const FilledVisible: Story = { args: { defaultValue: 'password', defaultVisible: true } };

export const Error: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'password',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-16">
      <PasswordInput
        aria-label="기본 비밀번호"
        defaultVisible
        placeholder="비밀번호를 입력해주세요"
      />
      <PasswordInput
        aria-label="포커스된 비밀번호"
        className="border-border-focus"
        placeholder="비밀번호를 입력해주세요"
        defaultVisible
      />
      <PasswordInput
        aria-invalid
        aria-label="오류 비밀번호"
        defaultValue="password"
        defaultVisible
      />
      <PasswordInput
        aria-label="비활성 비밀번호"
        defaultVisible
        disabled
        placeholder="비밀번호를 입력해주세요"
      />
      <PasswordInput aria-label="기본 비밀번호 숨김" placeholder="비밀번호를 입력해주세요" />
      <PasswordInput
        aria-label="포커스된 비밀번호 숨김"
        className="border-border-focus"
        placeholder="비밀번호를 입력해주세요"
      />
      <PasswordInput aria-invalid aria-label="오류 비밀번호 숨김" defaultValue="password" />
      <PasswordInput
        aria-label="비활성 비밀번호 숨김"
        disabled
        placeholder="비밀번호를 입력해주세요"
      />
    </div>
  ),
};
