import React from 'react';
import Link from '@docusaurus/Link';
import ScrambleText from './ScrambleText';

const IconShield = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.05 9 11 5.25-.95 9-5.75 9-11V7l-9-5z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconLock = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconWifi = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1.42 9A16 16 0 0 1 22.58 9" />
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M10.54 17.09a5 5 0 0 1 2.92 0" />
    <circle cx="12" cy="20" r="1" fill="currentColor" />
  </svg>
);

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

const HERO_METRICS = [
  { value: '5,000+', label: 'TPS' },
  { value: '20M', label: 'Verified Users' },
  { value: '100%', label: 'ZK Privacy' },
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
    q: "What is JMDT's L3 DAG architecture?",
    a: "JMDT (Jupiter Meta Data Token) uses a Layer 3 Directed Acyclic Graph (DAG) architecture. Unlike linear blockchains, the DAG enables asynchronous verification and parallel processing, delivering ultra-high throughput (5,000+ TPS) and near-instant finality for real-time, high-frequency use cases.",
  },
  {
    q: 'How does Zero-Knowledge DID protect my privacy?',
    a: 'JMDT combines W3C-standard decentralized identity (DID) with zero-knowledge verification. This allows credentials to be validated without exposing personal data, so users can authenticate and share attestable proofs while keeping sensitive details off-chain.',
  },
  {
    q: 'What are the main utilities of the JMDT Token?',
    a: 'The JMDT token is used to power the data economy: converting user-approved behavioral signals and app-level insights into verifiable, tradeable on-chain value. This supports incentives for authentic data contributions and privacy-first verification across the JMDT ecosystem.',
  },
  {
    q: 'Is JMDT compatible with Ethereum/EVM?',
    a: 'Yes. JMDT is fully EVM-compatible, meaning existing Ethereum smart contracts can be deployed on JMDT without modification.',
  },
  {
    q: 'What makes JMDT different from L2 solutions like Polygon or Optimism?',
    a: 'JMDT combines ZK privacy, DID-based self-sovereign identity, and a dedicated Layer 3 DAG execution architecture alongside its asynchronous validation consensus. This focuses on verifiable data, privacy-preserving identity, and high-throughput finality beyond typical L2 rollup-only stacks.',
  },
  {
    q: "What is 'On-Device AI' in the JMDT ecosystem?",
    a: "On-device AI runs locally on users' devices to generate insights and zk-attestable analytics without sending raw user data to the network. This helps preserve privacy while enabling edge analytics and proof-backed outcomes.",
  },
  {
    q: 'Can enterprises use JMDT for KYC compliance?',
    a: 'Yes. Enterprises can leverage DID and zero-knowledge verification to confirm identities and credentials without exposing personal data. This supports compliance-first workflows while reducing privacy risk from unnecessary PII disclosure.',
  },
  {
    q: 'Is the JMDT network secure against quantum computing?',
    a: 'JMDT is designed with quantum-robust proof systems in mind (zk-STARK and zk-SNARK proof oracles) so verifiable computation can remain reliable under stronger adversarial assumptions.',
  },
  {
    q: 'How do I set up the JMDT Testnet in my wallet?',
    a: 'To add JMDT Testnet to an EVM wallet, use RPC URL https://testnetrpc.jmdt.io and Chain ID 8000800 (Network name: JMDT Testnet, Currency symbol: JMDT). After saving, switch your wallet to the Testnet network.',
  },
  {
    q: 'Where can I get Testnet JMDT tokens?',
    a: 'Testnet JMDT tokens are free via the JMDT Faucet. The faucet is listed as "coming soon" in the Testnet documentation, and will provide tokens for development and testing.',
  },
  {
    q: 'How do I buy JMDT tokens?',
    a: 'When JMDT mainnet tokens go live, they are listed as available for purchase on Bitmart (per the Testnet vs Mainnet documentation).',
  },
];

