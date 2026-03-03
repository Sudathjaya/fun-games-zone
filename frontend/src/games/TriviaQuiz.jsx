import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

const ALL_QUESTIONS = [
  // Science
  { q: 'What is the closest planet to the Sun?', options: ['Venus','Mercury','Mars','Earth'], answer: 'Mercury', cat: '🔬 Science' },
  { q: 'What gas do plants absorb from the air?', options: ['Oxygen','Nitrogen','Carbon Dioxide','Hydrogen'], answer: 'Carbon Dioxide', cat: '🔬 Science' },
  { q: 'How many bones are in the adult human body?', options: ['206','186','256','196'], answer: '206', cat: '🔬 Science' },
  { q: 'What is the speed of light?', options: ['300,000 km/s','150,000 km/s','500,000 km/s','200,000 km/s'], answer: '300,000 km/s', cat: '🔬 Science' },
  { q: 'What is H2O commonly known as?', options: ['Hydrogen','Salt','Water','Oxygen'], answer: 'Water', cat: '🔬 Science' },
  // Nature
  { q: 'Which is the largest animal on Earth?', options: ['Elephant','Blue Whale','Giraffe','Great White Shark'], answer: 'Blue Whale', cat: '🌿 Nature' },
  { q: 'How many legs does a spider have?', options: ['6','8','10','12'], answer: '8', cat: '🌿 Nature' },
  { q: 'What do bees collect from flowers?', options: ['Water','Pollen & Nectar','Leaves','Fruits'], answer: 'Pollen & Nectar', cat: '🌿 Nature' },
  { q: 'Which bird cannot fly?', options: ['Sparrow','Eagle','Penguin','Parrot'], answer: 'Penguin', cat: '🌿 Nature' },
  { q: 'What is the tallest tree type?', options: ['Oak','Redwood','Pine','Maple'], answer: 'Redwood', cat: '🌿 Nature' },
  // Geography
  { q: 'Which is the largest ocean?', options: ['Atlantic','Indian','Arctic','Pacific'], answer: 'Pacific', cat: '🌍 Geography' },
  { q: 'What is the capital of Japan?', options: ['Osaka','Tokyo','Kyoto','Hiroshima'], answer: 'Tokyo', cat: '🌍 Geography' },
  { q: 'Which is the longest river?', options: ['Amazon','Yangtze','Nile','Mississippi'], answer: 'Nile', cat: '🌍 Geography' },
  { q: 'How many continents are there?', options: ['5','6','7','8'], answer: '7', cat: '🌍 Geography' },
  { q: 'Which country has the most population?', options: ['USA','India','China','Russia'], answer: 'India', cat: '🌍 Geography' },
  // General Knowledge
  { q: 'How many colors are in a rainbow?', options: ['5','6','7','8'], answer: '7', cat: '💡 General' },
  { q: 'What is the hardest natural substance?', options: ['Gold','Diamond','Iron','Quartz'], answer: 'Diamond', cat: '💡 General' },
  { q: 'How many seconds are in one minute?', options: ['50','60','70','100'], answer: '60', cat: '💡 General' },
  { q: 'What language is spoken most widely worldwide?', options: ['English','Spanish','Mandarin Chinese','Hindi'], answer: 'Mandarin Chinese', cat: '💡 General' },
  { q: 'Which planet has rings around it?', options: ['Jupiter','Mars','Saturn','Neptune'], answer: 'Saturn', cat: '💡 General' },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const TOTAL = 10;
const TIME_PER_Q = 15;

export default function TriviaQuiz({ onBack, game }) {
  const [stage, setStage] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(TIME_PER_Q);
  const [results, setResults] = useState([]);

  const start = () => {
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, TOTAL));
    setQIdx(0); setScore(0); setSelected(null);
    setTimer(TIME_PER_Q); setResults([]);
    setStage('playing');
  };

  const current = questions[qIdx];

  const choose = useCallback((opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === current?.answer;
    if (correct) setScore(s => s + 1);
    setResults(r => [...r, { q: current.q, correct, chosen: opt, answer: current.answer }]);
    setTimeout(() => {
      if (qIdx + 1 >= TOTAL) { setStage('done'); return; }
      setQIdx(i => i + 1);
      setSelected(null);
      setTimer(TIME_PER_Q);
    }, 1200);
  }, [selected, current, qIdx]);

  useEffect(() => {
    if (stage !== 'playing' || selected) return;
    if (timer <= 0) { choose('__timeout__'); return; }
    const t = setInterval(() => setTimer(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [stage, timer, selected, choose]);

  const grade = score >= 9 ? { label: 'Quiz Master!', icon: '🏆', color: 'text-yellow-400' }
              : score >= 7 ? { label: 'Excellent!', icon: '🌟', color: 'text-green-400' }
              : score >= 5 ? { label: 'Good Job!', icon: '👍', color: 'text-blue-400' }
              : { label: 'Keep Learning!', icon: '📚', color: 'text-orange-400' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      <GameHeader
        game={game}
        onBack={onBack}
        extra={stage === 'playing' && (
          <span className={`font-black text-lg ${timer <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            ⏱ {timer}s
          </span>
        )}
      />

      {/* INTRO */}
      {stage === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
          <div className="text-6xl">🧠</div>
          <h2 className="text-white text-3xl font-black">General Trivia</h2>
          <p className="text-white/70 max-w-sm">10 questions across Science, Nature, Geography & General Knowledge. You have {TIME_PER_Q} seconds per question!</p>
          <button onClick={start}
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-10 py-4 rounded-2xl text-xl transition-all hover:scale-105 shadow-xl">
            Start Quiz!
          </button>
        </div>
      )}

      {/* PLAYING */}
      {stage === 'playing' && current && (
        <div className="flex flex-col items-center px-4 pt-4 gap-5 max-w-lg mx-auto">
          {/* Progress */}
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                   style={{ width: `${((qIdx) / TOTAL) * 100}%` }} />
            </div>
            <span className="text-white/60 text-sm whitespace-nowrap">{qIdx + 1}/{TOTAL}</span>
          </div>

          {/* Timer bar */}
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full transition-all duration-1000 ${timer <= 5 ? 'bg-red-400' : 'bg-cyan-400'}`}
                 style={{ width: `${(timer / TIME_PER_Q) * 100}%` }} />
          </div>

          {/* Category */}
          <span className="text-white/50 text-sm">{current.cat}</span>

          {/* Question */}
          <div className="bg-white/10 rounded-2xl p-5 w-full text-white text-center text-lg font-bold leading-snug">
            {current.q}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 w-full">
            {current.options.map(opt => {
              const isCorrect = opt === current.answer;
              const isChosen = opt === selected;
              let style = 'bg-white/10 border-white/20 text-white hover:bg-white/20';
              if (selected) {
                if (isCorrect) style = 'bg-green-500 border-green-400 text-white';
                else if (isChosen) style = 'bg-red-500 border-red-400 text-white';
                else style = 'bg-white/5 border-white/10 text-white/40';
              }
              return (
                <button key={opt}
                  onClick={() => choose(opt)}
                  disabled={!!selected}
                  className={`border-2 rounded-xl px-4 py-3 font-bold text-left transition-all ${style}`}>
                  {isCorrect && selected ? '✓ ' : isChosen && !isCorrect ? '✗ ' : ''}{opt}
                </button>
              );
            })}
          </div>

          <div className="text-white/40 text-sm">Score: {score}/{qIdx}</div>
        </div>
      )}

      {/* DONE */}
      {stage === 'done' && (
        <div className="flex flex-col items-center min-h-[80vh] px-4 pt-6 gap-5">
          <div className="text-5xl">{grade.icon}</div>
          <h2 className={`text-3xl font-black ${grade.color}`}>{grade.label}</h2>
          <div className="bg-white/10 rounded-2xl p-5 w-full max-w-sm text-white text-center">
            <div className="text-5xl font-black">{score}<span className="text-2xl text-white/50">/{TOTAL}</span></div>
            <div className="text-white/60 text-sm mt-1">correct answers</div>
          </div>
          {/* Review */}
          <div className="w-full max-w-sm space-y-2 max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className={`rounded-xl p-3 text-sm ${r.correct ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <p className="text-white font-bold">{i + 1}. {r.q}</p>
                {!r.correct && <p className="text-green-400 text-xs mt-1">✓ {r.answer}</p>}
              </div>
            ))}
          </div>
          <button onClick={start}
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-3 rounded-2xl text-lg transition-all hover:scale-105">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
