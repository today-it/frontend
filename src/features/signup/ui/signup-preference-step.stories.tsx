import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import { Logo, Modal } from '@/shared/ui';

import { SignupPreferenceStep } from './signup-preference-step';

const meta = {
  title: 'Features/Signup/SignupPreferenceStep',
  component: SignupPreferenceStep,
  tags: ['autodocs'],
  decorators: [
    (StoryComponent) => (
      <Modal defaultOpen logo={<Logo />}>
        <StoryComponent />
      </Modal>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 720 } },
  },
  args: {
    onSubmit: fn(),
    onSkip: fn(),
  },
} satisfies Meta<typeof SignupPreferenceStep>;

export default meta;

type Story = StoryObj<typeof meta>;

async function choose(dialog: HTMLElement, name: string, option: string) {
  await userEvent.click(within(dialog).getByRole('combobox', { name }));
  await userEvent.click(await screen.findByRole('option', { name: option }));
}

export const Default: Story = {};

export const CitySelected: Story = {
  args: { defaultCity: 'busan' },
};

export const RegionSelected: Story = {
  args: { defaultCity: 'busan', defaultDistrict: '26:500' },
};

export const AllSelected: Story = {
  args: {
    defaultCity: 'busan',
    defaultDistrict: '26:500',
    defaultConcepts: ['QUIET', 'ROMANTIC', 'COZY'],
  },
};

export const CityOpen: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.click(within(dialog).getByRole('combobox', { name: '지역' }));

    for (const city of ['서울', '경기 & 인천', '부산', '강원', '제주', '기타']) {
      await expect(await screen.findByRole('option', { name: city })).toBeVisible();
    }
  },
};

export const DistrictOpen: Story = {
  args: { defaultCity: 'busan' },
  play: async () => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.click(within(dialog).getByRole('combobox', { name: '구/군' }));

    for (const district of ['수영구', '해운대구', '부산진구']) {
      await expect(await screen.findByRole('option', { name: district })).toBeVisible();
    }
  },
};

export const SelectRegion: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const district = within(dialog).getByRole('combobox', { name: '구/군' });

    await expect(district).toBeDisabled();

    await choose(dialog, '지역', '부산');
    await expect(within(dialog).getByRole('combobox', { name: '지역' })).toHaveTextContent('부산');
    await expect(district).toBeEnabled();

    await choose(dialog, '구/군', '수영구');
    await expect(district).toHaveTextContent('수영구');

    await choose(dialog, '지역', '서울');
    await expect(district).toHaveTextContent('구/군 선택');
  },
};

export const SelectPreference: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const submit = within(dialog).getByRole('button', { name: '선택 완료' });

    await expect(submit).toBeDisabled();

    await choose(dialog, '지역', '부산');
    await choose(dialog, '구/군', '수영구');
    await expect(submit).toBeDisabled();

    const quiet = within(dialog).getByRole('button', { name: '조용함' });

    await userEvent.click(quiet);
    await expect(quiet).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(within(dialog).getByRole('button', { name: '로맨틱' }));
    await expect(submit).toBeEnabled();

    await userEvent.click(quiet);
    await expect(quiet).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(submit);
    await expect(args.onSubmit).toHaveBeenCalledWith({
      city: 'busan',
      district: '26:500',
      concepts: ['ROMANTIC'],
    });
  },
};

export const Skip: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.click(within(dialog).getByRole('link', { name: '나중에 설정할게요' }));

    await expect(args.onSkip).toHaveBeenCalledTimes(1);
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Submitting: Story = {
  args: {
    defaultCity: 'busan',
    defaultDistrict: '26:500',
    defaultConcepts: ['QUIET', 'ROMANTIC'],
    isSubmitting: true,
  },
};

export const RequestError: Story = {
  args: {
    defaultCity: 'busan',
    defaultDistrict: '26:500',
    defaultConcepts: ['QUIET', 'ROMANTIC'],
    requestError: true,
  },
};
