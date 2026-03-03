import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

// Pieces: { type: 'P'|'N'|'B'|'R'|'Q'|'K', color: 'w'|'b' }
const VALS = { P: 10, N: 30, B: 30, R: 50, Q: 90, K: 900 };
const SYMBOLS = { wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙', bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟' };

function initBoard() {
  const b = Array.from({ length: 8 }, () => Array(8).fill(null));
  const back = ['R','N','B','Q','K','B','N','R'];
  back.forEach((t, c) => { b[0][c] = { type: t, color: 'b' }; b[7][c] = { type: t, color: 'w' }; });
  for (let c = 0; c < 8; c++) { b[1][c] = { type: 'P', color: 'b' }; b[6][c] = { type: 'P', color: 'w' }; }
  return b;
}

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

function rawMoves(board, r, c, epSquare) {
  const piece = board[r][c]; if (!piece) return [];
  const { type, color } = piece;
  const opp = color === 'w' ? 'b' : 'w';
  const moves = [];

  const slide = (dirs) => dirs.forEach(([dr, dc]) => {
    let nr = r + dr, nc = c + dc;
    while (inBounds(nr, nc)) {
      if (!board[nr][nc]) { moves.push([nr, nc]); }
      else { if (board[nr][nc].color === opp) moves.push([nr, nc]); break; }
      nr += dr; nc += dc;
    }
  });

  if (type === 'P') {
    const dir = color === 'w' ? -1 : 1;
    const start = color === 'w' ? 6 : 1;
    if (inBounds(r + dir, c) && !board[r + dir][c]) {
      moves.push([r + dir, c]);
      if (r === start && !board[r + 2 * dir][c]) moves.push([r + 2 * dir, c]);
    }
    [[-1], [1]].forEach(([dc]) => {
      const nr = r + dir, nc = c + dc;
      if (inBounds(nr, nc)) {
        if (board[nr][nc]?.color === opp) moves.push([nr, nc]);
        if (epSquare && epSquare[0] === nr && epSquare[1] === nc) moves.push([nr, nc, 'ep']);
      }
    });
  } else if (type === 'N') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc) && board[nr][nc]?.color !== color) moves.push([nr, nc]);
    });
  } else if (type === 'B') slide([[-1,-1],[-1,1],[1,-1],[1,1]]);
  else if (type === 'R') slide([[-1,0],[1,0],[0,-1],[0,1]]);
  else if (type === 'Q') slide([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
  else if (type === 'K') {
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc) && board[nr][nc]?.color !== color) moves.push([nr, nc]);
    });
  }
  return moves;
}

function findKing(board, color) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.type === 'K' && board[r][c]?.color === color) return [r, c];
  return null;
}

function isAttacked(board, r, c, byColor) {
  for (let pr = 0; pr < 8; pr++)
    for (let pc = 0; pc < 8; pc++)
      if (board[pr][pc]?.color === byColor)
        if (rawMoves(board, pr, pc, null).some(([mr, mc]) => mr === r && mc === c)) return true;
  return false;
}

function applyMove(board, fr, fc, tr, tc, flag) {
  const b = board.map(row => row.map(p => p ? { ...p } : null));
  const piece = b[fr][fc];
  b[tr][tc] = piece; b[fr][fc] = null;
  if (flag === 'ep') b[fr][tc] = null; // remove captured pawn
  if (piece.type === 'P' && (tr === 0 || tr === 7)) b[tr][tc] = { type: 'Q', color: piece.color }; // auto-promote
  return b;
}

function legalMoves(board, r, c, epSquare, castling) {
  const piece = board[r][c]; if (!piece) return [];
  const color = piece.color;
  const opp = color === 'w' ? 'b' : 'w';
  const moves = rawMoves(board, r, c, epSquare);
  const legal = [];

  for (const [tr, tc, flag] of moves) {
    const nb = applyMove(board, r, c, tr, tc, flag);
    const king = findKing(nb, color);
    if (king && !isAttacked(nb, king[0], king[1], opp)) legal.push([tr, tc, flag]);
  }

  // Castling
  if (piece.type === 'K' && !isAttacked(board, r, c, opp)) {
    const row = color === 'w' ? 7 : 0;
    if (r === row && c === 4) {
      // Kingside
      if (castling[color + 'K'] && !board[row][5] && !board[row][6] &&
          !isAttacked(board, row, 5, opp) && !isAttacked(board, row, 6, opp))
        legal.push([row, 6, 'castle-k']);
      // Queenside
      if (castling[color + 'Q'] && !board[row][3] && !board[row][2] && !board[row][1] &&
          !isAttacked(board, row, 3, opp) && !isAttacked(board, row, 2, opp))
        legal.push([row, 2, 'castle-q']);
    }
  }
  return legal;
}

function applyCastle(board, color, side) {
  const b = board.map(row => row.map(p => p ? { ...p } : null));
  const row = color === 'w' ? 7 : 0;
  if (side === 'k') {
    b[row][6] = b[row][4]; b[row][4] = null;
    b[row][5] = b[row][7]; b[row][7] = null;
  } else {
    b[row][2] = b[row][4]; b[row][4] = null;
    b[row][3] = b[row][0]; b[row][0] = null;
  }
  return b;
}

