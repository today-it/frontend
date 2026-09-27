import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ButtonLink } from './button-link';
import { iconNames } from './icon';

const buttonSizes = ['lg', 'md', 'sm'] as const;
const buttonStates = [
  { label: 'Default', className: 'pointer-events-none' },
  { label: 'Hover', className: 'pointer-events-none bg-state-inverse-hover' },
  { label: 'Pressed', className: 'pointer-events-none bg-state-inverse-pressed' },
  { label: 'Disabled', className: 'pointer-events-none', disabled: true },
] as const;

const meta = {
  title: 'Shared/UI/ButtonLink',
  component: ButtonLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '화면 이동에 사용하는 링크입니다. icon을 지정하면 텍스트 앞에 아이콘이 표시됩니다. 버튼 모양을 유지하면서 링크의 시맨틱과 키보드 동작을 제공합니다.',
      },
    },
  },
  args: {
    children: 'Button link',
    href: '/',
    size: 'lg',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: buttonSizes,
    },
    icon: {
      control: { type: 'select' },
      options: iconNames,
    },
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-16">
      {buttonSizes.map((size) => (
        <ButtonLink key={size} href="/" size={size}>
          Button link
        </ButtonLink>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  args: { icon: 'check' },
};

export const IconAllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-16">
      {buttonSizes.map((size) => (
        <ButtonLink href="/" icon="check" key={size} size={size}>
          Button link
        </ButtonLink>
      ))}
    </div>
  ),
};

export const IconDisabled: Story = {
  args: { disabled: true, icon: 'check' },
};

export const StateMatrix: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
  render: () => (
    <table className="border-separate border-spacing-x-16 border-spacing-y-8">
      <thead>
        <tr>
          <th className="text-left text-caption-c1 text-text-secondary">Size</th>
          {buttonStates.map(({ label }) => (
            <th className="text-left text-caption-c1 text-text-secondary" key={label}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {buttonSizes.map((size) => (
          <tr key={size}>
            <th className="text-left text-caption-c1 text-text-secondary uppercase">{size}</th>
            {buttonStates.map(({ label, className, ...stateProps }) => (
              <td key={label}>
                <ButtonLink className={className} href="/" size={size} {...stateProps}>
                  Button link
                </ButtonLink>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
