import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib';

import { Icon } from './icon';
import { TextLink } from './text-link';

export interface SectionHeaderProps {
  /** 제목에 연결할 DOM ID */
  id?: string;
  /** 제목 옆에 표시할 추가 설명 */
  description?: string;
  /** `More` 타입에서 설명을 표시할지 여부 */
  showDescription?: boolean;
  /** 제목 오른쪽의 모두 보기 링크 주소 */
  moreHref?: ComponentProps<typeof TextLink>['href'];
  /** 섹션 제목 */
  title?: string;
  /** 헤더 종류 */
  type?: 'Dropdown' | 'More';
  /** 헤더에 추가할 클래스 이름 */
  className?: string;
}

/** 섹션 헤더의 Dropdown 및 More 변형을 표시합니다. */
export function SectionHeader({
  className,
  description = '선호 지역과 컨셉을 바탕으로 골랐어요',
  id,
  moreHref,
  showDescription = true,
  title = '당신을 위한 추천 장소',
  type = 'Dropdown',
}: SectionHeaderProps) {
  const isMore = type === 'More';

  return (
    <div
      className={cn(
        'relative flex',
        isMore ? 'w-full items-end justify-between' : 'w-fit items-center gap-12',
        className,
      )}
      data-slot="section-header"
    >
      {isMore ? (
        <>
          <div className="flex shrink-0 flex-col items-start gap-8 overflow-clip whitespace-nowrap">
            <h2 className="text-heading-h1 text-text-primary" id={id}>
              {title}
            </h2>
            {showDescription && <p className="text-body-b2 text-text-secondary">{description}</p>}
          </div>
          <div className="flex shrink-0 items-start">
            {moreHref ? (
              <TextLink href={moreHref}>모두 보기</TextLink>
            ) : (
              <span className="text-body-b2 whitespace-nowrap text-text-primary">모두 보기</span>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-heading-h1 text-text-primary" id={id}>
            {title}
          </h2>
          <span aria-hidden="true" className="flex size-36 shrink-0 items-center justify-center">
            <Icon name="chevron-down" size={24} />
          </span>
        </>
      )}
    </div>
  );
}
