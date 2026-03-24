import React, { useState } from 'react';

export default function GameCard({ game, onPlay }) {
  const [showHowTo, setShowHowTo] = useState(false);

  const difficultyColor = {
    Easy:   'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard:   'bg-red-100 text-red-700',
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden
                    transition-all duration-300 hover:scale-105 hover:shadow-2xl
                    hover:shadow-violet-500/30 flex flex-col h-full">

      {/* Colored top banner */}
      <div className={`bg-gradient-to-r ${game.gradient} p-8 flex flex-col items-center justify-center min-h-[140px]`}>
        <div className="text-6xl mb-2 drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
          {game.icon}
        </div>
        <h3 className="text-white font-black text-xl text-center text-shadow">
          {game.name}
        </h3>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-gray-600 text-base leading-relaxed mb-3 flex-1">
          {game.description}
        </p>

        {/* How to Play toggle */}
        {game.howToPlay && (
          <div className="mb-3">
            <button
              onClick={() => setShowHowTo(v => !v)}
              className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 transition-colors"
            >
              <span>{showHowTo ? '▲' : '▼'}</span>
              {showHowTo ? 'Hide instructions' : 'How to play'}
            </button>
            {showHowTo && (
              <p className="mt-2 text-gray-500 text-xs leading-relaxed bg-violet-50 rounded-xl p-3 border border-violet-100">
                {game.howToPlay}
              </p>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyColor[game.difficulty]}`}>
            {game.difficulty}
          </span>
          {game.tags.map(tag => (
            <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {tag}
            </span>
          ))}
        </div>

        {/* Play Button */}
        <button
          onClick={onPlay}
          className={`w-full py-4 rounded-2xl font-black text-lg text-white
            bg-gradient-to-r ${game.gradient}
            transition-all duration-200 hover:opacity-90 active:scale-95
            shadow-md hover:shadow-lg`}
        >
          ▶ Play Now
        </button>
      </div>
    </div>
  );
}
