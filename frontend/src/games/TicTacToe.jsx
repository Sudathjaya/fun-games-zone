import React, { useState, useEffect } from 'react';
import GameHeader from '../components/GameHeader';
import AdBanner from '../components/AdBanner';

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],         // diags
];

function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function getBestMove(board, player) {
  // Simple AI: win if possible, block if needed, else random
  const opponent = player === 'X' ? 'O' : 'X';
  const empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
  if (empty.length === 0) return null;

  // Try to win
  for (const idx of empty) {
    const test = [...board];
    test[idx] = player;
    if (checkWinner(test)) return idx;
  }
  // Try to block
  for (const idx of empty) {
    const test = [...board];
    test[idx] = opponent;
    if (checkWinner(test)) return idx;
  }
  // Take center
  if (board[4] === null) return 4;
  // Random
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function TicTacToe({ onBack, game }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [mode, setMode] = useState('ai'); // 'ai' or '2p'
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });
  const [winLine, setWinLine] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setResult(null);
    setWinLine(null);
    setAiThinking(false);
  };

  // AI move
  useEffect(() => {
    if (mode !== 'ai' || isX || result) return;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const move = getBestMove(board, 'O');
      if (move !== null) {
        const newBoard = [...board];
        newBoard[move] = 'O';
        setBoard(newBoard);
        const res = checkWinner(newBoard);
        if (res) {
          setResult(res.winner);
          setWinLine(res.line);
          setScores(s => ({ ...s, [res.winner]: s[res.winner] + 1 }));
        } else if (newBoard.every(Boolean)) {
          setResult('Draw');
          setScores(s => ({ ...s, Draw: s.Draw + 1 }));
        } else {
          setIsX(true);
        }
      }
      setAiThinking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [board, isX, mode, result]);

  const handleClick = (idx) => {
    if (board[idx] || result || aiThinking) return;
    if (mode === 'ai' && !isX) return; // Wait for AI
    const newBoard = [...board];
    const mark = isX ? 'X' : 'O';
    newBoard[idx] = mark;
    setBoard(newBoard);
    const res = checkWinner(newBoard);
    if (res) {
      setResult(res.winner);
      setWinLine(res.line);
      setScores(s => ({ ...s, [res.winner]: s[res.winner] + 1 }));
    } else if (newBoard.every(Boolean)) {
      setResult('Draw');
      setScores(s => ({ ...s, Draw: s.Draw + 1 }));
    } else {
      setIsX(!isX);
    }
  };

  const getCellStyle = (idx, value) => {
    const isWinCell = winLine?.includes(idx);
    const base = `w-full h-24 md:h-28 text-5xl md:text-6xl font-black rounded-2xl
                  transition-all duration-200 flex items-center justify-center
                  border-4 shadow-md`;
    if (!value) {
      return `${base} bg-white border-gray-100 hover:bg-blue-50 hover:border-blue-300
              hover:scale-105 cursor-pointer`;
    }
    if (value === 'X') {
      return `${base} ${isWinCell
        ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-700 text-white scale-105 shadow-blue-300 shadow-lg'
        : 'bg-blue-50 border-blue-200 text-blue-600'}`;
    }
    return `${base} ${isWinCell
      ? 'bg-gradient-to-br from-rose-400 to-rose-600 border-rose-700 text-white scale-105 shadow-rose-300 shadow-lg'
      : 'bg-rose-50 border-rose-200 text-rose-600'}`;
  };

  const statusMsg = result
    ? result === 'Draw' ? "It's a Draw! 🤝" : `${result === 'X' ? '🔵' : '🔴'} ${result} Wins! 🎉`
    : aiThinking
    ? '🤖 AI is thinking...'
    : `${isX ? '🔵 X' : '🔴 O'}'s Turn${mode === 'ai' && isX ? ' (Your Turn)' : ''}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <GameHeader game={game} onBack={onBack} />

      <div className="max-w-sm mx-auto px-4 py-6">
        {/* Mode selector */}
        <div className="flex gap-3 justify-center mb-6">
          {[['ai', '🤖 vs AI'], ['2p', '👥 2 Players']].map(([m, label]) => (
            <button
              key={m}
              onClick={() => { setMode(m); reset(); }}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all
                ${mode === m
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-blue-600 hover:bg-blue-50 shadow'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scoreboard */}
        <div className="flex justify-around mb-6">
          {[
            { label: '🔵 X', key: 'X', color: 'text-blue-600' },
            { label: '🤝 Draw', key: 'Draw', color: 'text-gray-500' },
            { label: '🔴 O', key: 'O', color: 'text-rose-600' },
          ].map(({ label, key, color }) => (
            <div key={key} className="text-center bg-white rounded-2xl px-5 py-3 shadow-md">
              <div className={`text-3xl font-black ${color}`}>{scores[key]}</div>
              <div className="text-xs font-bold text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className={`text-center text-lg font-bold py-3 px-4 rounded-2xl mb-6 transition-all
          ${result
            ? result === 'Draw'
              ? 'bg-gray-200 text-gray-700'
              : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
            : 'bg-white shadow text-gray-700'
          }`}>
          {statusMsg}
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((val, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              disabled={!!val || !!result || aiThinking}
              className={getCellStyle(idx, val)}
            >
              {val === 'X' && <span className="text-blue-600">✕</span>}
              {val === 'O' && <span className="text-rose-500">○</span>}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold
                       py-4 rounded-2xl transition-all hover:scale-105 shadow-lg text-lg"
          >
            🔄 New Round
          </button>
          <button
            onClick={() => { reset(); setScores({ X: 0, O: 0, Draw: 0 }); }}
            className="px-5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold
                       py-4 rounded-2xl transition-all hover:scale-105 shadow text-sm"
          >
            Reset All
          </button>
        </div>

        <div className="mt-6 bg-white/70 rounded-2xl p-4 text-center text-gray-600 text-sm">
          <strong>How to play:</strong> Take turns placing X and O. Get 3 in a row to win!
          {mode === 'ai' && ' You are X, the computer is O.'}
        </div>
        <AdBanner size="banner" slot="tictactoe-bottom" className="mt-4" />
      </div>
    </div>
  );
}
