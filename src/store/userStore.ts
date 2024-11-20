import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AdReward } from '../types';

const BASE_RATE = 0.002; // $0.002 per minute
const MAX_RATE = 0.01; // $0.01 per minute
const STREAK_BONUS = 0.001; // Additional $0.001 per minute per 5 days of streak
const REFERRAL_BONUS = 0.001; // Additional $0.001 per minute per referral

interface UserState {
  user: User;
  adRewards: AdReward[];
  addReward: (amount: number, source: AdReward['source']) => void;
  updateLastRewardTime: () => void;
  updateStreak: () => void;
  addReferral: (referralId: string) => void;
  updatePlayTime: (minutes: number) => void;
  calculateRewardRate: () => number;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: {
        balance: 0,
        totalEarned: 0,
        gamesPlayed: 0,
        lastRewardTime: Date.now(),
        streak: 0,
        lastLoginDate: new Date().toISOString().split('T')[0],
        referrals: [],
        playTimeMinutes: 0,
        rewardRate: BASE_RATE,
      },
      adRewards: [],
      addReward: (amount: number, source: AdReward['source']) =>
        set((state) => ({
          user: {
            ...state.user,
            balance: state.user.balance + amount,
            totalEarned: state.user.totalEarned + amount,
          },
          adRewards: [
            ...state.adRewards,
            { amount, timestamp: Date.now(), source },
          ].slice(-10),
        })),
      updateLastRewardTime: () =>
        set((state) => ({
          user: {
            ...state.user,
            lastRewardTime: Date.now(),
          },
        })),
      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastLogin = state.user.lastLoginDate;
          const dayDiff = Math.floor(
            (new Date(today).getTime() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24)
          );

          let newStreak = state.user.streak;
          if (dayDiff === 1) {
            newStreak += 1;
          } else if (dayDiff > 1) {
            newStreak = 0;
          }

          return {
            user: {
              ...state.user,
              streak: newStreak,
              lastLoginDate: today,
              rewardRate: get().calculateRewardRate(),
            },
          };
        }),
      addReferral: (referralId: string) =>
        set((state) => {
          if (state.user.referrals.includes(referralId)) return state;
          
          const newReferrals = [...state.user.referrals, referralId];
          return {
            user: {
              ...state.user,
              referrals: newReferrals,
              rewardRate: get().calculateRewardRate(),
            },
          };
        }),
      updatePlayTime: (minutes: number) =>
        set((state) => ({
          user: {
            ...state.user,
            playTimeMinutes: state.user.playTimeMinutes + minutes,
          },
        })),
      calculateRewardRate: () => {
        const state = get();
        const streakBonus = Math.floor(state.user.streak / 5) * STREAK_BONUS;
        const referralBonus = state.user.referrals.length * REFERRAL_BONUS;
        const newRate = BASE_RATE + streakBonus + referralBonus;
        return Math.min(newRate, MAX_RATE);
      },
    }),
    {
      name: 'user-storage',
    }
  )
);