import type { ReactNode } from 'react';

import { Card } from './card';
import { Icon } from './icon';
import { Tag } from './tag';

export interface CourseListItemProps {
  name: string;
  region: string;
  tags: readonly string[];
  date: string;
  likes: number;
  image?: ReactNode;
  onClick: () => void;
}

/**
 * 코스 정보와 대표 이미지를 보여주는 공용 CourseListItem 컴포넌트입니다.
 *
 * 카드 클릭 시 전달받은 onClick 핸들러를 호출합니다.
 */
export function CourseListItem({
  name,
  region,
  tags,
  date,
  likes,
  image,
  onClick,
}: CourseListItemProps) {
  return (
    <Card
      as="article"
      className="min-h-[458px] gap-0 rounded-xl border-0 px-12 pt-12 pb-8 shadow-md"
      data-slot="course-list-item"
    >
      <button
        aria-label={`${name} 상세 보기`}
        className="flex w-full cursor-pointer flex-col items-stretch rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        onClick={onClick}
        type="button"
      >
        <span
          aria-hidden={!image || undefined}
          className="relative h-[268px] overflow-hidden rounded-lg bg-surface-placeholder"
        >
          {image}
        </span>
        <span className="flex min-w-0 flex-col items-start gap-8 px-8 pt-16 pb-8">
          <span className="text-heading-h3 break-keep text-text-primary">{name}</span>
          <span className="text-body-b3 text-text-secondary">{region}</span>
          <span className="flex flex-wrap gap-6">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </span>
          <span className="flex w-full items-center justify-between gap-8 pt-4">
            <span className="text-caption-c2 text-text-tertiary">{date}</span>
            <span className="flex items-center gap-4 text-caption-c1 text-text-secondary">
              <Icon name="favorite" size={20} />
              {likes}
            </span>
          </span>
        </span>
      </button>
    </Card>
  );
}
