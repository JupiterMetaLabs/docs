import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="JupiterMetaZK Documentation" description="Scalable, Privacy-Preserving Layer 2 Blockchain">
      
      {/* SEO & Open Graph Meta Tags */}
      <Head>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-8N3L9Z2Z9X"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8N3L9Z2Z9X');
          `}
        </script>
        {/* 🌐 SEO Metadata */}
        <title>JupiterMetaZK - Next-Gen Blockchain Platform</title>
        <meta name="description" content="JupiterMetaZK is an Ethereum Layer 2 blockchain with Zero-Knowledge Proofs, Decentralized Identity, and Hybrid Multi-Layer Consensus for privacy, scalability, and security." />
        <meta name="keywords" content="JupiterMetaZK, Blockchain, Ethereum Layer 2, ZK Proofs, Web3, Decentralized Identity, L2 Blockchain, Crypto, Smart Contracts, zkjm, scalable blockchain, high throughput blockchain, gossip protocol, raft, bloom filters, nnss" />
        <meta name="author" content="JupiterMetaZK" />
        <link rel="canonical" href="https://zkjm.io/" />

        {/* 🌐 Favicon */}
        <link rel="icon" type="image/png" href="https://storage.googleapis.com/super-j/679b7e4648c7a998d458130e/favicon.png" />
        <link rel="apple-touch-icon" href="https://storage.googleapis.com/super-j/679b7e4648c7a998d458130e/favicon.png" />

        {/* 🌐 Open Graph (OG) Meta Tags for Social Sharing */}
        <meta property="og:title" content="JupiterMetaZK - Next-Gen Blockchain Platform" />
        <meta property="og:description" content="Scalable, private, and secure Ethereum Layer 2 blockchain with Zero-Knowledge Proofs and Decentralized Identity." />
        <meta property="og:url" content="https://zkjm.io/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://storage.googleapis.com/super-j/images/jmzk-ogimage.png" />
        <meta property="og:image:alt" content="JupiterMetaZK" />
        <meta property="og:site_name" content="JupiterMetaZK" />

        {/* 🌐 Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JupiterMetaZK - Next-Gen Blockchain Platform" />
        <meta name="twitter:description" content="Ethereum Layer 2 blockchain with privacy, scalability, and ZK Proofs." />
        <meta name="twitter:image" content="https://storage.googleapis.com/super-j/images/jmzk-ogimage.png" />
        <meta name="twitter:site" content="@JupiterMetaZK" />
      </Head>

      {/* 🚀 Hero Section with Darkened Background Image */}
      <header 
        className="hero hero--primary relative"
        style={{
          backgroundColor: 'var(--ifm-background-color)',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/img/bgimg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '4rem 0',
        }}
      >
        <div className="container">
          
          {/* 🔥 Gradient Title */}
          <h1 
            className="text-5xl sm:text-6xl font-extrabold mb-6 text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(90deg, #71a2e6 15.5%, #8074d9 41%, #df77a8 68%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            JupiterMetaZK Documentation
          </h1>

          <p className="hero__subtitle" style={{ color: 'var(--ifm-font-color-base)' }}>
            Scalable, privacy-preserving blockchain solutions with <strong>ZK Proofs</strong> & <strong>Decentralized Identity</strong>.
          </p>
          
          <div>
            <Link className="button button--secondary button--lg" to="/docs/intro">
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      {/* 🌟 Features Section */}
      <main>
        <section className="container" style={{ padding: '3rem 0' }}>
          <div className="row">
            
            <div className="col col--4">
              <h2>🔐 Privacy-Preserving</h2>
              <p>Zero-Knowledge Proofs (ZKPs) for secure and confidential transactions.</p>
            </div>
            
            <div className="col col--4">
              <h2>⚡ High Scalability</h2>
              <p>Layer 2 rollups ensure high throughput and low-cost transactions.</p>
            </div>
            
            <div className="col col--4">
              <h2>🛠 Developer-Friendly</h2>
              <p>Build on Ethereum with full EVM compatibility and easy-to-use SDKs.</p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}