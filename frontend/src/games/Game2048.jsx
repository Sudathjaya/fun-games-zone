import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameHeader from '../components/GameHeader';

const SIZE = 4;

const TILE_COLORS = {
  0:    'bg-gray-700 text-transparent',
  2:    'bg-amber-100 text-gray-800',
  4:    'bg-amber-200 text-gray-800',
  8:    'bg-orange-400 text-white',
  16:   'bg-orange-500 text-white',
  32:   'bg-red-400 text-white',
  64:   'bg-red-500 text-white',
  128:  'bg-yellow-400 text-white',
  256:  'bg-yellow-500 text-white',
  512:  'bg-yellow-600 text-white',
  1024: 'bg-amber-600 text-white',
  2048: 'bg-amber-700 text-white',
};

function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function addRandomTile(grid) {
  const empty = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] === 0) empty.push([r, c]);
  if (!empty.length) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = grid.map(row => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function initGrid() {
  let g = emptyGrid();
  g = addRandomTile(g);
  g = addRandomTile(g);
  return g;
}

function slideRow(row) {
  const nums = row.filter(v => v);
  let score = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2;
      score += nums[i];
      nums.splice(i + 1, 1);
    }
  }
  while (nums.length < SIZE) nums.push(0);
  return { row: nums, score };
}

function moveGrid(grid, dir) {
  let g = grid.map(row => [...row]);
  let totalScore = 0;
  let moved = false;

  const rotate90 = m => m[0].map((_, c) => m.map(r => r[c]).reverse());
  const rotateCCW = m => m[0].map((_, c) => m.map(r => r[r.length - 1 - c]));

  // Normalize: always slide left
  let times = { left: 0, right: 2, up: 1, down: 3 }[dir] || 0;
  for (let t = 0; t < times; t++) g = rotate90(g);

  const ng = g.map(row => {
    const { row: nr, score } = slideRow(row);
    totalScore += score;
    if (nr.some((v, i) => v !== row[i])) moved = true;
    return nr;
  });

  let result = ng;
  for (let t = 0; t < (4 - times) % 4; t++) result = rotate90(result);

  return { grid: result, score: totalScore, moved };
}

function hasWon(grid) {
  return grid.some(row => row.some(v => v >= 2048));
}

function canMove(grid) {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}

export default function Game2048({ onBack, game }) {
  const [grid, setGrid] = useState(initGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('2048-best') || '0'));
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const touchStart = useRef(null);

  const handleMove = useCallback((dir) => {
    if (over) return;
    setGrid(prev => {
      const { grid: next, score: gain, moved } = moveGrid(prev, dir);
      if (!moved) return prev;
      const withTile = addRandomTile(next);
      setScore(s => {
        const ns = s + gain;
        setBest(b => {
          const nb = Math.max(b, ns);
          localStorage.setItem('2048-best', nb);
          return nb;
        });
        return ns;
      });
      if (!keepPlaying && hasWon(withTile)) setWon(true);
      if (!canMove(withTile)) setOver(true);
      return withTile;
    });
  }, [over, keepPlaying]);

  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleMove]);

  const onTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left');
    else handleMove(dy > 0 ? 'down' : 'up');
    touchStart.current = null;
  };

  const restart = () => {
    setGrid(initGrid()); setScore(0); setWon(false); setOver(false); setKeepPlaying(false);
  };

  const tileSize = `calc((min(100vw - 2rem, 380px) - 20px) / 4)`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900">
      <GameHeader game={game} onBack={onBack}
        extra={<span className="text-white text-sm font-bold">Best: {best}</span>} />

      {/* Score */}
      <div className="flex justify-center gap-4 py-2">
        <div className="bg-amber-700/60 rounded-xl px-5 py-2 text-center">
          <div className="text-amber-200 text-xs font-bold uppercase">Score</div>
          <div className="text-white text-2xl font-black">{score}</div>
        </div>
        <div className="bg-amber-700/60 rounded-xl px-5 py-2 text-center">
          <div className="text-amber-200 text-xs font-bold uppercase">Best</div>
          <div className="text-white text-2xl font-black">{best}</div>
        </div>
      </div>

      {/* Win/Lose overlay messages */}
      {won && !keepPlaying && (
        <div className="mx-auto max-w-xs text-center py-2">
          <div className="bg-yellow-400/20 border border-yellow-400 rounded-2xl p-3">
            <p className="text-yellow-300 font-black text-lg">🏆 You reached 2048!</p>
            <div className="flex gap-2 justify-center mt-2">
              <button onClick={() => setKeepPlaying(true)}
                className="bg-yellow-500 text-black font-black px-4 py-1.5 rounded-xl text-sm hover:scale-105 transition-all">
                Keep Playing
              </button>
              <button onClick={restart}
                className="bg-white/20 text-white font-bold px-4 py-1.5 rounded-xl text-sm hover:scale-105 transition-all">
                New Game
              </button>
            </div>
          </div>
        </div>
      )}
      {over && (
        <div className="mx-auto max-w-xs text-center py-2">
          <div className="bg-red-500/20 border border-red-400 rounded-2xl p-3">
            <p className="text-red-300 font-black text-lg">Game Over!</p>
            <button onClick={restart}
              className="mt-2 bg-amber-500 text-white font-black px-6 py-1.5 rounded-xl text-sm hover:scale-105 transition-all">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex justify-center px-4 py-3">
        <div
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          className="bg-amber-800/80 rounded-2xl p-1.5 shadow-2xl select-none"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, ${tileSize})`, gap: 6,
                   width: `calc(min(100vw - 2rem, 380px))` }}>
          {grid.flat().map((val, i) => {
            const colorClass = TILE_COLORS[Math.min(val, 2048)] || 'bg-amber-700 text-white';
            const fontSize = val >= 1024 ? 'text-lg' : val >= 128 ? 'text-2xl' : 'text-3xl';
            return (
              <div key={i} className={`rounded-xl font-black flex items-center justify-center transition-all
                                       ${colorClass} ${fontSize}`}
                style={{ width: tileSize, height: tileSize }}>
                {val > 0 ? val : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrow buttons for mobile */}
      <div className="flex flex-col items-center gap-1 py-2">
        <button onClick={() => handleMove('up')}
          className="bg-white/20 hover:bg-white/30 text-white font-black w-12 h-12 rounded-xl text-xl transition-all">↑</button>
        <div className="flex gap-1">
          <button onClick={() => handleMove('left')}
            className="bg-white/20 hover:bg-white/30 text-white font-black w-12 h-12 rounded-xl text-xl transition-all">←</button>
          <button onClick={() => handleMove('down')}
            className="bg-white/20 hover:bg-white/30 text-white font-black w-12 h-12 rounded-xl text-xl transition-all">↓</button>
          <button onClick={() => handleMove('right')}
            className="bg-white/20 hover:bg-white/30 text-white font-black w-12 h-12 rounded-xl text-xl transition-all">→</button>
        </div>
      </div>

      <div className="flex justify-center pb-4">
        <button onClick={restart}
          className="bg-amber-600 hover:bg-amber-500 text-white font-black px-8 py-2 rounded-xl transition-all hover:scale-105">
          New Game
        </button>
      </div>

      <p className="text-center text-white/30 text-xs pb-4">Swipe or use arrow keys • Merge tiles to reach 2048!</p>
    </div>
  );
}
