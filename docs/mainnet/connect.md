---
id: mainnet-connect
title: Mainnet — Connect & Verify
sidebar_label: Connect & Verify
description: Start your JMDN node on JMDT Mainnet, verify peer connections, check sync status, and monitor node health.
keywords: [JMDT mainnet connect, JMDN sync, mainnet node running, verify JMDT node, JMDT mainnet monitoring]
---

# Mainnet — Connect & Verify

With your node installed and configured, this page walks you through starting it, confirming peer connections, and verifying you're syncing with the JMDT Mainnet.

---

## Start the Node

### Using systemd (Linux — recommended)

```bash
# Start immudb first (JMDN depends on it)
sudo systemctl start immudb
sudo systemctl start jmdn

# Enable both to start on boot
sudo systemctl enable immudb
sudo systemctl enable jmdn
```

### Check service status

```bash
sudo systemctl status jmdn
sudo systemctl status immudb
```

You should see `active (running)` for both services.

---

## View Live Logs

```bash
# Follow JMDN logs in real time
journalctl -u jmdn -f

# View the last 100 lines
journalctl -u jmdn -n 100 --no-pager
```

On a healthy start you'll see output like:

```
[INFO]  Starting JMDN...
[INFO]  Binary: /usr/local/bin/jmdn
[INFO]  Config: /etc/jmdn/jmdn.yaml
[INFO]  Connecting to seed node: 34.174.94.172
[INFO]  Peer connected: /ip4/34.174.94.172/tcp/15000/p2p/...
[INFO]  Network: mainnet | Chain ID: 7000700
[INFO]  Syncing blocks...
```

---

## Verify Peer Connections

From the JMDN interactive console (if running in foreground mode):

```bash
./jmdn
```

```
>>> listpeers
```

You should see at least one peer entry — the mainnet seed node at `34.174.94.172`.

```
>>> peers
```

Requests an updated peer list from the seed node. After a few minutes, your node should have discovered and connected to multiple mainnet peers.

---

## Check Sync Status

```bash
>>> dbstate
```

This shows your current immudb state — block height and Merkle root. Compare your block height against the latest block from the RPC:

```bash
curl -s -X POST https://mainnetrpc.jmdt.io \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  | python3 -c "import sys,json; r=json.load(sys.stdin); print('Latest block:', int(r['result'],16))"
```

When your local block height matches the network, your node is **fully synced**.

---

## Fast Sync (If Behind)

If your node is many blocks behind, use FastSync to catch up quickly:

```bash
>>> fastsync /ip4/34.174.94.172/tcp/15000/p2p/<peer-id>
```

FastSync uses Bloom filter optimisation to identify and batch-transfer only the missing blocks.

---

## Prometheus Metrics

If `metrics_enabled: true` in your `jmdn.yaml`, metrics are available at:

```
http://<your-server-ip>:8080/metrics
```

Key metrics to monitor:

| Metric | What it tells you |
|---|---|
| `jmdn_peer_count` | Number of connected peers |
| `jmdn_block_height` | Current local chain height |
| `jmdn_consensus_rounds_total` | AVC consensus rounds participated in |
| `jmdn_sync_lag_blocks` | Blocks behind the network tip |
| `immudb_entries_total` | Total entries in the local immudb ledger |

---

## Deploying an Update

When a new JMDN version is released, deploy it with a single command:

```bash
sudo ./Scripts/deploy.sh
```

This performs a full rebuild, atomic binary swap, service restart, and health check — with automatic rollback if the new version fails to start. See [Running a JMDN Node →](/docs/running-a-node#step-4--deploy-updates) for details.

---

## Troubleshooting

**Node won't connect to peers:**
- Confirm port `15000` is open: `sudo ufw status`
- Confirm the seed node is reachable: `nc -vz 34.174.94.172 15000`
- Check logs for connection errors: `journalctl -u jmdn -n 50`

**immudb fails to start:**
- Check disk space: `df -h /var/lib/jmdn`
- Check immudb logs: `journalctl -u immudb -n 50`

**Node starts but stays at block 0:**
- Confirm `chain_id: 7000700` and `network: mainnet` in `/etc/jmdn/jmdn.yaml`
- Confirm `seed_nodes` contains `34.174.94.172`
- Try a manual FastSync to the seed node

---

## Summary

| Step | Command |
|---|---|
| Start services | `sudo systemctl start immudb && sudo systemctl start jmdn` |
| View logs | `journalctl -u jmdn -f` |
| Check peers | `listpeers` in JMDN console |
| Check sync | `dbstate` in JMDN console |
| Check RPC | `curl -X POST https://mainnetrpc.jmdt.io ...` |
| Deploy update | `sudo ./Scripts/deploy.sh` |

Your mainnet node is live. Welcome to the **JMDT Truth Layer**.
