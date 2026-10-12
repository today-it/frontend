'use client';

import { type ChangeEvent, useRef } from 'react';

import { cn } from '@/shared/lib';

import { Avatar } from './avatar';
import { Icon } from './icon';

export interface AvatarUploaderProps {
  /** 표시할 프로필 이미지 주소. 생략하면 기본 프로필 이미지를 표시합니다. */
  src?: string;
  /** 프로필 이미지의 대체 텍스트 */
  alt?: string;
  /** 이미지 파일을 선택하면 호출되는 함수. 선택한 파일을 받습니다. */
  onFileSelect: (file: File) => void;
  /** 선택할 수 있는 파일 형식. 기본값은 `image/*`입니다. */
  accept?: string;
  /** 이미지 선택 버튼의 접근성 이름. 기본값은 `프로필 이미지 선택`입니다. */
  label?: string;
  /** 이미지 선택을 막습니다. */
  disabled?: boolean;
  /** AvatarUploader에 추가할 클래스 이름 */
  className?: string;
}

/**
 * Avatar 오른쪽 아래의 + 버튼으로 이미지 파일을 선택하는 공용 AvatarUploader 컴포넌트입니다.
 *
 * 선택한 파일은 `onFileSelect`로 전달하며, 미리보기 주소는 호출부에서 `src`로 넘깁니다.
 * 같은 파일을 다시 선택할 수 있도록 선택 직후 입력값을 비웁니다.
 *
 * @example
 * ```tsx
 * <AvatarUploader src={previewUrl} onFileSelect={(file) => setPreviewUrl(URL.createObjectURL(file))} />
 * ```
 */
export function AvatarUploader({
  accept = 'image/*',
  alt,
  className,
  disabled,
  label = '프로필 이미지 선택',
  onFileSelect,
  src,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (file) {
      onFileSelect(file);
    }
  }

  return (
    <div className={cn('relative inline-flex', className)} data-slot="avatar-uploader">
      <Avatar alt={alt} src={src} />
      <input
        accept={accept}
        className="hidden"
        data-slot="avatar-uploader-input"
        disabled={disabled}
        onChange={handleChange}
        ref={inputRef}
        tabIndex={-1}
        type="file"
      />
      <button
        aria-label={label}
        className="absolute right-0 bottom-0 inline-flex size-avatar-badge cursor-pointer items-center justify-center rounded-full bg-surface-inverse p-0 text-icon-inverse transition-colors outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 enabled:hover:bg-state-inverse-hover enabled:active:bg-state-inverse-pressed disabled:cursor-default disabled:bg-state-inverse-disabled"
        data-slot="avatar-uploader-button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Icon name="add" size={16} tone="inherit" />
      </button>
    </div>
  );
}
