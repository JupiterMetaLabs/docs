import React from 'react';
import Link from '@docusaurus/Link';
import JmdtHomeStaticBackground from './JmdtHomeStaticBackground';
import ThemeAwareHeroLogo from './ThemeAwareHeroLogo';

// SVG icon components — no emoji
const IconDAG = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <path d="M10 10l4 4" />
    <path d="M14 10l-4 4" />
  </svg>
);

const IconZKRollups = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L3 7l9 5 9-5-9-5z" />
    <path d="M3 17l9 5 9-5" />
    <path d="M3 12l9 5 9-5" />
  </svg>
);

const IconEthereum = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2l9 6-9 6-9-6 9-6z" />
    <path d="M3 14l9 8 9-8" />
  </svg>
);

const IconShield = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.05 9 11 5.25-.95 9-5.75 9-11V7l-9-5z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconPrivacy = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9.5 10.5l1.8 1.8 3.2-4" />
  </svg>
);

const IconIdentity = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <line x1="12" y1="7" x2="5" y2="17" />
    <line x1="12" y1="7" x2="19" y2="17" />
    <line x1="5" y1="19" x2="19" y2="19" />
  </svg>
);

const HERO_METRICS = [
  { value: '5,000+', label: 'TPS', color: 'var(--nb-orange)' },
  { value: '20M', label: 'Verified Users', color: 'var(--nb-blue)' },
  { value: '100%', label: 'ZK Privacy', color: 'var(--nb-yellow)' },
];

const MISSION_PILLARS = [
  {
    number: '01',
    title: 'Multi-Layer Stack',
    description: 'L1 security, L2 zkRollups for scalability, and L3 DAG-based networks for lightning-fast finality.',
  },
  {
    number: '02',
    title: 'Zero-Knowledge Innovation',
    description: 'zk-STARK and SNARK proof systems enable privacy-preserving verification without compromising security.',
  },
  {
    number: '03',
    title: 'Self-Sovereign Identity',
    description: 'W3C-compliant DID framework keeps your identity and data on your device — always.',
  },
];

const STACK_CARDS = [
  {
    level: 'L3',
    title: 'DAG Data Store',
    description: 'High-performance execution layer with directed acyclic graph structure.',
    color: 'var(--nb-yellow)',
    Icon: IconDAG,
  },
  {
    level: 'L2',
    title: 'zkRollups',
    description: 'Scalability layer utilizing zero-knowledge proofs for batch processing.',
    color: 'var(--nb-blue)',
    Icon: IconZKRollups,
  },
  {
    level: 'L1',
    title: 'Ethereum',
    description: 'Foundation layer providing ultimate security and final settlement.',
    color: 'var(--nb-orange)',
    Icon: IconEthereum,
  },
];

// This repo doesn’t currently enable a blog plugin; we use existing docs routes as a stand-in for “Latest Insights”.
const LATEST_INSIGHTS = [
  { label: 'INTRODUCTION', href: '/docs/intro', desc: 'Overview of JMDT' },
  { label: 'ARCHITECTURE', href: '/docs/architecture', desc: 'Three-layer design' },
  { label: 'AVC CONSENSUS', href: '/docs/avc', desc: 'Consensus mechanism' },
  { label: 'ZK PROOFS', href: '/docs/zk', desc: 'ZK-Rollup details' },
  { label: 'IDENTITY', href: '/docs/did', desc: 'DID & W3C Standards' },
  { label: 'SMART CONTRACTS', href: '/docs/smart-contract', desc: 'EVM deployment' },
];

const FAQ_ITEMS = [
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
];

function HomeIconRow({ Icon, title, color }) {
  return (
    <div className="homeIconRow" style={{ color }}>
      <div className="homeIconRowIcon">
        <Icon />
      </div>
      <div className="homeIconRowTitle">{title}</div>
    </div>
  );
}

