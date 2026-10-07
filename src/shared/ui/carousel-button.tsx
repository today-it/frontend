import { cn } from '@/shared/lib';

import { IconButton, type IconButtonProps } from './icon-button';

export type CarouselDirection = 'left' | 'right';

export interface CarouselButtonProps extends Omit<IconButtonProps, 'icon' | 'label'> {
  /** 이동 방향 */
  direction: CarouselDirection;
}

/** 좌우 이동에 사용하는 원형 Carousel 버튼입니다. */
export function CarouselButton({ direction, className, ...props }: CarouselButtonProps) {
  return (
    <IconButton
      className={cn(
        'size-carousel-button h-carousel-button w-carousel-button rounded-full shadow-md',
        className,
      )}
      icon={direction === 'left' ? 'chevron-left' : 'chevron-right'}
      label={direction === 'left' ? '이전' : '다음'}
      {...props}
    />
  );
}
