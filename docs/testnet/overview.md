---
id: testnet-overview
title: Testnet Overview
sidebar_label: Overview
description: JMDT Testnet network details — Chain ID, RPC endpoints, seed nodes, faucet, and how to get started developing and testing on the JMDT Layer 2 testnet.
keywords: [JMDT testnet, chain ID 8000800, JMDT testnet RPC, testnet node, JMDT Layer 2 testnet, JMDT faucet]
---

# JMDT Testnet

> *The Truth Layer for Verifiable Information — safe to experiment on JMDT Testnet.*

The **JMDT Testnet** is the public staging network for developers, node operators, and validators who want to build, test, and explore the JMDT ecosystem without using real tokens. It mirrors the mainnet stack — same JMDN binary, same AVC consensus, same smart contract environment — but with no financial risk.

---

## Network Details

| Parameter | Value |
|---|---|
| **Network Name** | JMDT Testnet |
| **Chain ID** | `8000800` |
| **Native Token** | JMDT (testnet — no real value) |
| **RPC URL** | `https://testnetrpc.jmdt.io` |
| **Seed Node** | `34.134.156.196` |
| **Consensus** | AVC (Asynchronous Validation Consensus) |
| **L1 Settlement** | Ethereum Sepolia |

---

## Add Testnet to Your Wallet

To connect MetaMask or any EVM-compatible wallet to JMDT Testnet:

1. Open your wallet → **Settings → Networks → Add Network**
2. Fill in the details:

| Field | Value |
|---|---|
| Network Name | `JMDT Testnet` |
| RPC URL | `https://testnetrpc.jmdt.io` |
| Chain ID | `8000800` |
| Currency Symbol | `JMDT` |

3. Save and switch to the JMDT Testnet network

---

## RPC Endpoint

```
https://testnetrpc.jmdt.io
```

**Example — check latest testnet block:**

```bash
curl -X POST https://testnetrpc.jmdt.io \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## Testnet Seed Node

The testnet seed node handles peer discovery for JMDN nodes joining the testnet:

```
34.134.156.196
```

This address is configured in your `jmdn.yaml` during node setup. See [Install & Configure →](./install) for the full config.

---

## Testnet Faucet

Testnet JMDT tokens are free and available via the **JMDT Faucet** — coming soon.

Once live, the faucet will allow you to:
- Connect your EVM-compatible wallet
- Request testnet JMDT tokens
- Start deploying contracts and testing node operations immediately

Watch [jmdt.io](https://jmdt.io) for the faucet launch announcement.

---

## What You Can Do on Testnet

| Activity | Details |
|---|---|
| **Run a JMDN node** | Full node with AVC consensus participation |
| **Deploy smart contracts** | EVM-compatible, identical to mainnet behaviour |
| **Test DID operations** | Register and resolve W3C DID documents |
| **Test enterprise DAG** | L3 DAG node operations in a safe environment |
| **Validate integrations** | Test your dApp against real JMDT APIs before mainnet |

---

## Testnet vs Mainnet

| | Testnet | Mainnet |
|---|---|---|
| Chain ID | `8000800` | `7000700` |
| RPC | `testnetrpc.jmdt.io` | `mainnetrpc.jmdt.io` |
| Seed node | `34.134.156.196` | `34.174.94.172` |
| Tokens | Free via faucet | Purchase on Bitmart |
| Real value | No — None | Yes — Real JMDT |
| L1 settlement | Ethereum Sepolia | Ethereum |

---

## Before You Begin

- No real tokens are required — use the faucet (coming soon)
- The same `jmdn` binary is used for both testnet and mainnet; only the config differs
- Testnet may be reset periodically; don't rely on testnet data for production

Ready? Continue to [Prerequisites →](./prerequisites)
