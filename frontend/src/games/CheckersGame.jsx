import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

// Board: 8x8 — only dark squares (row+col)%2===1 are playable
// 'r'=red normal, 'R'=red king, 'b'=black normal, 'B'=black king
// Red starts top (rows 0-2), Black starts bottom (rows 5-7)
// Black moves UP (row-1), Red moves DOWN (row+1)

function initBoard() {
  const b = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1) b[r][c] = 'r';
  for (let r = 5; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1) b[r][c] = 'b';
  return b;
}

const pColor = p => (!p ? null : p === 'r' || p === 'R' ? 'red' : 'black');
const isKing = p => p === 'R' || p === 'B';
const dirs = (p) => {
  const d = [];
  if (p === 'b' || p === 'B') d.push([-1, -1], [-1, 1]);
  if (p === 'r' || p === 'R') d.push([1, -1], [1, 1]);
  return d;
};

function getJumps(board, r, c) {
  const p = board[r][c]; if (!p) return [];
  const pc = pColor(p); const jumps = [];
  for (const [dr, dc] of dirs(p)) {
    const mr = r + dr, mc = c + dc;
    if (mr < 0 || mr > 7 || mc < 0 || mc > 7) continue;
    if (!board[mr][mc] || pColor(board[mr][mc]) === pc) continue;
    const jr = mr + dr, jc = mc + dc;
    if (jr < 0 || jr > 7 || jc < 0 || jc > 7 || board[jr][jc]) continue;
    jumps.push({ to: [jr, jc], cap: [mr, mc] });
  }
  return jumps;
}

function getNormals(board, r, c) {
  const p = board[r][c]; if (!p) return [];
  return dirs(p)
    .map(([dr, dc]) => [r + dr, c + dc])
    .filter(([nr, nc]) => nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && !board[nr][nc]);
}

// All multi-jump chains from a position
function jumpChains(board, r, c, visited = new Set()) {
  const jumps = getJumps(board, r, c).filter(j => !visited.has(`${j.cap[0]},${j.cap[1]}`));
  if (!jumps.length) return [[]];
  const chains = [];
  for (const j of jumps) {
    const b2 = board.map(row => [...row]);
    const p = b2[r][c];
    b2[j.to[0]][j.to[1]] = promote(p, j.to[0]);
    b2[r][c] = null; b2[j.cap[0]][j.cap[1]] = null;
    const v2 = new Set(visited); v2.add(`${j.cap[0]},${j.cap[1]}`);
    for (const rest of jumpChains(b2, j.to[0], j.to[1], v2))
      chains.push([j, ...rest]);
  }
  return chains.length ? chains : [[]];
}

function promote(p, row) {
  if (p === 'b' && row === 0) return 'B';
  if (p === 'r' && row === 7) return 'R';
  return p;
}

function applyChain(board, r, c, chain) {
  let b = board.map(row => [...row]);
  let cr = r, cc = c;
  for (const step of chain) {
    b[step.cap[0]][step.cap[1]] = null;
    b[step.to[0]][step.to[1]] = promote(b[cr][cc], step.to[0]);
    b[cr][cc] = null;
    cr = step.to[0]; cc = step.to[1];
  }
  return b;
}

function applyNormal(board, r, c, tr, tc) {
  const b = board.map(row => [...row]);
  b[tr][tc] = promote(b[r][c], tr);
  b[r][c] = null;
  return b;
}

function allMoves(board, player) {
  const jumps = [], normals = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (pColor(board[r][c]) === player) {
        const chains = jumpChains(board, r, c).filter(ch => ch.length > 0);
        chains.forEach(ch => jumps.push({ r, c, type: 'jump', chain: ch }));
        if (!chains.length) getNormals(board, r, c).forEach(([tr, tc]) =>
          normals.push({ r, c, type: 'normal', tr, tc }));
      }
  return jumps.length ? jumps : normals;
}

function evaluate(board) {
  let s = 0;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const v = isKing(p) ? 150 : 100;
      s += pColor(p) === 'red' ? v : -v;
    }
  return s;
}

