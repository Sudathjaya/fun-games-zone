import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from '../components/GameHeader';
import AdBanner from '../components/AdBanner';

const EMOJI_SETS = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  fruits:  ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🥝', '🍒'],
  faces:   ['😀', '😂', '😍', '🤩', '😎', '🥳', '🤔', '😴'],
  sports:  ['⚽', '🏀', '🎾', '🏐', '🎱', '🏓', '🏸', '🥊'],
};

function createCards(emojis) {
  const pairs = [...emojis, ...emojis];
  return pairs
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
}

export default function MemoryMatch({ onBack, game }) {
  const [category, setCategory] = useState('animals');
  const [cards, setCards] = useState(() => createCards(EMOJI_SETS.animals));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [checking, setChecking] = useState(false);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);

  const totalPairs = cards.length / 2;

  // Timer
  useEffect(() => {
    if (!started || won) return;
    const t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, won]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  const newGame = useCallback((cat = category) => {
    setCards(createCards(EMOJI_SETS[cat]));
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setChecking(false);
    setWon(false);
    setTime(0);
    setStarted(false);
  }, [category]);

  const changeCategory = (cat) => {
    setCategory(cat);
    newGame(cat);
  };

  const handleCardClick = (idx) => {
    if (checking || cards[idx].flipped || cards[idx].matched || won) return;
    if (!started) setStarted(true);
    if (flipped.length === 2) return;

    const newCards = [...cards];
    newCards[idx] = { ...newCards[idx], flipped: true };
    setCards(newCards);
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setChecking(true);
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        // Match!
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[a] = { ...updated[a], matched: true };
            updated[b] = { ...updated[b], matched: true };
            return updated;
          });
          const newMatches = matches + 1;
          setMatches(newMatches);
          if (newMatches === totalPairs) setWon(true);
          setFlipped([]);
          setChecking(false);
        }, 500);
      } else {
        // No match — flip back
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[a] = { ...updated[a], flipped: false };
            updated[b] = { ...updated[b], flipped: false };
            return updated;
          });
          setFlipped([]);
          setChecking(false);
        }, 1000);
      }
    }
  };

  const score = Math.max(0, totalPairs * 100 - (moves - totalPairs) * 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <GameHeader
        game={game}
        onBack={onBack}
        score={`${matches}/${totalPairs}`}
        extra={
          <div className="bg-white/20 rounded-xl px-4 py-2 font-bold text-white">
            ⏱ {formatTime(time)}
          </div>
        }
      />

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Category selector */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {Object.keys(EMOJI_SETS).map(cat => (
            <button
              key={cat}
              onClick={() => changeCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm capitalize transition-all
                ${category === cat
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-purple-700 hover:bg-purple-100 shadow'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Ad banner above game */}
        <AdBanner size="small" slot="memory-top" className="mb-4" />

        {/* Stats bar */}
        <div className="flex justify-center gap-3 sm:gap-6 mb-4">
          {[
            { label: 'Moves', value: moves },
            { label: 'Pairs', value: `${matches}/${totalPairs}` },
            { label: 'Score', value: won ? score : '...' },
          ].map(s => (
            <div key={s.label} className="text-center bg-white rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-md flex-1 max-w-[100px]">
              <div className="text-lg sm:text-2xl font-black text-purple-700">{s.value}</div>
              <div className="text-xs text-gray-500 font-bold uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Card Grid — 4 cols always, responsive height */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={card.matched || checking}
              className={`
                relative h-16 sm:h-20 md:h-24 rounded-xl sm:rounded-2xl text-3xl sm:text-4xl font-bold
                transition-all duration-300 shadow-md
                ${card.matched
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 scale-95 opacity-80 cursor-default'
                  : card.flipped
                  ? 'bg-white border-4 border-purple-400 scale-105 shadow-lg shadow-purple-200'
                  : 'bg-gradient-to-br from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 hover:scale-105 cursor-pointer'
                }
              `}
              style={{ perspective: '1000px' }}
            >
              {card.flipped || card.matched ? (
                <span className="transition-all duration-300">{card.emoji}</span>
              ) : (
                <span className="text-white/60 text-xl sm:text-2xl">?</span>
              )}
              {card.matched && (
                <span className="absolute top-0.5 right-1 text-xs sm:text-base">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Win Screen */}
        {won && (
          <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-400
                          rounded-3xl p-8 text-center shadow-2xl animate-bounce-in">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-3xl font-black text-white mb-2">You Won!</h2>
            <p className="text-white/90 text-lg mb-2">
              {moves} moves &bull; {formatTime(time)} &bull; Score: <strong>{score}</strong>
            </p>
            <button
              onClick={() => newGame()}
              className="mt-4 bg-white text-orange-600 font-black text-xl
                         px-8 py-4 rounded-2xl hover:scale-105 active:scale-95
                         transition-all shadow-lg"
            >
              Play Again!
            </button>
          </div>
        )}

        {/* New Game button */}
        {!won && (
          <div className="text-center mt-6">
            <button
              onClick={() => newGame()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold
                         px-8 py-3 rounded-2xl transition-all hover:scale-105 shadow-lg"
            >
              🔄 New Game
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 bg-white/70 rounded-2xl p-3 sm:p-4 text-center text-gray-600 text-xs sm:text-sm">
          <strong>How to play:</strong> Click cards to flip them. Find all matching pairs to win!
          Fewer moves = higher score.
        </div>

        {/* Ad banner below game */}
        <AdBanner size="banner" slot="memory-bottom" className="mt-4" />
      </div>
    </div>
  );
}