export default function JmdtHomeNeubrutalismBody() {
  return (
    <>
      <header className="homeHero">
        <div className="homeHeroDots" aria-hidden="true" />

        <div className="section-container homeHeroGrid">
          {/* Left copy */}
          <div className="homeHeroCopy">
            <p className="homeEyebrow">
              <ScrambleText text="THE" baseColor="#C4C7C8" triggerOnMount={true} />{' '}
              <ScrambleText text="TRUTH" baseColor="#FFFFFF" triggerOnMount={true} />{' '}
              <ScrambleText text="LAYER" baseColor="#C4C7C8" triggerOnMount={true} />{' '}
              <ScrambleText text="FOR" baseColor="#FFFFFF" triggerOnMount={true} />{' '}
              <ScrambleText text="VERIFIABLE" baseColor="#C4C7C8" triggerOnMount={true} />{' '}
              <ScrambleText text="INFORMATION" baseColor="#FFFFFF" triggerOnMount={true} />
            </p>

            <h1 className="homeH1">
              Build<br />On JMDT
            </h1>

            <p className="homeSubtitle">
              <span className="subDim">Privacy-</span><span className="subBright">Preserving </span>
              <span className="subDim">Ethereum </span>
              <span className="subBright">Layer 2 </span>
              <span className="subDim">Blockchain –</span>
              <br />
              <span className="subBright">Powered by </span>
              <span className="subDim">Zero-Knowledge </span>
              <span className="subBright">Proofs, Decentralized</span>
              <br />
              <span className="subBright">Identity, </span>
              <span className="subDim">and </span>
              <span className="subBright">AVC Consensus.</span>
            </p>

            <div className="homeCtaRow">
              <Link className="homeBtnPrimary" to="/docs/intro">
                Start Building <img src="/icons/black_right_arrow.svg" alt="Arrow Right" className="" />
              </Link>
              <Link className="homeBtnSecondary" to="https://jmdt.io" target="_blank" rel="noopener noreferrer">
                JMDT.IO <img src="/icons/white_arrow.svg" alt="Arrow Right" className="" />
              </Link>
            </div>

            <Link className="homeTelegramBtn" to="https://t.me/JMDT_token" target="_blank" rel="noopener noreferrer">
              JOIN TELEGRAM GROUP
              <img src="/icons/join_telegram_arrow.svg" alt="" width="15" height="10" />
            </Link>
          </div>

          {/* Right card */}
          <aside className="homeHeroSide">
            <div className="homeStatement">
              <div className="homeStatementTitle">
                Verified Humans Own<br />Their Data.
              </div>

              <div className="homeStatementDivider" />

              <p className="homeStatementLead">
                <span className="subDim">Enterprises </span>
                <span className="subBright">Access </span>
                <span className="subDim">Authentic </span>
                <span className="subBright">Insights. </span>
                <span className="subBright">Privacy </span>
                <span className="subDim">is Absolute – </span>
                <span className="subBright">Built On </span>
                <span className="subDim">ZK Proofs and Self-</span>
                <span className="subBright">Sovereign </span>
                <span className="subDim">Identity.</span>
              </p>

              <div className="homeStatementDivider" />

              <div className="homeIconGrid">
                <div className="homeIconRow">
                  <span className="homeIconRowIcon">
                    <img src="/icons/tamper_icon.svg" alt="" width="32" height="32" />
                  </span>
                  <span className="homeIconRowTitle">
                    <ScrambleText
                      text="Tamper-Proof Truth"
                      highlight="Truth"
                      baseColor="#A2A2A2"
                      highlightColor="#FFFFFF"
                    />
                  </span>
                </div>
                <div className="homeIconRow">
                  <span className="homeIconRowIcon">
                    <img src="/icons/zk_privacy_icon.svg" alt="" width="32" height="32" />
                  </span>
                  <span className="homeIconRowTitle">
                    <ScrambleText
                      text="ZK Privacy, End-To-End"
                      highlight="Privacy,"
                      baseColor="#A2A2A2"
                      highlightColor="#FFFFFF"
                    />
                  </span>
                </div>
                <div className="homeIconRow">
                  <span className="homeIconRowIcon">
                    <img src="/icons/self_sovereign_icon.svg" alt="" width="32" height="32" />
                  </span>
                  <span className="homeIconRowTitle">
                    <ScrambleText
                      text="Self-Sovereign Identity"
                      highlight="Sovereign"
                      baseColor="#A2A2A2"
                      highlightColor="#FFFFFF"
                    />
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Stats bar */}
        <div className="homeHeroStatsBar">
          <div className="section-container homeStatsRow">
            {HERO_METRICS.map((m, i) => (
              <React.Fragment key={m.label}>
                {i > 0 && <span className="homeStatDivider" aria-hidden="true" />}
                <div className="homeStatItem">
                  <div className="homeStatValue">{m.value}</div>
                  <div className="homeStatLabel">{m.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {false && <main className="homeMain">
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
      </main>}
    </>
  );
}
