import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import ParticlesBackground from '../components/ParticlesBackground';
import Lenis from 'lenis';
import clsx from 'clsx';
import ThemeAwareHeroLogo from '../components/ThemeAwareHeroLogo';

const FeatureList = [
  {
    title: 'Privacy-Preserving',
    icon: '🔐',
    color: 'bg-blue-500/20',
    description: (
      <>
        Zero-Knowledge Proofs (ZKPs) ensure your transactions remain secure and confidential, protecting user data without compromising transparency.
      </>
    ),
  },
  {
    title: 'High Scalability',
    icon: '⚡',
    color: 'bg-purple-500/20',
    description: (
      <>
        Layer 2 rollups provide lightning-fast transaction throughput and minimal gas fees, making blockchain accessible for everyone.
      </>
    ),
  },
  {
    title: 'Developer-Friendly',
    icon: '🛠',
    color: 'bg-pink-500/20',
    description: (
      <>
        Full EVM compatibility means you can deploy existing Ethereum smart contracts instantly using the tools you already know and love.
      </>
    ),
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
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
    <Layout title="JMDT Documentation" description="Scalable, Privacy-Preserving Layer 2 Blockchain">

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
        {/* 🌐 SEO Metadata */}
        <title>JMDT - Next-Gen Blockchain Network</title>
        <meta name="description" content="JMDT is an Ethereum Layer 2 blockchain with Zero-Knowledge Proofs, Decentralized Identity, and Hybrid Multi-Layer Consensus for privacy, scalability, and security." />
        <meta name="keywords" content="JMDT, Blockchain, Ethereum Layer 2, ZK Proofs, Web3, Decentralized Identity, L2 Blockchain, Crypto, Smart Contracts, JMDT, scalable blockchain, high throughput blockchain, gossip protocol, raft, bloom filters, nnss" />
        <meta name="author" content="JMDT" />
        <link rel="canonical" href="https://jmdt.io/" />

        {/* 🌐 Favicon */}
        <link rel="icon" type="image/png" href="/img/Frame_12.png" />
        <link rel="apple-touch-icon" href="/img/Frame_12.png" />

        {/* 🌐 Open Graph (OG) Meta Tags for Social Sharing */}
        <meta property="og:title" content="JMDT - Next-Gen Blockchain Network" />
        <meta property="og:description" content="Scalable, private, and secure Ethereum Layer 2 blockchain with Zero-Knowledge Proofs and Decentralized Identity." />
        <meta property="og:url" content="https://jmdt.io/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://jmdt.io/og-new.png" />
        <meta property="og:image:alt" content="JMDT" />
        <meta property="og:site_name" content="JMDT" />

        {/* 🌐 Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JMDT - Next-Gen Blockchain Network" />
        <meta name="twitter:description" content="Ethereum Layer 2 blockchain with privacy, scalability, and ZK Proofs." />
        <meta name="twitter:image" content="https://jmdt.io/og-new.png" />
        <meta name="twitter:site" content="@JMDT" />

        {/* 🌐 Publish / Update Date (AEO: AI engines use this for freshness) */}
        <meta name="article:published_time" content="2025-01-01T00:00:00Z" />
        <meta name="article:modified_time" content="2026-03-11T00:00:00Z" />

        {/* ── AEO + SEO: Organization, WebSite, SoftwareApplication JSON-LD ── */}
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
      "description": "Official technical documentation for the JMDT Ethereum Layer 2 blockchain.",
      "publisher": { "@id": "https://jmdt.io/#organization" },
      "inLanguage": "en-US",
      "dateModified": "2026-03-11",
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
      "name": "JMDT - Next-Gen Blockchain Network",
      "description": "JMDT is an Ethereum Layer 2 blockchain with Zero-Knowledge Proofs, Decentralized Identity, and AVC consensus for privacy, scalability, and security.",
      "isPartOf": { "@id": "https://docs.jmdt.io/#website" },
      "publisher": { "@id": "https://jmdt.io/#organization" },
      "dateModified": "2026-03-11",
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
      "dateModified": "2026-03-11",
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

        {/* ── AEO: FAQ Structured Data ─────────────────────────────────── */}
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
        "text": "JMDT supports user onboarding and reward redemption (e.g., via SuperJ platform), enterprise identity verification using DID credentials, privacy-preserving DeFi applications, and any dApp requiring high throughput with data privacy."
      }
    }
  ]
}
        `}</script>

        {/* ── AEO: BreadcrumbList for homepage ─────────────────────────── */}
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

      {/* 🚀 Modern Hero Section */}
      <header className="hero relative flex flex-col items-center justify-center min-vh-100" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>

        {/* ✨ Dynamic Particles Background */}
        <ParticlesBackground />

        {/* Ambient Background Meshes (Optional Overlay) */}
        <div className="bg-gradient-mesh" style={{ top: '-10%', left: '-10%', background: 'radial-gradient(circle, var(--jm-primary), transparent 70%)' }}></div>
        <div className="bg-gradient-mesh" style={{ bottom: '10%', right: '-10%', background: 'radial-gradient(circle, var(--jm-accent), transparent 70%)' }}></div>

        <div className="container relative z-10 hero-grid h-full">

          {/* Left Column: Content */}
          <div className="hero-text-content">
            <div className="animate-float mb-6">
              <ThemeAwareHeroLogo style={{ height: '100px', filter: 'drop-shadow(0 0 20px rgba(113, 162, 230, 0.4))' }} />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              Build on <span className="text-gradient d-block lg-inline">JMDT</span>
            </h1>

            <p className="hero__subtitle text-xl max-w-xl mb-8 leading-relaxed text-subtitle-dynamic">
              Scalable, privacy-preserving blockchain solutions powered by
              <span className="font-bold text-dynamic"> Zero-Knowledge Proofs</span> &
              <span className="font-bold text-dynamic"> Decentralized Identity</span>.
            </p>

            <div className="d-flex gap-4 mb-4 hero-buttons">
              <Link className="button button--primary button--lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all" to="/docs/intro" style={{ backgroundColor: 'var(--jm-secondary)', border: 'none' }}>
                Start Building →
              </Link>
              <Link className="button button--secondary button--lg backdrop-blur-md" to="https://zkjm.io">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column: Features Carousel */}
          <div className="w-full d-flex justify-center">
            <div className="carousel-card-wrapper">

              {/* Carousel Card */}
              <div className="w-full text-center" style={{ flex: 1 }}>
                <div key={activeIndex} className="glass-panel carousel-card d-flex flex-col items-center justify-center p-8 feature-slide" style={{ minHeight: '340px' }}>
                  <div className={`mb-6 p-5 rounded-full text-4xl ${activeFeature.color} shadow-lg`} style={{ width: 'fit-content', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {activeFeature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gradient">{activeFeature.title}</h3>
                  <p className="text-base opacity-90 text-dynamic leading-relaxed">{activeFeature.description}</p>
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
                  {/* Click Zones */}
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

      {/* ── What is JMDT — visible content for crawlers ────────────────────── */}
      <main>
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
            What is JMDT?
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
            <strong>Jupiter Meta Data Token (JMDT)</strong> is an Ethereum-based Layer 2 (L2) blockchain
            designed to enhance scalability, privacy, and security for decentralized applications (dApps)
            and enterprise use cases. By leveraging <strong>Zero-Knowledge Proofs (ZKPs)</strong>,{' '}
            <strong>Decentralized Identity (DID)</strong>, and the{' '}
            <strong>AVC (Asynchronous Validation Consensus)</strong> mechanism, JMDT provides a highly
            efficient and interoperable blockchain infrastructure.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
            JMDT is fully EVM-compatible, meaning developers can deploy existing Ethereum smart contracts
            without modification. Transactions are batched via zk-rollups and committed to Ethereum
            dynamically based on optimal gas fees, keeping costs low while maintaining L1-level security.
            The immutable ledger ensures tamper-proof, verifiable data recording for every operation.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
            Built for enterprises and developers alike, JMDT's DID system follows W3C standards —
            enabling PII-protected user authentication and cross-platform credential sharing without
            exposing personal data on-chain.
          </p>

          {/* ── Explore the Docs — internal linking section ──────────────── */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>
            Explore the Documentation
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Dive into any section of the JMDT technical documentation:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '3rem' }}>
            {[
              { label: 'Introduction', href: '/docs/intro', desc: 'Start here — overview of JMDT' },
              { label: 'Architecture', href: '/docs/architecture', desc: 'Three-layer design' },
              { label: 'AVC Consensus', href: '/docs/bft', desc: 'Consensus mechanism' },
              { label: 'Zero-Knowledge Proofs', href: '/docs/zk', desc: 'ZK-Rollup details' },
              { label: 'Decentralized Identity', href: '/docs/did', desc: 'DID & W3C standards' },
              { label: 'Tokenomics', href: '/docs/tokenomics', desc: 'JM Coin model' },
              { label: 'Use Cases', href: '/docs/use-cases', desc: 'Real-world applications' },
              { label: 'Smart Contracts', href: '/docs/smart-contract', desc: 'EVM deployment' },
              { label: 'Sequencer', href: '/docs/sequencer', desc: 'Transaction ordering' },
              { label: 'Advantages', href: '/docs/advantages', desc: 'vs other L2 solutions' },
              { label: 'Roadmap', href: '/docs/roadmap', desc: 'Development milestones' },
              { label: 'CLI Reference', href: '/docs/cli', desc: 'Node operator commands' },
            ].map(({ label, href, desc }) => (
              <li key={href}>
                <Link
                  to={href}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <strong style={{ display: 'block', marginBottom: '0.2rem' }}>{label}</strong>
                  <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{desc}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Visible FAQ section — addresses audit "FAQ Section: Not Found" ── */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Frequently Asked Questions
          </h2>

          {[
            {
              q: 'What is JMDT?',
              a: 'JMDT (Jupiter Meta Data Token) is an Ethereum-based Layer 2 blockchain designed for scalability, privacy, and security. It uses Zero-Knowledge Proofs (ZKPs), Decentralized Identity (DID), and the AVC consensus algorithm to deliver a high-throughput, privacy-preserving blockchain infrastructure for dApps and enterprise use cases.',
            },
            {
              q: 'What is AVC consensus?',
              a: 'AVC (Asynchronous Validation Consensus) is JMDT\'s consensus algorithm, engineered for efficient and fault-tolerant agreement across all network nodes, enabling the JMDT Layer 2 to process transactions reliably at scale.',
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
              a: 'JMDT supports user onboarding and reward redemption (via the SuperJ platform), enterprise identity verification using DID credentials, privacy-preserving DeFi applications, and any dApp requiring high throughput combined with strong data privacy guarantees.',
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
