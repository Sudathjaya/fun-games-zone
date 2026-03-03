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

// ─── YOUR AD SETTINGS (fill in after AdSense approval) ───────────────────────
const PUBLISHER_ID = 'ca-pub-3194091975690498';
const AD_SLOTS = {
  banner:    '2184627125',
  rectangle: '2184627125',
  small:     '2184627125',
};
const ADS_ENABLED = true; // ← change to true after AdSense approval
// ─────────────────────────────────────────────────────────────────────────────

export default function AdBanner({ size = 'banner', className = '' }) {
  React.useEffect(() => {
    if (ADS_ENABLED) {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
    }
  }, []);

  if (ADS_ENABLED) {
    return (
      <div className={`w-full overflow-hidden ${className}`} aria-label="Advertisement">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={AD_SLOTS[size]}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder shown before AdSense approval
  return (
    <div
      className={`w-full flex items-center justify-center gap-2
                  bg-gray-100/80 border border-dashed border-gray-300
                  rounded-xl overflow-hidden
                  ${SIZE_CLASSES[size]} ${className}`}
      aria-label="Advertisement"
    >
      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold select-none">
        Advertisement
      </span>
      <span className="text-gray-300 text-xs select-none">
        — Ad space • future revenue —
      </span>
    </div>
  );
}
