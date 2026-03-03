import React from 'react';

export default function GameHeader({ game, score, extra, onBack }) {
  return (
    <div className={`bg-gradient-to-r ${game.gradient} text-white shadow-xl`}>
      <div className="max-w-4xl mx-auto px-3 py-3 flex items-center gap-2">

        {/* Back button — icon-only on very small screens, text on sm+ */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-white/20 hover:bg-white/30
                     rounded-xl px-3 py-2 font-bold transition-all duration-200
                     hover:scale-105 active:scale-95 flex-shrink-0 text-sm sm:text-base"
        >
          <span>←</span>
          <span className="hidden xs:inline sm:inline">Back</span>
        </button>

        {/* Title — centered, truncates on small screens */}
        <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
          <span className="text-2xl sm:text-3xl flex-shrink-0">{game.icon}</span>
          <h1 className="text-base sm:text-xl md:text-2xl font-black truncate">
            {game.name}
          </h1>
        </div>

        {/* Score / extra — shrinks on small screens */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {extra && <div className="hidden sm:block">{extra}</div>}
          {score !== undefined && (
            <div className="bg-white/20 rounded-xl px-3 py-1 sm:px-4 sm:py-2
                            font-black text-sm sm:text-lg text-center whitespace-nowrap">
              {score}
            </div>
          )}
        </div>
      </div>

      {/* On mobile, show "extra" (e.g. timer) in a second row */}
      {extra && (
        <div className="sm:hidden px-3 pb-2 flex justify-center">
          {extra}
        </div>
      )}
    </div>
  );
}
