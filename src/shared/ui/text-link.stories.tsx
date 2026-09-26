import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextLink } from './text-link';

const meta = {
  title: 'Shared/UI/TextLink',
  component: TextLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Link Text',
    href: '/',
  },
} satisfies Meta<typeof TextLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hover: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-32">
      <TextLink href="/">Link Text</TextLink>
      <TextLink href="/">Link Text</TextLink>
      <TextLink disabled href="/">
        Link Text
      </TextLink>
    </div>
  ),
};
