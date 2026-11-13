import type { ReactNode } from 'react';

import { Card, CardContent } from './card';
import { Tag } from './tag';

export interface MenuCardProps {
  name: string;
  price: string;
  signature?: boolean;
  image?: ReactNode;
}

/**
 * 메뉴 이미지와 이름, 가격을 보여주는 공용 MenuCard 컴포넌트입니다.
 *
 * signature가 true이면 대표 메뉴 태그를 함께 표시합니다.
 */
export function MenuCard({ name, price, signature = false, image }: MenuCardProps) {
  return (
    <Card
      as="article"
      aria-label={name}
      className="flex-row items-center gap-20 p-20"
      data-slot="menu-card"
    >
      <div
        aria-hidden={!image || undefined}
        className="relative size-96 shrink-0 overflow-hidden rounded-xl bg-surface-placeholder"
      >
        {image}
      </div>
      <CardContent className="items-start">
        {signature && <Tag type="category">대표</Tag>}
        <h3 className="text-heading-h3 break-keep text-text-primary">{name}</h3>
        <p className="text-body-b2 text-text-secondary">{price}</p>
      </CardContent>
    </Card>
  );
}
