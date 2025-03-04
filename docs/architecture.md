---
id: architecture
title: Three-Layer Architecture
sidebar_label: Architecture
---

# 🏗️ Three-Layer Architecture

JupiterMetaZK employs a **three-layer architecture**:

1. **Enterprise Layer** – User interactions, enterprise workflows, and high-level application logic.
2. **Chain Layer** – **ZK-Rollups, SNARK/STARK computations, and DID-based verifiable credentials**.
3. **Bridge Layer** – Commits transactions to **Ethereum**.

```mermaid
flowchart TB
    A["Enterprise Layer<br>---<br> User Interfaces<br> Enterprise Workflows<br> DID Services"] -->|Transactions| B["Chain Layer<br>---<br> ZK-Rollups<br> SNARK/STARKs<br> Verifiable Proofs"]
    B -->|Rollups| C["Bridge Layer<br>---<br> Rubix Bridge<br> EVM Bridge<br> Solana Bridge (Future)"]
    C -->|Final Commit| D["Ethereum L1"]