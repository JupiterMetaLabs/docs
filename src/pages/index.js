import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import ParticlesBackground from '../components/ParticlesBackground';
import Lenis from 'lenis';
import clsx from 'clsx';
import ThemeAwareHeroLogo from '../components/ThemeAwareHeroLogo';

// SVG icon components — no emoji
const IconShield = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.05 9 11 5.25-.95 9-5.75 9-11V7l-9-5z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconLayers = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconCode = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconNetwork = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <line x1="12" y1="7" x2="5" y2="17" />
    <line x1="12" y1="7" x2="19" y2="17" />
    <line x1="5" y1="19" x2="19" y2="19" />
  </svg>
);

const FeatureList = [
  {
    title: 'THE TRUTH LAYER',
    Icon: IconShield,
    color: 'var(--nb-orange)',
    description: (
      <>
        Every record committed to JMDT is immutable and verifiable. Tamper-proof data integrity, backed by Ethereum settlement — building a permanent foundation of trust.
      </>
    ),
  },
  {
    title: 'ZERO-KNOWLEDGE PRIVACY',
    Icon: IconLayers,
    color: 'var(--nb-blue)',
    description: (
      <>
        ZK-Rollups batch transactions into succinct proofs committed to Ethereum Layer 1, achieving high throughput while keeping sensitive data completely private.
      </>
    ),
  },
  {
    title: 'DECENTRALIZED IDENTITY',
    Icon: IconNetwork,
    color: 'var(--nb-yellow)',
    description: (
      <>
        W3C-standard Decentralized Identifiers (DIDs) enable PII-protected user authentication and cross-platform credential sharing without exposing personal data on-chain.
      </>
    ),
  },
  {
    title: 'EVM COMPATIBLE',
    Icon: IconCode,
    color: 'var(--nb-orange)',
    description: (
      <>
        Full Ethereum Virtual Machine compatibility — deploy existing Solidity contracts without modification using Hardhat, Foundry, or any standard EVM toolchain.
      </>
    ),
  },
];

