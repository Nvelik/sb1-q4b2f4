import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { Camera, LogOut } from 'lucide-react';

export default function UserProfile() {
  const { user, signOut, updateUserProfile } = useAuthStore();
  const { user: gameUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(displayName);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
            alt={user.displayName || 'User'}
            className="w-20 h-20 rounded-full"
          />
          <button className="absolute bottom-0 right-0 bg-gray-800 p-1.5 rounded-full text-white hover:bg-gray-700">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{user.displayName}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-purple-600 hover:text-purple-500"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(gameUser.balance)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Total Earned</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(gameUser.totalEarned)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold">Daily Streak</h4>
            <p className="text-gray-600">{gameUser.streak} days</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Bonus Rate</p>
            <p className="font-semibold text-green-600">
              +{((gameUser.rewardRate - 0.002) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold">Play Time</h4>
            <p className="text-gray-600">
              {Math.floor(gameUser.playTimeMinutes / 60)}h {gameUser.playTimeMinutes % 60}m
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Games Played</p>
            <p className="font-semibold">{gameUser.gamesPlayed}</p>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold">Referrals</h4>
            <p className="text-gray-600">{gameUser.referrals.length} users</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Referral Bonus</p>
            <p className="font-semibold text-green-600">
              +${(gameUser.referrals.length * 0.001 * 60).toFixed(3)}/hour
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={signOut}
        className="mt-8 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}