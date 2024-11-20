import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HighScore } from '../types';

interface HighScoreState {
  scores: HighScore[];
  addScore: (score: number) => void;
  getTopScores: (limit?: number) => HighScore[];
}

const MAX_SCORES = 10;

export const useHighScoreStore = create<HighScoreState>()(
  persist(
    (set, get) => ({
      scores: [],
      addScore: (score: number) => {
        const playerName = localStorage.getItem('playerName') || 'Anonymous';
        const newScore: HighScore = {
          score,
          playerName,
          date: Date.now(),
        };

        set((state) => {
          const newScores = [...state.scores, newScore]
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_SCORES);

          return { scores: newScores };
        });
      },
      getTopScores: (limit = MAX_SCORES) => {
        return get().scores.slice(0, limit);
      },
    }),
    {
      name: 'game-highscores',
    }
  )
);