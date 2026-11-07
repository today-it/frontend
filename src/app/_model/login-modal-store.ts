'use client';

import { create } from 'zustand';

import { type SocialSignupRequest } from '@/features/social-login';

interface LoginModalState {
  isOpen: boolean;
  /** 소셜 인증을 마치고 가입만 남은 사용자의 정보 */
  socialSignup?: SocialSignupRequest;
}

interface LoginModalActions {
  openLogin: () => void;
  /** 소셜 가입을 이어서 진행하도록 회원가입 모달을 엽니다. */
  openSocialSignup: (socialSignup: SocialSignupRequest) => void;
  closeLogin: () => void;
}

type LoginModalStore = LoginModalState & LoginModalActions;

const initialState: LoginModalState = {
  isOpen: false,
  socialSignup: undefined,
};

export const useLoginModalStore = create<LoginModalStore>()((set) => ({
  ...initialState,
  openLogin: () => set({ isOpen: true, socialSignup: undefined }),
  openSocialSignup: (socialSignup) => set({ isOpen: true, socialSignup }),
  closeLogin: () => set(initialState),
}));
