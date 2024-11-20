import React from 'react';
import { useUserStore } from '../store/userStore';
import { Clock, GamepadIcon, Users, Flame, ArrowUpRight } from 'lucide-react';

export default function RewardsScreen() {
  const { user, adRewards } = useUserStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3,
    }).format(amount);
  };

  const calculateHourlyRate = () => {
    return formatCurrency(user.rewardRate * 60);
  };

  const calculateDailyRate = () => {
    return formatCurrency(user.rewardRate * 60 * 24);
  };

  const calculateMonthlyRate = () => {
    return formatCurrency(user.rewardRate * 60 * 24 * 30);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Rewards Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Hourly Rate</h3>
          <p className="text-3xl font-bold">{calculateHourlyRate()}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Daily Potential</h3>
          <p className="text-3xl font-bold">{calculateDailyRate()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Monthly Potential</h3>
          <p className="text-3xl font-bold">{calculateMonthlyRate()}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Reward Multipliers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold">Daily Streak Bonus</h4>
                <p className="text-sm text-gray-600">
                  +{Math.floor(user.streak / 5) * 0.001 * 60 * 100}% per hour
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold">Referral Bonus</h4>
                <p className="text-sm text-gray-600">
                  +{user.referrals.length * 0.001 * 60 * 100}% per hour
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Rewards</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {adRewards.map((reward, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {reward.source === 'time' ? (
                      <Clock className="w-5 h-5 text-blue-500" />
                    ) : reward.source === 'gameplay' ? (
                      <GamepadIcon className="w-5 h-5 text-purple-500" />
                    ) : (
                      <Users className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {reward.source === 'time'
                          ? 'Time Reward'
                          : reward.source === 'gameplay'
                          ? 'Gameplay Bonus'
                          : 'Referral Bonus'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(reward.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(reward.amount)}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Withdrawal Options</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              You can withdraw your earnings once you reach a minimum balance of $10.00
            </p>
            <button
              disabled={user.balance < 10}
              className={`w-full py-2 px-4 rounded-lg ${
                user.balance >= 10
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {user.balance >= 10 ? 'Withdraw Funds' : 'Insufficient Balance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}