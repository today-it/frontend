'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { useLoginModalStore } from '@/app/_model/login-modal-store';
import { useSessionStore } from '@/app/_model/session-store';

const LoginModals = dynamic(() => import('./login-modals').then((module) => module.LoginModals));

export function LoginModalHost() {
  const isOpen = useLoginModalStore((state) => state.isOpen);
  const socialSignup = useLoginModalStore((state) => state.socialSignup);
  const closeLogin = useLoginModalStore((state) => state.closeLogin);
  const loadStoredMember = useSessionStore((state) => state.loadStoredMember);

  useEffect(() => () => closeLogin(), [closeLogin]);
  useEffect(() => {
    loadStoredMember();
  }, [loadStoredMember]);

  return isOpen ? <LoginModals onCloseComplete={closeLogin} socialSignup={socialSignup} /> : null;
}
