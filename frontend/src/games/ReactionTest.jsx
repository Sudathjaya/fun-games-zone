import React, { useState, useEffect, useRef } from 'react';
import GameHeader from '../components/GameHeader';

const ROUNDS = 5;

function getRating(avg) {
  if (avg < 200) return { label: 'Superhuman!', color: 'text-yellow-400', icon: '⚡' };
  if (avg < 250) return { label: 'Elite Reflexes!', color: 'text-green-400', icon: '🏆' };
  if (avg < 350) return { label: 'Above Average', color: 'text-blue-400', icon: '👍' };
  if (avg < 500) return { label: 'Average', color: 'text-white', icon: '😊' };
  return { label: 'Keep Practicing!', color: 'text-orange-400', icon: '💪' };
}

export default function ReactionTest({ onBack, game }) {
  const [stage, setStage] = useState('intro'); // intro | waiting | ready | clicked | tooEarly | done
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState([]);
  const [lastTime, setLastTime] = useState(null);
  const startRef = useRef(null);
  const timerRef = useRef(null);

  const startRound = () => {
    setStage('waiting');
    const delay = 2000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setStage('ready');
    }, delay);
  };

  const handleClick = () => {
    if (stage === 'intro') { setRound(0); setTimes([]); startRound(); return; }

    if (stage === 'waiting') {
      clearTimeout(timerRef.current);
      setStage('tooEarly');
      return;
    }

    if (stage === 'ready') {
      const elapsed = Date.now() - startRef.current;
      setLastTime(elapsed);
      setTimes(t => {
        const next = [...t, elapsed];
        if (next.length >= ROUNDS) {
          setTimeout(() => setStage('done'), 800);
        } else {
          setTimeout(() => { setRound(r => r + 1); startRound(); }, 1200);
        }
        return next;
      });
      setStage('clicked');
      return;
    }

    if (stage === 'tooEarly') { startRound(); return; }
    if (stage === 'clicked') return;
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const best = times.length ? Math.min(...times) : 0;
  const rating = getRating(avg);

  const bgColor = stage === 'waiting' ? 'from-red-800 to-red-900'
               : stage === 'ready'   ? 'from-green-500 to-green-600'
               : stage === 'tooEarly' ? 'from-orange-700 to-red-800'
               : stage === 'clicked' ? 'from-blue-600 to-indigo-700'
               : 'from-gray-800 via-slate-800 to-gray-900';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgColor} transition-colors duration-300 flex flex-col`}>
      <GameHeader
        game={game}
        onBack={onBack}
        extra={stage !== 'intro' && stage !== 'done' && (
          <span className="text-white/70 text-sm">{Math.min(times.length + 1, ROUNDS)}/{ROUNDS}</span>
        )}
      />

      <div
        className="flex-1 flex flex-col items-center justify-center px-6 cursor-pointer select-none"
        onClick={handleClick}
      >
        {stage === 'intro' && (
          <div className="text-center space-y-6 max-w-sm">
            <div className="text-7xl">⚡</div>
            <h2 className="text-white text-3xl font-black">Reaction Test</h2>
            <p className="text-white/70">When the screen turns <span className="text-green-400 font-bold">GREEN</span>, tap as fast as you can!</p>
            <p className="text-white/50 text-sm">Don't tap early — wait for green!</p>
            <button className="bg-white text-gray-900 font-black px-10 py-4 rounded-2xl text-xl shadow-2xl hover:scale-105 transition-all">
              Tap to Start
            </button>
          </div>
        )}

        {stage === 'waiting' && (
          <div className="text-center space-y-4">
            <div className="text-7xl animate-pulse">🔴</div>
            <p className="text-white text-2xl font-bold">Wait for green...</p>
            <p className="text-white/50 text-sm">Don't tap yet!</p>
          </div>
        )}

        {stage === 'ready' && (
          <div className="text-center space-y-4">
            <div className="text-7xl">🟢</div>
            <p className="text-white text-4xl font-black animate-bounce">TAP NOW!</p>
          </div>
        )}

        {stage === 'tooEarly' && (
          <div className="text-center space-y-4">
            <div className="text-6xl">😬</div>
            <p className="text-white text-3xl font-black">Too Early!</p>
            <p className="text-white/70">Wait for the screen to turn green</p>
            <p className="text-white/50 text-sm">Tap to try again</p>
          </div>
        )}

        {stage === 'clicked' && lastTime && (
          <div className="text-center space-y-4">
            <div className="text-6xl">⚡</div>
            <p className="text-white text-5xl font-black">{lastTime}ms</p>
            <p className="text-white/70 text-lg">
              {lastTime < 200 ? 'Incredible!' : lastTime < 300 ? 'Great!' : lastTime < 400 ? 'Good!' : 'Keep trying!'}
            </p>
            {/* Mini history */}
            <div className="flex gap-2 justify-center">
              {times.map((t, i) => (
                <div key={i} className="bg-white/20 rounded-lg px-2 py-1 text-white text-xs font-bold">{t}ms</div>
              ))}
            </div>
          </div>
        )}

        {stage === 'done' && (
          <div className="text-center space-y-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="text-5xl">{rating.icon}</div>
            <h2 className={`text-3xl font-black ${rating.color}`}>{rating.label}</h2>
            <div className="bg-white/10 rounded-2xl p-5 text-white space-y-3">
              <div className="flex justify-between"><span className="text-white/60">Average</span><span className="font-black">{avg}ms</span></div>
              <div className="flex justify-between"><span className="text-white/60">Best</span><span className="font-black text-green-400">{best}ms</span></div>
              <div className="flex justify-between"><span className="text-white/60">Worst</span><span className="font-black text-red-400">{Math.max(...times)}ms</span></div>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              {times.map((t, i) => (
                <div key={i} className="bg-white/20 rounded-lg px-3 py-1 text-white text-sm font-bold">#{i + 1}: {t}ms</div>
              ))}
            </div>
            <p className="text-white/40 text-xs">Average human reaction time is 250ms</p>
            <button onClick={() => { setRound(0); setTimes([]); setStage('intro'); }}
              className="bg-white text-gray-900 font-black px-8 py-3 rounded-2xl text-lg hover:scale-105 transition-all">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
