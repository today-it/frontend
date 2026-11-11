'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TopHeader } from '@/app/_components/top-header';
import { SearchBar } from '@/shared/ui';

export function PlaceDetailHeader() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  return (
    <TopHeader
      navigation="search"
      searchContent={
        <SearchBar
          value={query}
          onValueChange={setQuery}
          onSearch={() =>
            router.push(query.trim() ? `/places?q=${encodeURIComponent(query.trim())}` : '/places')
          }
        />
      }
    />
  );
}
