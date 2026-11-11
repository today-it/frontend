import type { ReactNode } from 'react';

import { Icon, type IconName } from './icon';

export interface InfoTagProps {
  icon: IconName;
  children: ReactNode;
}

/**
 * 아이콘과 텍스트로 편의 시설 및 부가 정보를 안내하는 공용 InfoTag 컴포넌트입니다.
 *
 * 클릭 동작이 없는 정보 표시 전용으로 사용합니다.
 */
export function InfoTag({ icon, children }: InfoTagProps) {
  return (
    <span
      className="inline-flex items-center gap-8 rounded-xl text-caption-c1 text-text-primary"
      data-slot="info-tag"
    >
      <Icon name={icon} size={24} tone="inherit" className="text-icon-brand" />
      {children}
    </span>
  );
}
