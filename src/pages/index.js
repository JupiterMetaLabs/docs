import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Lenis from 'lenis';
import JmdtHomeNeubrutalismBody from '../components/JmdtHomeNeubrutalismBody';

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
      <JmdtHomeNeubrutalismBody />
    </Layout>
  );
}
