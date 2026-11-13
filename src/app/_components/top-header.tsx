import Link from 'next/link';
import type { ReactNode } from 'react';

import { Avatar, Icon, Logo, SearchBar, Tab } from '@/shared/ui';

import { HeaderLoginButton } from './header-login-button';
import { ScrollSearchArea } from './scroll-search-area';

export type BrowseSection = 'places' | 'courses';
export type HeaderAuth = 'guest' | 'member';
export type HeaderNavigation = 'tabs' | 'search';

export interface TopHeaderProps {
  /** 현재 활성화된 탐색 영역 (기본값: `places`) */
  activeSection?: BrowseSection;
  /** 사용자 인증 상태에 따른 우측 계정 영역 (기본값: `guest`) */
  auth?: HeaderAuth;
  /** 프로필 칩에 표시할 닉네임 (기본값: `닉네임`) */
  nickname?: string;
  /** 중앙 내비게이션 형태 (기본값: `tabs`) */
  navigation?: HeaderNavigation;
  /** 헤더나 스크롤 검색 영역에 표시할 검색 요소 */
  searchContent?: ReactNode;
}

/**
 * 서비스 탐색 탭이나 상단 검색창, 로그인 계정 상태를 표시하는 공용 TopHeader 컴포넌트입니다.
 *
 * navigation 값에 따라 상단 검색창 형태 또는 탭 내비게이션 형태로 전환합니다.
 */
export function TopHeader({
  activeSection = 'places',
  auth = 'guest',
  nickname = '닉네임',
  navigation = 'tabs',
  searchContent,
}: TopHeaderProps) {
  if (navigation === 'search') {
    return (
      <header className="sticky top-0 z-40 border-b border-border-default bg-surface-default">
        <div className="mx-auto grid w-full max-w-[1920px] grid-cols-[1fr_auto] items-center gap-x-24 gap-y-12 px-24 py-16 lg:h-header-height lg:grid-cols-[1fr_minmax(0,900px)_1fr] lg:px-48 lg:py-0">
          <Link aria-label="ToDayIt 장소 목록" className="w-fit" href="/places">
            <Logo />
          </Link>
          <div className="col-span-2 row-start-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            {searchContent ?? <SearchBar />}
          </div>
          <div className="col-start-2 row-start-1 justify-self-end lg:col-start-3">
            <HeaderAccount auth={auth} nickname={nickname} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header>
      <div className="fixed inset-x-0 top-0 z-50 w-full bg-surface-default">
        <div className="relative mx-auto flex h-header-height w-full max-w-header-width items-center justify-between px-24">
          <Link aria-label="ToDayIt 장소 목록" className="no-underline" href="/">
            <Logo />
          </Link>
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
          <HeaderAccount auth={auth} nickname={nickname} />
        </div>
      </div>
      <div aria-hidden="true" className="h-header-height w-full shrink-0" />
      <ScrollSearchArea>{searchContent}</ScrollSearchArea>
    </header>
  );
}

function HeaderAccount({ auth, nickname }: Pick<TopHeaderProps, 'auth' | 'nickname'>) {
  return auth === 'member' ? (
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
  );
}
