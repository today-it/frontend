'use client';

import type { SubmitEvent } from 'react';

import { cn } from '@/shared/lib';

import { Icon } from './icon';

export interface SearchBarProps {
  /** 검색어. 전달하면 입력을 제어합니다. */
  value?: string;
  /** 비제어 입력의 초기 검색어 */
  defaultValue?: string;
  /** 검색어 변경 핸들러 */
  onValueChange?: (value: string) => void;
  /** 검색 실행 핸들러 */
  onSearch?: () => void;
  /** 입력 안내 문구 */
  placeholder?: string;
  /** 검색 버튼 표시 여부 */
  showButton?: boolean;
  /** 입력에 자동 포커스할지 여부 */
  autoFocus?: boolean;
  /** Search Bar에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 기본, 포커스, 입력 상태를 지원하는 검색 입력입니다.
 *
 * @example
 * ```tsx
 * <SearchBar value={query} onValueChange={setQuery} onSearch={search} />
 * ```
 */
export function SearchBar({
  autoFocus = false,
  className,
  defaultValue,
  onSearch,
  onValueChange,
  placeholder = '검색어를 입력해주세요',
  showButton = true,
  value,
}: SearchBarProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch?.();
  }

  return (
    <form
      aria-label="검색"
      className={cn(
        'group/search-bar flex h-search-bar-height w-full max-w-search-bar-width items-center justify-between rounded-full border border-border-default bg-surface-default pr-12 pl-40 transition-colors focus-within:border-border-focus',
        className,
      )}
      data-slot="search-bar"
      onSubmit={handleSubmit}
      role="search"
    >
      <input
        aria-label="검색어"
        autoFocus={autoFocus}
        autoComplete="off"
        className="min-w-0 flex-1 border-0 bg-transparent text-body-b1 text-text-primary outline-none placeholder:text-text-muted"
        defaultValue={defaultValue}
        onChange={onValueChange ? (event) => onValueChange(event.currentTarget.value) : undefined}
        placeholder={placeholder}
        readOnly={value !== undefined && !onValueChange}
        role="searchbox"
        type="text"
        value={value}
      />
      {showButton ? (
        <button
          aria-label="검색 실행"
          className="flex size-48 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface-inverse text-icon-inverse transition-colors hover:bg-state-inverse-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          type="submit"
        >
          <Icon name="search" size={24} tone="inherit" />
        </button>
      ) : null}
    </form>
  );
}
