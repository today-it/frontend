'use client';

import { useEffect } from 'react';

import { TopHeader } from '@/app/_components/top-header';
import { useSessionStore } from '@/app/_model/session-store';

import { PlaceListErrorState } from './_components/place-list-error-state';

interface PlacesErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function PlacesError({ error, retry }: PlacesErrorProps) {
  const member = useSessionStore((state) => state.member);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <TopHeader
        activeSection="places"
        auth={member ? 'member' : 'guest'}
        nickname={member?.nickname}
      />
      <PlaceListErrorState onRetry={retry} />
    </>
  );
}
