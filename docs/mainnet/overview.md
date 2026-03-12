---
id: mainnet-overview
title: Mainnet Overview
sidebar_label: Overview
description: JMDT Mainnet network details — Chain ID, RPC endpoints, seed nodes, and what you need to know before connecting a node or deploying smart contracts on the JMDT Layer 2.
keywords: [JMDT mainnet, chain ID 7000700, JMDT RPC, mainnet node, JMDT Layer 2 mainnet]
---

# JMDT Mainnet

> *The Truth Layer for Verifiable Information — live on JMDT Mainnet.*

The **JMDT Mainnet** is the production Layer 2 network anchored to Ethereum. All real JMDT tokens, deployed smart contracts, enterprise DAG operations, and DID registrations are live on mainnet. This is the network you connect to for production workloads.

---

## Network Details

| Parameter | Value |
|---|---|
| **Network Name** | JMDT Mainnet |
| **Chain ID** | `7000700` |
| **Native Token** | JMDT |
| **RPC URL (Primary)** | `https://mainnetrpc.jmdt.io` |
| **RPC URL (Alias)** | `https://rpc.jmdt.io` |
| **Seed Node** | `34.174.94.172` |
| **Consensus** | AVC (Asynchronous Validation Consensus) |
| **L1 Settlement** | Ethereum |

---

## Add Mainnet to Your Wallet

To connect MetaMask or any EVM-compatible wallet to JMDT Mainnet:

1. Open your wallet → **Settings → Networks → Add Network**
2. Fill in the details:

| Field | Value |
|---|---|
| Network Name | `JMDT Mainnet` |
| RPC URL | `https://mainnetrpc.jmdt.io` |
| Chain ID | `7000700` |
| Currency Symbol | `JMDT` |

3. Save and switch to the JMDT Mainnet network

---

## RPC Endpoints

JMDT Mainnet exposes standard JSON-RPC over HTTPS:

```
https://mainnetrpc.jmdt.io
https://rpc.jmdt.io
```

Both endpoints are interchangeable. The `rpc.jmdt.io` alias is recommended for applications that need a stable short URL.

**Example — check latest block:**

```bash
curl -X POST https://mainnetrpc.jmdt.io \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## Mainnet Seed Node

The mainnet seed node handles peer discovery for new JMDN nodes joining the network:

```
34.174.94.172
```

This address is configured in your `jmdn.yaml` during node setup. See [Install & Configure →](./install) for the full config.

---

## What's on Mainnet

- **JMDT token** — The production ERC-20-compatible Layer 2 token (acquire via [Bitmart](/docs/get-jmdt))
- **AVC consensus** — Live VRF-based buddy selection, BFT finality in ~3–10 seconds
- **Enterprise DAG (L3)** — Production DAG nodes operated by enterprise customers
- **DID registry** — Live W3C-standard DID documents and key management
- **Smart contracts** — EVM-compatible contracts deployed via Solidity or Rust (RISC Zero)

---

## Before You Begin

Running a mainnet node involves **real JMDT tokens** and connects to the live production network. Make sure you:

- Have a server meeting the [hardware prerequisites](./prerequisites)
- Have JMDT for staking and gas (acquire via [Bitmart](/docs/get-jmdt))
- Are familiar with the [JMDN build process](/docs/running-a-node)
- Keep your node key and config files secured

Ready? Continue to [Prerequisites →](./prerequisites)
