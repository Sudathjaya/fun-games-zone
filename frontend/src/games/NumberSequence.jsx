import React, { useState, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

function genSequences() {
  return [
    // Arithmetic
    { seq: [2, 4, 6, null, 10], answer: 8, hint: 'Add 2 each time' },
    { seq: [3, 6, 9, 12, null], answer: 15, hint: 'Add 3 each time' },
    { seq: [5, 10, 15, null, 25], answer: 20, hint: 'Add 5 each time' },
    { seq: [1, 4, 7, null, 13], answer: 10, hint: 'Add 3 each time' },
    { seq: [100, 90, 80, null, 60], answer: 70, hint: 'Subtract 10 each time' },
    { seq: [50, 45, 40, null, 30], answer: 35, hint: 'Subtract 5 each time' },
    // Geometric
    { seq: [2, 4, 8, 16, null], answer: 32, hint: 'Multiply by 2 each time' },
    { seq: [1, 3, 9, null, 81], answer: 27, hint: 'Multiply by 3 each time' },
    { seq: [256, 128, 64, null, 16], answer: 32, hint: 'Divide by 2 each time' },
    { seq: [1, 2, 4, 8, null], answer: 16, hint: 'Double each time' },
    // Squares
    { seq: [1, 4, 9, null, 25], answer: 16, hint: 'Square numbers: 1², 2², 3², ...' },
    { seq: [4, 9, 16, 25, null], answer: 36, hint: 'Square numbers' },
    // Fibonacci-like
    { seq: [1, 1, 2, 3, null], answer: 5, hint: 'Add the two previous numbers' },
    { seq: [1, 2, 3, 5, null], answer: 8, hint: 'Add the two previous numbers' },
    { seq: [2, 3, 5, 8, null], answer: 13, hint: 'Add the two previous numbers' },
    // Mixed
    { seq: [10, 20, 30, null, 50], answer: 40, hint: 'Add 10 each time' },
    { seq: [1, 3, 7, 15, null], answer: 31, hint: 'Double and add 1 each time' },
    { seq: [0, 1, 4, 9, null], answer: 16, hint: 'Square numbers: 0², 1², 2², 3², ...' },
    { seq: [81, 27, 9, null, 1], answer: 3, hint: 'Divide by 3 each time' },
    { seq: [2, 6, 12, 20, null], answer: 30, hint: 'Differences are 4, 6, 8, 10...' },
  ];
}

const TOTAL = 8;
const HINTS_ALLOWED = 2;

export default function NumberSequence({ onBack, game }) {
  const [stage, setStage] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(HINTS_ALLOWED);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState([]);

  const start = () => {
    const all = genSequences();
    const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, TOTAL);
    setQuestions(shuffled);
    setIdx(0); setScore(0); setInput(''); setFeedback(null);
    setHintsLeft(HINTS_ALLOWED); setShowHint(false); setResults([]);
    setStage('playing');
  };

  const current = questions[idx];

  const submit = useCallback(() => {
    if (!input.trim() || feedback) return;
    const val = parseInt(input.trim());
    const correct = val === current.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    setResults(r => [...r, { seq: current.seq, answer: current.answer, correct, given: val }]);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= TOTAL) { setStage('done'); return; }
      setIdx(i => i + 1);
      setInput(''); setFeedback(null); setShowHint(false);
    }, 1200);
  }, [input, feedback, current, idx]);

  const useHint = () => {
    if (hintsLeft <= 0 || showHint) return;
    setHintsLeft(h => h - 1);
    setShowHint(true);
  };

  const grade = score >= 7 ? { label: 'Math Genius!', icon: '🏆', color: 'text-yellow-400' }
              : score >= 5 ? { label: 'Pattern Master!', icon: '🌟', color: 'text-green-400' }
              : score >= 3 ? { label: 'Good Thinker!', icon: '👍', color: 'text-blue-400' }
              : { label: 'Keep Practicing!', icon: '💪', color: 'text-orange-400' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
      <GameHeader
        game={game}
        onBack={onBack}
        extra={stage === 'playing' && <span className="text-white font-bold">{idx + 1}/{TOTAL}</span>}
      />

      {/* INTRO */}
      {stage === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
          <div className="text-6xl">🔢</div>
          <h2 className="text-white text-3xl font-black">Number Sequence</h2>
          <p className="text-white/70 max-w-sm">Find the missing number in each sequence. Tests your pattern recognition and IQ!</p>
          <div className="bg-white/10 rounded-2xl p-4 max-w-xs text-white">
            <p className="text-sm text-white/60 mb-2">Example:</p>
            <p className="text-2xl font-black">2, 4, 6, <span className="text-yellow-400">?</span>, 10</p>
            <p className="text-green-400 text-sm mt-1">Answer: 8 (add 2 each time)</p>
          </div>
          <button onClick={start}
            className="bg-amber-500 hover:bg-amber-400 text-white font-black px-10 py-4 rounded-2xl text-xl transition-all hover:scale-105 shadow-xl">
            Start!
          </button>
        </div>
      )}

      {/* PLAYING */}
      {stage === 'playing' && current && (
        <div className="flex flex-col items-center px-4 pt-6 gap-6 max-w-lg mx-auto">
          {/* Progress dots */}
          <div className="flex gap-2">
            {Array.from({ length: TOTAL }, (_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all
                                       ${i < idx ? (results[i]?.correct ? 'bg-green-400' : 'bg-red-400') : i === idx ? 'bg-yellow-400 scale-125' : 'bg-white/20'}`} />
            ))}
          </div>

          {/* Sequence display */}
          <div className="bg-white/10 rounded-2xl p-6 w-full">
            <p className="text-white/50 text-xs text-center mb-3">Find the missing number</p>
            <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
              {current.seq.map((n, i) => (
                <div key={i}
                  className={`flex items-center justify-center rounded-xl font-black text-xl sm:text-2xl
                              w-12 h-12 sm:w-16 sm:h-16 transition-all
                              ${n === null
                                ? 'bg-yellow-400 text-yellow-900 ring-4 ring-yellow-300 animate-pulse'
                                : 'bg-white/20 text-white'}`}>
                  {n === null ? '?' : n}
                </div>
              ))}
            </div>
          </div>

          {/* Hint */}
          {showHint && (
            <div className="bg-yellow-500/20 border border-yellow-400/40 rounded-xl p-3 w-full text-center">
              <p className="text-yellow-300 text-sm">💡 {current.hint}</p>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3 w-full max-w-xs">
            <input
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Your answer"
              disabled={!!feedback}
              className="flex-1 bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3
                         text-white text-xl font-bold text-center focus:outline-none focus:border-yellow-400
                         placeholder-white/30"
            />
            <button onClick={submit} disabled={!!feedback || !input.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white font-black
                         px-5 rounded-xl transition-all hover:scale-105 active:scale-95">
              ✓
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-2xl font-black ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
              {feedback === 'correct' ? '✓ Correct!' : `✗ Answer: ${current.answer}`}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            <button onClick={useHint} disabled={hintsLeft <= 0 || showHint}
              className="bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 font-bold px-4 py-2
                         rounded-xl text-sm transition-all hover:bg-yellow-500/30 disabled:opacity-30">
              💡 Hint ({hintsLeft} left)
            </button>
            <div className="bg-white/10 rounded-xl px-4 py-2 text-white/60 text-sm font-bold">
              Score: {score}/{idx}
            </div>
          </div>
        </div>
      )}

      {/* DONE */}
      {stage === 'done' && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 gap-6 text-center">
          <div className="text-5xl">{grade.icon}</div>
          <h2 className={`text-3xl font-black ${grade.color}`}>{grade.label}</h2>
          <div className="bg-white/10 rounded-2xl p-6 w-full max-w-xs text-white">
            <div className="text-5xl font-black">{score}<span className="text-2xl text-white/50">/{TOTAL}</span></div>
            <div className="text-white/60 text-sm mt-1">correct answers</div>
          </div>
          <div className="w-full max-w-sm space-y-2 max-h-52 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className={`rounded-xl p-3 text-xs ${r.correct ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <span className="text-white font-bold">
                  {r.seq.map((n, j) => n === null ? (r.correct ? r.answer : `${r.given}→${r.answer}`) : n).join(', ')}
                </span>
              </div>
            ))}
          </div>
          <button onClick={start}
            className="bg-amber-500 hover:bg-amber-400 text-white font-black px-8 py-3 rounded-2xl text-lg transition-all hover:scale-105">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
