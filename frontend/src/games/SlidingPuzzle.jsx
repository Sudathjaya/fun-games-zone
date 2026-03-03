import React, { useState, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

function createSolved(size) {
  return Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
  // 0 = blank tile, values 1..size*size-1 are tiles
}

function shuffle(tiles, size) {
  let t = [...tiles];
  // Do many random valid moves to ensure solvability
  let blankIdx = t.indexOf(0);
  for (let i = 0; i < 1000; i++) {
    const r = Math.floor(blankIdx / size), c = blankIdx % size;
    const neighbors = [];
    if (r > 0) neighbors.push(blankIdx - size);
    if (r < size - 1) neighbors.push(blankIdx + size);
    if (c > 0) neighbors.push(blankIdx - 1);
    if (c < size - 1) neighbors.push(blankIdx + 1);
    const swap = neighbors[Math.floor(Math.random() * neighbors.length)];
    [t[blankIdx], t[swap]] = [t[swap], t[blankIdx]];
    blankIdx = swap;
  }
  return t;
}

function isSolved(tiles, size) {
  const goal = createSolved(size);
  return tiles.every((v, i) => v === goal[i]);
}

const SIZE_OPTIONS = [
  { size: 3, label: '3×3', desc: '8 tiles' },
  { size: 4, label: '4×4', desc: '15 tiles' },
  { size: 5, label: '5×5', desc: '24 tiles' },
];

export default function SlidingPuzzle({ onBack, game }) {
  const [size, setSize] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState({});

  const startGame = useCallback((s) => {
    setSize(s);
    const solved = createSolved(s);
    setTiles(shuffle(solved, s));
    setMoves(0);
    setWon(false);
  }, []);

  const handleTileClick = useCallback((idx) => {
    if (won) return;
    const blankIdx = tiles.indexOf(0);
    const r = Math.floor(idx / size), c = idx % size;
    const br = Math.floor(blankIdx / size), bc = blankIdx % size;
    const adjacent = (Math.abs(r - br) === 1 && c === bc) || (Math.abs(c - bc) === 1 && r === br);
    if (!adjacent) return;

    setTiles(prev => {
      const next = [...prev];
      [next[idx], next[blankIdx]] = [next[blankIdx], next[idx]];
      const newMoves = moves + 1;
      setMoves(newMoves);
      if (isSolved(next, size)) {
        setWon(true);
        setBest(b => {
          const prev = b[size];
          return { ...b, [size]: prev === undefined ? newMoves : Math.min(prev, newMoves) };
        });
      }
      return next;
    });
  }, [tiles, size, won, moves]);

  if (!size) return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      <GameHeader game={game} onBack={onBack} />
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4 text-center">
        <div className="text-6xl">🧩</div>
        <h2 className="text-white text-3xl font-black">Sliding Puzzle</h2>
        <p className="text-white/70 max-w-sm">Slide tiles to arrange them in order! Tap an adjacent tile to move it into the blank space.</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {SIZE_OPTIONS.map(({ size: s, label, desc }) => (
            <button key={s} onClick={() => startGame(s)}
              className="bg-white text-gray-900 font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl flex flex-col items-center">
              <span>{label}</span>
              <span className="text-gray-500 text-sm font-normal">{desc}</span>
              {best[s] !== undefined && <span className="text-teal-600 text-xs font-bold mt-1">Best: {best[s]}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const tileCount = size * size;
  const boardSize = Math.min(window.innerWidth - 24, 360);
  const tileSize = Math.floor((boardSize - (size + 1) * 4) / size);

  // Goal state preview: small tiles showing 1,2,3... left to right, top to bottom, blank at end
  const goal = createSolved(size);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      <GameHeader game={game} onBack={() => setSize(null)}
        extra={<span className="text-white text-sm font-bold">{size}×{size}</span>} />

      <div className="flex justify-center gap-6 py-2 text-white text-sm font-bold">
        <span>Moves: {moves}</span>
        {best[size] !== undefined && <span className="text-teal-300">Best: {best[size]}</span>}
      </div>

      {won && (
        <div className="text-center py-2">
          <span className="text-yellow-400 font-black text-2xl">🏆 Solved in {moves} moves!</span>
        </div>
      )}

      {/* Board */}
      <div className="flex justify-center px-3 py-2">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, ${tileSize}px)`,
                      gap: 4, backgroundColor: '#0e7490', borderRadius: 16, padding: 4 }}>
          {tiles.map((val, idx) => {
            const isBlank = val === 0;
            const blankIdx = tiles.indexOf(0);
            const r = Math.floor(idx / size), c = idx % size;
            const br = Math.floor(blankIdx / size), bc = blankIdx % size;
            const isAdjacent = !isBlank && ((Math.abs(r - br) === 1 && c === bc) || (Math.abs(c - bc) === 1 && r === br));
            const isCorrect = val === goal[idx];

            return (
              <div key={idx} onClick={() => handleTileClick(idx)}
                style={{ width: tileSize, height: tileSize }}
                className={`rounded-xl font-black flex items-center justify-center transition-all select-none
                  ${isBlank ? 'bg-teal-900/50' :
                    isCorrect && won ? 'bg-yellow-400 text-gray-900 cursor-default' :
                    isAdjacent ? 'bg-cyan-400 text-gray-900 cursor-pointer hover:scale-105 hover:bg-cyan-300' :
                    'bg-teal-600 text-white cursor-pointer hover:bg-teal-500'}
                  ${size === 3 ? 'text-3xl' : size === 4 ? 'text-2xl' : 'text-lg'}`}>
                {isBlank ? '' : val}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-white/50 text-xs py-1">
        Goal: 1 → {tileCount - 1} (blank at end)
      </div>

      <div className="flex justify-center gap-3 py-3">
        <button onClick={() => startGame(size)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-black px-6 py-2 rounded-xl transition-all hover:scale-105">
          Shuffle Again
        </button>
        <button onClick={() => setSize(null)}
          className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-2 rounded-xl transition-all">
          Change Size
        </button>
      </div>
    </div>
  );
}
