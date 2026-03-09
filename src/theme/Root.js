/**
 * src/theme/Root.js
 * Docusaurus swizzled Root component.
 * Wraps every page on the site — injects the ChatbotWidget globally.
 * Doc: https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root
 */

import React from 'react';
import ChatbotWidget from '@site/src/components/ChatbotWidget';

export default function Root({ children }) {
  return (
    <>
      {children}
      <ChatbotWidget />
    </>
  );
}