function minimax(board, depth, alpha, beta, isMax) {
  const player = isMax ? 'red' : 'black';
  const moves = allMoves(board, player);
  if (!depth || !moves.length) return { score: evaluate(board), move: null };
  let best = isMax ? -Infinity : Infinity, bestMove = null;
  for (const m of moves) {
    const nb = m.type === 'jump' ? applyChain(board, m.r, m.c, m.chain) : applyNormal(board, m.r, m.c, m.tr, m.tc);
    const { score } = minimax(nb, depth - 1, alpha, beta, !isMax);
    if (isMax ? score > best : score < best) { best = score; bestMove = m; }
    if (isMax) alpha = Math.max(alpha, best); else beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return { score: best, move: bestMove };
}

function countPieces(board) {
  let r = 0, b = 0;
  for (let row = 0; row < 8; row++)
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'r' || board[row][col] === 'R') r++;
      if (board[row][col] === 'b' || board[row][col] === 'B') b++;
    }
  return { red: r, black: b };
}

export default function CheckersGame({ onBack, game }) {
  const [mode, setMode] = useState(null); // 'ai' | '2p'
  const [board, setBoard] = useState(initBoard());
  const [turn, setTurn] = useState('black'); // black = human (bottom)
  const [selected, setSelected] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState('playing');
  const [thinking, setThinking] = useState(false);
  const [scores, setScores] = useState({ black: 0, red: 0 });

  const resetGame = useCallback((m) => {
    setMode(m); setBoard(initBoard()); setTurn('black');
    setSelected(null); setHighlights([]); setStatus('playing'); setThinking(false);
  }, []);

  // AI move
  useEffect(() => {
    if (mode !== 'ai' || turn !== 'red' || status !== 'playing') return;
    setThinking(true);
    const timer = setTimeout(() => {
      const { move } = minimax(board, 4, -Infinity, Infinity, true);
      if (!move) { setStatus('black-wins'); setScores(s => ({ ...s, black: s.black + 1 })); setThinking(false); return; }
      const nb = move.type === 'jump' ? applyChain(board, move.r, move.c, move.chain) : applyNormal(board, move.r, move.c, move.tr, move.tc);
      setBoard(nb);
      const moves = allMoves(nb, 'black');
      if (!moves.length) { setStatus('red-wins'); setScores(s => ({ ...s, red: s.red + 1 })); }
      else setTurn('black');
      setThinking(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [board, turn, mode, status]);

  const handleClick = (r, c) => {
    if (status !== 'playing' || thinking) return;
    if (mode === 'ai' && turn === 'red') return;

    const moves = allMoves(board, turn);

    if (selected) {
      // Try to apply move to (r, c)
      const jumpMove = moves.find(m => m.type === 'jump' && m.r === selected[0] && m.c === selected[1] && m.chain[0].to[0] === r && m.chain[0].to[1] === c);
      const normalMove = moves.find(m => m.type === 'normal' && m.r === selected[0] && m.c === selected[1] && m.tr === r && m.tc === c);

      if (jumpMove) {
        const nb = applyChain(board, jumpMove.r, jumpMove.c, jumpMove.chain);
        setBoard(nb); setSelected(null); setHighlights([]);
        const next = turn === 'black' ? 'red' : 'black';
        const nextMoves = allMoves(nb, next);
        if (!nextMoves.length) {
          setStatus(turn === 'black' ? 'black-wins' : 'red-wins');
          setScores(s => ({ ...s, [turn === 'black' ? 'black' : 'red']: s[turn === 'black' ? 'black' : 'red'] + 1 }));
        } else setTurn(next);
        return;
      }
      if (normalMove) {
        const nb = applyNormal(board, normalMove.r, normalMove.c, normalMove.tr, normalMove.tc);
        setBoard(nb); setSelected(null); setHighlights([]);
        const next = turn === 'black' ? 'red' : 'black';
        const nextMoves = allMoves(nb, next);
        if (!nextMoves.length) {
          setStatus(turn === 'black' ? 'black-wins' : 'red-wins');
          setScores(s => ({ ...s, [turn === 'black' ? 'black' : 'red']: s[turn === 'black' ? 'black' : 'red'] + 1 }));
        } else setTurn(next);
        return;
      }
    }

    // Select piece
    if (board[r][c] && pColor(board[r][c]) === turn) {
      setSelected([r, c]);
      const pieceMoves = moves.filter(m => m.r === r && m.c === c);
      const hl = pieceMoves.map(m => m.type === 'jump' ? m.chain[0].to : [m.tr, m.tc]);
      setHighlights(hl);
    } else {
      setSelected(null); setHighlights([]);
    }
  };

  const counts = countPieces(board);

  if (!mode) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 to-red-900">
      <GameHeader game={game} onBack={onBack} />
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4 text-center">
        <div className="text-6xl">🔴</div>
        <h2 className="text-white text-3xl font-black">Checkers</h2>
        <p className="text-white/70">Classic draughts — jump and capture all opponent pieces!</p>
        <div className="flex gap-4">
          <button onClick={() => resetGame('ai')} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl">
            🤖 vs AI
          </button>
          <button onClick={() => resetGame('2p')} className="bg-green-600 hover:bg-green-500 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl">
            👥 2 Players
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 to-red-900">
      <GameHeader game={game} onBack={() => setMode(null)}
        extra={<span className="text-white font-bold text-sm">⚫{counts.black} 🔴{counts.red}</span>} />

      {/* Score */}
      <div className="flex justify-center gap-6 py-2 text-white text-sm font-bold">
        <span>⚫ Black: {scores.black}</span>
        <span>🔴 Red: {scores.red}</span>
      </div>

      {/* Turn indicator */}
      <div className="text-center py-1">
        {status === 'playing' && (
          <span className={`text-sm font-bold px-4 py-1 rounded-full ${turn === 'black' ? 'bg-gray-800 text-white' : 'bg-red-600 text-white'}`}>
            {thinking ? '🤖 AI thinking...' : turn === 'black' ? (mode === 'ai' ? '⚫ Your turn' : '⚫ Black\'s turn') : '🔴 Red\'s turn'}
          </span>
        )}
        {status !== 'playing' && (
          <span className="text-yellow-300 font-black text-lg">
            {status === 'black-wins' ? '⚫ Black Wins! 🎉' : '🔴 Red Wins! 🎉'}
          </span>
        )}
      </div>

      {/* Board */}
      <div className="flex justify-center px-2 py-2">
        <div className="border-4 border-amber-700 rounded-lg overflow-hidden shadow-2xl"
             style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', width: Math.min(window.innerWidth - 24, 400) }}>
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 8 }, (_, c) => {
              const isDark = (r + c) % 2 === 1;
              const piece = board[r][c];
              const isSel = selected && selected[0] === r && selected[1] === c;
              const isHL = highlights.some(([hr, hc]) => hr === r && hc === c);
              const cellSize = Math.floor(Math.min(window.innerWidth - 24, 400) / 8);
              return (
                <div key={`${r}-${c}`}
                  onClick={() => isDark && handleClick(r, c)}
                  style={{ width: cellSize, height: cellSize }}
                  className={`flex items-center justify-center relative
                    ${isDark ? 'bg-amber-900' : 'bg-amber-100'}
                    ${isSel ? 'ring-4 ring-yellow-400 ring-inset' : ''}
                    ${isHL ? 'bg-yellow-600/70' : ''}
                    ${isDark ? 'cursor-pointer' : ''}`}>
                  {isHL && !piece && <div className="w-3 h-3 rounded-full bg-yellow-300 opacity-70" />}
                  {piece && (
                    <div className={`rounded-full border-4 flex items-center justify-center font-black text-sm select-none transition-transform
                      ${isSel ? 'scale-110' : 'hover:scale-105'}
                      ${pColor(piece) === 'red' ? 'bg-red-500 border-red-300 text-red-100' : 'bg-gray-800 border-gray-600 text-gray-300'}`}
                      style={{ width: cellSize * 0.75, height: cellSize * 0.75 }}>
                      {isKing(piece) ? '♔' : ''}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {status !== 'playing' && (
        <div className="flex justify-center gap-3 pt-3 pb-6">
          <button onClick={() => resetGame(mode)} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-6 py-2 rounded-xl transition-all hover:scale-105">
            Play Again
          </button>
          <button onClick={() => setMode(null)} className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-2 rounded-xl transition-all">
            Menu
          </button>
        </div>
      )}
    </div>
  );
}
