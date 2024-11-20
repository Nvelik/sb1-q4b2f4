import React from 'react';
import { Game } from '../types';
import { Users, User } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import SpaceShooter from '../games/SpaceShooter';
import PuzzleMaster from '../games/PuzzleMaster';

const games: Game[] = [
  {
    id: '1',
    title: 'Space Shooter',
    description: 'Classic arcade space shooting game',
    thumbnail: 'https://images.unsplash.com/photo-1614932257675-ea8c7b76f1ed?auto=format&fit=crop&q=80&w=300&h=200',
    multiplayer: false,
    category: 'Arcade',
    component: SpaceShooter
  },
  {
    id: '2',
    title: 'Puzzle Master',
    description: 'Brain-teasing puzzle challenges',
    thumbnail: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=300&h=200',
    multiplayer: false,
    category: 'Puzzle',
    component: PuzzleMaster
  },
  {
    id: '3',
    title: 'Chess Royale',
    description: 'Online multiplayer chess',
    thumbnail: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&q=80&w=300&h=200',
    multiplayer: true,
    category: 'Board',
    component: SpaceShooter // Placeholder
  },
  {
    id: '4',
    title: 'Word Battle',
    description: 'Competitive word finding game',
    thumbnail: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&q=80&w=300&h=200',
    multiplayer: true,
    category: 'Word',
    component: SpaceShooter // Placeholder
  }
];

export default function GameGrid() {
  const { setCurrentGame } = useGameStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {games.map((game) => (
        <div
          key={game.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-48">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2">
              {game.multiplayer ? (
                <Users className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900">{game.title}</h3>
              <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {game.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{game.description}</p>
            <button
              onClick={() => setCurrentGame(game)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Play Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}