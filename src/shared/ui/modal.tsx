import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { IconButton } from './icon-button';

export interface ModalProps extends Omit<DialogPrimitive.Root.Props, 'children'> {
  /** Modal 안에 표시할 내용. 접근성 이름을 위해 `ModalTitle`을 포함해야 합니다. */
  children: ReactNode;
  /** 닫기 버튼의 접근성 이름. 기본값은 `닫기`입니다. */
  closeLabel?: string;
  /** 패널 맨 위, `children` 앞에 표시할 로고. 생략하면 표시하지 않습니다. */
  logo?: ReactNode;
  /** Modal 패널에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 공용 Modal 컴포넌트
 *
 * 화면 위에 스크림과 패널을 표시하고, 열림 상태는 `open`과 `onOpenChange`로 제어합니다.
 * 패널 안에서는 포커스가 유지되며, ESC 키와 닫기 버튼으로 닫을 수 있습니다.
 * 잘못 눌러 닫히는 일을 막기 위해 스크림 클릭으로는 닫히지 않으며, 필요하면 `disablePointerDismissal={false}`로 허용합니다.
 * `logo`를 전달하면 패널 맨 위에 표시되고, 그 아래에 `children`이 세로로 배치됩니다.
 * 내용이 길어도 패널은 스크롤되지 않으므로 화면 높이 안에 들어오는 내용만 넣어야 합니다.
 * 접근성 이름은 `ModalTitle`로 지정합니다.
 *
 * @example
 * ```tsx
 * <Modal logo={<Logo />} open={open} onOpenChange={setOpen}>
 *   <ModalTitle>회원가입을 위해 약관에 동의해주세요</ModalTitle>
 *   <Button>다음</Button>
 * </Modal>
 * ```
 */
export function Modal({
  children,
  className,
  closeLabel = '닫기',
  disablePointerDismissal = true,
  logo,
  ...props
}: ModalProps) {
  return (
    <DialogPrimitive.Root disablePointerDismissal={disablePointerDismissal} {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 bg-overlay-scrim transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
          data-slot="modal-backdrop"
        />
        <DialogPrimitive.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex w-modal-width max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-24 rounded-xl bg-surface-default px-20 py-40 shadow-modal transition-opacity duration-150 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none',
            className,
          )}
          data-slot="modal"
        >
          {logo ? (
            <div className="flex justify-center" data-slot="modal-logo">
              {logo}
            </div>
          ) : null}
          {children}
          <DialogPrimitive.Close
            render={
              <IconButton className="absolute top-16 right-16" icon="close" label={closeLabel} />
            }
          />
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export interface ModalTitleProps extends DialogPrimitive.Title.Props {
  /** Modal 제목에 추가할 클래스 이름 */
  className?: string;
}

/**
 * Modal의 제목입니다. Modal의 접근성 이름으로 사용됩니다.
 *
 * @example
 * ```tsx
 * <ModalTitle>회원가입을 위해 약관에 동의해주세요</ModalTitle>
 * ```
 */
export function ModalTitle({ className, ...props }: ModalTitleProps) {
  return (
    <DialogPrimitive.Title
      className={cn('text-center text-heading-h3 [color:var(--td-color-text-primary)]', className)}
      data-slot="modal-title"
      {...props}
    />
  );
}
