'use client';

import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { Icon } from './icon';

interface ToastData {
  href?: string;
}

/**
 * 화면 토스트 알림 영역을 제공하고 표시 상태를 관리하는 공용 ToastProvider 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <ToastProvider>{children}</ToastProvider>
 * ```
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastPrimitive.Provider timeout={2500} limit={1}>
      {children}
      <ToastViewport />
    </ToastPrimitive.Provider>
  );
}

export function useToast() {
  return ToastPrimitive.useToastManager<ToastData>();
}

function ToastViewport() {
  const manager = useToast();
  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport
        aria-label="알림"
        className="pointer-events-none fixed inset-0 z-[60] outline-none"
        data-slot="toast-viewport"
      >
        {manager.toasts.map((toast) => (
          <ToastPrimitive.Positioner
            key={toast.id}
            toast={toast}
            className="data-anchor-hidden:hidden"
            data-slot="toast-positioner"
          >
            <ToastPrimitive.Root
              toast={toast}
              className={cn(
                'pointer-events-auto flex min-h-48 w-max max-w-[calc(100vw-40px)] items-center rounded-full bg-surface-inverse text-caption-c1 text-text-inverse shadow-toast transition-opacity duration-150 outline-none data-ending-style:opacity-0 data-limited:hidden data-starting-style:opacity-0 motion-reduce:transition-none',
              )}
              data-slot="toast"
            >
              <ToastPrimitive.Content className="w-full" data-slot="toast-content">
                {toast.actionProps || toast.data?.href ? (
                  <ToastPrimitive.Action
                    {...(toast.data?.href
                      ? { render: <Link href={toast.data.href} />, nativeButton: false }
                      : {})}
                    className="flex min-h-48 w-full cursor-pointer items-center gap-4 rounded-full py-12 pr-12 pl-20 outline-none focus-visible:ring-2 focus-visible:ring-border-inverse"
                    onClick={() => manager.close(toast.id)}
                    data-slot="toast-action"
                  >
                    <ToastPrimitive.Title
                      render={<span />}
                      className="min-w-0 break-keep text-text-inverse"
                    >
                      {toast.title}
                    </ToastPrimitive.Title>
                    <Icon name="chevron-right" size={24} tone="inherit" />
                  </ToastPrimitive.Action>
                ) : (
                  <ToastPrimitive.Title className="px-20 py-12 text-caption-c1 break-keep text-text-inverse">
                    {toast.title}
                  </ToastPrimitive.Title>
                )}
              </ToastPrimitive.Content>
            </ToastPrimitive.Root>
          </ToastPrimitive.Positioner>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}
