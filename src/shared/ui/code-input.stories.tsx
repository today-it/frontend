import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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

export const Default: Story = {};

export const Filled: Story = {
  args: {
    defaultValue: '123456',
    timerSeconds: 179,
  },
};

export const Error: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: '123456',
    timerSeconds: 179,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center gap-8">
      <CodeInput aria-label="기본 인증 코드" />
      <CodeInput aria-label="입력된 인증 코드" defaultValue="123456" timerSeconds={179} />
      <CodeInput
        aria-invalid
        aria-label="오류 인증 코드"
        defaultValue="123456"
        timerSeconds={179}
      />
    </div>
  ),
};