const NetworkStats = [
  { label: 'Mainnet Chain ID', value: '7000700' },
  { label: 'Testnet Chain ID', value: '8000800' },
  { label: 'Settlement', value: 'Ethereum' },
  { label: 'Consensus', value: 'AVC' },
  { label: 'Compatibility', value: 'EVM' },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % FeatureList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeFeature = FeatureList[activeIndex];

  return (
    <Layout title="JMDT Documentation" description="The Truth Layer for Verifiable Information — Ethereum Layer 2 blockchain with Zero-Knowledge Proofs and Decentralized Identity.">

      {/* SEO & Open Graph Meta Tags */}
      <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8N3L9Z2Z9X"></script>
        <script>
          {`
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-8N3L9Z2Z9X');
`}
        </script>

        {/* SEO Metadata */}
        <title>JMDT — The Truth Layer for Verifiable Information</title>
        <meta name="description" content="JMDT is an Ethereum Layer 2 blockchain with Zero-Knowledge Proofs, Decentralized Identity, and AVC consensus — delivering privacy, scalability, and tamper-proof data integrity." />
        <meta name="keywords" content="JMDT, Blockchain, Ethereum Layer 2, ZK Proofs, Web3, Decentralized Identity, L2 Blockchain, Smart Contracts, AVC consensus, JMDN node, zk-rollup, Truth Layer, JupiterMetaLabs" />
        <meta name="author" content="JupiterMetaLabs" />
        <link rel="canonical" href="https://docs.jmdt.io/" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/img/Frame_12.png" />
        <link rel="apple-touch-icon" href="/img/Frame_12.png" />

        {/* Open Graph */}
        <meta property="og:title" content="JMDT — The Truth Layer for Verifiable Information" />
        <meta property="og:description" content="Privacy-preserving, scalable Ethereum Layer 2 blockchain with Zero-Knowledge Proofs and Decentralized Identity." />
        <meta property="og:url" content="https://docs.jmdt.io/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://jmdt.io/og-new.png" />
        <meta property="og:image:alt" content="JMDT — The Truth Layer" />
        <meta property="og:site_name" content="JMDT Docs" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JMDT — The Truth Layer for Verifiable Information" />
        <meta name="twitter:description" content="Ethereum Layer 2 blockchain with ZK proofs, Decentralized Identity, and AVC consensus." />
        <meta name="twitter:image" content="https://jmdt.io/og-new.png" />
        <meta name="twitter:site" content="@JMDT" />

        {/* Publish / Update Date */}
        <meta name="article:published_time" content="2025-01-01T00:00:00Z" />
        <meta name="article:modified_time" content="2026-03-17T00:00:00Z" />

        {/* AEO + SEO: Organization, WebSite, SoftwareApplication JSON-LD */}
        <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://jmdt.io/#organization",
      "name": "JupiterMetaLabs",
      "url": "https://jmdt.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://docs.jmdt.io/img/jmdt_logo.png"
      },
      "sameAs": ["https://github.com/JupiterMetaLabs"],
      "description": "JupiterMetaLabs builds JMDT — a privacy-preserving, scalable Ethereum Layer 2 blockchain using Zero-Knowledge Proofs and Decentralized Identity."
    },
    {
      "@type": "WebSite",
      "@id": "https://docs.jmdt.io/#website",
      "url": "https://docs.jmdt.io",
      "name": "JMDT Documentation",
      "description": "Official technical documentation for the JMDT Ethereum Layer 2 blockchain — The Truth Layer for Verifiable Information.",
      "publisher": { "@id": "https://jmdt.io/#organization" },
      "inLanguage": "en-US",
      "dateModified": "2026-03-17",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://docs.jmdt.io/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://docs.jmdt.io/#webpage",
      "url": "https://docs.jmdt.io",
      "name": "JMDT — The Truth Layer for Verifiable Information",
      "description": "JMDT is an Ethereum Layer 2 blockchain with Zero-Knowledge Proofs, Decentralized Identity, and AVC consensus for privacy, scalability, and tamper-proof data integrity.",
      "isPartOf": { "@id": "https://docs.jmdt.io/#website" },
      "publisher": { "@id": "https://jmdt.io/#organization" },
      "dateModified": "2026-03-17",
      "inLanguage": "en-US"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://jmdt.io/#software",
      "name": "JMDT — Jupiter Meta Data Token",
      "applicationCategory": "BlockchainApplication",
      "operatingSystem": "Ethereum Layer 2",
      "description": "JMDT is a privacy-preserving Ethereum Layer 2 blockchain leveraging Zero-Knowledge Proofs (ZKPs), Decentralized Identity (DID), and the AVC (Asynchronous Validation Consensus) mechanism.",
      "url": "https://jmdt.io",
      "author": { "@id": "https://jmdt.io/#organization" },
      "dateModified": "2026-03-17",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Zero-Knowledge Proofs (ZKPs)",
        "Decentralized Identity (DID)",
        "AVC Consensus Algorithm",
        "EVM Compatibility",
        "zk-Rollups",
        "Immutable Storage",
        "Privacy-Preserving Queries"
      ]
    }
  ]
}
        `}</script>

        {/* AEO: FAQ Structured Data */}
        <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is JMDT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JMDT (Jupiter Meta Data Token) is an Ethereum-based Layer 2 blockchain designed for scalability, privacy, and security. It uses Zero-Knowledge Proofs (ZKPs), Decentralized Identity (DID), and the AVC (Asynchronous Validation Consensus) algorithm to provide a highly efficient, privacy-preserving blockchain infrastructure."
      }
    },
    {
      "@type": "Question",
      "name": "What is AVC consensus?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AVC (Asynchronous Validation Consensus) is JMDT's consensus algorithm designed for efficient, fault-tolerant agreement across network nodes in the JMDT Layer 2 blockchain."
      }
    },
    {
      "@type": "Question",
      "name": "How does JMDT use Zero-Knowledge Proofs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JMDT uses ZKPs to enable private transactions and computations without exposing sensitive data. ZK-Rollups batch multiple transactions into a single proof committed to Ethereum Layer 1, achieving high throughput while preserving privacy."
      }
    },
    {
      "@type": "Question",
      "name": "What is Decentralized Identity (DID) on JMDT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JMDT implements W3C-standard Decentralized Identifiers (DIDs) for secure, PII-protected user authentication. DID credentials are stored on Layer 2 and can be shared across multiple platforms without exposing personal data."
      }
    },
    {
      "@type": "Question",
      "name": "Is JMDT compatible with Ethereum smart contracts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. JMDT is fully EVM-compatible, meaning existing Ethereum smart contracts can be deployed on JMDT without modification. It supports seamless integration with Ethereum DeFi applications and enterprise solutions."
      }
    },
    {
      "@type": "Question",
      "name": "How does JMDT commit transactions to Ethereum Layer 1?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JMDT dynamically commits batched transactions to Ethereum based on optimal gas fees and block time, using zk-rollup proofs to ensure finality and security on L1 while keeping transaction costs low."
      }
    },
    {
      "@type": "Question",
      "name": "What are the use cases for JMDT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JMDT supports enterprise identity verification using DID credentials, privacy-preserving DeFi applications, user onboarding and reward redemption via the SuperJ platform, and any dApp requiring high throughput with data privacy."
      }
    }
  ]
}
        `}</script>

        {/* AEO: BreadcrumbList */}
        <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "JMDT Docs",
      "item": "https://docs.jmdt.io"
    }
  ]
}
        `}</script>
      </Head>

      {/* Hero Section */}
      <header className="hero relative flex flex-col items-center justify-center min-vh-100" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>

        <ParticlesBackground />

        {/* Ambient gradient meshes */}
        <div className="bg-gradient-mesh" style={{ top: '-10%', left: '-10%', background: 'radial-gradient(circle, var(--jm-primary), transparent 70%)' }}></div>
        <div className="bg-gradient-mesh" style={{ bottom: '10%', right: '-10%', background: 'radial-gradient(circle, var(--jm-accent), transparent 70%)' }}></div>

        <div className="container relative z-10 hero-grid h-full">

          {/* Left Column: Content */}
          <div className="hero-text-content">
            <div className="animate-float mb-6">
              <ThemeAwareHeroLogo style={{ height: '100px', filter: 'drop-shadow(0 0 20px rgba(113, 162, 230, 0.4))' }} />
            </div>

            <p style={{ fontSize: '1rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nb-yellow)', fontWeight: 900, marginBottom: '1rem' }}>
              The Truth Layer
            </p>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none uppercase">
              Build on <span className="text-gradient d-block lg-inline">JMDT</span>
            </h1>

            <p className="hero__subtitle text-xl max-w-xl mb-8 leading-relaxed text-subtitle-dynamic font-bold uppercase tracking-tight">
              Privacy-preserving Ethereum Layer 2 blockchain — powered by
              <span className="text-dynamic" style={{ color: 'var(--nb-orange)' }}> Zero-Knowledge Proofs</span>,{' '}
              <span className="text-dynamic" style={{ color: 'var(--nb-blue)' }}> Decentralized Identity</span>, and
              <span className="text-dynamic" style={{ color: 'var(--nb-yellow)' }}> AVC consensus</span>.
            </p>

            <div className="d-flex gap-4 mb-4 hero-buttons">
              <Link className="button button--primary button--lg" to="/docs/intro">
                Start Building →
              </Link>
              <Link className="button button--secondary button--lg" to="https://jmdt.io">
                jmdt.io
              </Link>
            </div>
          </div>

          {/* Right Column: Features Carousel */}
          <div className="w-full d-flex justify-center">
            <div className="carousel-card-wrapper">

              {/* Carousel Card */}
              <div className="w-full text-center" style={{ flex: 1 }}>
                <div key={activeIndex} className="glass-panel carousel-card d-flex flex-col items-center justify-center p-8 feature-slide" style={{ minHeight: '340px' }}>
                  <div
                    className="mb-6 p-5"
                    style={{
                      width: 'fit-content',
                      background: 'var(--nb-white)',
                      border: 'var(--nb-border)',
                      boxShadow: '4px 4px 0px 0px var(--nb-black)',
                      color: activeFeature.color,
                    }}
                  >
                    <activeFeature.Icon />
                  </div>
                  <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter" style={{ color: 'var(--nb-orange)' }}>{activeFeature.title}</h3>
                  <p className="text-base font-bold text-dynamic leading-relaxed uppercase tracking-tight">{activeFeature.description}</p>
                </div>
              </div>

              {/* Vertical Scrollbar (Desktop) */}
              <div className="carousel-indicators-desktop">
                <div className="scroll-track">
                  <div
                    className="scroll-thumb"
                    style={{
                      height: `${100 / FeatureList.length}%`,
                      top: `${activeIndex * (100 / FeatureList.length)}%`
                    }}
                  />
                  {FeatureList.map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        top: `${idx * (100 / FeatureList.length)}%`,
                        height: `${100 / FeatureList.length}%`,
                        width: '100%',
                        left: 0,
                        zIndex: 10,
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveIndex(idx)}
                      title={`View ${FeatureList[idx].title}`}
                    />
                  ))}
                </div>
              </div>

              {/* Horizontal Indicators (Mobile) */}
              <div className="carousel-indicators-mobile">
                {FeatureList.map((_, idx) => (
                  <div
                    key={idx}
                    className={clsx('indicator-dot', idx === activeIndex && 'active')}
                    style={{ width: idx === activeIndex ? '24px' : '12px', height: '4px' }}
                    onClick={() => setActiveIndex(idx)}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </header>

      {/* Network Stats Bar */}
      <div style={{
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        padding: '1.25rem 0',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
          }}>
            {NetworkStats.map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center', minWidth: '120px', padding: '1rem', border: 'var(--nb-border)', background: 'var(--nb-white)', color: 'var(--nb-black)', boxShadow: '4px 4px 0px 0px var(--nb-black)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--nb-orange)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {value}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main>

        {/* What is JMDT */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
            What is JMDT?
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
            <strong>Jupiter Meta Data Token (JMDT)</strong> is an Ethereum-based Layer 2 (L2) blockchain
            built as <strong>The Truth Layer for Verifiable Information</strong>. It delivers scalability,
            privacy, and tamper-proof data integrity for decentralized applications and enterprise use cases —
            leveraging <strong>Zero-Knowledge Proofs (ZKPs)</strong>,{' '}
            <strong>Decentralized Identity (DID)</strong>, and the{' '}
            <strong>AVC (Asynchronous Validation Consensus)</strong> mechanism.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
            JMDT is fully EVM-compatible — developers can deploy existing Ethereum smart contracts
            without modification. Transactions are batched via zk-rollups and committed to Ethereum
            dynamically based on optimal gas fees, keeping costs low while maintaining L1-level security.
            The immutable ledger ensures tamper-proof, verifiable data recording for every operation.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
            Built for enterprises and developers alike, JMDT's DID system follows W3C standards —
            enabling PII-protected user authentication and cross-platform credential sharing without
            exposing personal data on-chain.
          </p>

          {/* Explore the Docs */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
            Explore the Documentation
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Dive into any section of the JMDT technical documentation:
          </p>
            {/* Documentation Links */}
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              {[
                { label: 'INTRODUCTION', href: '/docs/intro', desc: 'Overview of JMDT' },
                { label: 'ARCHITECTURE', href: '/docs/architecture', desc: 'Three-layer design' },
                { label: 'AVC CONSENSUS', href: '/docs/avc', desc: 'Consensus mechanism' },
                { label: 'ZK PROOFS', href: '/docs/zk', desc: 'ZK-Rollup details' },
                { label: 'IDENTITY', href: '/docs/did', desc: 'DID & W3C Standards' },
                { label: 'TOKENOMICS', href: '/docs/tokenomics', desc: 'Token model' },
                { label: 'USE CASES', href: '/docs/use-cases', desc: 'Real-world apps' },
                { label: 'SMART CONTRACTS', href: '/docs/smart-contract', desc: 'EVM deployment' },
              ].map(({ label, href, desc }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="glass-panel"
                    style={{
                      display: 'block',
                      padding: '1rem',
                      textDecoration: 'none',
                    }}
                  >
                    <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', color: 'var(--nb-orange)' }}>{label}</strong>
                    <span style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 700 }}>{desc}</span>
                  </Link>
                </li>
              ))}
            </ul>

          {/* Node Setup — quick access */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
            Run a Node
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Deploy a JMDN node and connect to the JMDT network — mainnet or testnet:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[
              {
                label: 'Mainnet',
                chainId: 'Chain ID 7000700',
                href: '/docs/mainnet/overview',
                desc: 'Production network — real JMDT tokens.',
                color: 'var(--jm-primary)',
              },
              {
                label: 'Testnet',
                chainId: 'Chain ID 8000800',
                href: '/docs/testnet/overview',
                desc: 'Staging network — free faucet tokens, safe to experiment.',
                color: 'var(--jm-accent)',
              },
            ].map(({ label, chainId, href, desc, color }) => (
              <Link
                key={href}
                to={href}
                style={{
                  display: 'block',
                  padding: '1.25rem 1.25rem',
                  borderRadius: '10px',
                  border: `1px solid ${color}40`,
                  background: `${color}08`,
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1.05rem' }}>{label}</strong>
                  <span style={{ fontSize: '0.75rem', color, fontWeight: 600, background: `${color}18`, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>{chainId}</span>
                </div>
                <span style={{ fontSize: '0.9rem', opacity: 0.75 }}>{desc}</span>
              </Link>
            ))}
          </div>

          {/* FAQ */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Frequently Asked Questions
          </h2>

          {[
            {
              q: 'What is JMDT?',
              a: 'JMDT (Jupiter Meta Data Token) is an Ethereum-based Layer 2 blockchain and The Truth Layer for Verifiable Information. It uses Zero-Knowledge Proofs (ZKPs), Decentralized Identity (DID), and the AVC consensus algorithm to deliver high-throughput, privacy-preserving blockchain infrastructure for dApps and enterprise use cases.',
            },
            {
              q: 'What is AVC consensus?',
              a: "AVC (Asynchronous Validation Consensus) is JMDT's consensus algorithm, engineered for efficient and fault-tolerant agreement across all network nodes, enabling the JMDT Layer 2 to process transactions reliably at scale.",
            },
            {
              q: 'How does JMDT use Zero-Knowledge Proofs?',
              a: 'JMDT uses ZKPs to enable private transactions and computations without exposing sensitive data. ZK-Rollups batch multiple transactions into a single succinct proof that is committed to Ethereum Layer 1, achieving high throughput while preserving user privacy.',
            },
            {
              q: 'What is Decentralized Identity (DID) on JMDT?',
              a: 'JMDT implements W3C-standard Decentralized Identifiers (DIDs) for secure, PII-protected user authentication. DID credentials are stored on Layer 2 and can be shared across multiple platforms without exposing personal data on-chain.',
            },
            {
              q: 'Is JMDT compatible with Ethereum smart contracts?',
              a: 'Yes. JMDT is fully EVM-compatible — existing Ethereum smart contracts can be deployed on JMDT without modification, supporting seamless integration with DeFi protocols and enterprise solutions.',
            },
            {
              q: 'How does JMDT commit transactions to Ethereum?',
              a: 'JMDT dynamically commits batched transactions to Ethereum based on optimal gas fees and block time, using zk-rollup proofs to ensure finality and security on L1 while keeping transaction costs low for end users.',
            },
            {
              q: 'What are the main use cases for JMDT?',
              a: 'JMDT supports enterprise identity verification using DID credentials, privacy-preserving DeFi applications, user onboarding and reward redemption via the SuperJ platform, and any dApp requiring high throughput combined with strong data privacy guarantees.',
            },
          ].map(({ q, a }, i) => (
            <div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
              style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.08))' }}>
              <h3 itemProp="name" style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {q}
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" style={{ fontSize: '1rem', lineHeight: '1.8', margin: 0, opacity: 0.85 }}>
                  {a}
                </p>
              </div>
            </div>
          ))}

          <p style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '2rem' }}>
            Last updated: March 2026 · <Link to="/docs/intro">Read full documentation →</Link>
          </p>
        </section>
      </main>
    </Layout>
  );
}
