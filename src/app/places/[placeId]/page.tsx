import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPlaceDetail, isApiError } from '@/shared/api';

import { PlaceDetailHeader } from './_components/place-detail-header';
import { PlaceDetailView } from './_components/place-detail-view';
import { mapPlaceDetail } from './_model/place-detail';

export const metadata: Metadata = {
  title: '장소 상세 | ToDayIt',
  description: '장소 소개와 메뉴, 이용 정보와 포함된 코스를 확인하세요.',
};

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const { placeId } = await params;
  if (!/^\d+$/.test(placeId) || !Number.isSafeInteger(Number(placeId))) notFound();

  const detail = await getPlaceDetail(Number(placeId)).catch((error: unknown) => {
    if (isApiError(error, 404)) notFound();
    throw error;
  });
  const place = mapPlaceDetail(detail);

  return (
    <>
      <PlaceDetailHeader />
      <PlaceDetailView
        key={place.id}
        place={place}
        initialLiked={detail.liked}
        initialBookmarked={detail.scrapped}
      />
    </>
  );
}
