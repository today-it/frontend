import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './button';
import { type IconName, iconNames } from './icon';

const buttonSizes = ['lg', 'md', 'sm'] as const;
const buttonStates = [
  { label: 'Default', className: 'pointer-events-none' },
  { label: 'Hover', className: 'pointer-events-none bg-state-inverse-hover' },
  { label: 'Pressed', className: 'pointer-events-none bg-state-inverse-pressed' },
  { label: 'Disabled', className: 'pointer-events-none', disabled: true },
] as const;

const ctaStates = [
  { label: 'Default', className: 'pointer-events-none' },
  {
    label: 'Hover',
    className: 'pointer-events-none bg-state-cta-hover [color:var(--td-color-text-primary)]',
  },
  {
    label: 'Pressed',
    className: 'pointer-events-none bg-state-cta-pressed [color:var(--td-color-text-primary)]',
  },
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
          '일반 동작에는 primary, 주요 CTA에는 cta를 사용합니다. 공통 규격은 두 variant를 함께 비교하고, 상태별 색상은 각각의 상태 표에서 확인할 수 있습니다.',
      },
    },
  },
  args: {
    children: 'Button',
    size: 'lg',
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'cta'],
    },
    size: {
      control: { type: 'select' },
      options: buttonSizes,
    },
    icon: {
      control: { type: 'select' },
      options: iconNames,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const buttonVariants = [
  { variant: 'primary', label: '일반 버튼' },
  { variant: 'cta', label: 'CTA 버튼' },
] as const;

function VariantComparison({
  allSizes = false,
  disabled = false,
  icon,
}: {
  allSizes?: boolean;
  disabled?: boolean;
  icon?: IconName;
}) {
  return (
    <div className="flex flex-col gap-24">
      {buttonVariants.map(({ variant, label }) => (
        <section className="flex flex-col gap-8" key={variant}>
          <h3 className="text-caption-c1 text-text-secondary">{label}</h3>
          <div className="flex flex-wrap items-center gap-16">
            {(allSizes ? buttonSizes : (['lg'] as const)).map((size) => (
              <Button key={size} variant={variant} size={size} disabled={disabled} icon={icon}>
                Button
              </Button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ButtonStateMatrix({ variant }: { variant: 'primary' | 'cta' }) {
  const states = variant === 'cta' ? ctaStates : buttonStates;

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="border-separate border-spacing-x-16 border-spacing-y-8">
        <caption className="mb-16 text-left text-body-b2 text-text-primary">
          {variant === 'cta' ? 'CTA 버튼' : '일반 버튼'} 상태
        </caption>
        <thead>
          <tr>
            <th scope="col" className="text-left text-caption-c1 text-text-secondary">
              Size
            </th>
            {states.map(({ label }) => (
              <th scope="col" className="text-left text-caption-c1 text-text-secondary" key={label}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buttonSizes.map((size) => (
            <tr key={size}>
              <th scope="row" className="text-left text-caption-c1 text-text-secondary uppercase">
                {size}
              </th>
              {states.map(({ label, className, ...stateProps }) => (
                <td key={label}>
                  <Button variant={variant} className={className} size={size} {...stateProps}>
                    Button
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Default: Story = {
  name: 'Playground',
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => <VariantComparison />,
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => <VariantComparison allSizes />,
};

export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => <VariantComparison icon="check" />,
};

export const IconAllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => <VariantComparison allSizes icon="check" />,
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <VariantComparison disabled />,
};

export const IconDisabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <VariantComparison disabled icon="check" />,
};

export const StateMatrix: Story = {
  name: 'Primary State Matrix',
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => <ButtonStateMatrix variant="primary" />,
};

export const CtaStateMatrix: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => <ButtonStateMatrix variant="cta" />,
};
