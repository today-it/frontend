import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Dropdown } from './dropdown';

const options = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '제주', value: 'jeju' },
];

const meta = {
  title: 'Shared/UI/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: '지역',
    options,
    placeholder: '지역을 선택해주세요',
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: {
    defaultOpen: true,
  },
};

export const Selected: Story = {
  args: {
    defaultValue: 'seoul',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
