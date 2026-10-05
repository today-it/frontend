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
  args: { defaultCity: '부산' },
};

export const RegionSelected: Story = {
  args: { defaultCity: '부산', defaultDistrict: '서면' },
};

export const AllSelected: Story = {
  args: {
    defaultCity: '부산',
    defaultDistrict: '서면',
    defaultConcepts: ['조용함', '로맨틱', '아늑함'],
  },
};

export const CityOpen: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.click(within(dialog).getByRole('combobox', { name: '지역' }));

    for (const city of ['서울', '부산', '인천', '대구', '대전', '광주']) {
      await expect(await screen.findByRole('option', { name: city })).toBeVisible();
    }
  },
};

export const DistrictOpen: Story = {
  args: { defaultCity: '부산' },
  play: async () => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.click(within(dialog).getByRole('combobox', { name: '구/군' }));

    for (const district of ['전체 선택', '해운대구', '서면', '남포동', '광안리', '기장군']) {
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

    await choose(dialog, '구/군', '서면');
    await expect(district).toHaveTextContent('서면');

    await choose(dialog, '지역', '서울');
    await expect(district).toHaveTextContent('구/군 선택');
  },
};

export const SelectAllDistricts: Story = {
  args: { defaultCity: '부산', defaultConcepts: ['조용함'] },
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await choose(dialog, '구/군', '전체 선택');
    await expect(within(dialog).getByRole('combobox', { name: '구/군' })).toHaveTextContent(
      '전체 선택',
    );

    await userEvent.click(within(dialog).getByRole('button', { name: '선택 완료' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      city: '부산',
      district: '전체',
      concepts: ['조용함'],
    });
  },
};

export const SelectPreference: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const submit = within(dialog).getByRole('button', { name: '선택 완료' });

    await expect(submit).toBeDisabled();

    await choose(dialog, '지역', '부산');
    await choose(dialog, '구/군', '서면');
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
      city: '부산',
      district: '서면',
      concepts: ['로맨틱'],
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
    defaultCity: '부산',
    defaultDistrict: '서면',
    defaultConcepts: ['조용함', '로맨틱'],
    isSubmitting: true,
  },
};

export const RequestError: Story = {
  args: {
    defaultCity: '부산',
    defaultDistrict: '서면',
    defaultConcepts: ['조용함', '로맨틱'],
    requestError: true,
  },
};
