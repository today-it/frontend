import { useId } from 'react';

import { Icon } from '@/shared/ui';

/** 장소 목록이 비어 있을 때 표시합니다. */
export function PlaceListEmptyState() {
  const titleId = useId();

  return (
    <main className="mx-auto flex w-full max-w-[calc(var(--spacing-header-width)+48px)] flex-1 flex-col items-center px-24 pt-[116px] pb-96">
      <section
        aria-labelledby={titleId}
        className="flex h-[352px] w-full flex-col items-center justify-center pt-48"
        data-slot="place-list-empty-state"
      >
        <div className="flex h-[304px] flex-col items-center justify-center gap-24 py-96">
          <Icon name="search-off" size={36} />
          <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="text-heading-h3 text-text-primary" id={titleId}>
              아직 보여드릴 장소가 없어요
            </h1>
            <p className="text-body-b2 text-text-muted">
              조건에 맞는 장소가 생기면 이곳에 표시돼요.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
