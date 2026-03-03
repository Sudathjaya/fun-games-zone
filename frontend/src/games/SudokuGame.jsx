import React, { useState, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

// Pre-made puzzles per difficulty: [puzzle (0=blank), solution]
const PUZZLES = {
  easy: [
    {
      p: [5,3,0,0,7,0,0,0,0, 6,0,0,1,9,5,0,0,0, 0,9,8,0,0,0,0,6,0,
          8,0,0,0,6,0,0,0,3, 4,0,0,8,0,3,0,0,1, 7,0,0,0,2,0,0,0,6,
          0,6,0,0,0,0,2,8,0, 0,0,0,4,1,9,0,0,5, 0,0,0,0,8,0,0,7,9],
      s: [5,3,4,6,7,8,9,1,2, 6,7,2,1,9,5,3,4,8, 1,9,8,3,4,2,5,6,7,
          8,5,9,7,6,1,4,2,3, 4,2,6,8,5,3,7,9,1, 7,1,3,9,2,4,8,5,6,
          9,6,1,5,3,7,2,8,4, 2,8,7,4,1,9,6,3,5, 3,4,5,2,8,6,1,7,9],
    },
    {
      p: [0,0,3,0,2,0,6,0,0, 9,0,0,3,0,5,0,0,1, 0,0,1,8,0,6,4,0,0,
          0,0,8,1,0,2,9,0,0, 7,0,0,0,0,0,0,0,8, 0,0,6,7,0,8,2,0,0,
          0,0,2,6,0,9,5,0,0, 8,0,0,2,0,3,0,0,9, 0,0,5,0,1,0,3,0,0],
      s: [4,8,3,9,2,1,6,5,7, 9,6,7,3,4,5,8,2,1, 2,5,1,8,7,6,4,9,3,
          5,4,8,1,3,2,9,7,6, 7,2,9,5,6,4,1,3,8, 1,3,6,7,9,8,2,4,5,
          3,7,2,6,8,9,5,1,4, 8,1,4,2,5,3,7,6,9, 6,9,5,4,1,7,3,8,2],
    },
  ],
  medium: [
    {
      p: [0,0,0,2,6,0,7,0,1, 6,8,0,0,7,0,0,9,0, 1,9,0,0,0,4,5,0,0,
          8,2,0,1,0,0,0,4,0, 0,0,4,6,0,2,9,0,0, 0,5,0,0,0,3,0,2,8,
          0,0,9,3,0,0,0,7,4, 0,4,0,0,5,0,0,3,6, 7,0,3,0,1,8,0,0,0],
      s: [4,3,5,2,6,9,7,8,1, 6,8,2,5,7,1,4,9,3, 1,9,7,8,3,4,5,6,2,
          8,2,6,1,9,5,3,4,7, 3,7,4,6,8,2,9,1,5, 9,5,1,7,4,3,6,2,8,
          5,1,9,3,2,6,8,7,4, 2,4,8,9,5,7,1,3,6, 7,6,3,4,1,8,2,5,9],
    },
  ],
  hard: [
    {
      p: [0,0,0,0,0,0,0,0,0, 0,0,0,0,0,3,0,8,5, 0,0,1,0,2,0,0,0,0,
          0,0,0,5,0,7,0,0,0, 0,0,4,0,0,0,1,0,0, 0,9,0,0,0,0,0,0,0,
          5,0,0,0,0,0,0,7,3, 0,0,2,0,1,0,0,0,0, 0,0,0,0,4,0,0,0,9],
      s: [9,8,7,6,5,4,3,2,1, 2,4,6,1,7,3,9,8,5, 3,5,1,9,2,8,7,4,6,
          1,2,8,5,3,7,6,9,4, 6,3,4,8,9,2,1,5,7, 7,9,5,4,6,1,8,3,2,
          5,1,9,2,8,6,4,7,3, 4,7,2,3,1,9,5,6,8, 8,6,3,7,4,5,2,1,9],
    },
  ],
};

function getPuzzle(diff) {
  const list = PUZZLES[diff];
  const { p, s } = list[Math.floor(Math.random() * list.length)];
  return { puzzle: [...p], solution: [...s] };
}

function isComplete(grid, solution) {
  return grid.every((v, i) => v === solution[i]);
}

function getConflicts(grid) {
  const conflicts = new Set();
  for (let i = 0; i < 9; i++) {
    const rowVals = {}, colVals = {}, boxVals = {};
    for (let j = 0; j < 9; j++) {
      const ri = i * 9 + j;
      const ci = j * 9 + i;
      const br = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      const bc = (i % 3) * 3 + (j % 3);
      const bi = br * 9 + bc;

      const rv = grid[ri], cv = grid[ci], bv = grid[bi];
      if (rv) { if (rowVals[rv] !== undefined) { conflicts.add(ri); conflicts.add(rowVals[rv]); } else rowVals[rv] = ri; }
      if (cv) { if (colVals[cv] !== undefined) { conflicts.add(ci); conflicts.add(colVals[cv]); } else colVals[cv] = ci; }
      if (bv) { if (boxVals[bv] !== undefined) { conflicts.add(bi); conflicts.add(boxVals[bv]); } else boxVals[bv] = bi; }
    }
  }
  return conflicts;
}

const DIFF_LABELS = { easy: '😊 Easy', medium: '🤔 Medium', hard: '😤 Hard' };

export default function SudokuGame({ onBack, game }) {
  const [difficulty, setDifficulty] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [grid, setGrid] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [won, setWon] = useState(false);

  const startGame = useCallback((diff) => {
    const { puzzle: p, solution: s } = getPuzzle(diff);
    setDifficulty(diff);
    setPuzzle(p);
    setSolution(s);
    setGrid([...p]);
    setSelected(null);
    setMistakes(0);
    setHintsLeft(3);
    setWon(false);
  }, []);

  const handleCellClick = (idx) => {
    if (puzzle[idx] !== 0) return;
    setSelected(idx);
  };

  const handleNumber = useCallback((num) => {
    if (selected === null || won) return;
    if (puzzle[selected] !== 0) return;
    setGrid(prev => {
      const next = [...prev];
      next[selected] = num;
      if (num !== 0 && num !== solution[selected]) {
        setMistakes(m => m + 1);
      }
      if (isComplete(next, solution)) setWon(true);
      return next;
    });
  }, [selected, won, puzzle, solution]);

  const useHint = () => {
    if (hintsLeft <= 0 || selected === null || won) return;
    if (puzzle[selected] !== 0 || grid[selected] === solution[selected]) return;
    setGrid(prev => {
      const next = [...prev];
      next[selected] = solution[selected];
      setHintsLeft(h => h - 1);
      if (isComplete(next, solution)) setWon(true);
      return next;
    });
  };

  if (!difficulty) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <GameHeader game={game} onBack={onBack} />
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4 text-center">
        <div className="text-6xl">🔢</div>
        <h2 className="text-white text-3xl font-black">Sudoku</h2>
        <p className="text-white/70 max-w-sm">Fill the 9×9 grid so every row, column, and 3×3 box contains digits 1–9.</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {['easy', 'medium', 'hard'].map(d => (
            <button key={d} onClick={() => startGame(d)}
              className="bg-white text-gray-900 font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl capitalize">
              {DIFF_LABELS[d]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const conflicts = getConflicts(grid);
  const selRow = selected !== null ? Math.floor(selected / 9) : -1;
  const selCol = selected !== null ? selected % 9 : -1;
  const selBox = selected !== null ? Math.floor(selRow / 3) * 3 + Math.floor(selCol / 3) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <GameHeader game={game} onBack={() => setDifficulty(null)}
        extra={<span className="text-white text-sm font-bold capitalize">{difficulty}</span>} />

      <div className="flex justify-center gap-4 py-2 text-sm">
        <span className="text-red-400 font-bold">❌ Mistakes: {mistakes}</span>
        <span className="text-yellow-400 font-bold">💡 Hints: {hintsLeft}</span>
      </div>

      {won && (
        <div className="text-center py-2">
          <span className="text-yellow-400 font-black text-2xl">🏆 Puzzle Solved!</span>
        </div>
      )}

      {/* Board */}
      <div className="flex justify-center px-2 py-2">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)',
                      width: Math.min(window.innerWidth - 16, 380), gap: 1,
                      backgroundColor: '#312e81', border: '3px solid #312e81', borderRadius: 12, overflow: 'hidden' }}>
          {grid.map((val, idx) => {
            const r = Math.floor(idx / 9), c = idx % 9;
            const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
            const isSelected = selected === idx;
            const isSameGroup = r === selRow || c === selCol || box === selBox;
            const isGiven = puzzle[idx] !== 0;
            const isConflict = conflicts.has(idx);
            const isCorrect = val !== 0 && val === solution[idx];
            const isSameNum = selected !== null && val !== 0 && val === grid[selected];
            const cellSize = Math.floor((Math.min(window.innerWidth - 16, 380) - 8) / 9);

            // Border for 3x3 boxes
            const borderRight = (c + 1) % 3 === 0 && c < 8 ? '2px solid #312e81' : '1px solid #4338ca';
            const borderBottom = (r + 1) % 3 === 0 && r < 8 ? '2px solid #312e81' : '1px solid #4338ca';

            return (
              <div key={idx} onClick={() => handleCellClick(idx)}
                style={{ width: cellSize, height: cellSize, borderRight, borderBottom }}
                className={`flex items-center justify-center font-black text-sm cursor-pointer transition-colors
                  ${isSelected ? 'bg-blue-400' :
                    isSameNum ? 'bg-blue-600/60' :
                    isSameGroup ? 'bg-indigo-800/60' : 'bg-indigo-900'}
                  ${isConflict ? '!bg-red-700/70' : ''}
                  ${isGiven ? 'text-white' : isCorrect ? 'text-green-300' : 'text-blue-200'}`}>
                {val || ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Number pad */}
      <div className="flex justify-center gap-1.5 px-4 py-3">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => handleNumber(n)}
            className="bg-indigo-700 hover:bg-indigo-600 active:scale-95 text-white font-black rounded-xl
                       transition-all flex-1 max-w-[38px] aspect-square text-sm shadow">
            {n}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3 pb-4">
        <button onClick={() => handleNumber(0)} disabled={selected === null || puzzle[selected] !== 0}
          className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-40">
          ✕ Erase
        </button>
        <button onClick={useHint} disabled={hintsLeft <= 0 || selected === null || won}
          className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-40">
          💡 Hint ({hintsLeft})
        </button>
        <button onClick={() => startGame(difficulty)}
          className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
          New Puzzle
        </button>
      </div>
    </div>
  );
}
