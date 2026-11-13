import { PlaceDetailHeader } from './_components/place-detail-header';
import { PlaceDetailLoading } from './_components/place-detail-state';

export default function Loading() {
  return (
    <>
      <PlaceDetailHeader />
      <PlaceDetailLoading />
    </>
  );
}
