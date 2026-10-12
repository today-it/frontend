import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Footer } from './footer';

const meta = {
  title: 'Shared/UI/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    termsHref: '/terms',
    privacyHref: '/privacy',
    contactHref: 'mailto:contact@example.com',
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
