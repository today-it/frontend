import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { TextInput } from './text-input';

const meta = {
  title: 'Shared/UI/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    placeholder: '이메일을 입력해주세요',
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Focused: Story = {
  args: {
    autoFocus: true,
  },
  render: (args) => <TextInput {...args} data-focused="" />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox');
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await expect(input).toHaveValue('');
  },
};

export const Typing: Story = {
  args: { autoFocus: true, defaultValue: 'user@' },
  render: (args) => <TextInput {...args} data-focused="" />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'user@');
    await expect(input).toHaveFocus();
    await expect(input).toHaveValue('user@');
  },
};
export const Filled: Story = { args: { defaultValue: 'user@example.com' } };

export const Error: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: '이메일을 입력해주세요',
  },
};

export const Success: Story = {
  args: {
    success: true,
    defaultValue: 'user@example.com',
    'aria-label': '검증 성공 이메일',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-16">
      <TextInput aria-label="기본 입력창" placeholder="이메일을 입력해주세요" />
      <TextInput aria-label="포커스된 입력창" autoFocus placeholder="이메일을 입력해주세요" />
      <TextInput aria-label="값이 있는 입력창" defaultValue="user@example.com" />
      <TextInput aria-invalid aria-label="오류 입력창" defaultValue="이메일을 입력해주세요" />
      <TextInput success aria-label="검증 성공 입력창" defaultValue="user@example.com" />
      <TextInput aria-label="비활성 입력창" disabled placeholder="이메일을 입력해주세요" />
    </div>
  ),
};

export const SuccessWithError: Story = {
  args: {
    success: true,
    'aria-invalid': true,
    defaultValue: 'user@example.com',
    'aria-label': '성공과 오류가 함께 설정된 입력창',
  },
};

export const SuccessDisabled: Story = {
  args: {
    success: true,
    disabled: true,
    defaultValue: 'user@example.com',
    'aria-label': '비활성 검증 성공 입력창',
  },
};
