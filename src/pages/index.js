import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="JupiterMetaZK Documentation" description="Scalable, Privacy-Preserving Layer 2 Blockchain">
      
      {/* Google Analytics Tag */}
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
