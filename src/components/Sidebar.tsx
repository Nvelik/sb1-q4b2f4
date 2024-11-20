import React from 'react';
import { useUserStore } from '../store/userStore';
import { usePassiveRewards } from '../hooks/usePassiveRewards';
import { Coins, Trophy, GamepadIcon, Clock, Users, Flame } from 'lucide-react';

export default function Sidebar() {
  const { user, adRewards } = useUserStore();
  
  // Initialize passive rewards
  usePassiveRewards();

  return (
    <div className="w-64 bg-gray-900 text-white p-6 flex flex-col h-screen">
      <div className="flex items-center gap-3 mb-8">
        <GamepadIcon className="w-8 h-8 text-purple-500" />
        <h1 className="text-xl font-bold">PlayRewards</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-300">Current Balance</span>
        </div>
        <p className="text-2xl font-bold">${user.balance.toFixed(2)}</p>
        <div className="mt-2 text-xs text-gray-400">
          Earning ${(user.rewardRate * 60).toFixed(3)}/hour
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-500" />
          <span className="text-sm">Total Earned: ${user.totalEarned.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <GamepadIcon className="w-5 h-5 text-purple-500" />
          <span className="text-sm">Games Played: {user.gamesPlayed}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm">Play Time: {Math.floor(user.playTimeMinutes / 60)}h {user.playTimeMinutes % 60}m</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-sm">Daily Streak: {user.streak} days</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-green-500" />
          <span className="text-sm">Referrals: {user.referrals.length}</span>
        </div>
      </div>

      <div className="mt-auto">
        <h3 className="text-sm font-semibold mb-3">Recent Rewards</h3>
        <div className="space-y-2">
          {adRewards.map((reward, index) => (
            <div key={index} className="bg-gray-800 rounded p-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {reward.source === 'time' ? (
                    <Clock className="w-3 h-3 text-blue-400" />
                  ) : reward.source === 'referral' ? (
                    <Users className="w-3 h-3 text-green-400" />
                  ) : (
                    <GamepadIcon className="w-3 h-3 text-purple-400" />
                  )}
                  <span>+${reward.amount.toFixed(3)}</span>
                </div>
                <span className="text-gray-400">
                  {new Date(reward.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}