import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PlaceDetailHeader } from './_components/place-detail-header';
import { PlaceDetailView } from './_components/place-detail-view';
import { placeDetailFixture } from './_model/place-detail';

export const metadata: Metadata = {
  title: '블루엘리펀트 스페이스 성수 | ToDayIt',
  description: '장소 소개와 메뉴, 이용 정보와 포함된 코스를 확인하세요.',
};

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const { placeId } = await params;
  if (placeId !== placeDetailFixture.id) notFound();

  return (
    <>
      <PlaceDetailHeader />
      <PlaceDetailView place={placeDetailFixture} />
    </>
  );
}
