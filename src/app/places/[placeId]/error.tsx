'use client';

import { PlaceDetailHeader } from './_components/place-detail-header';
import { PlaceDetailError } from './_components/place-detail-state';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <PlaceDetailHeader />
      <PlaceDetailError onRetry={reset} />
    </>
  );
}
