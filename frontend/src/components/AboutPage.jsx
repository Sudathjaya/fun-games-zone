import React, { useState } from 'react';

// ── Edit your business details here ─────────────────────────────────────────
const BUSINESS = {
  name:     'Fun Games Zone',
  tagline:  'Free Games for Everyone — Kids, Elders & All Ages!',
  mission:  `Fun Games Zone is a free-to-play web gaming platform designed for all ages.
             Whether you're 6 or 60, we have something for you — from brain-training puzzles
             and classic board games to relaxing bubble pops and fast-paced arcade action.
             Our mission is simple: bring joy, fun, and mental stimulation to everyone,
             completely free, forever.`,
  email:    'hello@fungameszone.com',      // ← replace with your email
  website:  'https://fungameszone.vercel.app',
  socials: [
    { name: 'Facebook',  icon: '📘', url: 'https://facebook.com/fungameszone' },
    { name: 'Instagram', icon: '📸', url: 'https://instagram.com/fungameszone' },
    { name: 'Twitter',   icon: '🐦', url: 'https://twitter.com/fungameszone' },
    { name: 'YouTube',   icon: '▶️', url: 'https://youtube.com/@fungameszone' },
  ],
  buyCoffee: 'https://buymeacoffee.com/sudathjaya',
};

const STATS = [
  { value: '22+', label: 'Free Games' },
  { value: '7',   label: 'Categories' },
  { value: '∞',   label: 'Fun' },
  { value: '0',   label: 'Cost' },
];

const FEATURES = [
  { icon: '🎮', title: 'All Ages',       desc: 'Games for kids, elders, and everyone in between' },
  { icon: '🧠', title: 'Brain Training', desc: 'IQ puzzles, memory games, logic challenges' },
  { icon: '😌', title: 'Stress Relief',  desc: 'Calming games and breathing exercises' },
  { icon: '♟',  title: 'Board Games',    desc: 'Chess, Checkers, Ludo, UNO and more' },
  { icon: '🧩', title: 'Puzzles',        desc: '2048, Sudoku, Minesweeper, Sliding Puzzle' },
  { icon: '🏆', title: 'Leaderboards',   desc: 'Sign in and compete with players worldwide' },
];

export default function AboutPage({ onBack }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Opens mailto — replace with a real form service (Formspree, EmailJS) later
    const subject = encodeURIComponent(`Message from ${formData.name} - Fun Games Zone`);
    const body    = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.open(`mailto:${BUSINESS.email}?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button onClick={onBack}
          className="text-white/70 hover:text-white font-bold flex items-center gap-2 transition-colors">
          ← Back
        </button>
        <h1 className="text-white font-black text-lg">About Us</h1>
        <div className="w-16" /> {/* spacer */}
      </div>

      {/* ── Hero ── */}
      <section className="text-center px-6 py-12">
        <div className="text-7xl mb-4">🎮</div>
        <h2 className="text-white text-4xl sm:text-5xl font-black mb-3">
          {BUSINESS.name}
        </h2>
        <p className="text-violet-200 text-lg sm:text-xl max-w-xl mx-auto">
          {BUSINESS.tagline}
        </p>
      </section>

      {/* ── Stats ── */}
      <section className="px-4 pb-10">
        <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
          {STATS.map(s => (
            <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
              <div className="text-white font-black text-2xl sm:text-3xl">{s.value}</div>
              <div className="text-violet-300 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="px-4 pb-10 max-w-2xl mx-auto">
        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
          <h3 className="text-white font-black text-xl mb-3">🚀 Our Mission</h3>
          <p className="text-violet-200 leading-relaxed whitespace-pre-line">
            {BUSINESS.mission}
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 pb-10 max-w-2xl mx-auto">
        <h3 className="text-white font-black text-xl mb-4 text-center">What We Offer</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white/10 rounded-2xl p-4 border border-white/10 flex gap-3 items-start">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="text-white font-bold text-sm">{f.title}</div>
                <div className="text-violet-300 text-xs mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social Links ── */}
      <section className="px-4 pb-10 max-w-2xl mx-auto">
        <h3 className="text-white font-black text-xl mb-4 text-center">Follow Us</h3>
        <div className="grid grid-cols-2 gap-3">
          {BUSINESS.socials.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10
                         rounded-2xl px-4 py-3 transition-all hover:scale-105 group">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-white font-bold text-sm group-hover:text-violet-200">{s.name}</span>
            </a>
          ))}
          <a href={BUSINESS.buyCoffee} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30
                       rounded-2xl px-4 py-3 transition-all hover:scale-105 col-span-2 justify-center">
            <span className="text-2xl">☕</span>
            <span className="text-yellow-300 font-black">Buy Us a Coffee</span>
          </a>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="px-4 pb-12 max-w-lg mx-auto">
        <h3 className="text-white font-black text-xl mb-4 text-center">📬 Get in Touch</h3>
        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
          {sent ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-400 font-black text-lg">Message sent!</p>
              <p className="text-white/60 text-sm mt-1">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wide block mb-1">Your Name</label>
                <input
                  type="text" required placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3
                             text-white placeholder-white/30 focus:outline-none focus:border-violet-400 text-sm"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wide block mb-1">Email</label>
                <input
                  type="email" required placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3
                             text-white placeholder-white/30 focus:outline-none focus:border-violet-400 text-sm"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wide block mb-1">Message</label>
                <textarea
                  required rows={4} placeholder="Your message..."
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3
                             text-white placeholder-white/30 focus:outline-none focus:border-violet-400 text-sm resize-none"
                />
              </div>
              <button type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white font-black py-3 rounded-xl
                           transition-all hover:scale-105 active:scale-95">
                Send Message →
              </button>
              <p className="text-white/30 text-xs text-center">
                Or email directly: <a href={`mailto:${BUSINESS.email}`}
                  className="text-violet-400 hover:underline">{BUSINESS.email}</a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="text-center pb-8 text-violet-300/40 text-xs px-4">
        <p>© 2025 {BUSINESS.name} — Free games for everyone, always!</p>
      </div>
    </div>
  );
}
