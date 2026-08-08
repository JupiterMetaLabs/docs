---
id: use-cases
title: Use Cases
sidebar_label: Use Cases
description: Real-world use cases for JMDT — from consumer identity and reward monetisation via SuperJ, to enterprise data collaboration, AI-driven analytics, DeFi, and compliance-first applications.
keywords: [JMDT use cases, SuperJ, Hercules, blockchain identity, enterprise DAG, DeFi privacy, Layer 2 applications, Web3 data marketplace]
---

# Use Cases

> **JMDT — The Truth Layer for Verifiable Information.** Every use case is grounded in privacy-first, cryptographically verifiable data flows — from individual users to enterprise ecosystems.

---

## Flagship Applications on JMDT

### SuperJ — Consumer Intelligence & Reward Platform

**SuperJ** is a decentralised consumer intelligence app built on JMDT's decentralised identity and verifiable-data infrastructure. It currently enables **over 20 million users** to:

- ZK-verify their identity without exposing personal information
- Share data and provide verified insights to enterprises
- Monetise their own authentic data — earning JMDT tokens as rewards

SuperJ demonstrates JMDT's core value proposition: users own their data, enterprises access verified intelligence with a cryptographic chain of custody, and no PII is ever exposed on-chain.

**How it works:**
1. User joins SuperJ and receives a **JMDT DID** (Decentralised Identifier)
2. Engages in surveys, tasks, or enterprise data-sharing workflows
3. Earns **JMDT tokens** — redeemable for gift cards, assets, or ecosystem benefits
4. Data is shared via ZK-proofs — enterprises receive verified signals, not raw PII

---

### Hercules — Research & Decision Intelligence

**Hercules** is a research assistant for data-backed decision making, built on JMDT's verifiable data infrastructure. Enterprises use Hercules to:

- Query verified, anonymised datasets from the JMDT ecosystem
- Generate AI-driven insights with a cryptographic chain of custody
- Comply with GDPR and data sovereignty regulations by design

---

## Enterprise Use Cases

### Enterprise Identity Verification

1. Businesses onboard users via **JMDT DID credentials**
2. DID credentials are stored on **Layer 2** — verifiable but private
3. Users can share credentials across **multiple platforms** without re-exposing identity
4. Enterprise-managed DIDs enable department- or role-level access control

### Private Enterprise Data Operations (L3 DAG) *(planned)*

Once the L3 DAG layer ships (see the [roadmap](/docs/roadmap)), enterprises will deploy private **DAG nodes** for:

- **Supply chain tracking** — tamper-proof audit trails on an append-only ledger
- **Compliance logging** — append-only, ZK-anchored activity records
- **CRM and analytics** — AI-inference logs with verifiable provenance
- **Internal tokenisation** — industry-specific logic and reward mechanisms

DAG activity will be periodically committed to L2, providing global auditability without exposing raw enterprise data.

### Cross-Enterprise Data Collaboration *(planned)*

Using the planned **InterDAG Bridge**, organisations will be able to:

- Collaborate on shared datasets without centralising control
- Enable access requests, logging, and secure off-chain queries
- Maintain data sovereignty while participating in shared ecosystems

---

## Developer & DeFi Use Cases

### Privacy-Preserving DeFi

- Deploy Solidity smart contracts on JMDT's EVM-compatible L2
- Benefit from ZKP-backed transaction privacy — balances and counterparties are not exposed
- Lower gas costs via zkRollup batching to Ethereum L1

### Web3 Data Marketplaces

- Build marketplaces where verified human data is tokenised and traded
- DID-based access control ensures only authorised parties can query datasets
- zk-proofed data capture enables GDPR-compliant, monetisable data flows

### AI-Driven Analytics Pipelines *(planned with L3)*

- Build AI inference pipelines on the planned L3 DAG nodes
- Outputs will be cryptographically committed to L2 — audit-ready by design
- Combine human-verified identity signals with enterprise data for trusted AI

---

## How Enterprises Build on JMDT

| Step | Action |
|---|---|
| **1. Build on L2** | Deploy EVM-compatible smart contracts on JMDT L2 today (L3 DAG nodes arrive with the L3 roadmap phase) |
| **2. Set Up DID & Access** | Register a DID, manage keys with secure wallets, issue sub-identities |
| **3. Deploy Workflows** | Build business logic in Solidity today; DAG-based Python/Rust workflows arrive with L3 |
| **4. Commit to L2** | Transactions execute on JMDT L2 and are anchored to Ethereum via the ZK rollup contract |
| **5. Use JMDT Token** | Fuel transaction fees, DID operations, and L2 commitments (staking is planned — see the roadmap) |
| **6. Run Infrastructure** | Host on GCP, AWS, or on-prem with JMDT.io RPC and append-only verifiable logs |
| **7. Monitor** | Use Explorer dashboards to track transactions, blocks, and network health |
