import React from 'react';

export default function TermsPage({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button onClick={onBack}
          className="text-white/70 hover:text-white font-bold flex items-center gap-2 transition-colors">
          ← Back
        </button>
        <h1 className="text-white font-black text-lg">Terms of Service</h1>
        <div className="w-16" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 text-white/80 text-sm leading-relaxed space-y-6">

        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
          <p className="text-violet-300 text-xs">Last updated: March 2025</p>
          <p className="mt-2">
            Welcome to Fun Games Zone! By accessing or using our website at{' '}
            <span className="text-violet-300">fungameszone.com</span>, you agree to be bound
            by these Terms of Service. Please read them carefully before using our site.
          </p>
        </div>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">1. Acceptance of Terms</h2>
          <p>
            By using Fun Games Zone, you confirm that you accept these Terms of Service and
            agree to comply with them. If you do not agree, please do not use our website.
            These terms apply to all visitors, registered users, and anyone else who accesses
            or uses the service.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">2. Description of Service</h2>
          <p>
            Fun Games Zone is a free online gaming platform that provides a collection of
            browser-based games for entertainment and brain training purposes. The service
            includes optional user accounts, leaderboards, and profile features. All games
            are provided free of charge.
          </p>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the service
            at any time without prior notice.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">3. User Accounts</h2>
          <p>
            You may use our games without creating an account. If you choose to sign in using
            Google or Facebook, you are responsible for:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorised use of your account</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">4. Acceptable Use</h2>
          <p>You agree NOT to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to cheat, hack, or manipulate game scores or leaderboards</li>
            <li>Use automated bots, scripts, or tools to play games or inflate scores</li>
            <li>Attempt to gain unauthorised access to any part of the service or its servers</li>
            <li>Transmit any harmful, offensive, or disruptive content</li>
            <li>Interfere with the proper working of the website</li>
            <li>Scrape, copy, or redistribute our content without permission</li>
          </ul>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">5. Intellectual Property</h2>
          <p>
            All content on Fun Games Zone — including but not limited to game code, graphics,
            text, logos, and design — is owned by Fun Games Zone or its content suppliers
            and is protected by applicable intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or create derivative works of our
            content without our express written permission.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">6. Advertising</h2>
          <p>
            Fun Games Zone displays advertisements served by Google AdSense and potentially
            other advertising partners. These ads help keep the service free for all users.
            We are not responsible for the content of third-party advertisements.
          </p>
          <p>
            By using our service, you acknowledge and accept that advertisements will be
            displayed on the website.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">7. Disclaimer of Warranties</h2>
          <p>
            Fun Games Zone is provided on an "as is" and "as available" basis without any
            warranties of any kind, either express or implied. We do not warrant that:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>The service will be uninterrupted or error-free</li>
            <li>The results of using the service will be accurate or reliable</li>
            <li>The quality of any games, content, or information will meet your expectations</li>
          </ul>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Fun Games Zone shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages arising
            from your use of, or inability to use, the service. Our total liability for any
            claim related to the service shall not exceed the amount you paid us in the
            past 12 months (which, for our free service, is zero).
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">9. Privacy</h2>
          <p>
            Your use of Fun Games Zone is also governed by our{' '}
            <span className="text-violet-400">Privacy Policy</span>, which is incorporated
            into these Terms of Service by reference. By using the service, you consent to
            the data practices described in our Privacy Policy.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">10. Changes to Terms</h2>
          <p>
            We may revise these Terms of Service at any time by updating this page. You are
            expected to check this page periodically for changes. Continued use of Fun Games
            Zone after any changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">11. Governing Law</h2>
          <p>
            These Terms of Service are governed by and construed in accordance with applicable
            laws. Any disputes relating to these terms shall be subject to the exclusive
            jurisdiction of the relevant courts.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">12. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us:
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
