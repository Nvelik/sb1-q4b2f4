import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useHighScoreStore } from '../store/highScoreStore';
import { useGameStore } from '../store/gameStore';
import { Pause, Play, RotateCcw } from 'lucide-react';

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const INITIAL_TIME = 60;
const MATCH_SCORE = 10;
const CLEAR_BONUS = 50;

interface Tile {
  id: number;
  color: string;
  matched: boolean;
}

export default function PuzzleMaster() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScores, setHighScores] = useState<ReturnType<typeof getTopScores>>([]);
  const { addReward } = useUserStore();
  const { addScore, getTopScores } = useHighScoreStore();
  const { setCurrentGame } = useGameStore();

  useEffect(() => {
    setHighScores(getTopScores(5));
  }, [getTopScores, score]);

  useEffect(() => {
    const generateTiles = () => {
      const numPairs = 3 + Math.min(level - 1, 5);
      const colors = COLORS.slice(0, numPairs);
      const pairs = [...colors, ...colors];
      return pairs
        .sort(() => Math.random() - 0.5)
        .map((color, index) => ({
          id: index,
          color,
          matched: false,
        }));
    };

    setTiles(generateTiles());
    setTimeLeft(INITIAL_TIME);
    setSelected([]);
  }, [level]);

  useEffect(() => {
    if (gameOver || isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          addScore(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, isPaused, score, addScore]);

  const handleTileClick = (id: number) => {
    if (isPaused || selected.includes(id) || tiles[id].matched || selected.length >= 2) return;

    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (tiles[first].color === tiles[second].color) {
        setTimeout(() => {
          setTiles((prev) =>
            prev.map((tile) =>
              tile.id === first || tile.id === second
                ? { ...tile, matched: true }
                : tile
            )
          );
          setScore((prev) => {
            const newScore = prev + MATCH_SCORE;
            if (Math.floor(newScore / 100) > Math.floor(prev / 100)) {
              addReward(0.01, 'gameplay');
            }
            return newScore;
          });
          setSelected([]);

          const allMatched = tiles.every(
            (tile) => tile.matched || tile.id === first || tile.id === second
          );
          if (allMatched) {
            setScore((prev) => prev + CLEAR_BONUS);
            setLevel((prev) => prev + 1);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setSelected([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setTimeLeft(INITIAL_TIME);
    setSelected([]);
    setTiles([]);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 p-8 rounded-lg">
      <div className="flex justify-between w-full mb-4">
        <div className="text-white text-xl">Score: {score}</div>
        <div className="text-white text-xl">Level: {level}</div>
        <div className="text-white text-xl">Time: {timeLeft}s</div>
        <div className="space-x-4">
          <button
            onClick={togglePause}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button
            onClick={resetGame}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => handleTileClick(tile.id)}
            className={`w-20 h-20 rounded-lg transition-all duration-300 ${
              tile.matched
                ? 'opacity-0'
                : selected.includes(tile.id)
                ? colorClasses[tile.color as keyof typeof colorClasses]
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            disabled={tile.matched || gameOver || isPaused}
          />
        ))}
      </div>

      {gameOver && (
        <div className="mt-4 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <p className="mb-4">Final Score: {score}</p>
          <div className="space-x-4">
            <button
              onClick={resetGame}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              Play Again
            </button>
            <button
              onClick={() => setCurrentGame(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 w-full max-w-md">
        <h3 className="text-white text-lg font-bold mb-2">High Scores</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          {highScores.map((highScore, index) => (
            <div
              key={index}
              className="flex justify-between text-white py-1"
            >
              <span>{highScore.playerName}</span>
              <span>{highScore.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}