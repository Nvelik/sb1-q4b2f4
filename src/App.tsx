import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import GameGrid from './components/GameGrid';
import AdSpace from './components/AdSpace';
import GameScreen from './components/GameScreen';
import UserProfile from './components/UserProfile';
import RewardsScreen from './components/RewardsScreen';
import AuthModal from './components/AuthModal';
import { useAuthStore } from './store/authStore';
import { User, Trophy, LogIn } from 'lucide-react';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const { user } = useAuthStore();

  const handleAuthClick = () => {
    if (user) {
      setShowUserProfile(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Featured Games</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRewards(true)}
                  className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Rewards</span>
                </button>
                <button
                  onClick={handleAuthClick}
                  className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  {user ? (
                    <>
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto">
            <GameGrid />
          </main>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <AdSpace position="bottom" />
          </div>
        </div>
        <aside className="p-6">
          <AdSpace position="side" />
        </aside>
      </div>
      <GameScreen />

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showUserProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowUserProfile(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <User className="w-6 h-6" />
            </button>
            <UserProfile />
          </div>
        </div>
      )}

      {showRewards && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowRewards(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <Trophy className="w-6 h-6" />
            </button>
            <RewardsScreen />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;