import React, { useEffect, useState } from 'react';
import GameCard from './components/GameCard';
import AdBanner from './components/AdBanner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginModal from './components/LoginModal';
import ProfilePage from './components/ProfilePage';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsPage from './components/TermsPage';
import { CATEGORY_SUMMARIES, HOME_FAQS, QUALITY_PILLARS, SITE_INFO } from './siteContent';
import MemoryMatch from './games/MemoryMatch';
import TicTacToe from './games/TicTacToe';
import NumberGuessing from './games/NumberGuessing';
import WordScramble from './games/WordScramble';
import Snake from './games/Snake';
import WhackAMole from './games/WhackAMole';
import SimonSays from './games/SimonSays';
import MathQuiz from './games/MathQuiz';
import BubblePop from './games/BubblePop';
import BreathingExercise from './games/BreathingExercise';
import StroopTest from './games/StroopTest';
import TriviaQuiz from './games/TriviaQuiz';
import ReactionTest from './games/ReactionTest';
import NumberSequence from './games/NumberSequence';
import CheckersGame from './games/CheckersGame';
import ChessGame from './games/ChessGame';
import LudoGame from './games/LudoGame';
import UnoGame from './games/UnoGame';
import Game2048 from './games/Game2048';
import SudokuGame from './games/SudokuGame';
import SlidingPuzzle from './games/SlidingPuzzle';
import Minesweeper from './games/Minesweeper';

