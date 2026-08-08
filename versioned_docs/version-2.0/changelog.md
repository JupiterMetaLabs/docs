---
id: changelog
title: Documentation Changelog
sidebar_label: Changelog
description: Dated record of significant changes to the JMDT documentation — content corrections, new pages, and versioning events.
keywords: [JMDT docs changelog, documentation updates, docs versions]
---

# Documentation Changelog

Significant changes to this documentation site, most recent first. Pages that make
status claims (roadmap, network overviews) carry their own dates.

---

## 2026-08-09 — Docs 2.0 baseline

Knowledge-base synchronisation pass across the site:

- **Architecture accuracy** — the shipped system is described as L2 + Ethereum L1
  settlement; the L3 Enterprise DAG is presented as a planned roadmap phase throughout
- **Consensus** — quorum documented uniformly as `(2n+2)/3` (≥⅔ supermajority over the
  authenticated committee); committee selection described at the protocol level
- **ZK proof system** — wording aligned to what ships: RISC Zero zkVM, block commitments
  anchored to Ethereum via the ZK rollup contract, full state-transition proving being
  completed
- **Token utility** — current utility stated as transaction fees, network validation,
  DID operations, and L2 commitments; staking presented as a planned roadmap item
- **Transaction lifecycle** — documented price-and-nonce selection (per-sender strict
  nonce order, cross-sender fee priority, nonce gap-hold), sender-affinity mempool
  routing, and the Espresso Sequencer (namespace 7000700) as an external ordering
  dependency
- **Performance figures** — throughput and finality numbers labelled as design targets
- **Housekeeping** — retired legacy branding, removed stale/internal orphan pages,
  refreshed `llms.txt`, dated status-bearing pages
- **Versioning introduced** — docs are now versioned; 2.0.x is current and 1.x is
  deprecated (v1.x nodes no longer participate in the network as of 1 August 2026 —
  see the migration guide)

---

## Earlier

Pre-2.0 documentation was unversioned. For the v1 → v2 operator upgrade path, see the
migration guide.
