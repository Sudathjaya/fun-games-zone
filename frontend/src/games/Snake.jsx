import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

const GRID = 20;
const CELL = 24;
const CANVAS_SIZE = GRID * CELL;

const DIRS = {
  ArrowUp:    { x: 0, y: -1 },
  ArrowDown:  { x: 0, y: 1 },
  ArrowLeft:  { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const SPEEDS = [
  { label: '🐢 Slow', ms: 200 },
  { label: '🐇 Normal', ms: 130 },
  { label: '⚡ Fast', ms: 80 },
];

function randomFood(snake) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function drawGame(ctx, snake, food, score, gameOver) {
  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Grid dots
  ctx.fillStyle = '#1e293b';
  for (let x = 0; x < GRID; x++) {
    for (let y = 0; y < GRID; y++) {
      ctx.beginPath();
      ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Food
  ctx.font = `${CELL - 4}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🍎', food.x * CELL + CELL / 2, food.y * CELL + CELL / 2);

  // Snake
  snake.forEach((seg, i) => {
    const isHead = i === 0;
    const t = 1 - i / snake.length;
    const green = Math.floor(180 + t * 75);
    ctx.fillStyle = isHead ? '#34d399' : `rgb(16, ${green}, 87)`;

    const padding = isHead ? 2 : 3;
    ctx.beginPath();
    ctx.roundRect(
      seg.x * CELL + padding,
      seg.y * CELL + padding,
      CELL - padding * 2,
      CELL - padding * 2,
      isHead ? 6 : 4
    );
    ctx.fill();

    // Eyes on head
    if (isHead) {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(seg.x * CELL + CELL * 0.3, seg.y * CELL + CELL * 0.35, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(seg.x * CELL + CELL * 0.7, seg.y * CELL + CELL * 0.35, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export default function Snake({ onBack, game }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    score: 0,
    running: false,
    gameOver: false,
  });
  const intervalRef = useRef(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;
    drawGame(ctx, s.snake, s.food, s.score, s.gameOver);
  }, []);

  const initGame = useCallback(() => {
    const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    stateRef.current = {
      snake,
      food: randomFood(snake),
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      score: 0,
      running: false,
      gameOver: false,
    };
    setDisplayScore(0);
    setGameOver(false);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    draw();
  }, [draw]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (!s.running || s.gameOver) return;

    s.dir = s.nextDir;
    const head = {
      x: (s.snake[0].x + s.dir.x + GRID) % GRID,
      y: (s.snake[0].y + s.dir.y + GRID) % GRID,
    };

    // Self collision
    if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.gameOver = true;
      s.running = false;
      if (s.score > highScore) setHighScore(s.score);
      setGameOver(true);
      setRunning(false);
      clearInterval(intervalRef.current);
      draw();
      return;
    }

    const ateFood = head.x === s.food.x && head.y === s.food.y;
    s.snake = [head, ...s.snake];
    if (!ateFood) s.snake.pop();
    else {
      s.score += 10;
      s.food = randomFood(s.snake);
      setDisplayScore(s.score);
    }

    draw();
  }, [draw, highScore]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) {
      initGame();
      return;
    }
    s.running = true;
    setRunning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(gameLoop, SPEEDS[speedIdx].ms);
  }, [initGame, gameLoop, speedIdx]);

  // Restart interval on speed change
  useEffect(() => {
    if (running && !gameOver) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(gameLoop, SPEEDS[speedIdx].ms);
    }
  }, [speedIdx, running, gameOver, gameLoop]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (!DIRS[e.key]) return;
      e.preventDefault();
      const s = stateRef.current;
      const newDir = DIRS[e.key];
      // Prevent reversing
      if (newDir.x !== -s.dir.x || newDir.y !== -s.dir.y) {
        s.nextDir = newDir;
      }
      if (!s.running && !s.gameOver) startGame();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [startGame]);

  const handleDpad = (key) => {
    const s = stateRef.current;
    const newDir = DIRS[key];
    if (newDir && (newDir.x !== -s.dir.x || newDir.y !== -s.dir.y)) {
      s.nextDir = newDir;
    }
    if (!s.running && !s.gameOver) startGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-emerald-900">
      <GameHeader game={game} onBack={onBack} score={`🍎 ${displayScore}`} />

      <div className="flex flex-col items-center px-4 py-4">
        {/* Speed & Score */}
        <div className="flex gap-4 mb-4 flex-wrap justify-center">
          {SPEEDS.map((s, i) => (
            <button
              key={i}
              onClick={() => setSpeedIdx(i)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all
                ${speedIdx === i
                  ? 'bg-emerald-400 text-white shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              {s.label}
            </button>
          ))}
          <div className="bg-white/20 text-white font-bold px-4 py-2 rounded-full text-sm">
            🏆 Best: {highScore}
          </div>
        </div>

        {/* Canvas — responsive square, scales to screen width */}
        <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: '1 / 1' }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="rounded-2xl shadow-2xl border-4 border-emerald-500/50"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />

          {/* Overlay */}
          {(!running || gameOver) && (
            <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center">
              {gameOver ? (
                <>
                  <div className="text-5xl mb-2">💀</div>
                  <div className="text-white text-2xl font-black mb-1">Game Over!</div>
                  <div className="text-emerald-300 text-lg mb-4">Score: {displayScore}</div>
                  {displayScore >= highScore && displayScore > 0 && (
                    <div className="text-yellow-400 font-bold mb-4">🏆 New High Score!</div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-5xl mb-2">🐍</div>
                  <div className="text-white text-xl font-black mb-4">Ready to play?</div>
                </>
              )}
              <button
                onClick={() => {
                  if (gameOver) { initGame(); setTimeout(startGame, 100); }
                  else { startGame(); }
                }}
                className="bg-emerald-400 hover:bg-emerald-300 text-white font-black
                           text-xl px-8 py-4 rounded-2xl hover:scale-105 active:scale-95
                           transition-all shadow-lg"
              >
                {gameOver ? '🔄 Play Again' : '▶ Start Game'}
              </button>
            </div>
          )}
        </div>

        {/* D-Pad — larger buttons for touch on mobile */}
        <div className="mt-5 grid grid-cols-3 gap-2" style={{ width: '168px' }}>
          <div />
          <button onClick={() => handleDpad('ArrowUp')}    className="dpad-btn">⬆️</button>
          <div />
          <button onClick={() => handleDpad('ArrowLeft')}  className="dpad-btn">⬅️</button>
          <button onClick={() => handleDpad('ArrowDown')}  className="dpad-btn">⬇️</button>
          <button onClick={() => handleDpad('ArrowRight')} className="dpad-btn">➡️</button>
        </div>

        <style>{`
          .dpad-btn {
            background: rgba(255,255,255,0.18);
            border: 2px solid rgba(255,255,255,0.35);
            color: white;
            font-size: 1.6rem;
            width: 56px;
            height: 56px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.1s;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
          }
          .dpad-btn:active {
            background: rgba(255,255,255,0.35);
            transform: scale(0.88);
          }
        `}</style>

        <div className="mt-4 bg-white/10 rounded-2xl p-4 text-center text-emerald-200 text-sm w-full max-w-xs">
          <strong>Controls:</strong> Arrow keys (keyboard) or D-Pad above (touch).
          Eat 🍎 to grow! Don't crash.
        </div>
      </div>
    </div>
  );
}
