'use client';

import { create } from 'zustand';

import { type LoginMember } from '@/features/login';

interface SessionState {
  /** 로그인한 회원 정보. 비로그인이면 `undefined`입니다. */
  member?: LoginMember;
}

interface SessionActions {
  /** 저장해둔 회원 정보를 다시 읽어 반영합니다. */
  loadStoredMember: () => void;
}

export const useSessionStore = create<SessionState & SessionActions>()((set) => ({
  member: undefined,
  loadStoredMember: () => {
    const stored = localStorage.getItem('member');

    try {
      set({ member: stored ? (JSON.parse(stored) as LoginMember) : undefined });
    } catch {
      set({ member: undefined });
    }
  },
}));
