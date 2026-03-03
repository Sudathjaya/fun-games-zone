import React, { useState, useEffect, useRef } from 'react';
import GameHeader from '../components/GameHeader';

const PHASES = [
  { name: 'Inhale',  duration: 4, color: 'from-blue-400 to-cyan-400',   scale: 'scale-150', text: 'Breathe In...',  tip: 'Slowly fill your lungs' },
  { name: 'Hold',    duration: 4, color: 'from-cyan-400 to-teal-400',   scale: 'scale-150', text: 'Hold...',         tip: 'Hold gently' },
  { name: 'Exhale',  duration: 6, color: 'from-teal-400 to-indigo-400', scale: 'scale-100', text: 'Breathe Out...', tip: 'Slowly release' },
  { name: 'Rest',    duration: 2, color: 'from-indigo-400 to-blue-400', scale: 'scale-100', text: 'Rest...',        tip: 'Pause naturally' },
];

export default function BreathingExercise({ onBack, game }) {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [seconds, setSeconds] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);

  const phase = PHASES[phaseIdx];

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          const next = (phaseIdx + 1) % PHASES.length;
          setPhaseIdx(next);
          if (next === 0) setCycles(c => c + 1);
          setSeconds(PHASES[next].duration);
          return PHASES[next].duration;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, phaseIdx]);

  const toggle = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
      setPhaseIdx(0);
      setSeconds(PHASES[0].duration);
    } else {
      setRunning(true);
    }
  };

  const progress = 1 - (seconds / phase.duration);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 flex flex-col">
      <GameHeader
        game={game}
        onBack={onBack}
        extra={<span className="text-white/70 text-sm">🌀 {cycles} cycles</span>}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
        {/* Breathing circle */}
        <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${phase.color} opacity-20
                          transition-all duration-1000 ${running ? phase.scale : 'scale-100'}`}
               style={{ filter: 'blur(20px)' }} />

          {/* SVG progress ring */}
          <svg className="absolute inset-0" width="260" height="260">
            <circle cx="130" cy="130" r="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <circle
              cx="130" cy="130" r="120"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress)}`}
              transform="rotate(-90 130 130)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>

          {/* Main circle */}
          <div className={`rounded-full bg-gradient-to-br ${phase.color} shadow-2xl
                          flex flex-col items-center justify-center text-white
                          transition-all duration-[4000ms] ease-in-out
                          ${running ? phase.scale : 'scale-100'}`}
               style={{ width: 160, height: 160 }}>
            <div className="text-4xl font-black">{seconds}</div>
            <div className="text-sm font-bold opacity-80">{phase.name}</div>
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center">
          <p className="text-white text-2xl font-bold">{phase.text}</p>
          <p className="text-white/50 text-sm mt-1">{phase.tip}</p>
        </div>

        {/* Phase indicators */}
        <div className="flex gap-3">
          {PHASES.map((p, i) => (
            <div key={p.name} className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all
                              ${i === phaseIdx && running ? 'bg-white scale-125' : 'bg-white/30'}`} />
              <div className="text-white/50 text-xs">{p.name}</div>
              <div className="text-white/30 text-xs">{p.duration}s</div>
            </div>
          ))}
        </div>

        {/* Start/Stop button */}
        <button
          onClick={toggle}
          className={`px-10 py-4 rounded-full text-white font-black text-xl shadow-2xl
                      transition-all hover:scale-105 active:scale-95
                      ${running
                        ? 'bg-red-500 hover:bg-red-400'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400'
                      }`}
        >
          {running ? '■ Stop' : '▶ Start Breathing'}
        </button>

        <p className="text-white/40 text-xs text-center max-w-xs">
          Box breathing (4-4-6-2) reduces stress and calms your nervous system. Practice for 5 minutes daily.
        </p>
      </div>
    </div>
  );
}