export default function JmdtHomeNeubrutalismBody() {
  return (
    <>
      <header className="homeHero">
        <JmdtHomeStaticBackground />

        <div className="homeContainer homeHeroGrid">
          <div className="homeHeroCopy">
            <div className="animate-float homeHeroLogoWrap">
              <ThemeAwareHeroLogo
                style={{
                  height: '100px',
                  filter: 'drop-shadow(0 0 20px rgba(113, 162, 230, 0.4))',
                }}
              />
            </div>

            <p className="homeEyebrow">The Truth Layer for Verifiable Information</p>

            <h1 className="homeH1">
              Build on <span className="text-gradient">JMDT</span>
            </h1>

            <p className="homeSubtitle">
              Privacy-preserving Ethereum Layer 2 blockchain — powered by{' '}
              <span className="homeAccentOrange">Zero-Knowledge Proofs</span>,{' '}
              <span className="homeAccentBlue">Decentralized Identity</span>, and{' '}
              <span className="homeAccentYellow">AVC consensus</span>.
            </p>

            <div className="homeCtaRow">
              <Link className="button button--primary button--lg" to="/docs/intro">
                Start Building &rarr;
              </Link>
              <Link className="button button--secondary button--lg" to="https://jmdt.io">
                jmdt.io &rarr;
              </Link>
            </div>

            <div className="homeMetricsRow">
              {HERO_METRICS.map((m) => (
                <div key={m.label} className="homeMetricCard glass-panel">
                  <div className="homeMetricValue" style={{ color: m.color }}>
                    {m.value}
                  </div>
                  <div className="homeMetricLabel">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="homeHeroSide">
            <div className="homeStatement glass-panel">
              <div className="homeStatementTitle">Verified humans own their data.</div>
              <div className="homeStatementLead">
                Enterprises access authentic insights. Privacy is absolute — built on ZK proofs and self-sovereign identity.
              </div>

              <div className="homeIconGrid">
                <HomeIconRow Icon={IconShield} title="Tamper-proof truth" color="var(--nb-yellow)" />
                <HomeIconRow Icon={IconPrivacy} title="ZK privacy, end-to-end" color="var(--nb-blue)" />
                <HomeIconRow Icon={IconIdentity} title="Self-sovereign identity" color="var(--nb-orange)" />
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main className="homeMain">
        <section className="homeSection">
          <h2 className="homeSectionTitle">Our Mission</h2>
          <p className="homeSectionLead">
            JupiterMetaLabs has built the Antidote: a Web3 ecosystem where verified humans contribute authentic data they own — and earn from insights that previously enriched everyone but them.
          </p>

          <div className="homePillarGrid">
            {MISSION_PILLARS.map((p) => (
              <div key={p.number} className="homePillar glass-panel">
                <div className="homePillarNumber">{p.number}</div>
                <div className="homePillarTitle">{p.title}</div>
                <p className="homePillarDesc">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="homeSection">
          <h2 className="homeSectionTitle">JMDT Stack Architecture</h2>
          <div className="homeCardGrid">
            {STACK_CARDS.map((c) => (
              <div key={c.level} className="homeStackCard glass-panel">
                <div className="homeStackIconWrap" style={{ color: c.color }}>
                  <c.Icon />
                </div>
                <div className="homeStackLevel" style={{ color: c.color }}>
                  {c.level} LAYER
                </div>
                <div className="homeStackTitle">{c.title}</div>
                <p className="homeStackDesc">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="homeSection">
          <h2 className="homeSectionTitle">Latest Insights</h2>
          <p className="homeSectionLead">From the JMDT Labs — quick-start docs cards.</p>

          <div className="homeCardGrid homeCardGrid--insights">
            {LATEST_INSIGHTS.map((i) => (
              <Link key={i.href} to={i.href} className="homeInsightCard glass-panel">
                <div className="homeInsightLabel" style={{ color: 'var(--nb-orange)' }}>
                  {i.label}
                </div>
                <div className="homeInsightDesc">{i.desc}</div>
                <div className="homeInsightArrow">Read &rarr;</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="homeSection">
          <h2 className="homeSectionTitle">Frequently Asked Questions</h2>
          <div className="homeFaqGrid">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={item.q} className="homeFaqItem glass-panel">
                <div className="homeFaqIndex">{String(idx + 1).padStart(2, '0')}</div>
                <div className="homeFaqQ">{item.q}</div>
                <p className="homeFaqA">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="homeSection homeSection--community">
          <div className="homeCommunityPanel glass-panel">
            <div className="homeCommunityTitle">Still have questions? Join our community.</div>
            <a
              className="button button--primary button--lg homeCommunityButton"
              href="https://t.me/JMDT_token"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Telegram Group &rarr;
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

