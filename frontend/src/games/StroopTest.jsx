import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

const COLORS = [
  { name: 'Red',    tw: 'text-red-500',    bg: 'bg-red-500' },
  { name: 'Blue',   tw: 'text-blue-500',   bg: 'bg-blue-500' },
  { name: 'Green',  tw: 'text-green-500',  bg: 'bg-green-500' },
  { name: 'Yellow', tw: 'text-yellow-400', bg: 'bg-yellow-400' },
  { name: 'Purple', tw: 'text-purple-500', bg: 'bg-purple-500' },
  { name: 'Orange', tw: 'text-orange-500', bg: 'bg-orange-500' },
];

function makeQuestion() {
  const wordIdx = Math.floor(Math.random() * COLORS.length);
  let inkIdx;
  do { inkIdx = Math.floor(Math.random() * COLORS.length); } while (inkIdx === wordIdx);
  return { word: COLORS[wordIdx], ink: COLORS[inkIdx] };
}

const TOTAL = 10;

export default function StroopTest({ onBack, game }) {
  const [stage, setStage] = useState('intro'); // intro | playing | done
  const [q, setQ] = useState(null);
  const [qNum, setQNum] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [times, setTimes] = useState([]);
  const startRef = useRef(null);

  const nextQ = useCallback(() => {
    setQ(makeQuestion());
    setFeedback(null);
    startRef.current = Date.now();
  }, []);

  const start = () => {
    setScore(0); setQNum(0); setTimes([]);
    setStage('playing');
    setQ(makeQuestion());
    startRef.current = Date.now();
  };

  const answer = (colorName) => {
    if (feedback) return;
    const elapsed = Date.now() - startRef.current;
    const correct = colorName === q.ink.name;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTimes(t => [...t, elapsed]);

    setTimeout(() => {
      const next = qNum + 1;
      if (next >= TOTAL) { setStage('done'); return; }
      setQNum(next);
      nextQ();
    }, 600);
  };

  const avgTime = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  const grade = score >= 9 ? { label: 'Genius', color: 'text-yellow-400', icon: '🏆' }
              : score >= 7 ? { label: 'Excellent', color: 'text-green-400', icon: '🌟' }
              : score >= 5 ? { label: 'Good', color: 'text-blue-400', icon: '👍' }
              : { label: 'Keep Practicing', color: 'text-orange-400', icon: '💪' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <GameHeader
        game={game}
        onBack={onBack}
        extra={stage === 'playing' && <span className="text-white font-bold">{qNum + 1}/{TOTAL}</span>}
      />

      {/* INTRO */}
      {stage === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
          <div className="text-6xl">🧠</div>
          <h2 className="text-white text-3xl font-black">Stroop Test</h2>
          <div className="bg-white/10 rounded-2xl p-6 max-w-sm text-white/80 text-sm leading-relaxed">
            <p className="font-bold text-white mb-2">How to play:</p>
            <p>A color word will appear written in a <span className="text-red-400 font-bold">different color</span>.</p>
            <p className="mt-2">Click the <span className="font-bold text-white">color of the INK</span>, NOT what the word says!</p>
            <div className="mt-4 p-3 bg-white/10 rounded-xl">
              <p className="text-green-500 text-2xl font-black">RED</p>
              <p className="text-white/60 text-xs mt-1">Correct answer: <span className="text-green-400 font-bold">Green</span> (the ink color)</p>
            </div>
          </div>
          <button onClick={start}
            className="bg-purple-500 hover:bg-purple-400 text-white font-black px-10 py-4 rounded-2xl text-xl transition-all hover:scale-105 shadow-xl">
            Start Test
          </button>
        </div>
      )}

      {/* PLAYING */}
      {stage === 'playing' && q && (
        <div className="flex flex-col items-center px-4 pt-4 gap-6">
          {/* Score bar */}
          <div className="flex gap-2">
            {Array.from({ length: TOTAL }, (_, i) => (
              <div key={i} className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white/30
                                       ${i < qNum ? (times[i] && score > i ? 'bg-green-400' : 'bg-red-400') : 'bg-white/20'}`} />
            ))}
          </div>

          {/* The word */}
          <div className={`${q.ink.tw} text-6xl sm:text-8xl font-black select-none transition-all duration-200
                           ${feedback === 'correct' ? 'scale-110' : feedback === 'wrong' ? 'opacity-40' : ''}`}>
            {q.word.name}
          </div>

          <p className="text-white/60 text-sm">What COLOR is the text? (not the word)</p>

          {/* Color buttons */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {COLORS.map(c => (
              <button
                key={c.name}
                onClick={() => answer(c.name)}
                disabled={!!feedback}
                className={`${c.bg} rounded-xl py-3 text-white font-bold text-sm sm:text-base
                            transition-all hover:scale-105 active:scale-95 shadow-lg
                            ${feedback && c.name === q.ink.name ? 'ring-4 ring-white scale-105' : ''}
                            ${feedback && c.name !== q.ink.name ? 'opacity-40' : ''}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`text-2xl font-black ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
              {feedback === 'correct' ? '✓ Correct!' : `✗ It was ${q.ink.name}`}
            </div>
          )}

          <div className="text-white/40 text-sm">Score: {score}/{qNum}</div>
        </div>
      )}

      {/* DONE */}
      {stage === 'done' && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 gap-6 text-center">
          <div className="text-5xl">{grade.icon}</div>
          <h2 className={`text-3xl font-black ${grade.color}`}>{grade.label}!</h2>
          <div className="bg-white/10 rounded-2xl p-6 w-full max-w-xs text-white space-y-3">
            <div className="flex justify-between"><span className="text-white/60">Score</span><span className="font-black">{score}/{TOTAL}</span></div>
            <div className="flex justify-between"><span className="text-white/60">Avg Speed</span><span className="font-black">{avgTime}ms</span></div>
            <div className="flex justify-between"><span className="text-white/60">Accuracy</span><span className="font-black">{Math.round(score / TOTAL * 100)}%</span></div>
          </div>
          <p className="text-white/50 text-sm max-w-xs">
            The Stroop Test measures your brain's ability to override automatic responses — a key measure of cognitive flexibility.
          </p>
          <button onClick={start}
            className="bg-purple-500 hover:bg-purple-400 text-white font-black px-8 py-3 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
