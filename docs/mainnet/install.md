---
id: mainnet-install
title: Mainnet — Install & Configure
sidebar_label: Install & Configure
description: Step-by-step guide to installing the JMDN binary and configuring it for the JMDT Mainnet — including the jmdn.yaml config, seed node address, and Chain ID.
keywords: [JMDT mainnet install, JMDN mainnet config, jmdn.yaml mainnet, chain ID 7000700, JMDT node setup mainnet]
---

# Mainnet — Install & Configure

This page covers the mainnet-specific configuration for your JMDN node. For the full binary build and service installation steps, see [Running a JMDN Node →](/docs/running-a-node).

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

This installs Go, immudb, Yggdrasil, and GCC. Full details in [Running a JMDN Node →](/docs/running-a-node#step-1--install-dependencies).

---

## Step 3 — Build the Binary

```bash
./Scripts/build.sh
```

On success, you'll have a `jmdn` binary in the current directory:

```
✅ Build successful: ./jmdn
```

---

## Step 4 — Install Services

```bash
sudo ./Scripts/install_services.sh
```

This installs the `jmdn` and `immudb` system services and creates the required directories.

---

## Step 5 — Configure for Mainnet

Copy the default config template and edit it for mainnet:

```bash
sudo cp jmdn_default.yaml /etc/jmdn/jmdn.yaml
sudo nano /etc/jmdn/jmdn.yaml
```

### Mainnet `jmdn.yaml`

Set the following values for the JMDT Mainnet:

```yaml
# ── Network ──────────────────────────────────────────────
network: mainnet
chain_id: 7000700

# ── RPC ──────────────────────────────────────────────────
rpc_endpoint: https://mainnetrpc.jmdt.io

# ── Peer Discovery ───────────────────────────────────────
seed_nodes:
  - 34.174.94.172

# ── Node Identity ────────────────────────────────────────
# Your node's identity key — generated on first run if left blank
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

> **Important:** Never share your `node_key`. It uniquely identifies your node on the network.

---

## Step 6 — Set Correct Permissions

```bash
sudo chown -R root:root /etc/jmdn
sudo chmod 600 /etc/jmdn/jmdn.yaml
```

---

## Key Mainnet Parameters

| Config Key | Mainnet Value |
|---|---|
| `network` | `mainnet` |
| `chain_id` | `7000700` |
| `rpc_endpoint` | `https://mainnetrpc.jmdt.io` |
| Seed node IP | `34.174.94.172` |
| P2P port | `15000` |

---

## What's Next

Your node is installed and configured. Continue to [Connect & Verify →](./connect) to start it and confirm it's syncing with the mainnet.
