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
  // Navbar: hide-on-scroll-down, show-on-scroll-up, blur when scrolled
  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;
      const y = window.scrollY;

      // Blurred bg once user scrolls past 10px
      navbar.classList.toggle('navbar--scrolled', y > 10);

      // Hide when scrolling down past 80px, show when scrolling up
      // Don't hide if mobile sidebar is open
      const sidebarOpen = document.body.classList.contains('navbar-sidebar--show');
      if (!sidebarOpen) {
        if (y > lastY && y > 80) {
          navbar.classList.add('navbar--hidden');
        } else {
          navbar.classList.remove('navbar--hidden');
        }
      }

      lastY = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
