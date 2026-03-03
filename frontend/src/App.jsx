import React, { useState } from 'react';
import GameCard from './components/GameCard';
import AdBanner from './components/AdBanner';
import MemoryMatch from './games/MemoryMatch';
import TicTacToe from './games/TicTacToe';
import NumberGuessing from './games/NumberGuessing';
import WordScramble from './games/WordScramble';
import Snake from './games/Snake';
import WhackAMole from './games/WhackAMole';
import SimonSays from './games/SimonSays';
import MathQuiz from './games/MathQuiz';

const GAMES = [
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Flip cards and find matching pairs! Great for brain training.',
    icon: '🎴',
    gradient: 'from-purple-500 to-violet-600',
    tags: ['All Ages', 'Brain'],
    difficulty: 'Easy',
    component: MemoryMatch,
    category: ['all', 'elders', 'kids'],
  },
  {
    id: 'tictactoe',
    name: 'Tic-Tac-Toe',
    description: 'Classic X vs O! Play against a friend or the computer.',
    icon: '⭕',
    gradient: 'from-blue-500 to-cyan-600',
    tags: ['2 Players', 'Classic'],
    difficulty: 'Easy',
    component: TicTacToe,
    category: ['all', 'elders', 'kids'],
  },
  {
    id: 'number',
    name: 'Number Guessing',
    description: 'Guess the secret number with helpful hints! How fast can you find it?',
    icon: '🔢',
    gradient: 'from-emerald-500 to-teal-600',
    tags: ['Solo', 'Logic'],
    difficulty: 'Medium',
    component: NumberGuessing,
    category: ['all', 'elders', 'kids'],
  },
  {
    id: 'word',
    name: 'Word Scramble',
    description: 'Unscramble the letters to find the hidden word. Beat the clock!',
    icon: '📝',
    gradient: 'from-orange-500 to-amber-600',
    tags: ['Solo', 'Vocabulary'],
    difficulty: 'Medium',
    component: WordScramble,
    category: ['all', 'elders', 'kids'],
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Guide your snake to eat food and grow longer without crashing!',
    icon: '🐍',
    gradient: 'from-green-500 to-emerald-600',
    tags: ['Solo', 'Arcade'],
    difficulty: 'Medium',
    component: Snake,
    category: ['all', 'kids'],
  },
  {
    id: 'whackamole',
    name: 'Whack-a-Mole',
    description: 'Whack the moles as fast as you can before they disappear!',
    icon: '🦔',
    gradient: 'from-yellow-500 to-orange-500',
    tags: ['Reflex', 'Fun'],
    difficulty: 'Easy',
    component: WhackAMole,
    category: ['all', 'kids', 'elders'],
  },
  {
    id: 'simon',
    name: 'Simon Says',
    description: 'Watch the color pattern and repeat it! Each round gets longer.',
    icon: '🌈',
    gradient: 'from-pink-500 to-rose-600',
    tags: ['Memory', 'Pattern'],
    difficulty: 'Hard',
    component: SimonSays,
    category: ['all', 'kids', 'elders'],
  },
  {
    id: 'math',
    name: 'Math Quiz',
    description: 'Test your math skills! Addition, subtraction, and multiplication.',
    icon: '➕',
    gradient: 'from-indigo-500 to-blue-600',
    tags: ['Solo', 'Education'],
    difficulty: 'Easy',
    component: MathQuiz,
    category: ['all', 'elders', 'kids'],
  },
];

