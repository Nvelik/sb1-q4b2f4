import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X } from 'lucide-react';

export default function GameScreen() {
  const { currentGame, setCurrentGame } = useGameStore();

  if (!currentGame) return null;

  const GameComponent = currentGame.component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-4 rounded-lg w-full max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{currentGame.title}</h2>
          <button
            onClick={() => setCurrentGame(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <GameComponent />
      </div>
    </div>
  );
}