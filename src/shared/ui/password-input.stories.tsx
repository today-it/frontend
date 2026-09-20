import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
    defaultValue: 'password',
  },
};

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
    <div className="grid grid-cols-4 gap-8">
      <PasswordInput
        aria-label="기본 비밀번호"
        defaultVisible
        placeholder="비밀번호를 입력해주세요"
      />
      <PasswordInput
        aria-label="포커스된 비밀번호"
        className="border-border-active"
        defaultValue="password"
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
        className="border-border-active"
        defaultValue="password"
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
