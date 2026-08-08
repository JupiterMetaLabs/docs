---
id: avc
title: AVC Module — Asynchronous Validation Consensus
sidebar_label: AVC Module
description: Technical reference for the JMDT AVC module — covering BFT consensus, BLS signatures, buddy node selection, VRF-based committees, CRDT synchronization, and the JMDN node implementation.
keywords: [AVC module, JMDT consensus, BFT, BLS signatures, VRF node selection, buddy nodes, CRDT, JMDN, AVC consensus]
---

# AVC Module

> *The Truth Layer for Verifiable Information — powered by Asynchronous Validation Consensus.*

The **AVC (Asynchronous Validation Consensus)** module is the consensus core of the JMDT network. It implements Byzantine Fault Tolerance (BFT), randomised buddy node selection via VRF, BLS cryptographic signing, and CRDT-based state synchronisation — all running inside the **JMDN** (JMDT Decentralised Node) binary.

See [AVC Consensus Mechanism →](/docs/bft) for the protocol-level overview.

---

## Overview

The AVC module ensures secure, distributed consensus by:

- Implementing BFT consensus protocols for block validation
- Selecting and managing buddy nodes for consensus participation
- Providing BLS cryptographic signing and verification
- Managing voting mechanisms for network decisions
- Synchronising state with CRDT convergence guarantees

---

## Submodules

### 1. BFT (Byzantine Fault Tolerance)

Implements a Byzantine Fault Tolerant consensus protocol for validating blocks and reaching agreement among network participants.

**Key Features:**
- PREPARE and COMMIT phases for consensus
- Byzantine fault detection and handling
- GossipSub-based message passing
- gRPC communication with Sequencer

---

### 2. BLS (Boneh-Lynn-Shacham) Signatures

Provides BLS signature generation and verification for all cryptographic consensus operations.

**Key Features:**
- BLS signature generation and aggregation
- Signature verification across buddy committees
- Router for signature routing

---

### 3. BuddyNodes

Manages buddy node selection, communication, and consensus participation within each AVC round.

**Key Features:**
- Buddy node selection and management
- Message passing between buddy nodes
- CRDT synchronisation for buddy node state
- PubSub integration for consensus messaging
- BLS signing and verification for buddy messages

**Key Components:**
- `MessagePassing/` — Communication between buddy nodes
- `CRDTSync/` — CRDT synchronisation for buddy node state
- `ServiceLayer/` — Service layer for buddy node operations
- `DataLayer/` — Data layer for buddy node storage

---

### 4. NodeSelection

Implements Verifiable Random Function (VRF)-based node selection for choosing buddy node committees each consensus round.

**Key Features:**
- VRF-based randomised committee selection over the authenticated validator set
- Node filtering and validation
- Selection service for buddy node committees
- Router for selection operations

---

### 5. VoteModule

Handles the BuddyVote mechanism — validation, aggregation, and quorum calculation.

**Key Features:**
- Vote validation
- Vote aggregation
- Consensus quorum logic: `q_buddy = ⌈2k/3⌉`

---

## Usage

### Initializing BFT Consensus

```go
import "JMDN/AVC/BFT/bft"

// Create BFT instance
bftInstance := bft.NewBFT(config)

// Start consensus round
err := bftInstance.StartConsensus(blockData)
```

### Using Buddy Nodes

```go
import "JMDN/AVC/BuddyNodes/MessagePassing"

// Create buddy node
buddyNode := MessagePassing.NewBuddyNode(host, buddies, responseHandler, pubsub)

// Handle buddy messages
buddyNode.HandleBuddyNodesMessageStream(host, stream)
```

### Node Selection

```go
import "JMDN/AVC/NodeSelection/pkg/selection"

// Create selection service
service := selection.NewSelectionService()

// Select buddy nodes for current round
buddies, err := service.SelectBuddies(count)
```

---

## Integration Points

- **Sequencer** — Uses AVC for consensus on block validation; see [Sequencer →](/docs/sequencer)
- **PubSub** — AVC uses PubSub for message propagation across JMDN nodes
- **Messaging** — AVC integrates with the messaging module for peer communication
- **Config** — AVC uses configuration constants for consensus parameters

---

## Configuration

Key protocol configuration constants:

| Constant | Default | Description |
|---|---|---|
| `MaxMainPeers` | 13 | Maximum main buddy nodes per round |
| `MaxBackupPeers` | 10 | Maximum backup buddy nodes |
| `ConsensusTimeout` | 20s | Timeout for consensus operations |

---

## Security Considerations

- BFT protocol ensures consensus even with up to ⌊(n−1)/3⌋ Byzantine faults
- BLS signatures provide cryptographic security for all consensus messages
- VRF ensures fair, unpredictable, and verifiable node selection each round
- Byzantine fault detection prevents malicious validator behaviour

---

## Performance

- BFT consensus requires a `(2n+2)/3` (= ⌈2n/3⌉, ≥⅔ supermajority) quorum over the authenticated committee of size `n`
- Buddy node selection uses efficient VRF algorithms
- Message passing optimised for sub-second latency
- CRDT synchronisation guarantees eventual consistency under network partitions

---

## Testing

Each module ships with unit, integration, and consensus-simulation tests in the JMDN repository.
