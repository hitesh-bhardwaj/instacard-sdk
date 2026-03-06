import { create } from 'zustand';

export type CardMode = 'virtual' | 'universal';

interface CardModeStore {
  mode: CardMode;
  setMode: (mode: CardMode) => void;
}

export const useCardModeStore = create<CardModeStore>((set) => ({
  mode: 'virtual',
  setMode: (mode) => set({ mode }),
}));

