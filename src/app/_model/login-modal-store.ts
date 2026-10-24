'use client';

import { create } from 'zustand';

interface LoginModalState {
  isOpen: boolean;
}

interface LoginModalActions {
  openLogin: () => void;
  closeLogin: () => void;
}

type LoginModalStore = LoginModalState & LoginModalActions;

const initialState: LoginModalState = {
  isOpen: false,
};

export const useLoginModalStore = create<LoginModalStore>()((set) => ({
  ...initialState,
  openLogin: () => set({ isOpen: true }),
  closeLogin: () => set(initialState),
}));
