---
id: testnet-connect
title: Testnet — Connect & Verify
sidebar_label: Connect & Verify
description: Start your JMDN node on JMDT Testnet, verify peer connections, check sync status, and debug common testnet issues.
keywords: [JMDT testnet connect, JMDN testnet sync, testnet node running, verify JMDT testnet node]
---

# Testnet — Connect & Verify

With your node configured for testnet, this page walks you through starting it, verifying peer connections, and confirming you're syncing with the JMDT Testnet.

---

## Start the Node

### Using systemd (recommended)

```bash
sudo systemctl start immudb
sudo systemctl start jmdn

# Enable on boot
sudo systemctl enable immudb
sudo systemctl enable jmdn
```

### Check service status

```bash
sudo systemctl status jmdn
```

### Run directly in foreground (useful for debugging)

```bash
./jmdn -connect /ip4/34.134.156.196/tcp/15000 -console
```

The `-console` flag enables live log output. Useful when first setting up or debugging.

---

## View Live Logs

```bash
journalctl -u jmdn -f
```

A healthy testnet startup looks like:

```
[INFO]  Starting JMDN...
[INFO]  Config: /etc/jmdn/jmdn.yaml
[INFO]  Network: testnet | Chain ID: 8000800
[INFO]  Connecting to seed node: 34.134.156.196
[INFO]  Peer connected: /ip4/34.134.156.196/tcp/15000/p2p/...
[INFO]  Syncing blocks...
[INFO]  Block height: 1024
```

---

## Verify Peer Connections

```bash
>>> listpeers
```

You should see at least the testnet seed node (`34.134.156.196`). After a few minutes:

```bash
>>> peers
```

Requests a fresh peer list from the seed. Your node will begin discovering other testnet participants.

---

## Check Sync Status

```bash
>>> dbstate
```

Compare your local block height to the network tip:

```bash
curl -s -X POST https://testnetrpc.jmdt.io \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  | python3 -c "import sys,json; r=json.load(sys.stdin); print('Testnet tip:', int(r['result'],16))"
```

When your local height matches, you're **fully synced**.

---

## Fast Sync

If you're many blocks behind, use FastSync:

```bash
>>> fastsync /ip4/34.134.156.196/tcp/15000/p2p/<peer-id>
```

---

## Test Your RPC Connection

Confirm your node's local RPC is working:

```bash
# If running explorer on port 8081
curl http://localhost:8081/api/blocks

# Or check immudb API
curl http://localhost:8080/metrics
```

---

## Deploying a Smart Contract to Testnet

Once synced, you can deploy EVM-compatible contracts using standard Ethereum tooling pointed at the testnet RPC:

```bash
# Hardhat example
npx hardhat run scripts/deploy.js --network jmdt_testnet
```

**Hardhat config snippet:**

```js
networks: {
  jmdt_testnet: {
    url: "https://testnetrpc.jmdt.io",
    chainId: 8000800,
    accounts: [process.env.PRIVATE_KEY],
  },
}
```

---

## Troubleshooting

**Stuck at block 0:**
- Confirm `chain_id: 8000800` and `network: testnet` in your config
- Confirm `seed_nodes` contains `34.134.156.196`
- Test connectivity: `nc -vz 34.134.156.196 15000`

**immudb not starting:**
- Check logs: `journalctl -u immudb -n 30`
- Ensure `/var/lib/jmdn/data` exists and has correct permissions

**Peer count stays at 0:**
- Confirm port 15000 is open: `sudo ufw status`
- Try connecting directly: `./jmdn -connect /ip4/34.134.156.196/tcp/15000`

**Wrong network — node shows mainnet Chain ID:**
- Recheck `/etc/jmdn/jmdn.yaml` — `chain_id` must be `8000800` and `network` must be `testnet`
- Restart: `sudo systemctl restart jmdn`

---

## Summary

| Step | Command |
|---|---|
| Start services | `sudo systemctl start immudb && sudo systemctl start jmdn` |
| View logs | `journalctl -u jmdn -f` |
| Check peers | `listpeers` in JMDN console |
| Check sync | `dbstate` in JMDN console |
| Check RPC tip | `curl -X POST https://testnetrpc.jmdt.io ...` |
| Run foreground | `./jmdn -connect /ip4/34.134.156.196/tcp/15000 -console` |

Your testnet node is live. Start building on the **JMDT Truth Layer** — risk free.
