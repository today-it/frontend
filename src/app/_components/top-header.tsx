import Link from 'next/link';

import { Avatar, Icon, Logo, SearchBar, Tab } from '@/shared/ui';

import { HeaderLoginButton } from './header-login-button';
import { ScrollSearchArea } from './scroll-search-area';

export type BrowseSection = 'places' | 'courses';
export type HeaderAuth = 'guest' | 'member';
export type HeaderNavigation = 'tabs' | 'search';

export interface TopHeaderProps {
  /** 현재 선택된 탐색 영역 */
  activeSection?: BrowseSection;
  /** 로그인 여부에 따른 우측 영역 */
  auth?: HeaderAuth;
  /** 프로필에 표시할 닉네임 */
  nickname?: string;
  /** 탭 또는 검색창 중 표시할 내비게이션 */
  navigation?: HeaderNavigation;
}

/** 고정 상단 바와 스크롤 방향에 따라 표시되는 검색 영역을 포함한 헤더입니다. */
export function TopHeader({
  activeSection = 'places',
  auth = 'guest',
  nickname = '닉네임',
  navigation = 'tabs',
}: TopHeaderProps) {
  return (
    <header>
      <div className="fixed inset-x-0 top-0 z-50 w-full bg-surface-default">
        <div className="relative mx-auto flex h-header-height w-full max-w-header-width items-center justify-between px-24">
          <Link aria-label="ToDayIt 장소 목록" className="no-underline" href="/">
            <Logo />
          </Link>

          {navigation === 'tabs' ? (
            <nav
              aria-label="주요 메뉴"
              className="absolute bottom-20 left-1/2 flex h-tab-height -translate-x-1/2"
            >
              <Tab active={activeSection === 'places'} href="/places">
                장소
              </Tab>
              <Tab active={activeSection === 'courses'} href="/courses">
                코스
              </Tab>
            </nav>
          ) : (
            <SearchBar className="absolute top-1/2 left-1/2 w-search-bar-width -translate-x-1/2 -translate-y-1/2" />
          )}

          {auth === 'member' ? (
            <div
              aria-label={`프로필: ${nickname}`}
              className="flex h-profile-chip w-profile-chip-width shrink-0 items-center gap-12 pr-8 pl-10"
              role="group"
            >
              <Avatar alt="" className="rounded-full" size="sm" />
              <span className="shrink-0 text-caption-c1 whitespace-nowrap text-text-primary">
                {nickname}
              </span>
              <Icon name="chevron-down" size={24} />
            </div>
          ) : (
            <HeaderLoginButton />
          )}
        </div>
      </div>
      <div aria-hidden="true" className="h-header-height w-full shrink-0" />
      {navigation === 'tabs' ? <ScrollSearchArea /> : null}
    </header>
  );
}
