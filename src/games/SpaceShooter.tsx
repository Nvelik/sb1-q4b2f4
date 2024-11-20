import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import { useHighScoreStore } from '../store/highScoreStore';
import { useGameStore } from '../store/gameStore';
import { Enemy } from '../types';
import { Pause, Play, RotateCcw, Heart } from 'lucide-react';

const SHIP_SIZE = 30;
const PROJECTILE_SIZE = 5;
const ENEMY_SIZE = 30;
const ENEMY_SPEED_BASE = 2;
const SPEED_INCREMENT = 0.5;
const ENEMY_COUNT_INCREMENT = 1;
const POINTS_PER_ENEMY = 10;
const INITIAL_LIVES = 3;

interface GameState {
  ship: { x: number; y: number };
  projectiles: { x: number; y: number }[];
  enemies: Enemy[];
  isPaused: boolean;
  lives: number;
  isGameOver: boolean;
}

export default function SpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const { addReward } = useUserStore();
  const { addScore, getTopScores } = useHighScoreStore();
  const { setCurrentGame } = useGameStore();
  const highScores = getTopScores(5);
  
  const gameStateRef = useRef<GameState>({
    ship: { x: 0, y: 0 },
    projectiles: [],
    enemies: [],
    isPaused: false,
    lives: INITIAL_LIVES,
    isGameOver: false
  });

  const animationFrameRef = useRef<number>();
  const livesRef = useRef(INITIAL_LIVES);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  const handleScoreUpdate = useCallback((points: number) => {
    setScore(prev => {
      const newScore = prev + points;
      if (Math.floor(newScore / 100) > Math.floor(prev / 100)) {
        addReward(0.01, 'gameplay');
      }
      return newScore;
    });
  }, [addReward]);

  const handleLifeLost = useCallback(() => {
    const newLives = livesRef.current - 1;
    if (newLives <= 0 && !gameStateRef.current.isGameOver) {
      gameStateRef.current.isGameOver = true;
      setGameOver(true);
      addScore(score);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    setLives(newLives);
  }, [score, addScore]);

  const initGame = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;

    const currentShipX = gameStateRef.current.ship.x || canvas.width / 2;
    
    gameStateRef.current = {
      ship: { x: currentShipX, y: canvas.height - 50 },
      projectiles: [],
      enemies: generateEnemies(1),
      isPaused: false,
      lives: INITIAL_LIVES,
      isGameOver: false
    };

    setScore(0);
    setLevel(1);
    setLives(INITIAL_LIVES);
    livesRef.current = INITIAL_LIVES;
    setGameOver(false);
    setIsPaused(false);
  }, []);

  const generateEnemies = (currentLevel: number): Enemy[] => {
    const count = Math.min(1 + (currentLevel - 1) * ENEMY_COUNT_INCREMENT, 5);
    const speed = ENEMY_SPEED_BASE + (currentLevel - 1) * SPEED_INCREMENT;
    
    return Array.from({ length: count }, () => ({
      x: Math.random() * ((canvasRef.current?.width ?? 800) - ENEMY_SIZE),
      y: -ENEMY_SIZE,
      speed,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
    }));
  };

  const updateGame = useCallback(() => {
    if (!canvasRef.current || gameStateRef.current.isGameOver || isPaused) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ship
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(
      gameState.ship.x - SHIP_SIZE / 2,
      gameState.ship.y - SHIP_SIZE / 2,
      SHIP_SIZE,
      SHIP_SIZE
    );

    // Update and draw projectiles
    gameState.projectiles = gameState.projectiles.filter(projectile => {
      projectile.y -= 10;
      if (projectile.y > 0) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(
          projectile.x - PROJECTILE_SIZE / 2,
          projectile.y - PROJECTILE_SIZE / 2,
          PROJECTILE_SIZE,
          PROJECTILE_SIZE
        );
        return true;
      }
      return false;
    });

    // Update and draw enemies
    let enemiesDestroyed = 0;
    gameState.enemies = gameState.enemies.filter(enemy => {
      enemy.y += enemy.speed;

      // Check for projectile collisions
      const hitByProjectile = gameState.projectiles.some((projectile, index) => {
        if (
          projectile.x >= enemy.x - enemy.width / 2 &&
          projectile.x <= enemy.x + enemy.width / 2 &&
          projectile.y >= enemy.y - enemy.height / 2 &&
          projectile.y <= enemy.y + enemy.height / 2
        ) {
          gameState.projectiles.splice(index, 1);
          enemiesDestroyed++;
          return true;
        }
        return false;
      });

      if (hitByProjectile) {
        return false;
      }

      // Check for ship collision
      if (
        Math.abs(gameState.ship.x - enemy.x) < (SHIP_SIZE + enemy.width) / 2 &&
        Math.abs(gameState.ship.y - enemy.y) < (SHIP_SIZE + enemy.height) / 2
      ) {
        handleLifeLost();
        return false;
      }

      // Check if enemy passed bottom
      if (enemy.y > canvas.height) {
        handleLifeLost();
        return false;
      }

      // Draw enemy
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(
        enemy.x - enemy.width / 2,
        enemy.y - enemy.height / 2,
        enemy.width,
        enemy.height
      );
      return true;
    });

    // Update score for destroyed enemies
    if (enemiesDestroyed > 0) {
      handleScoreUpdate(enemiesDestroyed * POINTS_PER_ENEMY);
    }

    // Generate new enemies if all are destroyed
    if (gameState.enemies.length === 0) {
      setLevel(prevLevel => {
        const newLevel = prevLevel + 1;
        gameState.enemies = generateEnemies(newLevel);
        return newLevel;
      });
    }

    animationFrameRef.current = requestAnimationFrame(updateGame);
  }, [isPaused, handleScoreUpdate, handleLifeLost]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (gameStateRef.current.isGameOver || isPaused) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      // Clamp the ship position to the canvas bounds
      gameStateRef.current.ship.x = Math.max(
        SHIP_SIZE / 2,
        Math.min(canvas.width - SHIP_SIZE / 2, x)
      );
    };

    const handleClick = () => {
      if (gameStateRef.current.isGameOver || isPaused) return;
      gameStateRef.current.projectiles.push({
        x: gameStateRef.current.ship.x,
        y: gameStateRef.current.ship.y - SHIP_SIZE / 2,
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    initGame();
    animationFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initGame, isPaused, updateGame]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    gameStateRef.current.isPaused = !isPaused;
    if (!isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      animationFrameRef.current = requestAnimationFrame(updateGame);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 p-8 rounded-lg">
      <div className="flex justify-between w-full mb-4">
        <div className="text-white text-xl">Score: {score}</div>
        <div className="text-white text-xl">Level: {level}</div>
        <div className="flex items-center gap-2">
          {Array.from({ length: lives }).map((_, i) => (
            <Heart
              key={i}
              className="w-6 h-6 text-red-500 fill-current"
            />
          ))}
        </div>
        <div className="space-x-4">
          <button
            onClick={togglePause}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button
            onClick={initGame}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="border-2 border-purple-500 rounded-lg cursor-crosshair"
      />
      {gameOver && (
        <div className="mt-4 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <p className="mb-4">Final Score: {score}</p>
          <div className="space-x-4">
            <button
              onClick={initGame}
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