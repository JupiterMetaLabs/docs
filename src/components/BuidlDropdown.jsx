import { useState, useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';

const ITEMS = [
  { label: 'Mainnet', to: '/docs/mainnet/overview' },
  { label: 'Testnet', to: '/docs/testnet/overview' },
];

export default function BuidlDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>

      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`nav-link nav-chip${isOpen ? ' nav-chip-active' : ''}`}
      >
        <span
          style={isOpen ? {
            background: 'linear-gradient(360deg, #ff512f 0%, #f09819 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          } : { color: '#ffffff' }}
        >
          BUIDL
        </span>

        <svg
          width="9" height="6" viewBox="0 0 9 6" fill="none"
          style={{
            transition: 'transform 200ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path
            d="M1 1L4.5 5L8 1"
            stroke={isOpen ? '#ff8c42' : '#ffffff'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="buidl-dropdown-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 50,
            marginTop: '4px',
            minWidth: '141px',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="buidl-dropdown-inner">
            {ITEMS.map((item, i) => (
              <Link
                key={item.label}
                to={item.to}
                className={`dropdown-item${i === 0 ? ' dropdown-item-first' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