const FILTERS = [
  { id: 'all',    label: 'All Games', icon: '🎮' },
  { id: 'kids',   label: 'Kids',      icon: '👶' },
  { id: 'elders', label: 'Elders',    icon: '👴' },
];

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [filter, setFilter] = useState('all');

  if (currentGame) {
    const game = GAMES.find(g => g.id === currentGame);
    if (game) {
      const GameComponent = game.component;
      return <GameComponent onBack={() => setCurrentGame(null)} game={game} />;
    }
  }

  const filteredGames = GAMES.filter(g => g.category.includes(filter));

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">

      {/* ── Top Ad Banner ── */}
      <div className="px-3 pt-2">
        <AdBanner size="small" slot="home-top" className="max-w-5xl mx-auto" />
      </div>

      {/* ── Header ── */}
      <header className="text-center pt-5 pb-4 px-4">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-2 leading-tight">
          🎮 Fun Games Zone
        </h1>
        <p className="text-sm sm:text-xl md:text-2xl text-violet-200 font-medium">
          Games for Everyone — Kids, Elders &amp; All Ages!
        </p>
        <div className="flex justify-center gap-2 mt-2 text-lg sm:text-2xl">
          {['⭐','🌟','✨','🌟','⭐'].map((s, i) => (
            <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>{s}</span>
          ))}
        </div>
      </header>

      {/* ── Filters ── */}
      <div className="flex justify-center gap-2 px-4 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3
                        rounded-full text-sm sm:text-lg font-bold transition-all duration-300 shadow-lg
                        ${filter === f.id
                          ? 'bg-white text-violet-900 scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                        }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Games Grid ── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filteredGames.map((game, index) => (
            <div key={game.id} style={{ animationDelay: `${index * 0.08}s` }} className="animate-bounce-in">
              <GameCard game={game} onPlay={() => setCurrentGame(game.id)} />
            </div>
          ))}
        </div>
        {filteredGames.length === 0 && (
          <div className="text-center py-20 text-white/60">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-xl font-bold">No games for this filter</p>
          </div>
        )}
      </main>

      {/* ── Mid Ad Banner ── */}
      <div className="px-3 mb-6">
        <AdBanner size="banner" slot="home-mid" className="max-w-5xl mx-auto" />
      </div>

      {/* ── Support / Monetization Section ── */}
      <section className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 sm:p-8 text-center text-white border border-white/20">
          <h2 className="text-xl sm:text-3xl font-black mb-2">❤️ Enjoy the Games?</h2>
          <p className="text-violet-200 text-xs sm:text-base mb-5 max-w-xl mx-auto">
            Fun Games Zone is free for everyone! Support us to keep the games coming and the servers running.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-5">
            <a
              href="https://buymeacoffee.com/sudathjaya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300
                         text-yellow-900 font-black px-4 sm:px-6 py-2 sm:py-3 rounded-2xl
                         transition-all hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              ☕ Buy Us a Coffee
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Fun Games Zone 🎮', url: window.location.href });
                } else {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Link copied! Share it 🎮');
                }
              }}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white
                         font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-2xl transition-all
                         hover:scale-105 border border-white/30 text-sm sm:text-base"
            >
              📲 Share with Friends
            </button>
          </div>

          {/* Revenue Streams */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: '📢', title: 'Ad Revenue',     desc: 'Ads keep access free' },
              { icon: '☕', title: 'Donations',       desc: 'Support development' },
              { icon: '⭐', title: 'Premium (Soon)',  desc: 'Ad-free + bonus games' },
            ].map(item => (
              <div key={item.title} className="bg-white/10 rounded-2xl p-3">
                <div className="text-xl sm:text-2xl mb-1">{item.icon}</div>
                <div className="font-bold text-xs sm:text-sm">{item.title}</div>
                <div className="text-violet-300 text-xs mt-1 hidden sm:block">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom Ad Banner ── */}
      <div className="px-3 mb-4">
        <AdBanner size="banner" slot="home-bottom" className="max-w-5xl mx-auto" />
      </div>

      <footer className="text-center pb-6 text-violet-300/50 text-xs px-4">
        <p>🎮 Fun Games Zone — Free games for everyone, always!</p>
        <p className="mt-1 opacity-70">Ad revenue helps keep this site free. Thank you! ❤️</p>
      </footer>
    </div>
  );
}