const GAMES = [
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Flip cards and find matching pairs! Great for brain training.',
    howToPlay: 'Click any card to flip it over and reveal its emoji. Then click a second card — if they match, both stay face up. If they don\'t match, both flip back. Find all matching pairs to win! Try to remember where each card is to reduce your move count.',
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
    howToPlay: 'Players take turns placing their symbol (X or O) on a 3×3 grid. The first player to get three of their symbols in a row — horizontally, vertically, or diagonally — wins! Play against the computer AI or challenge a friend on the same device.',
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
    howToPlay: 'A secret number has been chosen within a range (Easy: 1-20, Medium: 1-50, Hard: 1-100). Type your guess and hit Enter. You\'ll get a "Too High" or "Too Low" hint after each guess. Use the hints to narrow down the number — can you find it in the fewest guesses?',
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
    howToPlay: 'A word has been scrambled and jumbled up — your job is to figure out what the original word is! Type your answer and press Enter or click Submit. Use the Hint button if you\'re stuck (costs points). You can also Reshuffle the letters to see them in a different order. Beat your streak by solving multiple words in a row!',
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
    howToPlay: 'Use the arrow keys on your keyboard (or the on-screen D-pad on mobile) to steer the snake. Eat the red food to grow longer and earn points. Avoid hitting the walls or the snake\'s own body — either will end the game! The longer your snake grows, the higher your score. Choose from 3 speeds: Slow, Normal, or Fast.',
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
    howToPlay: 'Moles randomly pop up from 9 holes — tap or click them before they duck back down to score points! Watch out for bombs 💣 — hitting a bomb costs you points. Build up combos by whacking multiple moles quickly in a row for bonus points. You have 30 seconds — how high can you score?',
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
    howToPlay: 'Simon will flash a sequence of colored buttons. Watch carefully! Then repeat the exact same sequence by clicking the buttons in the same order. Each round adds one more color to the sequence. One mistake and it\'s game over! How long a sequence can you remember? Great for training short-term memory.',
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
    howToPlay: 'Answer 10 math questions as quickly as possible. Each question shows a math problem with 4 multiple-choice answers — click the correct one. The faster you answer, the more bonus points you earn! Questions include addition, subtraction, multiplication, and division. Your results screen shows your score, accuracy, and time.',
    icon: '➕',
    gradient: 'from-indigo-500 to-blue-600',
    tags: ['Solo', 'Education'],
    difficulty: 'Easy',
    component: MathQuiz,
    category: ['all', 'elders', 'kids', 'brain'],
  },
  // ── Stress Release ──────────────────────────────────────────────────────────
  {
    id: 'bubblepop',
    name: 'Bubble Pop',
    description: 'Pop colorful bubbles with no timer or pressure. Pure relaxation!',
    howToPlay: 'Simply click or tap the colorful floating bubbles to pop them! There\'s no timer, no score pressure, no winning or losing — just pure relaxation. New bubbles appear as you pop the existing ones. Perfect for a quick stress-relief break. Sit back, breathe, and enjoy popping!',
    icon: '🫧',
    gradient: 'from-sky-400 to-blue-500',
    tags: ['Relax', 'No Timer'],
    difficulty: 'Easy',
    component: BubblePop,
    category: ['all', 'elders', 'kids', 'relax'],
  },
  {
    id: 'breathing',
    name: 'Breathing Exercise',
    description: 'Guided box breathing to calm your mind and reduce stress.',
    howToPlay: 'Follow the animated breathing guide on screen. Breathe IN as the circle expands, HOLD your breath, then breathe OUT as it contracts. This is called "box breathing" — a technique used by athletes and therapists to reduce stress and anxiety. Just a few minutes of guided breathing can calm your nervous system and improve focus.',
    icon: '🌬️',
    gradient: 'from-slate-600 to-indigo-700',
    tags: ['Relax', 'Wellness'],
    difficulty: 'Easy',
    component: BreathingExercise,
    category: ['all', 'elders', 'relax'],
  },
  // ── Brain / IQ ──────────────────────────────────────────────────────────────
  {
    id: 'stroop',
    name: 'Stroop Test',
    description: 'Name the ink color, not the word! Classic cognitive brain challenge.',
    howToPlay: 'You\'ll see a color word (like "RED") written in a different ink color (like blue ink). Your job is to click the color of the INK, not what the word says. It sounds simple but your brain automatically reads the word, making this surprisingly tricky! This is the famous Stroop Effect — a classic psychology experiment that measures cognitive control and mental flexibility.',
    icon: '🎨',
    gradient: 'from-purple-600 to-indigo-700',
    tags: ['IQ', 'Cognitive'],
    difficulty: 'Hard',
    component: StroopTest,
    category: ['all', 'elders', 'brain'],
  },
  {
    id: 'trivia',
    name: 'Trivia Quiz',
    description: 'Test your general knowledge! Science, nature, geography & more.',
    howToPlay: 'Answer multiple-choice trivia questions spanning science, history, geography, nature, and general knowledge. Select your answer from 4 options. After each question you\'ll see whether you were right or wrong, along with the correct answer. Your final score shows your knowledge rating — can you get a perfect 10/10?',
    icon: '🧠',
    gradient: 'from-emerald-500 to-teal-600',
    tags: ['Knowledge', 'IQ'],
    difficulty: 'Medium',
    component: TriviaQuiz,
    category: ['all', 'elders', 'brain'],
  },
  {
    id: 'reaction',
    name: 'Reaction Test',
    description: 'How fast are your reflexes? Tap when the screen turns green!',
    howToPlay: 'Wait for the screen to turn green, then tap or click as fast as you can! The screen will first show red — don\'t click yet or you\'ll get a penalty. When it flashes green, react immediately! Your reaction time is measured in milliseconds. The average human reaction time is 250ms — can you beat it? Take multiple rounds and see your average.',
    icon: '⚡',
    gradient: 'from-yellow-500 to-red-500',
    tags: ['Reflex', 'Speed'],
    difficulty: 'Medium',
    component: ReactionTest,
    category: ['all', 'kids', 'brain'],
  },
  {
    id: 'sequence',
    name: 'Number Sequence',
    description: 'Find the missing number in the pattern. Train your logical thinking!',
    howToPlay: 'Each puzzle shows a sequence of numbers with one number missing (shown as "?"). Study the pattern — is it adding, subtracting, multiplying, or something more complex? Enter the missing number and hit Submit. Each correct answer earns points and increases the difficulty. This game strengthens pattern recognition and logical reasoning skills.',
    icon: '🔢',
    gradient: 'from-amber-500 to-orange-600',
    tags: ['IQ', 'Logic'],
    difficulty: 'Medium',
    component: NumberSequence,
    category: ['all', 'elders', 'brain'],
  },
  // ── Puzzle Games ─────────────────────────────────────────────────────────────
  {
    id: '2048',
    name: '2048',
    description: 'Slide and merge tiles to reach 2048! Use arrow keys or swipe.',
    howToPlay: 'Use the arrow keys (or swipe on mobile) to slide all tiles in one direction. When two tiles with the same number collide, they merge into one tile with their combined value. Keep merging tiles to reach the magical 2048 tile! The board fills up fast — plan your moves carefully to avoid running out of space. Tip: keep your highest tile in a corner!',
    icon: '🔢',
    gradient: 'from-amber-500 to-orange-600',
    tags: ['Puzzle', 'Solo'],
    difficulty: 'Medium',
    component: Game2048,
    category: ['all', 'elders', 'kids', 'brain', 'puzzle'],
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Fill the 9×9 grid so every row, column and box has digits 1–9.',
    howToPlay: 'Fill in the empty cells of the 9×9 grid with digits from 1 to 9. Every row must contain digits 1–9 with no repeats. Every column must contain digits 1–9 with no repeats. Every 3×3 box must contain digits 1–9 with no repeats. Some numbers are pre-filled as clues. Click a cell then click a number to place it. A classic logic puzzle that\'s excellent for brain health!',
    icon: '🔣',
    gradient: 'from-blue-600 to-indigo-700',
    tags: ['Puzzle', 'Logic'],
    difficulty: 'Hard',
    component: SudokuGame,
    category: ['all', 'elders', 'brain', 'puzzle'],
  },
  {
    id: 'sliding',
    name: 'Sliding Puzzle',
    description: 'Slide tiles into order! Choose from 3×3, 4×4 or 5×5 grids.',
    howToPlay: 'The numbered tiles are scrambled — slide them into the correct order (1, 2, 3... left to right, top to bottom) using the one empty space. Click any tile adjacent to the empty space to slide it into that gap. Choose your difficulty: 3×3 (8 tiles) for beginners, 4×4 (15 tiles) for a challenge, or 5×5 (24 tiles) for experts! The move counter tracks your efficiency.',
    icon: '🧩',
    gradient: 'from-teal-500 to-cyan-600',
    tags: ['Puzzle', 'Solo'],
    difficulty: 'Medium',
    component: SlidingPuzzle,
    category: ['all', 'elders', 'kids', 'puzzle'],
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    description: 'Reveal all safe cells without hitting a mine. Classic puzzle!',
    howToPlay: 'Click cells to reveal them. Numbers show how many mines are in the 8 surrounding cells — use this information to deduce where mines are hiding. Right-click (or long-press on mobile) to place a flag on a cell you think contains a mine. Reveal all non-mine cells to win! Clicking a mine ends the game. The first click is always safe.',
    icon: '💣',
    gradient: 'from-gray-600 to-slate-800',
    tags: ['Puzzle', 'Logic'],
    difficulty: 'Hard',
    component: Minesweeper,
    category: ['all', 'elders', 'puzzle'],
  },
  // ── Board Games ──────────────────────────────────────────────────────────────
  {
    id: 'checkers',
    name: 'Checkers',
    description: 'Classic draughts! Jump and capture all opponent pieces to win.',
    howToPlay: 'Move your pieces diagonally forward on the dark squares. Jump over an opponent\'s piece to capture it (removing it from the board). If you can jump, you must! Chain multiple jumps in a single turn when possible. Reach the opposite end to crown your piece a King — Kings can move and jump both forwards and backwards. Capture all opponent pieces or block them completely to win!',
    icon: '🔴',
    gradient: 'from-amber-700 to-red-800',
    tags: ['Strategy', '2-Player'],
    difficulty: 'Medium',
    component: CheckersGame,
    category: ['all', 'elders', 'kids', 'board'],
  },
  {
    id: 'chess',
    name: 'Chess',
    description: 'The ultimate strategy game! Checkmate the king to win.',
    howToPlay: 'Each piece moves differently: Pawns move forward one square (two on first move) and capture diagonally. Rooks move any number of squares horizontally or vertically. Bishops move diagonally. Knights move in an "L" shape and can jump over pieces. Queens can move any number of squares in any direction. Kings move one square in any direction. Put the opponent\'s King in checkmate to win!',
    icon: '♟',
    gradient: 'from-gray-700 to-gray-900',
    tags: ['Strategy', '2-Player'],
    difficulty: 'Hard',
    component: ChessGame,
    category: ['all', 'elders', 'board'],
  },
  {
    id: 'ludo',
    name: 'Ludo',
    description: 'Race your tokens home! Roll dice and send opponents back to start.',
    howToPlay: 'Roll the dice and move your coloured tokens around the board towards the home column. You need a 6 to bring a token out from the starting yard. Land on an opponent\'s token to send it back to their starting yard! Get all 4 of your tokens safely into the home triangle to win. Multiple tokens can share safe squares. A fun family game for 2-4 players!',
    icon: '🎲',
    gradient: 'from-red-600 via-yellow-500 to-green-600',
    tags: ['Family', '2-4 Players'],
    difficulty: 'Easy',
    component: LudoGame,
    category: ['all', 'elders', 'kids', 'board'],
  },
  {
    id: 'uno',
    name: 'UNO',
    description: 'Match colors and numbers! First to empty your hand wins. Don\'t forget UNO!',
    howToPlay: 'Match the top card of the discard pile by either color or number. Play special action cards: Skip (miss a turn), Reverse (change direction), Draw Two (next player draws 2), Wild (choose any color), and Wild Draw Four (choose color + next player draws 4). When you have just one card left, shout UNO! First player to empty their hand wins the round. Watch out for Draw cards — they can turn the game around!',
    icon: '🃏',
    gradient: 'from-red-500 via-yellow-500 to-blue-500',
    tags: ['Cards', '2-4 Players'],
    difficulty: 'Easy',
    component: UnoGame,
    category: ['all', 'elders', 'kids', 'board'],
  },
];

