---
id: mainnet-prerequisites
title: Mainnet Prerequisites
sidebar_label: Prerequisites
description: Hardware, software, and token requirements for running a JMDT Mainnet node.
keywords: [JMDT mainnet prerequisites, JMDN server requirements, mainnet node hardware, JMDT mainnet setup]
---

# Mainnet Prerequisites

Before setting up a JMDT Mainnet node, make sure your environment meets the following requirements.

---

## Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| **CPU** | 4 cores | 8 cores |
| **RAM** | 8 GB | 16 GB |
| **Storage** | 100 GB SSD | 500 GB NVMe SSD |
| **Network** | 100 Mbps | 1 Gbps |
| **Uptime** | — | 99%+ for validators |

> **Storage note:** Chain state grows over time. Start with at least 100 GB and plan for expansion. NVMe SSD is strongly recommended for immudb write performance.

---

## Supported Operating Systems

| OS | Supported |
|---|---|
| Ubuntu 20.04 / 22.04 LTS | ✅ Recommended |
| Debian 11 / 12 | ✅ |
| RHEL / CentOS 8+ | ✅ |
| macOS 12+ | ✅ (development only) |
| FreeBSD 13+ | ✅ |
| Windows | ❌ Not supported |

---

## Software Dependencies

The `setup_dependencies.sh` script installs these automatically (see [Install & Configure →](./install)), but it helps to know what's needed:

| Dependency | Version | Purpose |
|---|---|---|
| **Go** | 1.21+ | Compile the JMDN binary |
| **GCC / build-essential** | Any | CGO compilation (required) |
| **immudb** | 1.10.0+ | Tamper-proof local chain ledger |
| **Yggdrasil** | 0.5.12+ | Encrypted mesh P2P messaging |
| **Git** | Any | Clone the JMDN repository |

---

## Network & Firewall

Open the following ports on your server firewall and any upstream security groups:

| Port | Protocol | Direction | Purpose |
|---|---|---|---|
| `15000` | TCP | Inbound + Outbound | libp2p peer-to-peer communication |
| `15052` | TCP | Inbound | gRPC API (optional — close if not needed) |
| `8080` | TCP | Inbound | Prometheus metrics (optional) |
| `443` | TCP | Outbound | RPC calls to `mainnetrpc.jmdt.io` |

The seed node at `34.174.94.172` must be reachable from your server on port `15000`.

**Quick firewall setup (UFW):**

```bash
sudo ufw allow 15000/tcp
sudo ufw allow 15052/tcp   # optional
sudo ufw allow 8080/tcp    # optional — metrics
sudo ufw reload
```

---

## JMDT Tokens

Running a mainnet JMDN node requires JMDT for:

- **Gas fees** — Paying for transactions you submit
- **Enterprise access** — Paying for L3 DAG node allocations and data services

Acquire JMDT on **Bitmart** — see [How to Get JMDT →](/docs/get-jmdt)

---

## Checklist

Before proceeding to installation:

- [ ] Server meets minimum hardware requirements
- [ ] Ubuntu 20.04+ or supported OS installed
- [ ] Port 15000 open and reachable
- [ ] SSH access to the server confirmed
- [ ] JMDT tokens acquired via Bitmart
- [ ] Git installed (`git --version`)

Ready? Continue to [Install & Configure →](./install)
