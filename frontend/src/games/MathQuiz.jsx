import React, { useState, useEffect, useRef } from 'react';
import GameHeader from '../components/GameHeader';
import AdBanner from '../components/AdBanner';

const LEVELS = {
  easy:   { label: '🟢 Easy',   ops: ['+', '-'],      maxNum: 10, time: 20 },
  medium: { label: '🟡 Medium', ops: ['+', '-', '×'], maxNum: 20, time: 15 },
  hard:   { label: '🔴 Hard',   ops: ['+', '-', '×', '÷'], maxNum: 30, time: 10 },
};

const TOTAL_QUESTIONS = 10;

function generate(level) {
  const cfg = LEVELS[level];
  const op = cfg.ops[Math.floor(Math.random() * cfg.ops.length)];
  let a, b, answer;

  if (op === '+') {
    a = Math.floor(Math.random() * cfg.maxNum) + 1;
    b = Math.floor(Math.random() * cfg.maxNum) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * cfg.maxNum) + 1;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  } else if (op === '×') {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a * b;
  } else { // ÷
    b = Math.floor(Math.random() * 10) + 1;
    answer = Math.floor(Math.random() * 10) + 1;
    a = b * answer;
  }

  // Generate 3 wrong choices close to answer
  const choices = new Set([answer]);
  while (choices.size < 4) {
    const wrong = answer + (Math.floor(Math.random() * 7) - 3);
    if (wrong !== answer && wrong >= 0) choices.add(wrong);
  }
  const shuffled = [...choices].sort(() => Math.random() - 0.5);

  return { a, b, op, answer, choices: shuffled };
}

