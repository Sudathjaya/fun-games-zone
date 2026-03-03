import React, { useState, useRef } from 'react';
import GameHeader from '../components/GameHeader';
import AdBanner from '../components/AdBanner';

const LEVELS = [
  { label: '🟢 Easy', max: 20, tries: 8, icon: '🌱' },
  { label: '🟡 Medium', max: 50, tries: 10, icon: '🌿' },
  { label: '🔴 Hard', max: 100, tries: 12, icon: '🌳' },
];

function generateSecret(max) {
  return Math.floor(Math.random() * max) + 1;
}

export default function NumberGuessing({ onBack, game }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [secret, setSecret] = useState(() => generateSecret(LEVELS[0].max));
  const [input, setInput] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [totalWins, setTotalWins] = useState(0);
  const inputRef = useRef(null);

  const level = LEVELS[levelIdx];

  const newGame = (idx = levelIdx) => {
    setSecret(generateSecret(LEVELS[idx].max));
    setInput('');
    setGuesses([]);
    setWon(false);
    setLost(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const changeLevel = (idx) => {
    setLevelIdx(idx);
    newGame(idx);
  };

  const getHint = (guess) => {
    const diff = Math.abs(guess - secret);
    if (guess === secret) return { text: '🎯 Exact!', emoji: '🎯', color: 'from-green-400 to-emerald-500' };
    const dir = guess < secret ? '⬆️ Too Low!' : '⬇️ Too High!';
    if (diff <= 3) return { text: `🔥 ${dir} Very close!`, emoji: '🔥', color: 'from-orange-400 to-red-400' };
    if (diff <= 10) return { text: `🌡️ ${dir} Getting warm!`, emoji: '🌡️', color: 'from-yellow-400 to-orange-400' };
    return { text: `🧊 ${dir} Way off!`, emoji: '🧊', color: 'from-blue-400 to-cyan-400' };
  };

  const handleGuess = () => {
    const num = parseInt(input);
    if (isNaN(num) || num < 1 || num > level.max) return;
    if (guesses.some(g => g.value === num)) return;

    const hint = getHint(num);
    const newGuesses = [{ value: num, hint }, ...guesses];
    setGuesses(newGuesses);
    setInput('');

    if (num === secret) {
      setWon(true);
      setTotalWins(w => w + 1);
    } else if (newGuesses.length >= level.tries) {
      setLost(true);
    }
    inputRef.current?.focus();
  };

  const remaining = level.tries - guesses.length;
  const percentage = (guesses.length / level.tries) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <GameHeader game={game} onBack={onBack} score={`🏆 ${totalWins}`} />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Level selector */}
        <div className="flex gap-2 justify-center mb-6">
          {LEVELS.map((l, i) => (
            <button
              key={i}
              onClick={() => changeLevel(i)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all
                ${levelIdx === i
                  ? 'bg-teal-600 text-white shadow-lg scale-105'
                  : 'bg-white text-teal-700 hover:bg-teal-50 shadow'
                }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🔢</div>
            <h2 className="text-2xl font-black text-gray-800">
              Guess a number between <span className="text-teal-600">1</span> and{' '}
              <span className="text-teal-600">{level.max}</span>
            </h2>
          </div>

          {/* Tries remaining bar */}
          <div className="mb-5">
            <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
              <span>Attempts Used: {guesses.length}</span>
              <span className={remaining <= 2 ? 'text-red-500' : 'text-teal-600'}>
                {remaining} left
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500
                  ${percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-teal-500'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Input */}
          {!won && !lost && (
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="number"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGuess()}
                min={1}
                max={level.max}
                placeholder={`1 – ${level.max}`}
                className="flex-1 border-4 border-teal-300 focus:border-teal-500
                           rounded-2xl px-4 py-4 text-2xl font-bold text-center
                           outline-none transition-all text-gray-800"
                autoFocus
              />
              <button
                onClick={handleGuess}
                className="bg-gradient-to-r from-teal-500 to-emerald-500
                           text-white font-black text-xl px-6 py-4 rounded-2xl
                           hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                Guess!
              </button>
            </div>
          )}

          {/* Result */}
          {(won || lost) && (
            <div className={`text-center rounded-2xl p-6 mt-4
              ${won ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : 'bg-gradient-to-r from-red-400 to-rose-500'} text-white`}>
              <div className="text-5xl mb-2">{won ? '🎉' : '😢'}</div>
              <h3 className="text-2xl font-black mb-1">
                {won ? 'Correct!' : 'Game Over!'}
              </h3>
              <p className="text-lg">
                {won
                  ? `You got it in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}!`
                  : `The number was ${secret}`}
              </p>
              <button
                onClick={() => newGame()}
                className="mt-4 bg-white font-black text-lg px-8 py-3 rounded-2xl
                           hover:scale-105 active:scale-95 transition-all shadow-lg
                           text-emerald-600"
              >
                Play Again!
              </button>
            </div>
          )}
        </div>

        {/* Guess History */}
        {guesses.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {guesses.map((g, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-2xl text-white font-bold
                  bg-gradient-to-r ${g.hint.color} shadow-md`}
              >
                <span className="text-2xl">{g.hint.emoji}</span>
                <span className="text-2xl font-black w-16 text-center">{g.value}</span>
                <span className="flex-1 text-sm">{g.hint.text}</span>
                <span className="text-sm opacity-75">#{guesses.length - i}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-white/70 rounded-2xl p-4 text-center text-gray-600 text-sm">
          <strong>How to play:</strong> Guess the secret number! After each guess you'll get a hot or cold hint.
          Find it within {level.tries} tries!
        </div>
        <AdBanner size="banner" slot="number-bottom" className="mt-4" />
      </div>
    </div>
  );
}
