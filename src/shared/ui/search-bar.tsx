'use client';

import type { SubmitEvent } from 'react';

import { cn } from '@/shared/lib';

import { Icon } from './icon';

export interface SearchBarProps {
  /** 제어 입력에 사용할 검색어 */
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
  /** 검색 버튼과 Enter 제출 비활성화 여부 */
  searchDisabled?: boolean;
  /** 입력에 자동 포커스할지 여부 */
  autoFocus?: boolean;
  /** SearchBar에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 기본, 포커스, 입력 상태를 지원하는 공용 SearchBar 컴포넌트입니다.
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
  searchDisabled = false,
  value,
}: SearchBarProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!searchDisabled) onSearch?.();
  }

  return (
    <form
      aria-label="검색"
      className={cn(
        'group/search-bar flex h-search-bar-height w-full max-w-search-bar-width items-center justify-between rounded-full border border-border-default bg-surface-default pr-8 pl-40 transition-colors focus-within:border-border-focus',
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
        className="min-w-0 flex-1 border-0 bg-transparent text-body-b2 text-text-primary outline-none placeholder:text-text-muted"
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
          disabled={searchDisabled}
          className="flex size-40 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent text-icon-default transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:cursor-default disabled:hover:bg-transparent"
          type="submit"
        >
          <Icon name="search" size={24} tone="inherit" />
        </button>
      ) : null}
    </form>
  );
}
