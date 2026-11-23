import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { PlaceSearchSuggestionPopup } from './place-search-suggestion-popup';

const onSearch = fn();
const onSelect = fn();
const onQueryAdded = fn();

function SuggestionHarness({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  return (
    <PlaceSearchSuggestionPopup
      onClose={() => {}}
      onQueryChange={setQuery}
      onSearch={onSearch}
      onSelect={onSelect}
      query={query}
    />
  );
}

const meta = {
  title: 'App/Places/PlaceSearchSuggestionPopup',
  render: () => <SuggestionHarness />,
  decorators: [
    (Story) => {
      const [client] = useState(() => {
        const queryClient = new QueryClient();
        queryClient.getQueryCache().subscribe((event) => {
          if (event.type === 'added') onQueryAdded(event.query.queryKey);
        });
        return queryClient;
      });
      return (
        <QueryClientProvider client={client}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '장소 검색창에서 열리는 검색 제안 전용 팝업 컴포넌트입니다. 장소 이름만 대소문자 구분 없이 부분 일치로 찾으며, 항목 선택 시 `onSelect` 콜백을 호출합니다.',
      },
    },
  },
  beforeEach: () => {
    onSearch.mockClear();
    onSelect.mockClear();
    onQueryAdded.mockClear();
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyQuery: Story = {
  play: async () => {
    const dialog = within(await screen.findByRole('dialog', { name: '장소 검색 제안' }));
    await expect(dialog.getByRole('status')).toHaveTextContent('장소 이름을 입력해주세요.');
    await expect(dialog.getByRole('button', { name: '검색 실행' })).toBeDisabled();
    await userEvent.keyboard('{Enter}');
    await expect(onSearch).not.toHaveBeenCalled();
  },
};

export const NameMatchesAndNoAddressMatches: Story = {
  render: () => <SuggestionHarness initialQuery="도예" />,
  play: async () => {
    const dialog = within(await screen.findByRole('dialog', { name: '장소 검색 제안' }));
    await expect(await dialog.findByText('도예 원데이 클래스')).toBeVisible();
    const input = dialog.getByRole('searchbox');
    onQueryAdded.mockClear();
    await userEvent.type(input, '공방');
    const previousPlace = dialog.getByRole('button', { name: /도예 원데이 클래스/ });
    await expect(previousPlace).toBeDisabled();
    await userEvent.click(previousPlace);
    await expect(onSelect).not.toHaveBeenCalled();
    await userEvent.clear(input);
    await expect(dialog.getByRole('status')).toHaveTextContent('장소 이름을 입력해주세요.');
    await userEvent.type(input, '종로 카페거리');
    await expect(await dialog.findByText('종로 카페거리')).toBeVisible();
    await expect(onQueryAdded).not.toHaveBeenCalledWith([
      'places',
      'search',
      expect.objectContaining({ keyword: '도예공' }),
    ]);
    await userEvent.click(dialog.getByRole('button', { name: /종로 카페거리/ }));
    await expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: '12', name: '종로 카페거리' }),
    );
    await userEvent.click(input);
    await userEvent.keyboard('{Enter}');
    await expect(onSearch).toHaveBeenCalledTimes(1);
  },
};

export const NoMatches: Story = {
  render: () => <SuggestionHarness initialQuery="없는장소이름" />,
  play: async () => {
    const dialog = within(await screen.findByRole('dialog', { name: '장소 검색 제안' }));
    await expect(dialog.getByRole('status')).toHaveTextContent('검색한 장소가 없어요.');
    await expect(dialog.getByRole('button', { name: '검색 실행' })).toBeEnabled();
  },
};

export const KeyboardFocusStaysInside: Story = {
  render: () => <SuggestionHarness initialQuery="도예" />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: '장소 검색 제안' });
    const input = within(dialog).getByRole('searchbox');
    await expect(input).toHaveFocus();
    await userEvent.tab({ shift: true });
    const rows = within(dialog).getAllByRole('listitem');
    await waitFor(() => expect(within(rows.at(-1)!).getByRole('button')).toHaveFocus());
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveFocus());
  },
};

export const SuggestionDimensions: Story = {
  render: () => <SuggestionHarness initialQuery="도예" />,
  play: async () => {
    const popup = await screen.findByRole('dialog', { name: '장소 검색 제안' });
    const row = within(popup).getAllByRole('listitem')[0].querySelector('button')!;
    const icon = row.querySelector('svg')!;
    const title = row.querySelector('span.text-body-b1')!;
    const subtitle = row.querySelector('span.text-body-b3')!;
    const tag = row.lastElementChild!;
    const panel = popup.lastElementChild!;
    await expect(row.getBoundingClientRect().height).toBe(72);
    await expect(getComputedStyle(panel).padding).toBe('18px');
    await expect(getComputedStyle(panel).borderRadius).toBe('24px');
    await expect(icon.parentElement!.getBoundingClientRect().width).toBe(40);
    await expect(icon.getBoundingClientRect().width).toBe(24);
    await expect(getComputedStyle(title).fontSize).toBe('20px');
    await expect(getComputedStyle(subtitle).fontSize).toBe('14px');
    await expect(getComputedStyle(tag).fontSize).toBe('14px');
    await expect(popup.getBoundingClientRect().top).toBe(90);
    await expect(panel.getBoundingClientRect().top).toBe(158);
  },
};
