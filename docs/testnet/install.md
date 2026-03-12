---
id: testnet-install
title: Testnet — Install & Configure
sidebar_label: Install & Configure
description: Step-by-step guide to installing the JMDN binary and configuring it for the JMDT Testnet — including jmdn.yaml config, testnet seed node, and Chain ID 8000800.
keywords: [JMDT testnet install, JMDN testnet config, jmdn.yaml testnet, chain ID 8000800, JMDT testnet node setup]
---

# Testnet — Install & Configure

This page covers the testnet-specific configuration for your JMDN node. The build steps are identical to mainnet — only the `jmdn.yaml` config differs.

For the full binary build and service installation walkthrough, see [Running a JMDN Node →](/docs/running-a-node).

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/JupiterMetaLabs/jmdn.git
cd jmdn
```

---

## Step 2 — Install Dependencies

```bash
sudo ./Scripts/setup_dependencies.sh --all
```

Installs Go, immudb, Yggdrasil, and GCC. Full details at [Running a JMDN Node →](/docs/running-a-node#step-1--install-dependencies).

---

## Step 3 — Build the Binary

```bash
./Scripts/build.sh
```

```
✅ Build successful: ./jmdn
```

The same binary works for both testnet and mainnet — the config file controls which network the node joins.

---

## Step 4 — Install Services

```bash
sudo ./Scripts/install_services.sh
```

Installs `jmdn` and `immudb` as system services and creates the required data directories.

---

## Step 5 — Configure for Testnet

```bash
sudo cp jmdn_default.yaml /etc/jmdn/jmdn.yaml
sudo nano /etc/jmdn/jmdn.yaml
```

### Testnet `jmdn.yaml`

```yaml
# ── Network ──────────────────────────────────────────────
network: testnet
chain_id: 8000800

# ── RPC ──────────────────────────────────────────────────
rpc_endpoint: https://testnetrpc.jmdt.io

# ── Peer Discovery ───────────────────────────────────────
seed_nodes:
  - 34.134.156.196

# ── Node Identity ────────────────────────────────────────
node_key: ""

# ── Storage ──────────────────────────────────────────────
data_dir: /var/lib/jmdn/data
log_dir: /var/log/jmdn

# ── P2P ──────────────────────────────────────────────────
p2p_port: 15000

# ── Yggdrasil ────────────────────────────────────────────
yggdrasil_enabled: true

# ── Metrics ──────────────────────────────────────────────
metrics_port: 8080
metrics_enabled: true
```

---

## Mainnet vs Testnet Config Diff

The only differences between the two configs:

| Config Key | Testnet | Mainnet |
|---|---|---|
| `network` | `testnet` | `mainnet` |
| `chain_id` | `8000800` | `7000700` |
| `rpc_endpoint` | `https://testnetrpc.jmdt.io` | `https://mainnetrpc.jmdt.io` |
| Seed node IP | `34.134.156.196` | `34.174.94.172` |

> **Tip:** Keep separate config files if you plan to switch between networks. E.g. `/etc/jmdn/jmdn-testnet.yaml` and `/etc/jmdn/jmdn-mainnet.yaml`, then symlink the active one to `/etc/jmdn/jmdn.yaml`.

---

## Running Testnet Locally (Without System Services)

For quick local testing without installing system services:

```bash
# Run the node directly with the testnet config
BIN_PATH=./jmdn CONFIG_PATH=./jmdn_testnet.yaml ./Scripts/start_jmdn_wrapper.sh
```

Or just run the binary directly:

```bash
./jmdn -connect /ip4/34.134.156.196/tcp/15000 -console
```

---

## What's Next

Continue to [Connect & Verify →](./connect) to start the node and confirm it's syncing with the JMDT Testnet.
