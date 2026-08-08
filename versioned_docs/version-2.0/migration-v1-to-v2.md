---
id: migration-v1-to-v2
title: Migrating from v1.x to v2.0
sidebar_label: v1 → v2 Migration
description: Operator guide for upgrading a JMDN node from the deprecated v1.x line to v2.0 — what changed, the upgrade procedure, and configuration implications. v1.x nodes no longer participate in the network as of 1 August 2026.
keywords: [JMDN upgrade, v1 to v2 migration, JMDT node upgrade, deprecated v1, AVC consensus upgrade]
---

# Migrating from v1.x to v2.0

:::danger v1.x support has ended
As of **1 August 2026**, the network no longer accepts legacy-format consensus messages.
**v1.x nodes can no longer participate** — they will connect but their consensus messages
are rejected. Upgrading to v2.0 is required to validate, propose, or serve the network.
:::

*Page updated: 9 August 2026.*

---

## What Changed in 2.0

v2.0 is a protocol-level upgrade, not a drop-in binary swap:

- **AVC consensus** — consensus moved to Asynchronous Validation Consensus: VRF-selected
  buddy committees over the authenticated validator set, two-phase BFT (PREPARE/COMMIT)
  with BLS aggregate signatures, and a `(2n+2)/3` (≥⅔ supermajority) quorum. See
  [AVC Consensus →](/docs/bft).
- **Gossip propagation** — transaction, vote, and block dissemination moved to
  GossipSub-based propagation with Bloom-filter deduplication.
- **State-consistency upgrades** — WAL-first block commits (a finalised block is durable
  before it is acknowledged) and Merkle-verified FastSync for nodes joining or catching
  up with the network.
- **Transaction pipeline** — sender-affinity mempool routing, price-and-nonce selection,
  and external ordering via the Espresso Sequencer (namespace 7000700). See
  [Transaction Lifecycle →](/docs/transaction-lifecycle).

Because the consensus message format changed, v1.x and v2.0 nodes do not interoperate.

---

## Upgrade Procedure

1. **Stop the v1.x node** and take it out of any process supervision (systemd, Docker
   restart policies) so it does not restart mid-upgrade.
2. **Back up your node identity and configuration** — your key material, `jmdn.yaml`,
   and any operator tooling configuration. Keys carry over; configuration does not
   (see below).
3. **Install the v2.0 binary** by following the current install guide for your network:
   [Mainnet install →](/docs/mainnet/mainnet-install) or
   [Testnet install →](/docs/testnet/testnet-install).
4. **Recreate your configuration from the v2 template** in the install guide rather than
   carrying the v1 file forward — v2 introduces new consensus and networking sections,
   and several v1 settings no longer exist. Verify at minimum: `network`, `chain_id`
   (`7000700` mainnet / `8000800` testnet), and your key paths.
5. **Start with a clean v2 data directory.** On first start the node bootstraps via
   **FastSync**, which Merkle-verifies blocks as it catches up with the network — do not
   point v2 at a v1 data directory.
6. **Verify participation.** The startup log should show the correct network and chain
   ID (e.g. `Network: mainnet | Chain ID: 7000700`), and the node should begin syncing
   blocks. Cross-check progress against the [explorer](https://explorer.jmdt.io).

---

## FAQ

**Can I run v1.x a little longer?**
No — the cutoff is already enforced. A v1.x node may stay online but contributes nothing:
its consensus messages are rejected by the network.

**Do my keys change?**
No. Node identity and key material carry over; only the binary, configuration, and data
directory are replaced.

**Is testnet affected the same way?**
Yes — the same v2.0 requirement applies on both networks.

**Where do I get help?**
The [Telegram community](https://t.me/JMDT_Blockchain) and the install guides above. For
suspected bugs, open an issue on [GitHub](https://github.com/JupiterMetaLabs).

---

## Related

- [Running a Node →](/docs/running-a-node)
- [Mainnet Overview →](/docs/mainnet/mainnet-overview)
- [Documentation Changelog →](/docs/changelog)
