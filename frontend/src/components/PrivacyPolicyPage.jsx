import React from 'react';

export default function PrivacyPolicyPage({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button onClick={onBack}
          className="text-white/70 hover:text-white font-bold flex items-center gap-2 transition-colors">
          ← Back
        </button>
        <h1 className="text-white font-black text-lg">Privacy Policy</h1>
        <div className="w-16" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 text-white/80 text-sm leading-relaxed space-y-6">

        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
          <p className="text-violet-300 text-xs">Last updated: March 2025</p>
          <p className="mt-2">
            Fun Games Zone ("we", "our", or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information
            when you visit our website at <span className="text-violet-300">fungameszone.com</span> and
            play our free online games.
          </p>
        </div>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">1. Information We Collect</h2>

          <h3 className="text-violet-300 font-bold">a) Information you provide</h3>
          <p>
            When you create an account or sign in using Google or Facebook, we receive your
            name, email address, and profile picture from those providers. We do not receive
            your social media passwords.
          </p>

          <h3 className="text-violet-300 font-bold">b) Game data</h3>
          <p>
            We store your game scores, high scores, and leaderboard rankings in our secure
            database (Google Firebase / Firestore) to power the leaderboard and profile features.
          </p>

          <h3 className="text-violet-300 font-bold">c) Automatically collected data</h3>
          <p>
            Like most websites, we automatically collect certain information when you visit,
            including your IP address, browser type, device type, pages visited, and time
            spent on the site. This is used for analytics and to improve the site.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To provide and maintain our free gaming service</li>
            <li>To save your game progress, scores, and leaderboard rankings</li>
            <li>To personalise your experience (display your name and avatar)</li>
            <li>To improve our games and website based on usage patterns</li>
            <li>To respond to your messages sent via our contact form</li>
            <li>To display relevant advertisements through Google AdSense</li>
          </ul>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">3. Cookies and Advertising</h2>
          <p>
            Fun Games Zone uses cookies to enhance your experience and to serve personalised
            advertisements via <strong className="text-white">Google AdSense</strong>.
            Google AdSense uses cookies to display ads based on your prior visits to this
            website and other sites on the internet.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads based
            on your visit to our site and/or other sites on the internet. You may opt out of
            personalised advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads"
              className="text-violet-400 underline" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>.
          </p>
          <p>
            We also use Firebase Analytics cookies to understand how visitors use our site.
            This data is aggregated and anonymous.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">4. Third-Party Services</h2>
          <p>We use the following third-party services which have their own privacy policies:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-white">Google Firebase</strong> — authentication, database, analytics</li>
            <li><strong className="text-white">Google AdSense</strong> — advertising</li>
            <li><strong className="text-white">Facebook Login</strong> — optional sign-in method</li>
            <li><strong className="text-white">Google Sign-In</strong> — optional sign-in method</li>
          </ul>
          <p>
            We do not sell, trade, or rent your personal information to any third parties.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">5. Children's Privacy</h2>
          <p>
            Fun Games Zone is designed for all ages including children. We do not knowingly
            collect personal information from children under 13 without verifiable parental
            consent. Our games can be played without creating an account — signing in is
            optional and only required for leaderboard features.
          </p>
          <p>
            If you are a parent and believe your child has provided personal information,
            please contact us and we will delete it promptly.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">6. Data Security</h2>
          <p>
            We use Google Firebase, which provides industry-standard security including
            encryption in transit (HTTPS) and at rest. We implement appropriate technical
            and organisational measures to protect your personal information against
            unauthorised access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Withdraw consent for data processing at any time</li>
            <li>Opt out of personalised advertising</li>
          </ul>
          <p>To exercise these rights, contact us at the email below.</p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on
            this page with an updated date. Continued use of Fun Games Zone after changes
            constitutes your acceptance of the revised policy.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data,
            please contact us:
          </p>
          <p>
            📧 <a href="mailto:hello@fungameszone.com"
              className="text-violet-400 underline">hello@fungameszone.com</a>
          </p>
          <p>🌐 Fun Games Zone — Free Online Games for Everyone</p>
        </section>

        <p className="text-center text-white/30 text-xs pb-4">
          © 2025 Fun Games Zone. All rights reserved.
        </p>
      </div>
    </div>
  );
}
