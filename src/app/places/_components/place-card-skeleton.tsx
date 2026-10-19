/** 장소 카드의 로딩 상태입니다. */
export function PlaceCardSkeleton() {
  return (
    <div
      className="w-place-card-width max-w-full min-w-0 overflow-hidden rounded-xl bg-surface-default shadow-md"
      data-slot="place-card-skeleton"
    >
      <div className="h-place-card-thumbnail-height bg-surface-subtle" />
      <div className="flex h-place-card-body-height min-w-0 flex-col gap-12 px-20 pt-20 pb-18">
        <div className="h-[22px] w-[72px] shrink-0 rounded-lg bg-surface-subtle" />
        <div className="h-24 w-[220px] max-w-full shrink-0 rounded-lg bg-surface-subtle" />
        <div className="h-16 w-[160px] max-w-full shrink-0 rounded-lg bg-surface-subtle" />
      </div>
    </div>
  );
}
