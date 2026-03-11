---
id: sequencer
title: Sequencer Module
sidebar_label: Sequencer
description: JMDT's Sequencer module — responsible for consensus orchestration, buddy node selection, vote collection, BFT consensus execution, and transaction ordering on the JMDT Layer 2 network.
keywords: [JMDT sequencer, transaction ordering, consensus orchestration, BFT, Layer 2 sequencer, buddy nodes, JMDN]
---

# Sequencer Module

> *The Truth Layer for Verifiable Information — transaction ordering and consensus orchestration on JMDT L2.*

The **Sequencer** is the orchestration core of the JMDT Layer 2 chain. It drives the AVC consensus cycle: selecting buddy node committees via VRF, creating PubSub channels, collecting BuddyVotes, executing BFT consensus, and batching DAG state transitions into zk-proofs for L1 anchoring.

The Sequencer runs as a core component inside the **JMDN** (JMDT Decentralised Node) binary.

---

## Overview

The Sequencer module enables:

- Consensus orchestration for block validation
- Buddy node selection and management using VRF
- Vote collection from buddy nodes
- BFT consensus execution
- PubSub channel management for consensus
- CRDT synchronisation for buddy node state

---

## Key Components

### 1. Consensus

**File:** `JMDN/Sequencer/Consensus.go`

Main consensus orchestration:

- `NewConsensus` — Create a new consensus instance
- `Start` — Begin the consensus process for a block
- `QueryBuddyNodes` — Select buddy nodes via VRF for the current round
- `RequestSubscriptionPermission` — Request subscription from selected buddy nodes
- `CreatePubSubChannel` — Create the private PubSub channel for consensus

### 2. Communication

**File:** `JMDN/Sequencer/Communication.go`

Communication with buddy nodes:

- `AskForSubscription` — Ask buddy nodes to subscribe to the consensus channel
- `RequestVoteResultsFromBuddies` — Collect vote results from the buddy committee
- `StartBFTConsensus` — Trigger the BFT consensus phase

### 3. Router

**File:** `JMDN/Sequencer/Router/Router.go`

Routing for consensus operations:

- Message routing across JMDN peers
- Vote aggregation and tallying
- Response handling

### 4. Metadata

**File:** `JMDN/Sequencer/Metadata/Metadata.go`

Consensus metadata management:

- Block metadata
- Vote metadata
- Consensus state tracking

### 5. Triggers

**File:** `JMDN/Sequencer/Triggers/`

Consensus triggers:

- `Triggers.go` — Trigger management for consensus phases
- `Maps.go` — Vote result maps

---

## Key Functions

### Start Consensus

```go
// Start consensus process for a block
func (c *Consensus) Start(block *config.ZKBlock) error {
    // Query buddy nodes via VRF
    // Create PubSub channel
    // Request subscriptions from selected buddies
    // Collect BuddyVotes
    // Execute BFT consensus
}
```

### Query Buddy Nodes

```go
// Select buddy committee using VRF
func (c *Consensus) QueryBuddyNodes() error {
    // Use VRF to select buddy nodes
    // Connect to selected peers
    // Populate main and backup peer lists
}
```

### Request Vote Results

```go
// Collect votes from the current buddy committee
func RequestVoteResultsFromBuddies() error {
    // Request votes from all buddy nodes
    // Collect vote results
    // Aggregate with quorum check: q = ⌈2k/3⌉
}
```

---

## Usage

### Create Consensus Instance

```go
import "JMDN/Sequencer"

// Initialise peer list
peerList := Sequencer.PeerList{
    MainPeers:   []peer.ID{},
    BackupPeers: []peer.ID{},
}

// Create consensus instance
consensus := Sequencer.NewConsensus(peerList, host)
```

### Start Consensus

```go
// Start consensus for a block
err := consensus.Start(block)
if err != nil {
    log.Error(err)
}
```

---

## Integration Points

- **AVC Module** — Uses BFT for consensus execution; see [AVC Module →](/docs/avc)
- **PubSub** — Uses PubSub for consensus messaging and private channel management
- **Messaging** — Uses the messaging layer for vote collection
- **Block Module** — Initiates consensus for each new block; receives consensus results
- **zkVM** — Batches validated transactions into RISC Zero STARK proofs for L1

---

## Configuration

Key configuration in `JMDN/config/`:

| Constant | Default | Description |
|---|---|---|
| `MaxMainPeers` | 13 | Maximum main buddy nodes per round |
| `MaxBackupPeers` | 10 | Maximum backup buddy nodes |
| `ConsensusTimeout` | 20s | Consensus timeout |
| `PubSub_ConsensusChannel` | — | Consensus channel name |
| `Pubsub_CRDTSync` | — | CRDT sync channel name |

---

## Error Handling

The module includes comprehensive error handling for:

- Buddy node selection failures
- Subscription errors
- Vote collection timeouts
- BFT consensus errors

---

## Security

- Buddy node authentication via BLS signatures
- Vote signature verification before aggregation
- BFT consensus guarantees safety under Byzantine failures
- Private PubSub channel access control per consensus round

---

## Performance

- Efficient VRF-based buddy node selection
- Concurrent vote collection from the full committee
- Optimised BFT execution for ~3–10s L2 finality
- PubSub channel lifecycle management per block

---

## Testing

Test files:

- `JMDN/Sequencer/Sequencer_test.go` — Sequencer operation tests
- Integration tests
- Consensus simulation tests
