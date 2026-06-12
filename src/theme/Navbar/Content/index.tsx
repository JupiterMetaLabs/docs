import { type ReactNode, useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';
import {
  useThemeConfig,
  ErrorCauseBoundary,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import { splitNavbarItems } from '@docusaurus/theme-common/internal';
import NavbarItem, { type Props as NavbarItemConfig } from '@theme/NavbarItem';
import NavbarLogo from '@theme/Navbar/Logo';

function useNavbarItems() {
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarItems({ items, excludeSearch }: { items: NavbarItemConfig[]; excludeSearch?: boolean }): ReactNode {
  const filtered = excludeSearch ? items.filter((item: any) => item.type !== 'search') : items;
  return (
    <>
      {filtered.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.\nPlease double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:\n${JSON.stringify(item, null, 2)}`,
              { cause: error },
            )
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

// ── PriceChip ────────────────────────────────────────────────────────────────
function PriceChip(): ReactNode {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=jmdt&vs_currencies=usd&include_24hr_change=true'
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.jmdt) {
          setPrice(data.jmdt.usd);
          setChange(data.jmdt.usd_24h_change);
        }
      })
      .catch(() => {});
  }, []);

  if (price === null) return null;
  const positive = (change ?? 0) >= 0;

  return (
    <span className="nav-chip navbar__price-chip">
      <span style={{ fontFamily: "'Iosevka Charon Mono', monospace", fontSize: 13, fontWeight: 400, color: '#fff', letterSpacing: '0.6px' }}>
        ${price.toFixed(4)}
      </span>
      <span style={{ fontFamily: "'Iosevka Charon Mono', monospace", fontSize: 11, fontWeight: 400, letterSpacing: '0.4px', color: positive ? '#4ade80' : '#f87171' }}>
        {positive ? '+' : ''}{(change ?? 0).toFixed(2)}%
      </span>
    </span>
  );
}

// ── MobileMenu ───────────────────────────────────────────────────────────────
function MobileMenu({ onClose }: { onClose: () => void }): ReactNode {
  const location = useLocation();
  const isMainnet = location.pathname.includes('mainnet');
  const isTestnet = location.pathname.includes('testnet');

  // Lock body scroll — iOS-safe: fix position so rubber-band doesn't show page
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="mobile-menu" data-lenis-prevent>
      {/* Header — X close button */}
      <div className="mobile-menu-header">
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <div className="mobile-menu-body">
        <Link className="mobile-menu-link" to="/docs/intro" onClick={onClose}>
          Docs
        </Link>
        <Link className="mobile-menu-link" to="/docs/architecture" onClick={onClose}>
          Architecture
        </Link>
        <Link className="mobile-menu-link" to="/docs/avc" onClick={onClose}>
          AVC
        </Link>
        <Link className="mobile-menu-link" to="https://jmdt.io" target="_blank" rel="noopener noreferrer" onClick={onClose}>
          JMDT.IO ↗
        </Link>

        {/* Network switcher */}
        <div className="mobile-menu-network">
          <Link to="/docs/mainnet/mainnet-overview" onClick={onClose}>
            <button className={isMainnet ? 'active' : ''}>Mainnet</button>
          </Link>
          <Link to="/docs/testnet/testnet-overview" onClick={onClose}>
            <button className={isTestnet ? 'active' : ''}>Testnet</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── HamburgerButton ──────────────────────────────────────────────────────────
function HamburgerButton({ onOpen }: { onOpen: () => void }): ReactNode {
  return (
    <button
      aria-label="Open menu"
      onClick={onOpen}
      className="navbar__hamburger"
      style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
    >
      <img src="/icons/menu_icon.svg" alt="Menu" width="24" height="24" />
    </button>
  );
}

// ── Layout ───────────────────────────────────────────────────────────────────
function NavbarContentLayout({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="navbar__inner">
      <div className={clsx(ThemeClassNames.layout.navbar.containerLeft, 'navbar__items')}>
        {left}
      </div>
      <div className={clsx(ThemeClassNames.layout.navbar.containerRight, 'navbar__items navbar__items--right')}>
        {right}
      </div>
    </div>
  );
}

// ── NavbarContent ─────────────────────────────────────────────────────────────
export default function NavbarContent(): ReactNode {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);

  return (
    <>
      <NavbarContentLayout
        left={
          <>
            <NavbarLogo />
            <NavbarItems items={leftItems} />
          </>
        }
        right={
          <>
            <NavbarItems items={rightItems} excludeSearch />
            <PriceChip />
            <HamburgerButton onOpen={() => setMobileMenuOpen(true)} />
          </>
        }
      />

      {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
    </>
  );
}
