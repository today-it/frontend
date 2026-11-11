'use client';

import { Button, ButtonLink, Icon, Skeleton } from '@/shared/ui';

export function PlaceDetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-[calc(100svh-325px)] w-full flex-1 items-center justify-center px-24 py-96">
      <section
        aria-label="장소 조회 오류"
        className="flex flex-col items-center gap-24 text-center"
        role="alert"
      >
        <Icon className="text-icon-error" name="info" size={28} tone="inherit" />
        <div className="flex flex-col gap-8">
          <h1 className="text-heading-h3 text-text-primary">장소 정보를 불러오지 못했어요</h1>
          <p className="text-body-b2 text-text-tertiary">
            요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        </div>
        <Button onClick={onRetry} size="md">
          다시 시도
        </Button>
      </section>
    </main>
  );
}

export function PlaceDetailNotFound() {
  return (
    <main className="flex min-h-[calc(100svh-325px)] w-full flex-1 flex-col items-center justify-center gap-24 px-24 py-96 text-center">
      <Icon name="search-off" size={36} />
      <h1 className="text-heading-h3 text-text-primary">장소를 찾을 수 없어요</h1>
      <p className="text-body-b2 text-text-tertiary">장소 정보를 다시 확인해주세요.</p>
      <ButtonLink href="/places" size="md">
        장소 목록으로
      </ButtonLink>
    </main>
  );
}

export function PlaceDetailLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="장소 정보 불러오는 중"
      className="mx-auto flex w-full max-w-[1488px] flex-col gap-40 px-24 pt-48 pb-96"
    >
      <span className="sr-only" role="status">
        장소 정보를 불러오고 있어요
      </span>
      <div aria-hidden="true" className="flex flex-col gap-40">
        <Skeleton className="min-h-[440px] rounded-2xl bg-surface-subtle lg:aspect-[2/1] lg:min-h-0" />
        <div className="grid gap-40 xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="flex flex-col gap-24">
            <Skeleton className="h-40 w-[420px] max-w-full rounded-lg bg-surface-subtle" />
            <Skeleton className="h-24 rounded-lg bg-surface-subtle" />
            <Skeleton className="h-24 w-[860px] max-w-full rounded-lg bg-surface-subtle" />
            <Skeleton className="h-24 w-[900px] max-w-full rounded-lg bg-surface-subtle" />
            <Skeleton className="h-[260px] rounded-2xl bg-surface-subtle" />
          </div>
          <Skeleton className="h-[510px] rounded-2xl bg-surface-subtle" />
        </div>
        <div className="flex flex-col gap-24 pt-56">
          <Skeleton className="h-32 w-[240px] max-w-full rounded-2xl bg-surface-subtle" />
          <div className="grid grid-cols-1 gap-32 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton className="h-[458px] rounded-2xl bg-surface-subtle" key={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
