import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const directionRef = useRef(INITIAL_DIRECTION);
  const snakeRef = useRef(INITIAL_SNAKE);
  const foodRef = useRef({ x: 5, y: 5 });
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const newFood = generateFood();
    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIRECTION;
    setFood(newFood);
    foodRef.current = newFood;
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const head = snakeRef.current[0];
    const newHead = {
      x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
    };

    // Check collision with self
    if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      setIsPaused(true);
      return;
    }

    const newSnake = [newHead, ...snakeRef.current];

    // Check food collision
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      setScore(s => {
        const newScore = s + 10;
        onScoreChange(newScore);
        return newScore;
      });
      const nextFood = generateFood();
      setFood(nextFood);
      foodRef.current = nextFood;
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    setSnake(newSnake);
  }, [gameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, SPEED);
    gameLoopRef.current = interval as unknown as number;
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className="relative bg-black/90 glitch-border overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Static noise effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uWUuejgRTU6YyW/giphy.gif')]" />

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ 
              x: segment.x * 20, 
              y: segment.y * 20,
            }}
            className={`absolute w-5 h-5 ${i === 0 ? 'bg-glitch-cyan' : 'bg-glitch-cyan/40'} border border-black`}
            style={{ left: 0, top: 0 }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            opacity: [1, 0, 1],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="absolute w-5 h-5 bg-glitch-magenta"
          style={{ 
            left: food.x * 20, 
            top: food.y * 20 
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-glitch-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-8 text-center"
            >
              {gameOver ? (
                <>
                  <h2 className="text-6xl font-black text-glitch-magenta mb-4 glitch-text" data-text="PROCESS_TERMINATED">PROCESS_TERMINATED</h2>
                  <p className="text-glitch-cyan mb-8 text-xl tracking-widest">YIELD_COLLECTED: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="px-10 py-3 bg-glitch-magenta text-black font-bold uppercase tracking-widest hover:bg-glitch-cyan transition-colors glitch-border"
                  >
                    REBOOT_CORE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-6xl font-black text-glitch-cyan mb-4 glitch-text" data-text="SYSTEM_HALTED">SYSTEM_HALTED</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-10 py-3 bg-glitch-cyan text-black font-bold uppercase tracking-widest hover:bg-glitch-magenta transition-colors glitch-border"
                  >
                    RESUME_PROCESS
                  </button>
                  <p className="mt-6 text-xs text-white/30 tracking-[0.3em] uppercase">Input: [SPACE_BAR] to toggle state</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-6 flex gap-8 text-xs font-pixel tracking-[0.2em] uppercase">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-glitch-cyan" />
          <span className="text-glitch-cyan">Serpent_Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-glitch-magenta" />
          <span className="text-glitch-magenta">Buffer_Data</span>
        </div>
      </div>
    </div>
  );
};
