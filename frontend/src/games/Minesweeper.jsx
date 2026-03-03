import React, { useState, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

const CONFIGS = {
  easy:   { rows: 9,  cols: 9,  mines: 10, label: '😊 Easy',   desc: '9×9 · 10 mines' },
  medium: { rows: 12, cols: 10, mines: 25, label: '🤔 Medium', desc: '12×10 · 25 mines' },
  hard:   { rows: 14, cols: 10, mines: 35, label: '😤 Hard',   desc: '14×10 · 35 mines' },
};

function createBoard(rows, cols) {
  return Array.from({ length: rows * cols }, (_, i) => ({
    idx: i, mine: false, revealed: false, flagged: false, adjacent: 0,
  }));
}

function plantMines(board, rows, cols, mines, safeIdx) {
  const cells = [...board];
  let placed = 0;
  const safeSet = new Set([safeIdx, ...getNeighbors(safeIdx, rows, cols)]);
  while (placed < mines) {
    const idx = Math.floor(Math.random() * rows * cols);
    if (!cells[idx].mine && !safeSet.has(idx)) {
      cells[idx] = { ...cells[idx], mine: true };
      placed++;
    }
  }
  // Calculate adjacency
  return cells.map((cell, idx) => {
    if (cell.mine) return cell;
    const neighbors = getNeighbors(idx, rows, cols);
    const adjacent = neighbors.filter(n => cells[n].mine).length;
    return { ...cell, adjacent };
  });
}

function getNeighbors(idx, rows, cols) {
  const r = Math.floor(idx / cols), c = idx % cols;
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)
        neighbors.push(nr * cols + nc);
    }
  return neighbors;
}

function floodReveal(board, idx, rows, cols) {
  const cells = board.map(c => ({ ...c }));
  const queue = [idx];
  const visited = new Set();
  while (queue.length) {
    const i = queue.shift();
    if (visited.has(i)) continue;
    visited.add(i);
    if (cells[i].flagged || cells[i].mine) continue;
    cells[i] = { ...cells[i], revealed: true };
    if (cells[i].adjacent === 0) {
      getNeighbors(i, rows, cols).forEach(n => {
        if (!visited.has(n) && !cells[n].revealed) queue.push(n);
      });
    }
  }
  return cells;
}

const ADJ_COLORS = ['', 'text-blue-400', 'text-green-400', 'text-red-400', 'text-purple-400',
                    'text-red-700', 'text-cyan-400', 'text-black', 'text-gray-400'];

