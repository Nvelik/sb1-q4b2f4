export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  multiplayer: boolean;
  category: string;
  component: React.ComponentType;
}

export interface User {
  balance: number;
  totalEarned: number;
  gamesPlayed: number;
  lastRewardTime: number;
  streak: number;
  lastLoginDate: string;
  referrals: string[];
  playTimeMinutes: number;
  rewardRate: number;
}

export interface AdReward {
  amount: number;
  timestamp: number;
  source: 'gameplay' | 'time' | 'referral';
}

export interface GameState {
  currentGame: Game | null;
  setCurrentGame: (game: Game | null) => void;
}

export interface HighScore {
  score: number;
  playerName: string;
  date: number;
}

export interface Enemy {
  x: number;
  y: number;
  speed: number;
  width: number;
  height: number;
}