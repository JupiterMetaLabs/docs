---
id: node-selection
title: Committee Selection
sidebar_label: Committee Selection
description: How JMDT's AVC consensus selects validator committees — VRF-based randomised selection over an authenticated validator set, weighted by seed-node reputation.
keywords: [node selection, committee selection, VRF, buddy nodes, AVC, JMDT consensus, validator committee]
---

# Committee Selection

> How AVC chooses who validates each block — randomised, verifiable, and Sybil-resistant.

Every consensus round, JMDT's **Asynchronous Validation Consensus (AVC)** selects a **buddy committee** of *k* validators to validate and vote on the proposed block. Selection is designed so that no party — including the block proposer — can predict or steer who validates a given block.

---

## How Selection Works

- **Authenticated validator set** — committees are drawn only from validators registered and authenticated on the network; unknown or unverified peers are never eligible.
- **VRF-based randomisation** — a Verifiable Random Function drives committee choice, making selection unpredictable in advance yet verifiable after the fact.
- **Reputation weighting** — Seed Node feedback adjusts selection weight over time: reliable validators gain standing, while misbehaving or unreliable nodes are penalised.
- **Geo-diversity and Sybil resistance** — selection considers network diversity (e.g. provider/ASN spread) so that committees cannot be dominated by co-located or duplicated identities.

## Committee Properties

| Property | Value |
|---|---|
| Committee size | *k* validators per round (protocol-configured) |
| Quorum for acceptance | `(2n+2)/3` — a ≥⅔ supermajority over the authenticated committee size *n* |
| Equivocation handling | Conflicting votes from the same validator are detected and rejected |
| Verifiability | VRF outputs are publicly verifiable against the validator's public key |

## Why Random Committees?

Fixed validator sets create predictable targets for bribery, denial-of-service, and cartel formation. Randomised per-round committees mean:

- An attacker cannot know in advance which nodes to target or corrupt
- No standing "leader class" accumulates outsized influence
- Failed or slow validators are naturally rotated out by reputation weighting

## Relationship to Consensus

Committee selection is stage one of every AVC round. Once the committee is chosen, the two-phase BFT flow (PREPARE/COMMIT with BLS aggregate signatures) takes over — see [AVC Consensus →](/docs/bft) for the full protocol, quorum math, and finality flow.

---

## Related

- [AVC Consensus →](/docs/bft) — the full consensus protocol
- [AVC Module →](/docs/avc) — module-level reference
- [Running a Node →](/docs/running-a-node) — join the validator set