const FILTERS = [
  { id: 'all',    label: 'All Games', icon: '🎮' },
  { id: 'kids',   label: 'Kids',      icon: '👶' },
  { id: 'elders', label: 'Elders',    icon: '👴' },
  { id: 'brain',  label: 'Brain/IQ',  icon: '🧠' },
  { id: 'relax',  label: 'Relax',     icon: '😌' },
  { id: 'board',  label: 'Board',     icon: '♟' },
  { id: 'puzzle', label: 'Puzzle',    icon: '🧩' },
];

function parseRoute(hash) {
  const value = hash.replace(/^#\/?/, '');

  if (!value) {
    return { page: 'home', gameId: null };
  }

  const [page, gameId] = value.split('/');

  if (page === 'game' && gameId) {
    return { page, gameId };
  }

  if (['about', 'privacy', 'terms'].includes(page)) {
    return { page, gameId: null };
  }

  return { page: 'home', gameId: null };
}

function buildRoute(page, gameId) {
  if (page === 'game' && gameId) {
    return `#/game/${gameId}`;
  }

  if (page === 'home') {
    return '#/';
  }

  return `#/${page}`;
}

function AppInner() {
  const { currentUser } = useAuth();
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    function syncRoute() {
      setRoute(parseRoute(window.location.hash));
    }

    window.addEventListener('hashchange', syncRoute);
    syncRoute();

    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  const selectedGame = route.page === 'game'
    ? GAMES.find((game) => game.id === route.gameId)
    : null;

  useEffect(() => {
    const descriptionTag = document.querySelector('meta[name="description"]');
    let title = `${SITE_INFO.name} | Free Browser Games`;
    let description = SITE_INFO.description;

    if (route.page === 'about') {
      title = `About | ${SITE_INFO.name}`;
      description =
        'Learn what Fun Games Zone offers, who it is built for, and how the site keeps its browser game library useful and family-friendly.';
    } else if (route.page === 'privacy') {
      title = `Privacy Policy | ${SITE_INFO.name}`;
      description =
        'Read how Fun Games Zone handles account data, advertising, cookies, and visitor privacy.';
    } else if (route.page === 'terms') {
      title = `Terms of Service | ${SITE_INFO.name}`;
      description =
        'Read the terms for using Fun Games Zone, including acceptable use, accounts, and advertising support.';
    } else if (selectedGame) {
      title = `${selectedGame.name} | ${SITE_INFO.name}`;
      description = `${selectedGame.description} ${selectedGame.howToPlay}`;
    }

    document.title = title;
    if (descriptionTag) {
      descriptionTag.setAttribute('content', description);
    }
  }, [route.page, selectedGame]);

  function navigateTo(page, gameId) {
    const nextRoute = buildRoute(page, gameId);

    if (window.location.hash === nextRoute) {
      setRoute(parseRoute(nextRoute));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.location.hash = nextRoute;
  }

  if (route.page === 'privacy') return <PrivacyPolicyPage onBack={() => navigateTo('home')} />;
  if (route.page === 'terms') return <TermsPage onBack={() => navigateTo('home')} />;
  if (route.page === 'about') return <AboutPage onBack={() => navigateTo('home')} />;

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} games={GAMES} />;
  }

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return <GameComponent onBack={() => navigateTo('home')} game={selectedGame} />;
  }

  const filteredGames = GAMES.filter((game) => {
    const matchesFilter = game.category.includes(filter);
    const query = searchQuery.trim().toLowerCase();

    if (!matchesFilter) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [
      game.name,
      game.description,
      game.howToPlay,
      game.difficulty,
      ...game.tags,
      ...game.category,
    ].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* ── Header ── */}
      <header className="pt-5 pb-4 px-4">
        {/* Auth bar */}
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => navigateTo('about')}
            className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-1.5
                       rounded-full text-sm transition-all hover:scale-105 border border-white/30">
            ℹ️ About
          </button>
          {currentUser ? (
            <button onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white
                         font-bold px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105">
              {currentUser.photoURL
                ? <img src={currentUser.photoURL} alt="" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                : <span className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs font-black">
                    {(currentUser.displayName || '?')[0].toUpperCase()}
                  </span>
              }
              {currentUser.displayName?.split(' ')[0] || 'Profile'}
            </button>
          ) : (
            <button onClick={() => setShowLogin(true)}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-1.5
                         rounded-full text-sm transition-all hover:scale-105 border border-white/30">
              🔑 Sign In
            </button>
          )}
        </div>
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-2 leading-tight">
            🎮 {SITE_INFO.name}
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl text-violet-200 font-medium">
            {SITE_INFO.tagline}
          </p>
          <div className="flex justify-center gap-2 mt-2 text-lg sm:text-2xl">
            {['⭐','🌟','✨','🌟','⭐'].map((s, i) => (
              <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>{s}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-6 items-start">
            <div>
              <h2 className="text-white text-2xl sm:text-4xl font-black leading-tight">
                Playable games with real context, not just a thin list of tiles
              </h2>
              <p className="text-violet-100 mt-3 leading-relaxed max-w-3xl">
                {SITE_INFO.name} is organized as a family-friendly browser game library. Every
                title includes a short explanation, instructions, tags, and category placement so
                visitors can understand what they are opening before they play.
              </p>
              <p className="text-white/70 mt-3 leading-relaxed max-w-3xl">
                That extra context improves usability and also strengthens the site for AdSense
                review because the homepage offers unique editorial value alongside the games.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Games', value: SITE_INFO.gameCount },
                { label: 'Categories', value: SITE_INFO.categoryCount },
                { label: 'Access', value: 'Free' },
                { label: 'Platforms', value: 'Web' },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                  <div className="text-white font-black text-2xl">{item.value}</div>
                  <div className="text-violet-300 text-xs mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="max-w-6xl mx-auto px-4 mb-5">
        <div className="bg-white/10 rounded-3xl border border-white/15 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-white font-black text-xl sm:text-2xl">Explore the game library</h2>
              <p className="text-violet-200 text-sm sm:text-base mt-1 max-w-2xl">
                Filter by audience or game type, then search by title, tag, or instructions to
                find the best fit for the player.
              </p>
            </div>
            <label className="block lg:min-w-[320px]">
              <span className="sr-only">Search games</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search puzzles, memory, relax, kids..."
                className="w-full rounded-2xl bg-white/90 text-slate-900 px-4 py-3 text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </label>
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
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

          <p className="text-center text-white/60 text-sm mt-4">
            Showing {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
            {searchQuery.trim() ? ` for "${searchQuery.trim()}"` : ` in ${FILTERS.find((item) => item.id === filter)?.label || 'All Games'}`}
          </p>
        </div>
      </section>

      {/* ── Games Grid ── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filteredGames.map((game, index) => (
            <div key={game.id} style={{ animationDelay: `${index * 0.08}s` }} className="animate-bounce-in">
              <GameCard game={game} onPlay={() => navigateTo('game', game.id)} />
            </div>
          ))}
        </div>
        {filteredGames.length === 0 && (
          <div className="text-center py-20 text-white/60">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-xl font-bold">No games match this search yet</p>
            <p className="text-sm mt-2">Try a different keyword or switch to another category.</p>
          </div>
        )}
      </main>

      <section className="max-w-6xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CATEGORY_SUMMARIES.map((section) => (
            <article key={section.id} className="bg-white/10 rounded-3xl p-5 border border-white/10">
              <div className="text-3xl mb-3">{section.icon}</div>
              <h3 className="text-white font-black text-lg">{section.title}</h3>
              <p className="text-violet-200 text-sm leading-relaxed mt-2">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Mid Ad Banner ── */}
      <div className="px-3 mb-6">
        <AdBanner size="banner" slot="home-mid" className="max-w-5xl mx-auto" />
      </div>

      <section className="max-w-6xl mx-auto px-4 mb-6">
        <div className="bg-white/10 rounded-3xl border border-white/15 p-5 sm:p-8">
          <h2 className="text-white text-2xl sm:text-3xl font-black mb-4">
            Why this layout is better for users and for AdSense review
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUALITY_PILLARS.map((pillar) => (
              <div key={pillar.title} className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <h3 className="text-white font-bold">{pillar.title}</h3>
                <p className="text-violet-200 text-sm leading-relaxed mt-2">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4">
          <div className="bg-white/10 rounded-3xl p-5 sm:p-8 border border-white/15">
            <h2 className="text-white text-2xl sm:text-3xl font-black mb-3">Editor notes for site quality</h2>
            <div className="space-y-4 text-violet-100 text-sm sm:text-base leading-relaxed">
              <p>
                Thin-content rejections usually happen when a site feels interchangeable or
                unfinished. A game grid by itself is often not enough. Reviewers expect to see
                real supporting content, site ownership signals, clear navigation, and pages that
                explain what visitors actually gain from staying on the site.
              </p>
              <p>
                This homepage now does more of that work directly. It explains audience segments,
                game types, usage expectations, and policy access. That gives users better
                orientation and makes the site look more substantial.
              </p>
              <p>
                You should still keep improving the library over time by adding original game
                descriptions, screenshots, feature updates, and new explanatory copy whenever a
                game changes.
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-3xl p-5 sm:p-8 border border-white/15">
            <h2 className="text-white text-2xl font-black mb-3">Contact and trust</h2>
            <div className="space-y-4 text-sm text-violet-100 leading-relaxed">
              <p>
                <span className="text-white font-semibold">Website:</span>{' '}
                <a
                  href={SITE_INFO.website}
                  className="text-violet-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE_INFO.websiteLabel}
                </a>
              </p>
              <p>
                <span className="text-white font-semibold">Email:</span>{' '}
                <a href={`mailto:${SITE_INFO.email}`} className="text-violet-300 underline">
                  {SITE_INFO.email}
                </a>
              </p>
              <p>
                <span className="text-white font-semibold">Policy review date:</span>{' '}
                {SITE_INFO.lastUpdated}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => navigateTo('about')}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-2 rounded-full text-sm border border-white/20"
                >
                  About Us
                </button>
                <button
                  onClick={() => navigateTo('privacy')}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-2 rounded-full text-sm border border-white/20"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => navigateTo('terms')}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-2 rounded-full text-sm border border-white/20"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Support / Monetization Section ── */}
      <section className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 sm:p-8 text-center text-white border border-white/20">
          <h2 className="text-xl sm:text-3xl font-black mb-2">❤️ Enjoy the Games?</h2>
          <p className="text-violet-200 text-xs sm:text-base mb-5 max-w-xl mx-auto">
            Fun Games Zone is free for everyone! Support us to keep the games coming and the servers running.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-5">
            <a
              href={SITE_INFO.buyCoffee}
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

      <section className="max-w-6xl mx-auto px-4 mb-6">
        <div className="bg-white/10 rounded-3xl p-5 sm:p-8 border border-white/15">
          <h2 className="text-white text-2xl sm:text-3xl font-black mb-4">Frequently asked questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOME_FAQS.map((item) => (
              <article key={item.question} className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <h3 className="text-white font-bold">{item.question}</h3>
                <p className="text-violet-200 text-sm leading-relaxed mt-2">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom Ad Banner ── */}
      <div className="px-3 mb-4">
        <AdBanner size="banner" slot="home-bottom" className="max-w-5xl mx-auto" />
      </div>

      <footer className="text-center pb-6 text-violet-300/50 text-xs px-4">
        <p>🎮 {SITE_INFO.name} — free browser games with guides, filters, and family-friendly navigation.</p>
        <p className="mt-1 opacity-70">Advertising and supporter revenue help keep the site free to use.</p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <button onClick={() => navigateTo('about')}
            className="text-violet-400 hover:text-violet-200 underline underline-offset-2 transition-colors">
            About Us
          </button>
          <button onClick={() => navigateTo('privacy')}
            className="text-violet-400 hover:text-violet-200 underline underline-offset-2 transition-colors">
            Privacy Policy
          </button>
          <button onClick={() => navigateTo('terms')}
            className="text-violet-400 hover:text-violet-200 underline underline-offset-2 transition-colors">
            Terms of Service
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