export default function MathQuiz({ onBack, game }) {
  const [level, setLevel] = useState('easy');
  const [question, setQuestion] = useState(null);
  const [qNumber, setQNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | 'timeout'
  const [phase, setPhase] = useState('start'); // 'start' | 'playing' | 'results'
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  const nextQuestion = (lvl = level, num = qNumber, sc = score, cor = correct, wr = wrong, res = results) => {
    if (num >= TOTAL_QUESTIONS) {
      setPhase('results');
      return;
    }
    const q = generate(lvl);
    setQuestion(q);
    setQNumber(num + 1);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(LEVELS[lvl].time);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null, q, num + 1, lvl, sc, cor, wr, res);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleAnswer = (choice, q = question, num = qNumber, lvl = level, sc = score, cor = correct, wr = wrong, res = results) => {
    clearInterval(timerRef.current);
    setSelected(choice);
    const isCorrect = choice === q.answer;
    const fb = choice === null ? 'timeout' : isCorrect ? 'correct' : 'wrong';
    setFeedback(fb);

    const newRes = [...res, { question: q, chosen: choice, correct: isCorrect }];
    setResults(newRes);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? 10 : 0;
      const timeBonus = Math.floor(timeLeft / LEVELS[lvl].time * 5);
      const points = 10 + bonus + timeBonus;
      setScore(sc + points);
      setCorrect(cor + 1);
    } else {
      setStreak(0);
      setWrong(wr + 1);
    }

    setTimeout(() => {
      nextQuestion(lvl, num, sc, cor, wr, newRes);
    }, 1200);
  };

  const startGame = (lvl = level) => {
    setLevel(lvl);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setStreak(0);
    setQNumber(0);
    setResults([]);
    setPhase('playing');
    clearInterval(timerRef.current);
    const q = generate(lvl);
    setQuestion(q);
    setQNumber(1);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(LEVELS[lvl].time);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null, q, 1, lvl, 0, 0, 0, []);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const timerPct = question ? (timeLeft / LEVELS[level].time) * 100 : 100;
  const timerColor = timerPct > 60 ? 'bg-green-500' : timerPct > 30 ? 'bg-yellow-500' : 'bg-red-500';

  if (phase === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <GameHeader game={game} onBack={onBack} />
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="text-7xl mb-4">➕</div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">Math Quiz!</h2>
          <p className="text-gray-600 mb-8 text-lg">{TOTAL_QUESTIONS} questions. Answer as fast as you can for bonus points!</p>
          <div className="space-y-3 mb-6">
            {Object.entries(LEVELS).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => startGame(key)}
                className={`w-full py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl shadow-lg
                           hover:scale-105 active:scale-95 transition-all
                           ${key === 'easy' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                             : key === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                             : 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
                           }`}
              >
                {cfg.label} &mdash; {cfg.ops.join(', ')} &bull; {cfg.time}s per Q
              </button>
            ))}
          </div>
          <AdBanner size="banner" slot="math-start" />
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const pct = Math.round((correct / TOTAL_QUESTIONS) * 100);
    const grade = pct >= 90 ? '🏆 A+' : pct >= 80 ? '🥇 A' : pct >= 70 ? '🥈 B' : pct >= 60 ? '🥉 C' : '📚 Keep Practicing!';
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <GameHeader game={game} onBack={onBack} />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center mb-4">
            <div className="text-5xl mb-2">{grade.split(' ')[0]}</div>
            <h2 className="text-3xl font-black text-gray-800 mb-1">{grade.split(' ').slice(1).join(' ')}</h2>
            <div className="text-5xl font-black text-indigo-600 mb-2">{pct}%</div>
            <div className="flex justify-around mb-4">
              <div>
                <div className="text-2xl font-black text-green-600">{correct}</div>
                <div className="text-sm text-gray-500">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-black text-red-500">{wrong + (TOTAL_QUESTIONS - correct - wrong)}</div>
                <div className="text-sm text-gray-500">Wrong/Skip</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-600">{score}</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </div>
          </div>

          {/* Question review */}
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl
                ${r.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <span className="text-xl">{r.correct ? '✅' : '❌'}</span>
                <span className="font-bold text-gray-700 flex-1">
                  {r.question.a} {r.question.op} {r.question.b} = {r.question.answer}
                </span>
                {!r.correct && r.chosen !== null && (
                  <span className="text-red-500 text-sm">You: {r.chosen}</span>
                )}
                {!r.correct && r.chosen === null && (
                  <span className="text-orange-500 text-sm">Timeout</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startGame(level)}
              className="flex-1 bg-indigo-600 text-white font-black text-lg py-4 rounded-2xl
                         hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              🔄 Play Again
            </button>
            <button
              onClick={() => setPhase('start')}
              className="px-5 bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl
                         hover:bg-gray-300 transition-all"
            >
              Change Level
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <GameHeader game={game} onBack={onBack} score={`⭐ ${score}`} />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Progress & streak */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((qNumber - 1) / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-600">{qNumber}/{TOTAL_QUESTIONS}</span>
        </div>

        {streak >= 2 && (
          <div className="text-center mb-3 animate-bounce">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white
                             font-black px-4 py-1 rounded-full text-sm">
              🔥 {streak} Streak! +10 bonus!
            </span>
          </div>
        )}

        {/* Timer */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-bold mb-1">
            <span className="text-gray-600">Time</span>
            <span className={timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-gray-600'}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ${timerColor}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        </div>

        {/* Question */}
        {question && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
            <div className={`text-center text-6xl font-black text-gray-800 mb-6 py-4
              transition-all duration-300
              ${feedback === 'correct' ? 'text-green-600' : feedback === 'wrong' ? 'text-red-500' : ''}`}>
              {question.a} {question.op} {question.b} = ?
            </div>

            <div className="grid grid-cols-2 gap-3">
              {question.choices.map((choice, i) => {
                let style = 'bg-gray-50 border-4 border-gray-200 text-gray-800 hover:bg-indigo-50 hover:border-indigo-400';
                if (selected !== null || feedback === 'timeout') {
                  if (choice === question.answer) {
                    style = 'bg-gradient-to-r from-green-400 to-emerald-500 border-4 border-green-600 text-white scale-105';
                  } else if (choice === selected) {
                    style = 'bg-gradient-to-r from-red-400 to-rose-500 border-4 border-red-600 text-white';
                  } else {
                    style = 'bg-gray-50 border-4 border-gray-200 text-gray-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(choice)}
                    disabled={selected !== null || feedback === 'timeout'}
                    className={`py-5 rounded-2xl font-black text-2xl transition-all duration-200
                               hover:scale-105 active:scale-95 cursor-pointer shadow-md ${style}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className={`text-center mt-4 text-lg font-black
                ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
                {feedback === 'correct' ? '✅ Correct! +' + (10 + (streak >= 3 ? 10 : 0)) : feedback === 'timeout' ? '⏰ Too slow!' : '❌ Wrong!'}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-around text-center">
          {[['✅', correct, 'Correct'], ['❌', wrong, 'Wrong']].map(([icon, val, label]) => (
            <div key={label} className="bg-white rounded-2xl px-6 py-3 shadow">
              <div className="text-xl">{icon}</div>
              <div className="text-2xl font-black text-indigo-600">{val}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
