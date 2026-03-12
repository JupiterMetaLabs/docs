---
id: testnet-prerequisites
title: Testnet Prerequisites
sidebar_label: Prerequisites
description: Hardware, software, and token requirements for running a JMDT Testnet node — lighter requirements than mainnet, free tokens via faucet.
keywords: [JMDT testnet prerequisites, JMDN testnet requirements, testnet node hardware, JMDT testnet setup, JMDT faucet]
---

# Testnet Prerequisites

The testnet has lighter requirements than mainnet since it carries no production load. This makes it ideal for getting familiar with JMDN operations before committing to mainnet infrastructure.

---

## Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| **CPU** | 2 cores | 4 cores |
| **RAM** | 4 GB | 8 GB |
| **Storage** | 20 GB SSD | 100 GB SSD |
| **Network** | 10 Mbps | 100 Mbps |

> Running on a cloud VPS (e.g., DigitalOcean, AWS t3.medium, GCP e2-medium) is perfectly fine for testnet.

---

## Supported Operating Systems

| OS | Supported |
|---|---|
| Ubuntu 20.04 / 22.04 LTS | ✅ Recommended |
| Debian 11 / 12 | ✅ |
| RHEL / CentOS 8+ | ✅ |
| macOS 12+ | ✅ |
| FreeBSD 13+ | ✅ |
| Windows | ❌ Not supported |

---

## Software Dependencies

The `setup_dependencies.sh` script installs these automatically:

| Dependency | Version | Purpose |
|---|---|---|
| **Go** | 1.21+ | Compile the JMDN binary |
| **GCC / build-essential** | Any | CGO compilation |
| **immudb** | 1.10.0+ | Local chain ledger |
| **Yggdrasil** | 0.5.12+ | Encrypted P2P messaging |
| **Git** | Any | Clone the repository |

---

## Network & Firewall

| Port | Protocol | Direction | Purpose |
|---|---|---|---|
| `15000` | TCP | Inbound + Outbound | libp2p P2P communication |
| `15052` | TCP | Inbound | gRPC API (optional) |
| `8080` | TCP | Inbound | Prometheus metrics (optional) |
| `443` | TCP | Outbound | RPC calls to `testnetrpc.jmdt.io` |

The testnet seed node at `34.134.156.196` must be reachable from your machine on port `15000`.

```bash
# Open required ports (UFW)
sudo ufw allow 15000/tcp
sudo ufw reload

# Verify connectivity to testnet seed node
nc -vz 34.134.156.196 15000
```

---

## Testnet JMDT Tokens

Testnet tokens are **free** — no purchase required.

**Faucet — coming soon.** Once the JMDT Testnet Faucet launches, you'll be able to:

1. Visit the faucet URL (announced on [jmdt.io](https://jmdt.io))
2. Connect your EVM-compatible wallet (MetaMask, etc.)
3. Request testnet JMDT — instantly credited to your wallet

In the meantime, you can run a testnet node without any tokens — tokens are only required once you begin submitting transactions.

---

## Checklist

- [ ] Machine meets minimum hardware requirements
- [ ] Port 15000 open and accessible
- [ ] Testnet seed node reachable (`nc -vz 34.134.156.196 15000`)
- [ ] Git installed (`git --version`)
- [ ] No real JMDT needed yet — faucet tokens available soon

Ready? Continue to [Install & Configure →](./install)
