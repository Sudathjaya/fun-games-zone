import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const GAME_ICONS = {
  memory: '🎴', tictactoe: '⭕', number: '🔢', word: '📝', snake: '🐍',
  whackamole: '🦔', simon: '🌈', math: '➕', bubblepop: '🫧', breathing: '🌬️',
  stroop: '🎨', trivia: '🧠', reaction: '⚡', sequence: '🔢', '2048': '🔢',
  sudoku: '🔣', sliding: '🧩', minesweeper: '💣', checkers: '🔴', chess: '♟',
  ludo: '🎲', uno: '🃏',
};

function LeaderboardModal({ gameId, gameName, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(
          collection(db, 'leaderboard', gameId, 'entries'),
          orderBy('score', 'desc'),
          limit(10)
        );
        const snap = await getDocs(q);
        setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
      setLoading(false);
    }
    fetch();
  }, [gameId]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-white/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-black text-lg">{GAME_ICONS[gameId]} {gameName} Leaderboard</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>
        {loading ? (
          <p className="text-white/50 text-center py-6">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-white/50 text-center py-6">No scores yet. Be the first!</p>
        ) : (
          <div className="space-y-2">
            {entries.map((e, i) => (
              <div key={e.id} className={`flex items-center gap-3 rounded-xl px-3 py-2
                ${i === 0 ? 'bg-yellow-500/20 border border-yellow-500/40' :
                  i === 1 ? 'bg-gray-400/20 border border-gray-400/30' :
                  i === 2 ? 'bg-amber-700/20 border border-amber-700/30' : 'bg-white/5'}`}>
                <span className="text-lg w-6 text-center font-black text-white/60">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                {e.photoURL ? (
                  <img src={e.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-black">
                    {(e.name || '?')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-white font-bold flex-1 truncate">{e.name || 'Player'}</span>
                <span className="text-yellow-400 font-black">{e.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage({ onBack, games }) {
  const { currentUser, signOut } = useAuth();
  const [scores, setScores] = useState({});
  const [loadingScores, setLoadingScores] = useState(true);
  const [leaderboardGame, setLeaderboardGame] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    async function fetchScores() {
      try {
        const snap = await getDocs(collection(db, 'users', currentUser.uid, 'scores'));
        const s = {};
        snap.docs.forEach(d => { s[d.id] = d.data().best; });
        setScores(s);
      } catch {}
      setLoadingScores(false);
    }
    fetchScores();
  }, [currentUser]);

  const totalGamesPlayed = Object.keys(scores).length;
  const topScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button onClick={onBack} className="text-white/70 hover:text-white font-bold flex items-center gap-2 transition-colors">
          ← Back
        </button>
        <h1 className="text-white font-black text-lg">My Profile</h1>
        <button onClick={signOut}
          className="text-red-400 hover:text-red-300 text-sm font-bold transition-colors">
          Sign Out
        </button>
      </div>

      {/* Avatar + info */}
      <div className="flex flex-col items-center py-8 gap-3 px-4">
        {currentUser?.photoURL ? (
          <img src={currentUser.photoURL} alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-violet-400 shadow-2xl"
            referrerPolicy="no-referrer" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center
                          text-white text-4xl font-black border-4 border-violet-400 shadow-2xl">
            {(currentUser?.displayName || '?')[0].toUpperCase()}
          </div>
        )}
        <div className="text-center">
          <h2 className="text-white text-2xl font-black">{currentUser?.displayName || 'Player'}</h2>
          <p className="text-white/50 text-sm">{currentUser?.email}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-2">
          <div className="bg-white/10 rounded-2xl px-5 py-3 text-center">
            <div className="text-white font-black text-2xl">{totalGamesPlayed}</div>
            <div className="text-white/50 text-xs">Games Played</div>
          </div>
          <div className="bg-white/10 rounded-2xl px-5 py-3 text-center">
            <div className="text-yellow-400 font-black text-2xl">{topScore.toLocaleString()}</div>
            <div className="text-white/50 text-xs">Total Score</div>
          </div>
        </div>
      </div>

      {/* Game scores */}
      <div className="px-4 pb-8">
        <h3 className="text-white font-black text-lg mb-3">Best Scores</h3>
        {loadingScores ? (
          <p className="text-white/40 text-center py-8">Loading scores...</p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {games.map(game => {
              const best = scores[game.id];
              return (
                <div key={game.id}
                  className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                  <span className="text-2xl">{game.icon}</span>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">{game.name}</div>
                    {best !== undefined ? (
                      <div className="text-yellow-400 text-xs font-bold">Best: {best.toLocaleString()}</div>
                    ) : (
                      <div className="text-white/30 text-xs">Not played yet</div>
                    )}
                  </div>
                  <button onClick={() => setLeaderboardGame(game)}
                    className="text-violet-400 hover:text-violet-300 text-xs font-bold transition-colors px-2 py-1 rounded-lg hover:bg-white/10">
                    🏆 Top 10
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {leaderboardGame && (
        <LeaderboardModal
          gameId={leaderboardGame.id}
          gameName={leaderboardGame.name}
          onClose={() => setLeaderboardGame(null)}
        />
      )}
    </div>
  );
}
