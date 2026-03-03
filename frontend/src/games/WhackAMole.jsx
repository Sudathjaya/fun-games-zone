import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameHeader from '../components/GameHeader';
import AdBanner from '../components/AdBanner';

const HOLE_COUNT = 9;
const GAME_DURATION = 30;
const MOLES = ['🦔', '🐹', '🐭', '🐰'];
const BOMB = '💣';

function getMoleEmoji() {
  return Math.random() < 0.15 ? BOMB : MOLES[Math.floor(Math.random() * MOLES.length)];
}

export default function WhackAMole({ onBack, game }) {
  const [holes, setHoles] = useState(Array(HOLE_COUNT).fill(null)); // null | emoji
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [running, setRunning] = useState(false);
  const [ended, setEnded] = useState(false);
  const [level, setLevel] = useState(1);
  const [miss, setMiss] = useState(0);
  const [combo, setCombo] = useState(0);
  const [popFeedback, setPopFeedback] = useState({}); // idx -> 'hit'|'bomb'

  const timerRef = useRef(null);
  const moleTimers = useRef({});

  const clearAllTimers = () => {
    clearInterval(timerRef.current);
    Object.values(moleTimers.current).forEach(t => clearTimeout(t));
    moleTimers.current = {};
  };

  const showMole = useCallback((running, level) => {
    if (!running) return;
    // Pick a random hole
    const idx = Math.floor(Math.random() * HOLE_COUNT);
    const emoji = getMoleEmoji();
    setHoles(prev => {
      if (prev[idx] !== null) return prev;
      const updated = [...prev];
      updated[idx] = emoji;
      return updated;
    });

    // Duration decreases with level
    const duration = Math.max(600, 1400 - level * 100);
    moleTimers.current[idx] = setTimeout(() => {
      setHoles(prev => {
        const updated = [...prev];
        if (updated[idx] !== null) {
          // Missed (if still there)
          setMiss(m => m + 1);
          setCombo(0);
          updated[idx] = null;
        }
        return updated;
      });
      delete moleTimers.current[idx];
    }, duration);
  }, []);

  const startGame = useCallback(() => {
    clearAllTimers();
    setHoles(Array(HOLE_COUNT).fill(null));
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setRunning(true);
    setEnded(false);
    setMiss(0);
    setCombo(0);
    setPopFeedback({});
  }, []);

  // Mole spawner
  useEffect(() => {
    if (!running) return;
    const spawnInterval = Math.max(400, 900 - level * 60);
    const spawner = setInterval(() => showMole(running, level), spawnInterval);
    return () => clearInterval(spawner);
  }, [running, level, showMole]);

  // Countdown timer
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setRunning(false);
          setEnded(true);
          setHoles(Array(HOLE_COUNT).fill(null));
          clearAllTimers();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  // Update high score
  useEffect(() => {
    if (ended && score > highScore) setHighScore(score);
  }, [ended, score, highScore]);

  // Level up every 30 points
  useEffect(() => {
    setLevel(Math.min(8, 1 + Math.floor(score / 30)));
  }, [score]);

  const whack = (idx) => {
    if (!running || holes[idx] === null) return;
    const emoji = holes[idx];
    const isBomb = emoji === BOMB;

    setHoles(prev => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
    clearTimeout(moleTimers.current[idx]);
    delete moleTimers.current[idx];

    setPopFeedback(prev => ({ ...prev, [idx]: isBomb ? 'bomb' : 'hit' }));
    setTimeout(() => setPopFeedback(prev => {
      const updated = { ...prev };
      delete updated[idx];
      return updated;
    }), 400);

    if (isBomb) {
      setScore(s => Math.max(0, s - 15));
      setCombo(0);
    } else {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const bonus = newCombo >= 3 ? Math.floor(newCombo / 3) * 5 : 0;
      setScore(s => s + 10 + bonus);
    }
  };

  const timerColor = timeLeft <= 10 ? 'text-red-400' : timeLeft <= 20 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200">
      <GameHeader
        game={game}
        onBack={onBack}
        score={`⭐ ${score}`}
        extra={
          <div className={`font-black text-xl px-4 py-2 bg-white/30 rounded-xl ${
            running ? timerColor : 'text-white'
          }`}>
            ⏱ {timeLeft}s
          </div>
        }
      />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Stats */}
        <div className="flex justify-around mb-4">
          {[
            { label: 'Level', value: level, icon: '🎯' },
            { label: 'Combo', value: combo >= 3 ? `${combo}🔥` : combo, icon: '🔥' },
            { label: 'Best', value: highScore, icon: '🏆' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl px-4 py-2 shadow text-center">
              <div className="text-lg">{s.icon}</div>
              <div className="text-xl font-black text-orange-600">{s.value}</div>
              <div className="text-xs font-bold text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Combo banner */}
        {combo >= 3 && running && (
          <div className="text-center mb-3 animate-bounce">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 text-white
                             font-black px-6 py-2 rounded-full shadow-lg text-lg">
              🔥 COMBO x{combo}! +{Math.floor(combo / 3) * 5} bonus!
            </span>
          </div>
        )}

        {/* Mole Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {holes.map((mole, idx) => (
            <button
              key={idx}
              onClick={() => whack(idx)}
              className={`relative aspect-square rounded-3xl flex items-center justify-center
                         text-5xl transition-all duration-150 select-none border-4
                         ${mole
                           ? 'bg-gradient-to-b from-amber-300 to-yellow-400 border-yellow-500 shadow-xl scale-105 cursor-pointer hover:scale-110 active:scale-95'
                           : 'bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 shadow-inner cursor-default'
                         }
                         ${popFeedback[idx] === 'hit' ? 'ring-4 ring-green-400' : ''}
                         ${popFeedback[idx] === 'bomb' ? 'ring-4 ring-red-500 animate-wiggle' : ''}
                        `}
            >
              {mole && (
                <span className={`transition-all duration-200 ${mole ? 'scale-100' : 'scale-0'}`}>
                  {mole}
                </span>
              )}
              {!mole && (
                <div className="w-12 h-8 rounded-full bg-stone-900 opacity-40" />
              )}
              {popFeedback[idx] === 'hit' && (
                <span className="absolute -top-4 -right-2 text-green-600 font-black text-base animate-bounce-in">
                  +10
                </span>
              )}
              {popFeedback[idx] === 'bomb' && (
                <span className="absolute -top-4 -right-2 text-red-500 font-black text-base animate-bounce-in">
                  -15
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Start / Game Over */}
        {!running && (
          <div className={`text-center rounded-3xl p-6 mb-4 shadow-xl
            ${ended
              ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white'
              : 'bg-white'
            }`}>
            {ended ? (
              <>
                <div className="text-5xl mb-2">🎊</div>
                <h2 className="text-3xl font-black mb-1">Time's Up!</h2>
                <p className="text-xl mb-1">Final Score: <strong>{score}</strong></p>
                {score >= highScore && score > 0 && (
                  <p className="text-yellow-200 font-bold mb-2">🏆 New High Score!</p>
                )}
                <p className="text-white/80 text-sm mb-4">
                  Missed: {miss} &bull; Reached Level: {level}
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-2">🦔</div>
                <p className="text-gray-600 mb-1 font-bold">Hit the moles, avoid bombs!</p>
                <p className="text-gray-500 text-sm mb-4">
                  Build combos for bonus points. 💣 Bombs cost 15 points!
                </p>
              </>
            )}
            <button
              onClick={startGame}
              className={`font-black text-xl px-10 py-4 rounded-2xl hover:scale-105
                         active:scale-95 transition-all shadow-lg
                         ${ended ? 'bg-white text-orange-600' : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'}`}
            >
              {ended ? '🔄 Play Again' : '▶ Start Game'}
            </button>
          </div>
        )}

        <div className="bg-white/70 rounded-2xl p-4 text-center text-gray-600 text-sm">
          <strong>How to play:</strong> Click moles when they pop up! Avoid 💣 bombs — they cost 15 points.
          Build combos for bonus points! You have {GAME_DURATION} seconds.
        </div>
        <AdBanner size="banner" slot="whack-bottom" className="mt-4" />
      </div>
    </div>
  );
}
