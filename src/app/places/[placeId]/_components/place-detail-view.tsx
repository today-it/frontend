'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import {
  Button,
  CarouselButton,
  CarouselIndicator,
  Chip,
  CourseListItem,
  Divider,
  Icon,
  IconButton,
  InfoCard,
  InfoTag,
  MenuCard,
  Modal,
  ModalTitle,
  ScrollTopButton,
  SectionHeader,
  Tag,
  ToastProvider,
  useToast,
} from '@/shared/ui';

import {
  filterPlaceMenus,
  getNextPhoto,
  menuCategories,
  type MenuCategory,
  type PlaceDetail,
} from '../_model/place-detail';

const amenityLabels = {
  parking: '주차 가능',
  pets: '반려동물 동반',
  'walk-in': '예약 없이 방문',
  indoor: '실내 공간',
};
export interface PlaceDetailViewProps {
  place: PlaceDetail;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  initialMapError?: boolean;
}

export function PlaceDetailView(props: PlaceDetailViewProps) {
  return (
    <ToastProvider>
      <PlaceDetailContent {...props} />
    </ToastProvider>
  );
}

function PlaceDetailContent({
  place,
  initialLiked = false,
  initialBookmarked = false,
  initialMapError = false,
}: PlaceDetailViewProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [photo, setPhoto] = useState(0);
  const [category, setCategory] = useState<MenuCategory>('전체');
  const [expandedCourses, setExpandedCourses] = useState(false);
  const [mapError, setMapError] = useState(initialMapError);
  const toast = useToast();
  const actionsRef = useRef<HTMLDivElement>(null);
  const [dialog, setDialog] = useState<'map' | 'directions' | 'course' | 'scraps' | null>(null);
  const copying = useRef(false);
  const menus = filterPlaceMenus(place.menus, category);
  const courses = expandedCourses ? place.courses : place.courses.slice(0, 4);
  const photoIndex = Math.min(photo, Math.max(0, place.photoCount - 1));

  function showNotice(title: string, link = false) {
    toast.add({
      id: 'place-detail-notice',
      title,
      positionerProps: {
        anchor: actionsRef.current,
        side: 'bottom',
        align: 'end',
        sideOffset: 12,
        positionMethod: 'fixed',
        collisionPadding: 20,
        collisionAvoidance: { side: 'none', align: 'shift' },
      },
      ...(link
        ? { actionProps: { 'aria-label': '스크랩 목록 보기', onClick: () => setDialog('scraps') } }
        : {}),
    });
  }

  async function copyLink() {
    if (copying.current) return;
    copying.current = true;
    try {
      await navigator.clipboard.writeText(window.location.href);
      showNotice('링크를 복사했어요');
    } catch {
      showNotice('링크를 복사하지 못했어요');
    } finally {
      copying.current = false;
    }
  }

  return (
    <>
      <main className="relative mx-auto flex w-full max-w-[1488px] flex-col gap-40 px-24 pt-48 pb-96">
        <section
          aria-label={`${place.name} 사진`}
          aria-roledescription="carousel"
          className="relative isolate flex min-h-[440px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-surface-placeholder lg:aspect-[2/1] lg:min-h-0"
          data-slot="place-detail-hero"
          onKeyDown={(event) => {
            if (place.photoCount < 2) return;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              setPhoto((current) =>
                getNextPhoto(current, event.key === 'ArrowLeft' ? -1 : 1, place.photoCount),
              );
            }
          }}
        >
          {place.photoCount === 0 ? (
            <div
              aria-label="등록된 장소 사진 없음"
              className="absolute inset-0 flex items-center justify-center overflow-hidden bg-primary-50"
              role="img"
            >
              <div className="w-full">
                <Image
                  alt=""
                  className="h-auto w-full"
                  height={240}
                  width={480}
                  src="/images/place-detail/exhibition-placeholder.svg"
                  unoptimized
                />
              </div>
            </div>
          ) : place.photos?.[photoIndex] ? (
            <Image
              alt={`${place.name} 장소 사진 ${photoIndex + 1}`}
              src={place.photos[photoIndex]}
              fill
              sizes="(min-width: 1488px) 1440px, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div
              aria-label={`장소 사진 ${photoIndex + 1}`}
              className="absolute inset-0"
              role="img"
            />
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-overlay-scrim" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-overlay-scrim to-transparent"
          />
          <div
            ref={actionsRef}
            className="absolute top-20 right-20 flex gap-12 lg:top-40 lg:right-40"
            data-slot="place-detail-actions"
          >
            <IconButton variant="round" icon="share" label="장소 공유" onClick={copyLink} />
            <IconButton
              variant="round"
              icon={bookmarked ? 'bookmark-filled' : 'bookmark'}
              label="장소 스크랩"
              aria-pressed={bookmarked}
              onClick={() => {
                setBookmarked((current) => !current);
                showNotice(bookmarked ? '스크랩을 취소했어요' : '스크랩했어요', !bookmarked);
              }}
            />
            <IconButton
              variant="round"
              icon={liked ? 'favorite-filled' : 'favorite'}
              label="장소 좋아요"
              aria-pressed={liked}
              className={liked ? 'text-icon-liked' : undefined}
              onClick={() => setLiked((current) => !current)}
            />
          </div>
          {place.photoCount > 1 ? (
            <>
              <CarouselButton
                aria-label="이전 장소 사진"
                className="absolute top-[140px] left-20 lg:top-1/2 lg:left-40 lg:-translate-y-1/2"
                direction="left"
                onClick={() => setPhoto((current) => getNextPhoto(current, -1, place.photoCount))}
              />
              <CarouselButton
                aria-label="다음 장소 사진"
                className="absolute top-[140px] left-[80px] lg:top-1/2 lg:right-40 lg:left-auto lg:-translate-y-1/2"
                direction="right"
                onClick={() => setPhoto((current) => getNextPhoto(current, 1, place.photoCount))}
              />
            </>
          ) : null}
          <div className="relative mx-20 mt-[200px] mb-24 flex min-w-0 flex-col items-start gap-12 lg:absolute lg:right-[120px] lg:bottom-40 lg:left-40 lg:m-0">
            <Tag type="category">{place.category}</Tag>
            <h1 className="max-w-full text-heading-h1 leading-[1.25] break-keep text-text-inverse lg:text-[48px] lg:font-bold">
              {place.name}
            </h1>
            <p className="text-body-b2 break-keep text-text-inverse lg:text-[18px]">
              {place.address}
            </p>
          </div>
          {place.photoCount > 0 ? (
            <CarouselIndicator
              aria-live="polite"
              aria-label={`사진 ${photoIndex + 1} / ${place.photoCount}`}
              className="absolute top-[140px] right-20 lg:top-auto lg:right-40 lg:bottom-40"
              current={photoIndex + 1}
              total={place.photoCount}
            />
          ) : null}
        </section>

        <div
          className="grid min-w-0 items-start gap-40 xl:grid-cols-[minmax(0,1fr)_460px]"
          data-slot="place-detail-columns"
        >
          <div className="flex min-w-0 flex-col gap-96">
            <section aria-labelledby="place-introduction" className="flex min-w-0 flex-col gap-24">
              <SectionHeader
                id="place-introduction"
                title="소개"
                type="More"
                size="Sm"
                showDescription={false}
                showLink={false}
              />
              <p className="text-body-b1 leading-32 break-keep text-text-secondary">
                {place.description || '등록된 소개가 없어요.'}
              </p>
              {place.amenities.length > 0 ? (
                <ul aria-label="편의 정보" className="flex flex-wrap gap-x-24 gap-y-16 pt-16">
                  {place.amenities.map((amenity, index) => (
                    <li className="flex items-center gap-24" key={amenity}>
                      {index > 0 && <Divider type="vertical" className="h-24" />}
                      <InfoTag icon={amenity}>{amenityLabels[amenity]}</InfoTag>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section aria-labelledby="place-menu" className="flex min-w-0 flex-col gap-24">
              <SectionHeader
                id="place-menu"
                title="메뉴"
                type="More"
                size="Sm"
                showDescription={false}
                showLink={false}
              />
              <div aria-label="메뉴 분류" className="flex flex-wrap gap-8" role="group">
                {menuCategories.map((item) => (
                  <Chip
                    key={item}
                    pressed={category === item}
                    onPressedChange={() => setCategory(item)}
                  >
                    {item}
                  </Chip>
                ))}
              </div>
              <div
                aria-live="polite"
                className="mt-8 grid min-w-0 gap-24 md:grid-cols-2"
                data-slot="place-detail-menu-grid"
              >
                {menus.length > 0 ? (
                  menus.map((menu) => (
                    <MenuCard
                      key={menu.id}
                      name={menu.name}
                      price={`${menu.price.toLocaleString('ko-KR')}원`}
                      signature={menu.signature}
                      image={
                        menu.imageSrc ? (
                          <Image
                            alt={`${menu.name} 사진`}
                            src={menu.imageSrc}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : undefined
                      }
                    />
                  ))
                ) : (
                  <p className="col-span-full py-40 text-body-b2 text-text-tertiary">
                    등록된 메뉴가 없어요.
                  </p>
                )}
              </div>
              <p className="mt-8 text-body-b3 text-text-tertiary">
                ※ 메뉴와 가격은 매장과 다를 수 있어요. 방문 전 매장에서 확인해주세요.
              </p>
            </section>
          </div>

          <InfoCard
            label="장소 이용 정보"
            className="xl:sticky xl:top-[138px]"
            map={
              <div
                className={`relative flex h-[220px] items-center justify-center overflow-hidden rounded-2xl ${mapError ? 'bg-surface-subtle' : 'bg-surface-placeholder'}`}
              >
                {mapError ? (
                  <div className="flex flex-col items-center gap-18">
                    <IconButton
                      variant="round"
                      icon="refresh"
                      label="지도 다시 불러오기"
                      onClick={() => {
                        setMapError(false);
                        setDialog('map');
                      }}
                    />
                    <p className="text-body-b2 text-text-tertiary">지도를 불러오지 못했어요</p>
                  </div>
                ) : (
                  <button
                    aria-label="장소 지도 보기"
                    className="relative flex size-full cursor-pointer items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    type="button"
                    onClick={() => setDialog('map')}
                  >
                    {place.mapImageSrc ? (
                      <Image
                        alt={`${place.name} 지도 미리보기`}
                        src={place.mapImageSrc}
                        fill
                        sizes="460px"
                        className="object-cover"
                      />
                    ) : (
                      <Icon name="map" size={24} />
                    )}
                  </button>
                )}
              </div>
            }
            rows={[
              { label: '위치', value: place.location || place.address },
              {
                label: '영업시간',
                value: place.hours ? (
                  <>
                    <span className="text-text-success">영업 중</span>
                    {' / '}
                    {place.hours}
                  </>
                ) : (
                  '영업시간 정보를 확인할 수 없어요'
                ),
              },
              { label: '전화', value: place.phone || '전화번호 정보가 없어요' },
            ]}
            action={
              <Button
                variant="cta"
                icon="navigation"
                className="w-full"
                onClick={() => setDialog('directions')}
              >
                길찾기
              </Button>
            }
          />
        </div>

        <section
          aria-labelledby="place-courses"
          className="flex min-w-0 flex-col gap-24 pt-56"
          data-slot="place-detail-courses"
        >
          <div className="flex flex-wrap items-end justify-between gap-16">
            <h2 className="text-heading-h2 text-text-primary" id="place-courses">
              이 장소가 포함된 코스 {place.courses.length}
            </h2>
            {place.courses.length > 4 ? (
              <button
                className="cursor-pointer rounded-sm text-body-b2 text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                aria-expanded={expandedCourses}
                aria-controls="place-course-grid"
                type="button"
                onClick={() => setExpandedCourses((current) => !current)}
              >
                {expandedCourses ? '접기' : '모두 보기'}
              </button>
            ) : null}
          </div>
          <div
            className="grid min-w-0 grid-cols-1 gap-32 sm:grid-cols-2 xl:grid-cols-4"
            id="place-course-grid"
          >
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseListItem
                  key={course.id}
                  {...course}
                  image={
                    course.imageSrc ? (
                      <Image
                        alt={`${course.name} 표지`}
                        src={course.imageSrc}
                        fill
                        sizes="(min-width: 1280px) 336px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : undefined
                  }
                  onClick={() => setDialog('course')}
                />
              ))
            ) : (
              <p className="col-span-full py-40 text-body-b2 text-text-tertiary">
                아직 이 장소가 포함된 코스가 없어요.
              </p>
            )}
          </div>
        </section>
        <ScrollTopButton hideWhenNotScrollable />
      </main>
      <Modal
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <ModalTitle>
          {dialog === 'map'
            ? '장소 지도'
            : dialog === 'directions'
              ? '길찾기'
              : dialog === 'scraps'
                ? '스크랩 목록'
                : '코스 상세'}
        </ModalTitle>
        <p className="text-center text-body-b2 text-text-secondary">
          {dialog === 'scraps'
            ? '스크랩 목록 화면을 준비하고 있어요.'
            : dialog === 'course'
              ? '코스 상세 화면을 준비하고 있어요.'
              : '지도와 길찾기 연결을 준비하고 있어요.'}
        </p>
        {dialog !== 'course' && dialog !== 'scraps' ? (
          <p className="text-center text-body-b2 break-keep text-text-secondary">{place.address}</p>
        ) : null}
        <Button size="md" onClick={() => setDialog(null)}>
          확인
        </Button>
      </Modal>
    </>
  );
}
