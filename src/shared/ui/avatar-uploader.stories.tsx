import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { AvatarUploader, type AvatarUploaderProps } from './avatar-uploader';

const meta = {
  title: 'Shared/UI/AvatarUploader',
  component: AvatarUploader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onFileSelect: fn(),
  },
} satisfies Meta<typeof AvatarUploader>;

export default meta;

type Story = StoryObj<typeof meta>;

function PreviewUploader({ onFileSelect, ...args }: AvatarUploaderProps) {
  const [src, setSrc] = useState<string>();

  useEffect(
    () => () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    },
    [src],
  );

  return (
    <AvatarUploader
      {...args}
      alt={src ? '선택한 프로필 이미지' : undefined}
      onFileSelect={(file) => {
        onFileSelect(file);
        setSrc(URL.createObjectURL(file));
      }}
      src={src}
    />
  );
}

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const SelectImage: Story = {
  render: (args) => <PreviewUploader {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');

    await expect(canvas.queryByRole('img', { name: '선택한 프로필 이미지' })).toBeNull();
    await expect(input).not.toBeNull();

    await userEvent.upload(input as HTMLInputElement, file);

    await expect(args.onFileSelect).toHaveBeenCalledWith(file);
    await expect(input).toHaveValue('');
  },
};
