import React from 'react';
import { SITE_INFO } from '../siteContent';

export default function TermsPage({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="text-white/70 hover:text-white font-bold flex items-center gap-2 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-white font-black text-lg">Terms of Service</h1>
        <div className="w-16" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 text-white/80 text-sm leading-relaxed space-y-6">
        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
          <p className="text-violet-300 text-xs">Last updated: {SITE_INFO.lastUpdated}</p>
          <p className="mt-2">
            By accessing or using{' '}
            <a
              href={SITE_INFO.website}
              className="text-violet-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_INFO.websiteLabel}
            </a>
            , you agree to these Terms of Service. If you do not agree, do not use the site.
          </p>
        </div>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">1. Service Description</h2>
          <p>
            {SITE_INFO.name} is a free browser-based game platform offering casual games,
            puzzles, reflex tests, and family-friendly activities. Some features, such as saved
            scores or profile data, may require optional sign-in.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">2. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Use the service for unlawful or abusive activity</li>
            <li>Attempt to manipulate scores, accounts, or leaderboards</li>
            <li>Interfere with the operation or security of the site</li>
            <li>Scrape, copy, or redistribute original site content without permission</li>
            <li>Use bots, scripts, or automation to gain unfair gameplay advantages</li>
          </ul>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">3. Accounts</h2>
          <p>
            Visitors can browse and play without creating an account. If you choose to sign in,
            you are responsible for activity associated with your account and for using accurate
            information where required.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">4. Intellectual Property</h2>
          <p>
            The site design, written copy, branding, and game-related content on {SITE_INFO.name}{' '}
            are protected by applicable intellectual property laws. You may not reproduce or
            republish those materials without permission.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">5. Advertising and Support</h2>
          <p>
            Advertising, supporter donations, or similar monetization methods may be used to help
            keep the service free. We are not responsible for the content of third-party ads or
            external websites linked from advertisements.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">6. Availability</h2>
          <p>
            We may update, modify, or remove games or site features at any time. We do not
            guarantee uninterrupted availability or error-free operation.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">7. Disclaimer</h2>
          <p>
            The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis
            without warranties of any kind. Use of the site is at your own risk.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, {SITE_INFO.name} will not be liable for
            indirect, incidental, or consequential damages arising from use of the site.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">9. Related Policies</h2>
          <p>
            Use of the site is also subject to the Privacy Policy, which explains how account,
            analytics, and advertising-related data may be handled.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">10. Changes to Terms</h2>
          <p>
            These terms may be updated from time to time. Continued use of the site after changes
            are posted means you accept the revised terms.
          </p>
        </section>

        <section className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
          <h2 className="text-white font-black text-lg">11. Contact</h2>
          <p>
            Questions about these terms can be sent to{' '}
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
