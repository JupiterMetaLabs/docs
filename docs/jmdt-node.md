---
id: jmdt-node
title: JMDN — JMDT Decentralised Node
sidebar_label: JMDN Node
description: The JMDT Decentralised Node (JMDN) — peer-to-peer communication, blockchain synchronisation, AVC consensus, and resilient messaging for the JMDT Layer 2 network.
keywords: [JMDN, JMDT node, P2P communication, blockchain sync, libp2p, immudb, FastSync, CRDT, AVC consensus, JMDT Layer 2]
---

# JMDN — JMDT Decentralised Node

> *The Truth Layer for Verifiable Information — every JMDN node anchors verifiable state to the JMDT chain.*

**JMDN** (JMDT Decentralised Node) is the primary network binary for the JMDT Layer 2. It combines peer-to-peer communication, AVC consensus participation, blockchain synchronisation via FastSync, and an immudb-backed immutable ledger — all in a single, cross-platform binary.

For build and deployment instructions, see [Running a JMDN Node →](/docs/running-a-node).

---

## Architecture

JMDN is built on a modular architecture combining several advanced distributed systems concepts:

- **Libp2p Network Layer** — Foundation for peer discovery, connection management, and direct messaging
- **immudb Integration** — Tamper-proof immutable database with Merkle trees for the local ledger
- **FastSync Protocol** — Efficient blockchain state synchronisation between nodes
- **Gossip Protocol** — Reliable information dissemination across the JMDT network
- **CRDT Engine** — Conflict-free replicated data types ensuring eventual consistency
- **AVC Consensus** — Asynchronous Validation Consensus with VRF-based buddy selection
- **Bloom Filter Optimisation** — Memory-efficient set membership testing to prevent redundant data transfers

---

## Features

- **Decentralised Communication** — Direct peer-to-peer messaging without central servers
- **Blockchain Synchronisation** — Efficiently sync chain state between nodes using FastSync
- **Bloom Filter Optimisation** — Reduces network traffic by identifying missing blocks
- **Web Explorer & API** — Browser-based block explorer and REST API
- **Heartbeat Monitoring** — Automatic health checks and peer status tracking
- **Yggdrasil Integration** — Alternative encrypted mesh networking for improved privacy and connectivity
- **Metrics & Monitoring** — Prometheus-compatible metrics for system performance
- **Seed Node Discovery** — Bootstrap mechanism for network peer joining; see [Seednode →](/docs/seednode)

---

## System Requirements

| Component | Minimum |
|---|---|
| OS | Ubuntu 18.04+, Debian 10+, macOS, FreeBSD |
| Architecture | x86_64, ARM64, or ARMv7 |
| RAM | 2 GB |
| Storage | 10 GB free |
| Network | Internet connection |

---

## Running a Node

Basic node startup after installation:

```bash
./jmdn
```

### Configuration Flags

| Flag | Description | Default |
|---|---|---|
| `-seed` | Run as a seed node | `false` |
| `-connect <multiaddr>` | Connect to a seed node | — |
| `-heartbeat <seconds>` | Heartbeat interval | `120` |
| `-metrics <port>` | Prometheus metrics port | `"8080"` |
| `-logdir <path>` | Log directory | `"./logs"` |
| `-console` | Log to console | `false` |
| `-ygg` | Enable Yggdrasil messaging | `true` |
| `-explorer <port>` | Run block explorer (0=disabled) | `0` |
| `-api <port>` | Run immudb API (0=disabled) | `0` |

---

## Node Commands

Once running, the JMDN interactive console supports:

| Command | Description |
|---|---|
| `msg <peer_multiaddr> <message>` | Send a message via libp2p |
| `ygg <peer_multiaddr\|ygg_ipv6> <message>` | Send a message via Yggdrasil |
| `file <peer_multiaddr> <filepath>` | Send a file to a peer |
| `addpeer <peer_multiaddr>` | Add a peer to managed nodes |
| `removepeer <peer_id>` | Remove a peer from managed list |
| `listpeers` | Show all managed peers |
| `peers` | Request updated peer list from seed |
| `stats` | Show messaging statistics |
| `broadcast <message>` | Broadcast to all connected peers |
| `fastsync <peer_multiaddr>` | Fast sync blockchain data with a peer |
| `dbstate` | Show current immudb database state |
| `exit` | Exit the node |

---

## Architecture Deep Dive

### FastSync Protocol

FastSync efficiently synchronises blockchain data between nodes using:

1. **Initial State Exchange** — Nodes exchange current chain height and Merkle roots
2. **Bloom Filter Optimisation** — Identifies missing blocks using probabilistic data structures
3. **Batch Processing** — Transfers missing blocks in optimised batches
4. **Verification** — Final Merkle root comparison to ensure consistency

### CRDT Implementation

JMDN uses Conflict-free Replicated Data Types (CRDTs) to ensure data consistency across all nodes:

- **Last-Writer-Wins Sets** — For handling user data with timestamps
- **Counters** — For metrics and statistics requiring eventual consistency
- **Vector Clocks** — For causality tracking between distributed events

### P2P Network Features

- **Automatic Node Discovery** — Find and connect to other JMDN peers
- **NAT Traversal** — Connect to peers behind NATs and firewalls
- **Transport Layer Security** — Encrypted communication between all peers
- **Multi-Protocol Support** — Both libp2p and Yggdrasil messaging

---

## Web Explorer & API

When enabled, JMDN provides:

- **Block Explorer** — Web interface for viewing chain data at the configured port
- **RESTful API** — HTTP endpoints for programmatic immudb access
- **Metrics Dashboard** — Prometheus-compatible performance and health monitoring

---

## Related

- [Running a JMDN Node →](/docs/running-a-node) — Full build, install, and deployment guide
- [AVC Module →](/docs/avc) — Consensus internals
- [Sequencer →](/docs/sequencer) — Transaction ordering and batch proofing
- [Seednode →](/docs/seednode) — Bootstrap and peer discovery infrastructure
