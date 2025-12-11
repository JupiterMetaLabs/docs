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

        {/* Google Translate Widget */}
        <script type="text/javascript">
          {`
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,hi,ta,te,ml,kn,zh-CN,fr,de,es,it,ko,ja,ru,ar',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}
`}
        </script>
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
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

      {/* Google Translate Dropdown - Fixed Position */}
      <div id="google_translate_element"
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid var(--glass-border)'
        }}
      ></div>
    </Layout>
  );
}
