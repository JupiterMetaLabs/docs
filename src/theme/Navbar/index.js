import React from 'react';
import { useLocation } from '@docusaurus/router';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';

const HIDDEN_PREFIXES = ['/docs/'];

export default function Navbar() {
  const { pathname } = useLocation();
  const hidden = HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Docusaurus's TOC scroll-highlight hook reads `.navbar`'s clientHeight
  // unconditionally, so the element must stay in the DOM — hide it visually
  // instead of unmounting it, or that hook throws on this route.
  return (
    <div style={hidden ? { display: 'none' } : undefined}>
      <NavbarLayout>
        <NavbarContent />
      </NavbarLayout>
    </div>
  );
}
