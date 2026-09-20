import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
    defaultValue: '이메일을 입력해주세요',
  },
};

export const Error: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: '이메일을 입력해주세요',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <TextInput aria-label="기본 입력창" placeholder="이메일을 입력해주세요" />
      <TextInput aria-label="포커스된 입력창" autoFocus defaultValue="이메일을 입력해주세요" />
      <TextInput aria-invalid aria-label="오류 입력창" defaultValue="이메일을 입력해주세요" />
      <TextInput aria-label="비활성 입력창" disabled placeholder="이메일을 입력해주세요" />
    </div>
  ),
};
