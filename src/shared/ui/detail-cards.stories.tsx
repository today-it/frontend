import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Card, CardContent } from './card';

const meta = {
  title: 'Shared/UI/DetailCards',
  component: Card,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[458px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Surface: Story = {
  render: () => (
    <Card>
      <CardContent>카드 내용</CardContent>
    </Card>
  ),
};
