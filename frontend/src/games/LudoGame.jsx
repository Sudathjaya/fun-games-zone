import React, { useState, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

// Ludo: 4 colors — Red(0), Green(1), Yellow(2), Blue(3)
// Each player has 4 tokens. Token path: 52 squares + 6-square home path
// Safe squares: 0,8,13,21,26,34,39,47 (standard safe positions)

const COLORS = ['red', 'green', 'yellow', 'blue'];
const COLOR_STYLES = {
  red:    { bg: 'bg-red-500',    light: 'bg-red-100',    text: 'text-red-600',    border: 'border-red-500',    name: 'Red'    },
  green:  { bg: 'bg-green-500',  light: 'bg-green-100',  text: 'text-green-600',  border: 'border-green-500',  name: 'Green'  },
  yellow: { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-500', name: 'Yellow' },
  blue:   { bg: 'bg-blue-500',   light: 'bg-blue-100',   text: 'text-blue-600',   border: 'border-blue-500',   name: 'Blue'   },
};

// Start squares for each color on main path (0-indexed)
const START_SQUARES = { red: 0, green: 13, yellow: 26, blue: 39 };
// Home path entry square for each color
const HOME_ENTRY = { red: 51, green: 12, yellow: 25, blue: 38 };
const SAFE_SQUARES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

function initTokens() {
  const tokens = {};
  COLORS.forEach(c => {
    tokens[c] = Array.from({ length: 4 }, (_, i) => ({
      id: i, color: c,
      pos: -1,      // -1 = home base, 0-51 = main board, 52-57 = home path, 58 = finished
      mainPos: -1,  // position on main track 0-51
    }));
  });
  return tokens;
}

// Get absolute main track position for a token given its color-relative position
function absolutePos(relPos, color) {
  return (START_SQUARES[color] + relPos) % 52;
}

function relativePos(absPos, color) {
  return (absPos - START_SQUARES[color] + 52) % 52;
}

function rollDice() { return Math.floor(Math.random() * 6) + 1; }

export default function LudoGame({ onBack, game }) {
  const [numPlayers, setNumPlayers] = useState(null);
  const [tokens, setTokens] = useState(initTokens());
  const [turn, setTurn] = useState(0); // index into activePlayers
  const [activePlayers, setActivePlayers] = useState([]);
  const [dice, setDice] = useState(null);
  const [rolled, setRolled] = useState(false);
  const [movableTokens, setMovableTokens] = useState([]);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState('');
  const [sixCount, setSixCount] = useState(0);

  const startGame = useCallback((n) => {
    setNumPlayers(n);
    const players = COLORS.slice(0, n);
    setActivePlayers(players);
    setTokens(initTokens());
    setTurn(0); setDice(null); setRolled(false);
    setMovableTokens([]); setWinner(null); setMessage('');
    setSixCount(0);
  }, []);

  const getMovable = useCallback((tkns, player, diceVal) => {
    const movable = [];
    tkns[player].forEach(token => {
      if (token.pos === 58) return; // finished
      if (token.pos === -1) {
        if (diceVal === 6) movable.push(token.id); // can enter board
      } else {
        const rel = relativePos(token.pos, player);
        const newRel = rel + diceVal;
        if (newRel <= 57) movable.push(token.id); // 52-57 = home path slots
      }
    });
    return movable;
  }, []);

  const handleRoll = useCallback(() => {
    if (rolled || winner) return;
    const val = rollDice();
    setDice(val);
    const player = activePlayers[turn];
    const movable = getMovable(tokens, player, val);

    if (val === 6) {
      const newSix = sixCount + 1;
      setSixCount(newSix);
      if (newSix >= 3) {
        setMessage('Three 6s in a row! Turn passes.');
        setSixCount(0); setRolled(false); setDice(null);
        setTurn(t => (t + 1) % activePlayers.length);
        return;
      }
    } else {
      setSixCount(0);
    }

    setRolled(true);
    if (!movable.length) {
      setMessage('No moves available. Turn passes.');
      setTimeout(() => {
        setMessage(''); setRolled(false); setDice(null);
        if (val !== 6) setTurn(t => (t + 1) % activePlayers.length);
      }, 1200);
    } else {
      setMovableTokens(movable);
      if (movable.length === 1) {
        // Auto-move if only one option
        setTimeout(() => moveToken(movable[0], val, tokens, player), 400);
      }
    }
  }, [rolled, winner, activePlayers, turn, tokens, sixCount, getMovable]);

  const moveToken = useCallback((tokenId, diceVal, currentTokens, player) => {
    const dv = diceVal ?? dice;
    const pl = player ?? activePlayers[turn];
    setTokens(prev => {
      const next = { ...prev, [pl]: prev[pl].map(t => {
        if (t.id !== tokenId) return t;
        let newPos;
        if (t.pos === -1) {
          // Enter board
          newPos = START_SQUARES[pl];
        } else {
          const rel = relativePos(t.pos, pl);
          const newRel = rel + dv;
          if (newRel >= 52) {
            // On home path (52+ = home path 0-5, 58 = finished)
            newPos = 52 + (newRel - 52);
            if (newPos >= 58) newPos = 58;
          } else {
            newPos = absolutePos(newRel, pl);
          }
        }
        return { ...t, pos: newPos };
      })};

      // Check captures (only on main board 0-51, not safe squares)
      const movedToken = next[pl].find(t => t.id === tokenId);
      if (movedToken && movedToken.pos >= 0 && movedToken.pos < 52 && !SAFE_SQUARES.has(movedToken.pos)) {
        COLORS.forEach(c => {
          if (c === pl) return;
          next[c] = next[c].map(t => {
            if (t.pos === movedToken.pos) {
              setMessage(`${COLOR_STYLES[pl].name} captures ${COLOR_STYLES[c].name}!`);
              return { ...t, pos: -1 };
            }
            return t;
          });
        });
      }

      // Check win
      if (next[pl].every(t => t.pos === 58)) {
        setWinner(pl);
      }
      return next;
    });

    setMovableTokens([]);
    setRolled(false);
    setTimeout(() => setMessage(''), 1500);

    if (dv !== 6) {
      setTurn(t => (t + 1) % activePlayers.length);
    }
    setDice(null);
  }, [dice, activePlayers, turn]);

  if (!numPlayers) return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-yellow-600 to-green-700">
      <GameHeader game={game} onBack={onBack} />
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4 text-center">
        <div className="text-6xl">🎲</div>
        <h2 className="text-white text-3xl font-black">Ludo</h2>
        <p className="text-white/70">Classic board game! Get all 4 tokens home to win.</p>
        <p className="text-white/50 text-sm">Roll 6 to enter the board. Land on opponent to send them home!</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {[2, 3, 4].map(n => (
            <button key={n} onClick={() => startGame(n)}
              className="bg-white text-gray-900 font-black px-8 py-4 rounded-2xl text-xl transition-all hover:scale-105 shadow-xl">
              {n} Players
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const currentPlayer = activePlayers[turn];
  const cs = COLOR_STYLES[currentPlayer];

  // Token display helper
  const TokenPiece = ({ token, onClick, highlight }) => (
    <button
      onClick={onClick}
      disabled={!highlight}
      className={`rounded-full border-4 font-black text-white text-xs flex items-center justify-center
                  transition-all ${highlight ? 'animate-bounce cursor-pointer ring-4 ring-yellow-300 scale-125' : ''}
                  ${COLOR_STYLES[token.color].bg} border-white/50`}
      style={{ width: 28, height: 28 }}>
      {token.pos === 58 ? '★' : token.id + 1}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <GameHeader game={game} onBack={() => setNumPlayers(null)}
        extra={<span className={`font-black text-sm px-2 py-1 rounded-lg ${cs.bg} text-white`}>{cs.name}'s turn</span>} />

      {message && (
        <div className="text-center py-1">
          <span className="text-yellow-300 font-bold text-sm animate-pulse">{message}</span>
        </div>
      )}

      {winner && (
        <div className="text-center py-2">
          <span className={`text-2xl font-black ${COLOR_STYLES[winner].text} bg-white px-4 py-1 rounded-xl`}>
            🏆 {COLOR_STYLES[winner].name} Wins!
          </span>
        </div>
      )}

      {/* Token status for all players */}
      <div className="flex justify-center gap-2 px-3 py-2 flex-wrap">
        {activePlayers.map(p => {
          const finished = tokens[p].filter(t => t.pos === 58).length;
          const onBoard = tokens[p].filter(t => t.pos >= 0 && t.pos !== 58).length;
          return (
            <div key={p} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-bold
                                      ${p === currentPlayer ? `${COLOR_STYLES[p].border} ${COLOR_STYLES[p].light} ${COLOR_STYLES[p].text}` : 'border-white/20 text-white/60'}`}>
              <div className={`w-3 h-3 rounded-full ${COLOR_STYLES[p].bg}`} />
              {COLOR_STYLES[p].name}: {finished}/4 ★
            </div>
          );
        })}
      </div>

      {/* Tokens per player (home base + board) */}
      <div className="grid grid-cols-2 gap-3 px-4 max-w-lg mx-auto py-2">
        {activePlayers.map(p => (
          <div key={p} className={`rounded-2xl p-3 border-2 ${p === currentPlayer ? COLOR_STYLES[p].border : 'border-white/10'} bg-white/5`}>
            <div className={`text-xs font-black mb-2 ${COLOR_STYLES[p].text}`}>{COLOR_STYLES[p].name}</div>
            <div className="flex gap-2 flex-wrap">
              {tokens[p].map(token => (
                <div key={token.id} className="flex flex-col items-center gap-0.5">
                  <TokenPiece
                    token={token}
                    highlight={p === currentPlayer && movableTokens.includes(token.id)}
                    onClick={() => p === currentPlayer && movableTokens.includes(token.id) && moveToken(token.id)}
                  />
                  <span className="text-white/40 text-xs">
                    {token.pos === -1 ? 'Base' : token.pos === 58 ? 'Done' : token.pos >= 52 ? `H${token.pos - 51}` : token.pos}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Dice & Roll */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className={`w-20 h-20 rounded-2xl ${cs.bg} text-white font-black text-5xl flex items-center justify-center shadow-2xl border-4 border-white/30`}>
          {dice ? ['⚀','⚁','⚂','⚃','⚄','⚅'][dice - 1] : '🎲'}
        </div>

        {!winner && (
          <button
            onClick={handleRoll}
            disabled={rolled || !!winner}
            className={`font-black px-10 py-4 rounded-2xl text-xl shadow-xl transition-all hover:scale-105 active:scale-95
                        ${rolled ? 'opacity-40 cursor-not-allowed bg-gray-600 text-white' : `${cs.bg} text-white`}`}>
            {rolled ? 'Select a token ↑' : `Roll Dice`}
          </button>
        )}

        {winner && (
          <div className="flex gap-3">
            <button onClick={() => startGame(numPlayers)} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-6 py-2 rounded-xl transition-all hover:scale-105">
              Play Again
            </button>
            <button onClick={() => setNumPlayers(null)} className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-2 rounded-xl">
              Menu
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-white/30 text-xs pb-4 px-4">
        Roll 6 to enter board • Land on opponent to capture • Reach 58 to finish
      </div>
    </div>
  );
}
