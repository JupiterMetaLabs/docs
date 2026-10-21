---
id: chain-upgrade-2026
title: Chain Upgrade & State Migration (October 2026)
sidebar_label: Chain Upgrade (Oct 2026)
description: What changed in the October 2026 JMDT chain upgrade — account balances were re-initialized by a state-migration batch, and how to read pre-migration history on the explorer.
keywords: [JMDT chain upgrade, state migration, balance re-initialization, explorer pre-migration, JMDT October 2026]
---

# Chain Upgrade & State Migration — October 2026

In October 2026 the JMDT network completed a planned chain upgrade. As part of
the upgrade, **account balances were re-initialized** by a state-migration
batch: a series of transfers (blocks **2360–2365** on mainnet) that re-seeded
each account's allocation.

## What this means for balances

- The re-seed transfer **set** each account's balance to its allocation.
  It did not add to earlier credits.
- Transactions mined **before** the migration window remain on-chain with
  successful receipts. They are part of the permanent history, but they are
  **superseded** by the re-seed for balance purposes.
- As a result, summing an address's full displayed history will **not** equal
  its current balance for accounts that existed before the upgrade. Summing
  from the re-seed transfer onward will.

### Worked example

An account received an allocation before the upgrade and again in the re-seed
batch, then made three transfers out:

```
Balance = re-seed amount − transfers out − gas
        = 40,000,000 − (18,000 + 3,982,000 + 16,000,000) − 0.002316
        = 19,999,999.997684 JMDT   ✓ matches the chain balance exactly
```

The pre-upgrade credit of 40,000,000 remains visible in history but does not
contribute to the balance.

## How the explorer shows it

On [explorer.jmdt.io](https://explorer.jmdt.io), addresses with pre-migration
history display an informational notice, and their transaction lists tag the
relevant rows:

- **⟲ migration re-seed** — the transfer that re-initialized the balance
  (blocks 2360–2365).
- **⟲ pre-migration** — history from before the window, shown dimmed. These
  transactions executed successfully and are preserved for completeness; they
  do not add to the current balance.

Nothing is hidden, removed, or relabeled: every transaction's receipt status
is shown exactly as the chain reports it.

## Verifying it yourself

Any JMDT RPC endpoint reports the same data the explorer displays:

```bash
# current balance
curl -s -X POST https://mainnetrpc.jmdt.io -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["<address>","latest"]}'

# receipt of any transaction (status 0x1 = success)
curl -s -X POST https://mainnetrpc.jmdt.io -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getTransactionReceipt","params":["<tx hash>"]}'
```

If you have questions about a specific account, contact
[jmdt@jupitermeta.io](mailto:jmdt@jupitermeta.io) or ask in the
[Telegram community](https://t.me/jmdtblockchain).
