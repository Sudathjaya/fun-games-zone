import React from 'react';
import { SITE_INFO } from '../siteContent';

export default function PrivacyPolicyPage({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="text-white/70 hover:text-white font-bold flex items-center gap-2 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-white font-black text-lg">Privacy Policy</h1>
        <div className="w-16" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 text-white/80 text-sm leading-relaxed space-y-6">
        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
          <p className="text-violet-300 text-xs">Last updated: {SITE_INFO.lastUpdated}</p>
          <p className="mt-2">
            {SITE_INFO.name} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to
            protecting your privacy. This policy explains what information may be collected when
            you visit{' '}
            <a
              href={SITE_INFO.website}
              className="text-violet-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_INFO.websiteLabel}
            </a>
            , how that information is used, and what choices visitors have.
          </p>
        </div>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">1. Information We Collect</h2>
          <h3 className="text-violet-300 font-bold">Information you provide</h3>
          <p>
            If you choose to sign in, we may receive basic account details such as your display
            name, email address, and profile image from the authentication provider you use.
            Passwords from third-party sign-in providers are not shared with us.
          </p>

          <h3 className="text-violet-300 font-bold">Game and account data</h3>
          <p>
            We may store scores, profile information, and leaderboard activity so that returning
            users can track their progress.
          </p>

          <h3 className="text-violet-300 font-bold">Automatic technical data</h3>
          <p>
            Like most websites, the service may log technical information such as browser type,
            device type, approximate location derived from IP address, pages viewed, and session
            timing to help with security, diagnostics, analytics, and service improvement.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">2. How We Use Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To provide games, saved scores, profile pages, and leaderboard features</li>
            <li>To improve game quality, performance, and site navigation</li>
            <li>To respond to messages and support requests</li>
            <li>To protect the site from abuse, fraud, or score manipulation</li>
            <li>To serve advertising that helps keep the service free</li>
          </ul>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">3. Cookies and Advertising</h2>
          <p>
            {SITE_INFO.name} may use cookies or similar technologies for analytics, sign-in
            state, and advertising. Advertising may be provided through Google AdSense.
          </p>
          <p>
            Google and its partners may use cookies to show ads based on prior visits to this
            site or other websites. Visitors can learn more about ad controls through{' '}
            <a
              href="https://www.google.com/settings/ads"
              className="text-violet-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            .
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">4. Third-Party Services</h2>
          <p>Depending on how the site is used, third-party services may support:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Authentication and account sign-in</li>
            <li>Database and score storage</li>
            <li>Analytics and performance monitoring</li>
            <li>Advertising delivery</li>
          </ul>
          <p>
            These providers maintain their own policies and data-handling practices. We do not
            sell personal information to unrelated third parties.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">5. Children&apos;s Privacy</h2>
          <p>
            The games are intended to be family-friendly. Players can browse and play without an
            account. If a parent or guardian believes that a child has provided personal
            information inappropriately, they can contact us to request review or deletion.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">6. Data Security</h2>
          <p>
            Reasonable technical and organizational measures are used to protect stored data, but
            no service can guarantee absolute security. Visitors should use the site with that
            understanding.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">7. Your Choices</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>You can play most games without creating an account</li>
            <li>You can contact us to request updates or deletion of account-related data</li>
            <li>You can manage advertising preferences through Google&apos;s controls</li>
          </ul>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">8. Changes to This Policy</h2>
          <p>
            This page may be updated from time to time as the site changes. The revision date at
            the top of this page reflects the latest policy review.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">9. Contact</h2>
          <p>
            Questions about this policy can be sent to{' '}
            <a href={`mailto:${SITE_INFO.email}`} className="text-violet-400 underline">
              {SITE_INFO.email}
            </a>
            .
          </p>
          <p>
            Website:{' '}
            <a
              href={SITE_INFO.website}
              className="text-violet-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_INFO.websiteLabel}
            </a>
          </p>
        </section>

        <p className="text-center text-white/30 text-xs pb-4">
          © {SITE_INFO.copyrightYear} {SITE_INFO.name}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
