'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { useLoginModalStore } from '@/app/_model/login-modal-store';

const LoginModals = dynamic(() => import('./login-modals').then((module) => module.LoginModals));

export function LoginModalHost() {
  const isOpen = useLoginModalStore((state) => state.isOpen);
  const closeLogin = useLoginModalStore((state) => state.closeLogin);

  useEffect(() => () => closeLogin(), [closeLogin]);

  return isOpen ? <LoginModals onCloseComplete={closeLogin} /> : null;
}
