import { create } from 'zustand';
import { GameState } from '../types';

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,
  setCurrentGame: (game) => set({ currentGame: game }),
}));