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

      <ChatbotWidget />
    </>
  );
}
