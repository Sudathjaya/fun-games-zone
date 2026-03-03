import React from 'react';

/**
 * AdBanner — Ad slot placeholder, ready for Google AdSense.
 *
 * HOW TO ACTIVATE ADS (Google AdSense):
 * 1. Sign up at https://adsense.google.com and get approved.
 * 2. Add to index.html <head>:
 *      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossorigin="anonymous"></script>
 * 3. Replace the inner <div> below with:
 *      <ins class="adsbygoogle" style="display:block"
 *           data-ad-client="ca-pub-YOUR_ID"
 *           data-ad-slot="YOUR_SLOT_ID"
 *           data-ad-format="auto"
 *           data-full-width-responsive="true"></ins>
 *      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
 *
 * OTHER MONETIZATION IDEAS:
 *  - Remove Ads subscription via Stripe/PayPal
 *  - Amazon Associates affiliate links (board games, puzzle books)
 *  - Buy Me a Coffee donations: https://buymeacoffee.com
 */

const SIZE_CLASSES = {
  banner:    'h-14 md:h-20',   // Leaderboard 728×90
  rectangle: 'h-48 md:h-64',  // Medium Rectangle 300×250
  small:     'h-10 md:h-12',  // Small banner
};

export default function AdBanner({ size = 'banner', slot = 'default', className = '' }) {
  return (
    <div
      className={`w-full flex items-center justify-center gap-2
                  bg-gray-100/80 border border-dashed border-gray-300
                  rounded-xl overflow-hidden relative
                  ${SIZE_CLASSES[size]} ${className}`}
      data-ad-slot={slot}
      aria-label="Advertisement"
    >
      {/* ── Replace this block with AdSense <ins> tag when approved ── */}
      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold select-none">
        Advertisement
      </span>
      <span className="text-gray-300 text-xs select-none">
        — Ad space • future revenue —
      </span>
    </div>
  );
}
