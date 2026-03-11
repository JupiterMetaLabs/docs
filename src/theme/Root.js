/**
 * src/theme/Root.js
 * Docusaurus swizzled Root component.
 * Wraps every page on the site — injects the ChatbotWidget and
 * Google Translate widget globally in the navbar.
 * Doc: https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root
 */

import React, { useEffect } from 'react';
import ChatbotWidget from '@site/src/components/ChatbotWidget';

export default function Root({ children }) {
  useEffect(() => {
    // Inject Google Translate init function
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,ta,te,ml,kn,zh-CN,fr,de,es,it,ko,ja,ru,ar',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    // Inject the Google Translate script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      {children}

      {/* ── Google Translate — fixed in navbar, site-wide ─────────────── */}
      <div
        id="google_translate_element"
        style={{
          position: 'fixed',
          top: '2rem',            /* halfway down the 4rem navbar */
          right: '72px',         /* leaves breathing room from right edge */
          transform: 'translateY(-50%)',
          zIndex: 9999,
          backgroundColor: 'var(--glass-bg, rgba(20,20,30,0.6))',
          backdropFilter: 'blur(10px)',
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
        }}
      />

      <ChatbotWidget />
    </>
  );
}
