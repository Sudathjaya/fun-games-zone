import React, { useState, useRef, useCallback } from 'react';
import GameHeader from '../components/GameHeader';
import AdBanner from '../components/AdBanner';

const WORD_LISTS = {
  Animals: ['ELEPHANT', 'DOLPHIN', 'GIRAFFE', 'PENGUIN', 'KANGAROO', 'BUTTERFLY', 'OCTOPUS', 'CHEETAH', 'FLAMINGO', 'TORTOISE'],
  Fruits:  ['MANGO', 'PAPAYA', 'CHERRY', 'LYCHEE', 'GUAVA', 'APRICOT', 'PEACH', 'PLUM', 'COCONUT', 'BANANA'],
  Colors:  ['CRIMSON', 'VIOLET', 'TEAL', 'SCARLET', 'INDIGO', 'MAGENTA', 'BEIGE', 'MAROON', 'TURQUOISE', 'LAVENDER'],
  Sports:  ['TENNIS', 'CRICKET', 'HOCKEY', 'ARCHERY', 'SURFING', 'BOWLING', 'WRESTLING', 'FENCING', 'ROWING', 'SKIING'],
  Food:    ['PIZZA', 'BURGER', 'NOODLE', 'SUSHI', 'TACOS', 'CHEESE', 'WAFFLE', 'PUDDING', 'MUFFIN', 'SCONE'],
};

function scramble(word) {
  let arr = word.split('');
  let tries = 0;
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    tries++;
  } while (arr.join('') === word && tries < 20);
  return arr.join('');
}

function getNewWord(category, usedWords) {
  const list = WORD_LISTS[category];
  const available = list.filter(w => !usedWords.includes(w));
  if (available.length === 0) return null;
  const word = available[Math.floor(Math.random() * available.length)];
  return { word, scrambled: scramble(word) };
}

export default function WordScramble({ onBack, game }) {
  const [category, setCategory] = useState('Animals');
  const [usedWords, setUsedWords] = useState([]);
  const [current, setCurrent] = useState(() => {
    const r = getNewWord('Animals', []);
    return r;
  });
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [showHint, setShowHint] = useState(false);
  const [skipped, setSkipped] = useState(0);
  const inputRef = useRef(null);

  const nextWord = useCallback((cat = category, used = usedWords) => {
    const result = getNewWord(cat, used);
    if (!result) {
      // All words used — reset
      setCurrent(getNewWord(cat, []));
      setUsedWords([]);
    } else {
      setCurrent(result);
    }
    setInput('');
    setShowHint(false);
    setFeedback(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [category, usedWords]);

  const changeCategory = (cat) => {
    setCategory(cat);
    setUsedWords([]);
    setScore(0);
    setStreak(0);
    setSkipped(0);
    nextWord(cat, []);
  };

  const handleSubmit = () => {
    if (!input.trim() || !current) return;
    const guess = input.trim().toUpperCase();
    if (guess === current.word) {
      const bonus = showHint ? 5 : 10;
      const streakBonus = streak >= 2 ? streak * 2 : 0;
      setScore(s => s + bonus + streakBonus);
      setStreak(s => s + 1);
      setFeedback('correct');
      const newUsed = [...usedWords, current.word];
      setUsedWords(newUsed);
      setTimeout(() => nextWord(category, newUsed), 1200);
    } else {
      setStreak(0);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
      setInput('');
    }
  };

  const handleSkip = () => {
    setSkipped(s => s + 1);
    setStreak(0);
    const newUsed = [...usedWords, current.word];
    setUsedWords(newUsed);
    nextWord(category, newUsed);
  };

  const newScramble = () => {
    if (!current) return;
    setCurrent({ word: current.word, scrambled: scramble(current.word) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <GameHeader game={game} onBack={onBack} score={`⭐ ${score}`} />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Category selector */}
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          {Object.keys(WORD_LISTS).map(cat => (
            <button
              key={cat}
              onClick={() => changeCategory(cat)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all
                ${category === cat
                  ? 'bg-orange-500 text-white shadow-lg scale-105'
                  : 'bg-white text-orange-700 hover:bg-orange-50 shadow'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-around mb-6">
          {[
            { label: 'Score', value: score, icon: '⭐' },
            { label: 'Streak', value: streak, icon: '🔥' },
            { label: 'Skipped', value: skipped, icon: '⏭️' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl px-4 py-3 shadow-md text-center min-w-[80px]">
              <div className="text-xl">{s.icon}</div>
              <div className="text-2xl font-black text-orange-600">{s.value}</div>
              <div className="text-xs font-bold text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        {current && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
            {/* Streak badge */}
            {streak >= 2 && (
              <div className="text-center mb-3">
                <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white
                                 font-black px-4 py-1 rounded-full text-sm animate-bounce-in">
                  🔥 {streak} Streak! +{streak * 2} bonus!
                </span>
              </div>
            )}

            {/* Scrambled word */}
            <div className={`text-center mb-6 transition-all duration-300
              ${feedback === 'correct' ? 'scale-110' : feedback === 'wrong' ? 'animate-wiggle' : ''}`}>
              <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">
                {category} — Unscramble this word:
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {current.scrambled.split('').map((letter, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center justify-center w-12 h-14
                               bg-gradient-to-b from-orange-400 to-amber-500
                               text-white text-2xl font-black rounded-xl shadow-md
                               border-b-4 border-amber-700"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="text-center mb-4 p-3 bg-amber-50 rounded-2xl border-2 border-amber-200">
                <p className="text-amber-700 font-bold">
                  💡 Hint: Starts with <strong className="text-2xl">{current.word[0]}</strong>,
                  has <strong>{current.word.length}</strong> letters
                </p>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className={`text-center text-xl font-black py-2 mb-3 rounded-xl
                ${feedback === 'correct' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                {feedback === 'correct' ? '✅ Correct! Well done!' : '❌ Not quite, try again!'}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-3 mb-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Type your answer..."
                className="flex-1 border-4 border-orange-300 focus:border-orange-500
                           rounded-2xl px-4 py-3 text-xl font-bold uppercase
                           outline-none transition-all text-gray-800"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white
                           font-black px-5 py-3 rounded-2xl hover:scale-105 active:scale-95
                           transition-all shadow-lg text-lg"
              >
                ✓
              </button>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="flex-1 py-3 rounded-xl font-bold bg-amber-100 text-amber-700
                           hover:bg-amber-200 transition-all disabled:opacity-40 text-sm"
              >
                💡 Hint (-5pts)
              </button>
              <button
                onClick={newScramble}
                className="flex-1 py-3 rounded-xl font-bold bg-blue-100 text-blue-700
                           hover:bg-blue-200 transition-all text-sm"
              >
                🔀 Reshuffle
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600
                           hover:bg-gray-200 transition-all text-sm"
              >
                ⏭️ Skip
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 bg-white/70 rounded-2xl p-4 text-center text-gray-600 text-sm">
          <strong>How to play:</strong> Rearrange the letters to form the correct word.
          Build streaks for bonus points! Use hints if you're stuck.
        </div>
        <AdBanner size="banner" slot="word-bottom" className="mt-4" />
      </div>
    </div>
  );
}