function getAllLegalMoves(board, color, epSquare, castling) {
  const moves = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.color === color)
        legalMoves(board, r, c, epSquare, castling).forEach(([tr, tc, flag]) =>
          moves.push({ fr: r, fc: c, tr, tc, flag }));
  return moves;
}

function evaluate(board) {
  let score = 0;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const v = VALS[p.type];
      score += p.color === 'w' ? v : -v;
    }
  return score;
}

function minimax(board, depth, alpha, beta, isMax, epSquare, castling) {
  const color = isMax ? 'w' : 'b';
  const moves = getAllLegalMoves(board, color, epSquare, castling);
  if (!depth || !moves.length) return { score: evaluate(board), move: null };

  let best = isMax ? -Infinity : Infinity, bestMove = null;
  for (const m of moves) {
    let nb;
    if (m.flag === 'castle-k') nb = applyCastle(board, color, 'k');
    else if (m.flag === 'castle-q') nb = applyCastle(board, color, 'q');
    else nb = applyMove(board, m.fr, m.fc, m.tr, m.tc, m.flag);
    const ep2 = (board[m.fr][m.fc]?.type === 'P' && Math.abs(m.tr - m.fr) === 2)
      ? [(m.fr + m.tr) / 2, m.fc] : null;
    const { score } = minimax(nb, depth - 1, alpha, beta, !isMax, ep2, castling);
    if (isMax ? score > best : score < best) { best = score; bestMove = m; }
    if (isMax) alpha = Math.max(alpha, best); else beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return { score: best, move: bestMove };
}

export default function ChessGame({ onBack, game }) {
  const [mode, setMode] = useState(null);
  const [board, setBoard] = useState(initBoard());
  const [turn, setTurn] = useState('w');
  const [selected, setSelected] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [epSquare, setEpSquare] = useState(null);
  const [castling, setCastling] = useState({ wK: true, wQ: true, bK: true, bQ: true });
  const [status, setStatus] = useState('playing'); // 'playing'|'check'|'checkmate'|'stalemate'
  const [thinking, setThinking] = useState(false);
  const [scores, setScores] = useState({ w: 0, b: 0 });
  const [lastMove, setLastMove] = useState(null);

  const resetGame = useCallback((m) => {
    setMode(m); setBoard(initBoard()); setTurn('w');
    setSelected(null); setHighlights([]); setEpSquare(null);
    setCastling({ wK: true, wQ: true, bK: true, bQ: true });
    setStatus('playing'); setThinking(false); setLastMove(null);
  }, []);

  const checkStatus = useCallback((b, t, ep, cast) => {
    const opp = t === 'w' ? 'b' : 'w';
    const king = findKing(b, t);
    if (!king) return 'playing';
    const inCheck = isAttacked(b, king[0], king[1], opp);
    const moves = getAllLegalMoves(b, t, ep, cast);
    if (!moves.length) return inCheck ? 'checkmate' : 'stalemate';
    return inCheck ? 'check' : 'playing';
  }, []);

  // AI move
  useEffect(() => {
    if (mode !== 'ai' || turn !== 'b' || status === 'checkmate' || status === 'stalemate') return;
    setThinking(true);
    const timer = setTimeout(() => {
      const { move } = minimax(board, 3, -Infinity, Infinity, false, epSquare, castling);
      if (!move) { setThinking(false); return; }
      let nb;
      if (move.flag === 'castle-k') nb = applyCastle(board, 'b', 'k');
      else if (move.flag === 'castle-q') nb = applyCastle(board, 'b', 'q');
      else nb = applyMove(board, move.fr, move.fc, move.tr, move.tc, move.flag);
      const ep2 = (board[move.fr][move.fc]?.type === 'P' && Math.abs(move.tr - move.fr) === 2)
        ? [(move.fr + move.tr) / 2, move.fc] : null;
      const newCast = { ...castling };
      if (move.fr === 0 && move.fc === 4) { newCast.bK = false; newCast.bQ = false; }
      if (move.fr === 0 && move.fc === 0) newCast.bQ = false;
      if (move.fr === 0 && move.fc === 7) newCast.bK = false;
      setBoard(nb); setEpSquare(ep2); setCastling(newCast);
      setLastMove([move.fr, move.fc, move.tr, move.tc]);
      const s = checkStatus(nb, 'w', ep2, newCast);
      setStatus(s);
      if (s === 'checkmate') setScores(sc => ({ ...sc, b: sc.b + 1 }));
      setTurn('w'); setThinking(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [board, turn, mode, status, epSquare, castling, checkStatus]);

  const handleClick = (r, c) => {
    if (status === 'checkmate' || status === 'stalemate' || thinking) return;
    if (mode === 'ai' && turn === 'b') return;

    if (selected) {
      const move = highlights.find(([tr, tc]) => tr === r && tc === c);
      if (move) {
        const [tr, tc, flag] = move;
        let nb;
        if (flag === 'castle-k') nb = applyCastle(board, turn, 'k');
        else if (flag === 'castle-q') nb = applyCastle(board, turn, 'q');
        else nb = applyMove(board, selected[0], selected[1], tr, tc, flag);
        const ep2 = (board[selected[0]][selected[1]]?.type === 'P' && Math.abs(tr - selected[0]) === 2)
          ? [(selected[0] + tr) / 2, selected[1]] : null;
        const newCast = { ...castling };
        if (selected[0] === 7 && selected[1] === 4) { newCast.wK = false; newCast.wQ = false; }
        if (selected[0] === 0 && selected[1] === 4) { newCast.bK = false; newCast.bQ = false; }
        if (selected[0] === 7 && selected[1] === 0) newCast.wQ = false;
        if (selected[0] === 7 && selected[1] === 7) newCast.wK = false;
        setBoard(nb); setEpSquare(ep2); setCastling(newCast);
        setLastMove([selected[0], selected[1], tr, tc]);
        const next = turn === 'w' ? 'b' : 'w';
        const s = checkStatus(nb, next, ep2, newCast);
        setStatus(s);
        if (s === 'checkmate') setScores(sc => ({ ...sc, [turn]: sc[turn] + 1 }));
        setTurn(next); setSelected(null); setHighlights([]);
        return;
      }
      setSelected(null); setHighlights([]);
    }

    if (board[r][c]?.color === turn) {
      setSelected([r, c]);
      setHighlights(legalMoves(board, r, c, epSquare, castling));
    }
  };

  if (!mode) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <GameHeader game={game} onBack={onBack} />
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4 text-center">
        <div className="text-6xl">♟</div>
        <h2 className="text-white text-3xl font-black">Chess</h2>
        <p className="text-white/70">Classic chess — checkmate the king to win!</p>
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

  const size = Math.min(window.innerWidth - 16, 420);
  const cell = Math.floor(size / 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <GameHeader game={game} onBack={() => setMode(null)}
        extra={<span className="text-white text-sm font-bold">♔{scores.w} ♚{scores.b}</span>} />

      <div className="text-center py-1">
        {status === 'playing' && (
          <span className={`text-sm font-bold px-4 py-1 rounded-full ${turn === 'w' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white border border-white/30'}`}>
            {thinking ? '🤖 Thinking...' : turn === 'w' ? (mode === 'ai' ? '♔ Your turn (White)' : '♔ White\'s turn') : '♚ Black\'s turn'}
          </span>
        )}
        {status === 'check' && <span className="text-red-400 font-black animate-pulse">⚠ {turn === 'w' ? 'White' : 'Black'} in Check!</span>}
        {status === 'checkmate' && <span className="text-yellow-400 font-black text-lg">♛ Checkmate! {turn === 'w' ? 'Black' : 'White'} wins!</span>}
        {status === 'stalemate' && <span className="text-blue-400 font-black">🤝 Stalemate! Draw.</span>}
      </div>

      <div className="flex justify-center px-2 py-2">
        <div className="border-4 border-gray-600 rounded-lg overflow-hidden shadow-2xl"
             style={{ display: 'grid', gridTemplateColumns: `repeat(8, ${cell}px)` }}>
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 8 }, (_, c) => {
              const piece = board[r][c];
              const isLight = (r + c) % 2 === 0;
              const isSel = selected && selected[0] === r && selected[1] === c;
              const isHL = highlights.some(([tr, tc]) => tr === r && tc === c);
              const isLast = lastMove && ((lastMove[0] === r && lastMove[1] === c) || (lastMove[2] === r && lastMove[3] === c));
              return (
                <div key={`${r}-${c}`}
                  onClick={() => handleClick(r, c)}
                  style={{ width: cell, height: cell }}
                  className={`flex items-center justify-center cursor-pointer relative
                    ${isLight ? 'bg-amber-100' : 'bg-amber-700'}
                    ${isSel ? 'ring-4 ring-yellow-400 ring-inset' : ''}
                    ${isLast && !isSel ? 'opacity-80 bg-yellow-500/40' : ''}
                    `}>
                  {isHL && (
                    <div className={`absolute rounded-full ${piece ? 'inset-0 ring-4 ring-green-400' : 'w-3 h-3 bg-green-500 opacity-70'}`} />
                  )}
                  {piece && (
                    <span className={`select-none z-10 leading-none transition-transform
                      ${isSel ? 'scale-110' : ''}
                      ${piece.color === 'w' ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]' : 'text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]'}`}
                      style={{ fontSize: cell * 0.75 }}>
                      {SYMBOLS[piece.color + piece.type]}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {(status === 'checkmate' || status === 'stalemate') && (
        <div className="flex justify-center gap-3 pt-2 pb-6">
          <button onClick={() => resetGame(mode)} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-6 py-2 rounded-xl transition-all hover:scale-105">
            Play Again
          </button>
          <button onClick={() => setMode(null)} className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-2 rounded-xl">
            Menu
          </button>
        </div>
      )}
    </div>
  );
}
