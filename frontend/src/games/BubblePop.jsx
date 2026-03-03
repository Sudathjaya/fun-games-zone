import React, { useState, useCallback, useRef } from 'react';
import GameHeader from '../components/GameHeader';

const COLORS = [
  'from-pink-400 to-pink-500',
  'from-purple-400 to-purple-500',
  'from-blue-400 to-blue-500',
  'from-green-400 to-green-500',
  'from-yellow-400 to-yellow-500',
  'from-red-400 to-red-500',
  'from-indigo-400 to-indigo-500',
  'from-teal-400 to-teal-500',
  'from-orange-400 to-orange-500',
];

let uid = 0;
function makeBubble() {
  return {
    id: uid++,
    x: Math.random() * 82 + 4,
    y: Math.random() * 78 + 4,
    size: Math.floor(Math.random() * 45) + 35,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    popping: false,
  };
}

const INIT = Array.from({ length: 15 }, makeBubble);

export default function BubblePop({ onBack, game }) {
  const [bubbles, setBubbles] = useState(INIT);
  const [score, setScore] = useState(0);
  const [pops, setPops] = useState([]);
  const popIdRef = useRef(0);

  const pop = useCallback((id, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = rect.left + rect.width / 2;
    const py = rect.top + rect.height / 2;
    const popId = popIdRef.current++;

    setPops(prev => [...prev, { id: popId, x: px, y: py }]);
    setTimeout(() => setPops(prev => prev.filter(p => p.id !== popId)), 600);

    setBubbles(prev =>
      prev.map(b => b.id === id ? { ...b, popping: true } : b)
    );
    setScore(s => s + 1);

    setTimeout(() => {
      setBubbles(prev => [
        ...prev.filter(b => b.id !== id),
        makeBubble(),
      ]);
    }, 350);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500 select-none">
      <GameHeader
        title={game.name}
        onBack={onBack}
        extra={<span className="font-bold text-white text-sm">💥 {score} popped</span>}
      />

      <div className="text-center text-white/80 text-sm py-2">
        Pop bubbles to relax — no timer, no pressure 😊
      </div>

      <div
        className="relative mx-auto rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20"
        style={{ width: '100%', maxWidth: 600, height: 480 }}
      >
        {bubbles.map(b => (
          <button
            key={b.id}
            onClick={e => !b.popping && pop(b.id, e)}
            className={`absolute rounded-full bg-gradient-to-br ${b.color} shadow-xl
                        flex items-center justify-center text-white
                        transition-all duration-300 hover:scale-110 active:scale-90
                        ${b.popping ? 'scale-0 opacity-0' : 'opacity-90'}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              transform: b.popping ? 'scale(0)' : 'translate(-50%,-50%)',
              marginLeft: b.popping ? 0 : 0,
            }}
          >
            <span style={{ fontSize: b.size * 0.35 }}>🫧</span>
          </button>
        ))}

        {pops.map(p => (
          <div
            key={p.id}
            className="fixed pointer-events-none text-2xl animate-ping"
            style={{ left: p.x, top: p.y, transform: 'translate(-50%,-50%)', zIndex: 50 }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="text-center mt-5 space-y-1">
        <div className="text-white text-2xl font-black">💥 {score}</div>
        <div className="text-white/60 text-sm">bubbles popped</div>
        <div className="text-white/50 text-xs mt-2">Take a deep breath and just pop 🫧</div>
      </div>
    </div>
  );
}
