import React, { useState } from 'react';
import { QUALITY_PILLARS, SITE_INFO } from '../siteContent';

const STATS = [
  { value: SITE_INFO.gameCount, label: 'Free Games' },
  { value: SITE_INFO.categoryCount, label: 'Categories' },
  { value: 'Desktop + Mobile', label: 'Devices' },
  { value: 'All Ages', label: 'Audience' },
];

const FEATURE_BLOCKS = [
  {
    icon: '🎮',
    title: 'Playable in the browser',
    body: 'Visitors can start quickly without installing apps or creating an account first.',
  },
  {
    icon: '🧠',
    title: 'Mix of fun and focus',
    body: 'The library balances arcade games, memory drills, puzzle solving, and calm exercises.',
  },
  {
    icon: '📚',
    title: 'Useful game context',
    body: 'Each game includes a summary, tags, and instructions so users know what they are opening.',
  },
  {
    icon: '🔒',
    title: 'Clear site policies',
    body: 'Privacy, terms, and contact details are available so the site looks accountable and transparent.',
  },
];

export default function AboutPage({ onBack }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const subject = encodeURIComponent(`Message from ${formData.name} - ${SITE_INFO.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
    );

    window.open(`mailto:${SITE_INFO.email}?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="text-white/70 hover:text-white font-bold flex items-center gap-2 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-white font-black text-lg">About Us</h1>
        <div className="w-16" />
      </div>

      <section className="text-center px-6 py-12 max-w-4xl mx-auto">
        <div className="text-7xl mb-4">🎮</div>
        <h2 className="text-white text-4xl sm:text-5xl font-black mb-3">{SITE_INFO.name}</h2>
        <p className="text-violet-200 text-lg sm:text-xl max-w-2xl mx-auto">
          {SITE_INFO.tagline}
        </p>
        <p className="text-white/70 max-w-3xl mx-auto mt-5 leading-relaxed">
          {SITE_INFO.name} is built as a lightweight browser game library for players who want
          fast entertainment, family-friendly options, and repeatable puzzle or reflex
          challenges without downloading an app. The goal is to make every visit useful, even
          before a player presses the play button.
        </p>
      </section>

      <section className="px-4 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {STATS.map((item) => (
            <div
              key={item.label}
              className="bg-white/10 rounded-2xl p-4 text-center border border-white/10"
            >
              <div className="text-white font-black text-xl sm:text-2xl">{item.value}</div>
              <div className="text-violet-300 text-xs mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-10 max-w-4xl mx-auto">
        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
          <h3 className="text-white font-black text-xl mb-3">Why This Site Exists</h3>
          <div className="space-y-4 text-violet-100 leading-relaxed">
            <p>
              Some visitors want quick brain training. Others want a familiar board game, a
              low-pressure puzzle, or a simple activity they can share with family. Fun Games
              Zone groups those needs into one place with short explanations, clear difficulty
              labels, and easy browsing by audience or category.
            </p>
            <p>
              That structure matters for quality. A game site should not feel like a thin shell
              around ad slots. It should explain what is available, who it is useful for, and
              how the experience works on real devices.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 max-w-4xl mx-auto">
        <h3 className="text-white font-black text-xl mb-4 text-center">What Visitors Get</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURE_BLOCKS.map((item) => (
            <div
              key={item.title}
              className="bg-white/10 rounded-2xl p-5 border border-white/10 flex gap-3 items-start"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="text-white font-bold text-sm">{item.title}</div>
                <div className="text-violet-300 text-sm mt-1 leading-relaxed">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-10 max-w-4xl mx-auto">
        <h3 className="text-white font-black text-xl mb-4 text-center">Quality Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUALITY_PILLARS.map((pillar) => (
            <div key={pillar.title} className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold">{pillar.title}</h4>
              <p className="text-violet-200 text-sm leading-relaxed mt-2">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
            <h3 className="text-white font-black text-xl mb-3">Site Details</h3>
            <div className="space-y-3 text-sm text-violet-100">
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
                <span className="text-white font-semibold">Contact:</span>{' '}
                <a href={`mailto:${SITE_INFO.email}`} className="text-violet-300 underline">
                  {SITE_INFO.email}
                </a>
              </p>
              <p>
                <span className="text-white font-semibold">Monetization:</span> advertising and
                optional supporter donations help keep the games free to access.
              </p>
              <p>
                <span className="text-white font-semibold">Last policy review:</span>{' '}
                {SITE_INFO.lastUpdated}
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
            <h3 className="text-white font-black text-xl mb-3">Support the Project</h3>
            <p className="text-violet-100 text-sm leading-relaxed">
              The site is intended to stay free. If visitors find the games useful, they can
              share the site or support it directly.
            </p>
            <a
              href={SITE_INFO.buyCoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-2xl px-4 py-3 transition-all"
            >
              <span className="text-2xl">☕</span>
              <span className="text-yellow-200 font-black">Buy Us a Coffee</span>
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 max-w-lg mx-auto">
        <h3 className="text-white font-black text-xl mb-4 text-center">Get in Touch</h3>
        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
          {sent ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-400 font-black text-lg">Message prepared</p>
              <p className="text-white/60 text-sm mt-1">Your email app should open next.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wide block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 text-sm"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wide block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 text-sm"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wide block mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white font-black py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                Send Message →
              </button>
              <p className="text-white/40 text-xs text-center">
                Direct email:{' '}
                <a href={`mailto:${SITE_INFO.email}`} className="text-violet-300 hover:underline">
                  {SITE_INFO.email}
                </a>
              </p>
            </form>
          )}
        </div>
      </section>

      <div className="text-center pb-8 text-violet-300/40 text-xs px-4">
        <p>
          © {SITE_INFO.copyrightYear} {SITE_INFO.name}. Free browser games with clear guidance
          and family-friendly navigation.
        </p>
      </div>
    </div>
  );
}
