import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './button';

const buttonSizes = ['lg', 'md', 'sm'] as const;
const buttonStates = [
  { label: 'Default', className: 'pointer-events-none' },
  { label: 'Hover', className: 'pointer-events-none bg-state-inverse-hover' },
  { label: 'Pressed', className: 'pointer-events-none bg-state-inverse-pressed' },
  { label: 'Disabled', className: 'pointer-events-none', disabled: true },
] as const;

const meta = {
  title: 'Shared/UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '공용 Button 컴포넌트 입니다. hover, active, disabled 상태는 semantic color token을 사용합니다.',
      },
    },
  },
  args: {
    children: 'Button',
    size: 'lg',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: buttonSizes,
    },
  },
} satisfies Meta<typeof Button>;

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
    <div className="flex items-center gap-8">
      {buttonSizes.map((size) => (
        <Button key={size} size={size}>
          Button
        </Button>
      ))}
    </div>
  ),
};

export const StateMatrix: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
  render: () => (
    <table className="border-separate border-spacing-x-8 border-spacing-y-4">
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
                <Button className={className} size={size} {...stateProps}>
                  Button
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