export default function Minesweeper({ onBack, game }) {
  const [difficulty, setDifficulty] = useState(null);
  const [board, setBoard] = useState([]);
  const [started, setStarted] = useState(false); // mines planted on first click
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [flagMode, setFlagMode] = useState(false);
  const [minesLeft, setMinesLeft] = useState(0);
  const [time, setTime] = useState(0);
  const [timerRef, setTimerRef] = useState(null);

  const config = difficulty ? CONFIGS[difficulty] : null;

  const stopTimer = useCallback(() => {
    if (timerRef) { clearInterval(timerRef); setTimerRef(null); }
  }, [timerRef]);

  const startTimer = useCallback(() => {
    stopTimer();
    setTime(0);
    const ref = setInterval(() => setTime(t => t + 1), 1000);
    setTimerRef(ref);
  }, [stopTimer]);

  const startGame = useCallback((diff) => {
    stopTimer();
    const { rows, cols, mines } = CONFIGS[diff];
    setDifficulty(diff);
    setBoard(createBoard(rows, cols));
    setStarted(false);
    setStatus('playing');
    setFlagMode(false);
    setMinesLeft(mines);
    setTime(0);
  }, [stopTimer]);

  const checkWin = useCallback((cells, rows, cols) => {
    return cells.every(c => c.mine ? !c.revealed : c.revealed);
  }, []);

  const handleClick = useCallback((idx) => {
    if (status !== 'playing') return;
    const cell = board[idx];
    if (cell.revealed) return;

    if (flagMode) {
      if (cell.revealed) return;
      setBoard(prev => {
        const next = [...prev];
        next[idx] = { ...cell, flagged: !cell.flagged };
        setMinesLeft(m => cell.flagged ? m + 1 : m - 1);
        return next;
      });
      return;
    }

    if (cell.flagged) return;

    if (!started) {
      // First click: plant mines then reveal
      const { rows, cols, mines } = config;
      const planted = plantMines(board, rows, cols, mines, idx);
      const revealed = floodReveal(planted, idx, rows, cols);
      setBoard(revealed);
      setStarted(true);
      startTimer();
      if (checkWin(revealed, rows, cols)) { setStatus('won'); stopTimer(); }
      return;
    }

    if (cell.mine) {
      // Boom! Reveal all mines
      setBoard(prev => prev.map(c => c.mine ? { ...c, revealed: true } : c));
      setStatus('lost');
      stopTimer();
      return;
    }

    const { rows, cols } = config;
    setBoard(prev => {
      const next = floodReveal(prev, idx, rows, cols);
      if (checkWin(next, rows, cols)) { setStatus('won'); stopTimer(); }
      return next;
    });
  }, [board, status, flagMode, started, config, startTimer, stopTimer, checkWin]);

  const handleRightClick = useCallback((e, idx) => {
    e.preventDefault();
    if (status !== 'playing' || board[idx].revealed) return;
    setBoard(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], flagged: !next[idx].flagged };
      setMinesLeft(m => next[idx].flagged ? m - 1 : m + 1);
      return next;
    });
  }, [board, status]);

  if (!difficulty) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-900 to-gray-900">
      <GameHeader game={game} onBack={onBack} />
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4 text-center">
        <div className="text-6xl">💣</div>
        <h2 className="text-white text-3xl font-black">Minesweeper</h2>
        <p className="text-white/70 max-w-sm">Reveal all safe cells without hitting a mine! Right-click or use flag mode to mark mines.</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {Object.entries(CONFIGS).map(([key, conf]) => (
            <button key={key} onClick={() => startGame(key)}
              className="bg-white text-gray-900 font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl flex flex-col items-center gap-1">
              <span>{conf.label}</span>
              <span className="text-gray-500 text-sm font-normal">{conf.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const { rows, cols } = config;
  const cellW = Math.floor((Math.min(window.innerWidth - 16, 400) - (cols + 1) * 2) / cols);
  const cellH = Math.min(cellW, 36);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-900 to-gray-900">
      <GameHeader game={game} onBack={() => { stopTimer(); setDifficulty(null); }} />

      {/* Status bar */}
      <div className="flex justify-center items-center gap-4 py-2 text-white text-sm font-bold">
        <span>💣 {minesLeft}</span>
        <span>⏱ {time}s</span>
        <button onClick={() => setFlagMode(f => !f)}
          className={`px-3 py-1 rounded-lg font-black transition-all text-xs
            ${flagMode ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-white/20 text-white'}`}>
          🚩 Flag {flagMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {status === 'won' && (
        <div className="text-center py-1">
          <span className="text-yellow-400 font-black text-xl">🏆 You Win! ({time}s)</span>
        </div>
      )}
      {status === 'lost' && (
        <div className="text-center py-1">
          <span className="text-red-400 font-black text-xl">💥 Boom! Game Over</span>
        </div>
      )}

      {/* Board */}
      <div className="flex justify-center px-2 py-2 overflow-x-auto">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cellW}px)`, gap: 2 }}>
          {board.map((cell, idx) => {
            let content = '';
            let cellClass = 'bg-slate-600 hover:bg-slate-500 cursor-pointer';

            if (cell.flagged && !cell.revealed) {
              content = '🚩';
              cellClass = 'bg-slate-600 cursor-pointer';
            } else if (!cell.revealed) {
              cellClass = status === 'playing'
                ? 'bg-slate-600 hover:bg-slate-500 active:bg-slate-400 cursor-pointer'
                : 'bg-slate-700 cursor-default';
            } else if (cell.mine) {
              content = '💣';
              cellClass = 'bg-red-700';
            } else {
              cellClass = 'bg-slate-800';
              content = cell.adjacent > 0 ? (
                <span className={`${ADJ_COLORS[cell.adjacent]} font-black`}>{cell.adjacent}</span>
              ) : '';
            }

            return (
              <div key={idx} onClick={() => handleClick(idx)}
                onContextMenu={(e) => handleRightClick(e, idx)}
                style={{ width: cellW, height: cellH }}
                className={`flex items-center justify-center rounded text-sm select-none transition-colors ${cellClass}`}>
                {content}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-3 py-3">
        <button onClick={() => startGame(difficulty)}
          className="bg-slate-600 hover:bg-slate-500 text-white font-black px-6 py-2 rounded-xl transition-all hover:scale-105">
          New Game
        </button>
        <button onClick={() => { stopTimer(); setDifficulty(null); }}
          className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-2 rounded-xl transition-all">
          Menu
        </button>
      </div>

      <p className="text-center text-white/30 text-xs pb-4">Tap to reveal • Flag mode or right-click to mark mines</p>
    </div>
  );
}
