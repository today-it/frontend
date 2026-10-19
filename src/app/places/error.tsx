'use client';

import { useEffect } from 'react';

import { TopHeader } from '@/app/_components/top-header';

import { PlaceListErrorState } from './_components/place-list-error-state';

interface PlacesErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function PlacesError({ error, retry }: PlacesErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <TopHeader activeSection="places" auth="guest" />
      <PlaceListErrorState onRetry={retry} />
    </>
  );
}
