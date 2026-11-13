import type { ReactNode } from 'react';

import { Card } from './card';

export interface InfoCardProps {
  label: string;
  map: ReactNode;
  rows: readonly { label: string; value: ReactNode }[];
  action: ReactNode;
  className?: string;
}

/**
 * 지도와 세부 정보 목록, 하단 버튼을 함께 묶어 표시하는 공용 InfoCard 컴포넌트입니다.
 *
 * 전달받은 지도와 정보 목록, 하단 버튼 영역을 한 화면에 모아 보여줍니다.
 */
export function InfoCard({ label, map, rows, action, className }: InfoCardProps) {
  return (
    <Card as="aside" aria-label={label} className={className} data-slot="info-card">
      {map}
      <dl className="flex min-w-0 flex-col gap-16 text-body-b2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[var(--spacing-info-row-label-width)_minmax(0,1fr)] gap-16"
          >
            <dt className="text-text-tertiary">{row.label}</dt>
            <dd className="break-keep text-text-primary">{row.value}</dd>
          </div>
        ))}
      </dl>
      {action}
    </Card>
  );
}
