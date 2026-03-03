import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameHeader from '../components/GameHeader';
import AdBanner from '../components/AdBanner';

const BUTTONS = [
  { id: 0, color: 'red',    active: 'from-red-400 to-rose-500',     idle: 'from-red-700 to-rose-800',    label: '🔴', shadow: 'shadow-red-500/50' },
  { id: 1, color: 'green',  active: 'from-green-400 to-emerald-500', idle: 'from-green-700 to-emerald-800', label: '🟢', shadow: 'shadow-green-500/50' },
  { id: 2, color: 'blue',   active: 'from-blue-400 to-indigo-500',  idle: 'from-blue-700 to-indigo-800', label: '🔵', shadow: 'shadow-blue-500/50' },
  { id: 3, color: 'yellow', active: 'from-yellow-300 to-amber-400', idle: 'from-yellow-600 to-amber-700', label: '🟡', shadow: 'shadow-yellow-500/50' },
];

const SPEED_DELAY = { slow: 900, normal: 600, fast: 350 };

export default function SimonSays({ onBack, game }) {
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [activeBtn, setActiveBtn] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | showing | input | win | lose
  const [round, setRound] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState('normal');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const playingRef = useRef(false);

  const flashBtn = useCallback((id, duration = 400) => {
    return new Promise(resolve => {
      setActiveBtn(id);
      setTimeout(() => {
        setActiveBtn(null);
        setTimeout(resolve, 100);
      }, duration);
    });
  }, []);

  const playSequence = useCallback(async (seq) => {
    if (playingRef.current) return;
    playingRef.current = true;
    setPhase('showing');
    setPlayerSeq([]);
    await new Promise(r => setTimeout(r, 500));

    const delay = SPEED_DELAY[speed];
    for (const id of seq) {
      if (!playingRef.current) break;
      await flashBtn(id, delay * 0.6);
      await new Promise(r => setTimeout(r, delay * 0.2));
    }

    playingRef.current = false;
    setPhase('input');
  }, [flashBtn, speed]);

  const startGame = useCallback(() => {
    const first = Math.floor(Math.random() * 4);
    const seq = [first];
    setSequence(seq);
    setRound(1);
    setFeedback(null);
    playSequence(seq);
  }, [playSequence]);

  const handleBtn = (id) => {
    if (phase !== 'input') return;

    const newPlayer = [...playerSeq, id];
    setPlayerSeq(newPlayer);
    flashBtn(id, 200);

    const idx = newPlayer.length - 1;
    if (id !== sequence[idx]) {
      // Wrong!
      setFeedback('wrong');
      setPhase('lose');
      if (round - 1 > highScore) setHighScore(round - 1);
      return;
    }

    if (newPlayer.length === sequence.length) {
      // Completed round!
      setFeedback('correct');
      setPhase('win');
      setTimeout(() => {
        const next = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(next);
        setRound(r => r + 1);
        setFeedback(null);
        playSequence(next);
      }, 1200);
    }
  };

  const resetGame = () => {
    playingRef.current = false;
    setSequence([]);
    setPlayerSeq([]);
    setActiveBtn(null);
    setPhase('idle');
    setRound(0);
    setFeedback(null);
  };

  const phaseMsg = {
    idle: { text: 'Press Start to Play!', icon: '🎮', color: 'text-gray-600' },
    showing: { text: 'Watch the sequence...', icon: '👀', color: 'text-pink-600' },
    input: { text: 'Your turn! Repeat it!', icon: '👆', color: 'text-green-600' },
    win: { text: 'Great! Next round coming...', icon: '✅', color: 'text-green-600' },
    lose: { text: 'Wrong! Game Over!', icon: '❌', color: 'text-red-600' },
  }[phase];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-rose-900 to-purple-900">
      <GameHeader game={game} onBack={onBack} score={`Round ${round}`} />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Speed selector */}
        <div className="flex gap-2 justify-center mb-6">
          {Object.keys(SPEED_DELAY).map(s => (
            <button
              key={s}
              onClick={() => { setSpeed(s); resetGame(); }}
              className={`px-4 py-2 rounded-full font-bold text-sm capitalize transition-all
                ${speed === s
                  ? 'bg-pink-400 text-white shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              {s === 'slow' ? '🐢 Slow' : s === 'normal' ? '🐇 Normal' : '⚡ Fast'}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-around mb-6">
          {[
            { label: 'Round', value: round, icon: '🎯' },
            { label: 'Best', value: highScore, icon: '🏆' },
            { label: 'Length', value: sequence.length, icon: '📏' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 text-white rounded-2xl px-4 py-2 text-center min-w-[75px]">
              <div className="text-lg">{s.icon}</div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className={`text-center py-3 px-4 rounded-2xl mb-6 font-bold text-lg
          bg-white/10 backdrop-blur ${phaseMsg.color.replace('text-', 'text-white ')}`}>
          <span className="mr-2">{phaseMsg.icon}</span>{phaseMsg.text}
        </div>

        {/* Simon Pad — responsive height */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xs mx-auto mb-6">
          {BUTTONS.map(btn => (
            <button
              key={btn.id}
              onClick={() => handleBtn(btn.id)}
              disabled={phase !== 'input'}
              className={`
                h-28 sm:h-32 rounded-3xl text-3xl sm:text-4xl font-black transition-all duration-150
                bg-gradient-to-br shadow-xl border-4 border-white/10
                ${activeBtn === btn.id
                  ? `${btn.active} scale-110 shadow-2xl ${btn.shadow} brightness-150 border-white/30`
                  : `${btn.idle} hover:brightness-110 active:scale-95`
                }
                ${phase === 'input' ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                ${feedback === 'correct' && phase === 'win' ? 'animate-bounce' : ''}
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Player progress indicators */}
        {phase === 'input' && (
          <div className="flex justify-center gap-2 mb-6">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all
                  ${i < playerSeq.length
                    ? 'bg-white scale-125'
                    : 'bg-white/30'
                  }`}
              />
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          {phase === 'idle' || phase === 'lose' ? (
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-pink-400 to-rose-500 text-white
                         font-black text-xl px-10 py-4 rounded-2xl
                         hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              {phase === 'lose' ? '🔄 Try Again' : '▶ Start Game'}
            </button>
          ) : (
            <button
              onClick={resetGame}
              className="bg-white/20 text-white font-bold px-6 py-3 rounded-2xl
                         hover:bg-white/30 transition-all"
            >
              Reset
            </button>
          )}
        </div>

        {/* Game over details */}
        {phase === 'lose' && (
          <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-2xl p-4 text-center text-white">
            <p className="font-bold text-lg">You reached Round <strong>{round}</strong>!</p>
            <p className="text-white/70 text-sm">Best: Round {highScore}</p>
          </div>
        )}

        <div className="mt-6 bg-white/10 rounded-2xl p-4 text-center text-pink-200 text-sm">
          <strong>How to play:</strong> Watch the color sequence light up, then repeat it exactly!
          Each round adds one more color. How far can you go?
        </div>
        <AdBanner size="banner" slot="simon-bottom" className="mt-4 opacity-80" />
      </div>
    </div>
  );
}
