import React, { useEffect, useState } from 'react';

const DISMISS_KEY = 'jmdt_listing_notice_dismissed_v1';

/**
 * Anti-scam listing notice: JMDT trades only on MEXC. Standard closable
 * warning ribbon fixed at the bottom of the viewport — same style and copy
 * as jmdt.io, explorer.jmdt.io and faucet.jmdt.io. Inline-styled (the docs
 * site has no Tailwind); dismissal persists in localStorage.
 * SSR-safe: hidden on the server AND on first client render, revealed in a
 * mount effect — identical markup both sides, no hydration mismatch.
 */
export default function ListingNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY) !== '1') setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* private mode — dismiss for this render only */
    }
    setVisible(false);
  };

  const mono = "'Iosevka Charon Mono', 'Courier New', monospace";

  return (
    <div
      role="note"
      aria-label="Official listing notice"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: '#120c05',
        borderTop: '1px solid rgba(236,170,98,0.35)',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          maxWidth: 1152,
          margin: '0 auto',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span aria-hidden style={{ flexShrink: 0, color: '#ECAA62', fontSize: 14, lineHeight: '20px' }}>⚠</span>
        <p
          style={{
            flex: 1,
            margin: 0,
            fontFamily: mono,
            fontSize: 12,
            lineHeight: 1.6,
            letterSpacing: '0.4px',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <span style={{ color: '#ECAA62', fontWeight: 700, textTransform: 'uppercase' }}>
            Official listing notice:
          </span>{' '}
          JMDT is listed exclusively on{' '}
          <a
            href="https://www.mexc.com/exchange/JMDT_USDT"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ffffff', textDecoration: 'underline', textDecorationColor: 'rgba(236,170,98,0.5)' }}
          >
            MEXC (JMDT/USDT)
          </a>
          . We have no other pairs on any CEX or DEX — treat any other listing, liquidity pool,
          presale, or airdrop claiming to be JMDT as a scam. Verify links via our official channels.
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss notice"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.35)',
            fontSize: 16,
            lineHeight: 1,
            padding: 4,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
