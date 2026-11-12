---
id: docker
title: Running JMDN with Docker
sidebar_label: Docker
description: Run a JMDN node with Docker or Docker Compose — quick start, configuration, ports, health checks, backups, and upgrades.
keywords: [JMDN docker, docker compose, run JMDT node, JMDN container, ThebeDB, PostgreSQL docker, JMDT node deployment]
---

# Running JMDN with Docker

> *The Truth Layer for Verifiable Information — run a JMDN node without managing a Go toolchain.*

JMDN publishes an official Docker image, making it possible to run a node with `docker run` or `docker compose` instead of building from source. This guide covers both paths.

For a from-source build (systemd/launchd services, no containers), see [Running a JMDN Node →](/docs/running-a-node).

---

## Images

JupiterMeta publishes a signed, multi-arch image to GitHub Container Registry on every release:

```bash
docker pull ghcr.io/jupitermetalabs/jmdn:latest

# Or pin to a specific version
docker pull ghcr.io/jupitermetalabs/jmdn:v1.2.0
```

Images are published for `linux/amd64`, `linux/arm64`, and `linux/arm/v7` — Docker pulls the right variant automatically.

---

## Architecture

The recommended Docker Compose stack runs three services:

- **`jmdn`** — the node process. ThebeDB's canonical log (BadgerDB) and CDC event log (DuckDB) are embedded here, stored in the `jmdn-state` volume.
- **`postgres`** — ThebeDB's SQL projection (`postgres:16-alpine`, started with `wal_level=logical` for CDC). `jmdn` reaches it over the internal compose network via `THEBE_SQL_DSN`.
- **`redis`** — the account-sync worker queue (Redis Streams). It decouples account writes from synchronous DB commit latency.

Running Postgres and Redis as separate containers means each can restart, upgrade, and be backed up independently of the node process.

A fourth, one-time **bootstrap** service downloads a chain snapshot before the first start, so a new node doesn't have to sync from genesis.

---

## Quick Start (Docker Compose)

### Prerequisites

- Docker 24+ and Docker Compose v2
- Sufficient free disk space for the chain snapshot on first run
- Open the following ports on your firewall/security group:

| Port | Purpose |
|---|---|
| `8545` | JSON-RPC (Ethereum-compatible) |
| `8546` | WebSocket RPC |
| `15052` | DID service |
| `8090` | Explorer API (optional — disabled by default) |

### Step 1 — Get the repo and config template

```bash
git clone https://github.com/JupiterMetaLabs/jmdn.git
cd jmdn
cp jmdn_default.yaml jmdn.yaml
```

Edit `jmdn.yaml` and set at minimum: `node.alias`, `network.seednode`, and `network.mempool`. See [`jmdn_default.yaml`](https://github.com/JupiterMetaLabs/jmdn/blob/main/jmdn_default.yaml) for the full set of options — ports, logging, FastSync, and security policy per service.

> `docker-compose.yml` always mounts `./jmdn.yaml` into the container at `/etc/jmdn/jmdn.yaml`. This file must exist before running `docker compose up`.

### Step 2 — Create `.env`

`postgres` and `redis` read their passwords from environment variables, and Compose
refuses to start without them (no baked defaults). Create a `.env` file next to
`docker-compose.yml` (see `.env.docker.example` in the repo):

```bash
cat > .env << EOF
COMPOSE_PROJECT_NAME=jmdn
JMDN_VERSION=latest
POSTGRES_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
JMDN_SECURITY_EXPLORER_API_KEY=$(openssl rand -base64 32)
EOF
```

- `COMPOSE_PROJECT_NAME=jmdn` keeps volume names stable regardless of the checkout directory
- `JMDN_VERSION` pins the image tag — set it here, never by editing `docker-compose.yml`
- Compose builds `THEBE_SQL_DSN` from `POSTGRES_PASSWORD` and injects the Redis password as `JMDN_DATABASE_REDIS_PASSWORD` — nothing to duplicate in `jmdn.yaml`

### Step 3 — Bootstrap the chain snapshot (first time only)

```bash
docker compose run --rm jmdn-bootstrap
```

This downloads a chain snapshot archive into the **`jmdn-state`** volume
(`storage/` and `DB/`) so the node doesn't have to sync from genesis. It writes a
sentinel file when done, so it's safe to run again — it will just skip if already
bootstrapped.

The published **`SNAPSHOT_SHA256`** of the archive is **required** in `.env`:
without it the script exits and the node falls back to syncing from peers.
(`ALLOW_UNVERIFIED_SNAPSHOT=1` skips the check — development only.) The download
comes over public HTTP from the configured snapshot bucket.

### Step 4 — Start the stack

```bash
docker compose up -d
docker compose logs -f jmdn
```

### Step 5 — Verify

```bash
# All services should show (healthy)
docker compose ps

# JSON-RPC
curl -s http://localhost:8545 -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## Running Standalone (`docker run`)

`docker run` without Compose is possible, but you must provide PostgreSQL yourself —
ThebeDB's SQL projection is mandatory and lives outside the node container:

```bash
docker run -d \
  --name jmdn \
  -v $(pwd)/jmdn.yaml:/etc/jmdn/jmdn.yaml:ro \
  -v jmdn-state:/opt/jmdn \
  -e THEBE_SQL_DSN="postgres://jmdn:<password>@<postgres-host>:5432/jmdn?sslmode=disable" \
  -p 15000:15000 -p 15000:15000/udp \
  -p 8545:8545 \
  -p 8546:8546 \
  ghcr.io/jupitermetalabs/jmdn:latest
```

The Postgres instance needs `wal_level=logical` and the `thebe_pub` publication in
the `jmdn` database (see `Scripts/setup_postgres.sh`). For anything beyond a quick
experiment, use the Compose stack.

To enable the Explorer API, add `-p 8090:8090 -e JMDN_PORTS_API=8090`.

Stop and remove the container with `docker stop jmdn && docker rm jmdn` — the `jmdn-data` volume is preserved, so re-running with the same `-v` flag resumes where you left off. To fully reset, also run `docker volume rm jmdn-data`.

---

## Configuration

Most configuration lives in `jmdn.yaml`, mounted read-only into the container. A small set of Docker-specific environment variables handle the differences between a bare-metal install and a containerized one:

| Variable | Purpose |
|---|---|
| `THEBE_SQL_DSN` | Postgres DSN for ThebeDB's SQL projection — Compose builds it from `POSTGRES_PASSWORD` and points it at the `postgres` service (`sslmode=disable` on the internal network; bare-metal defaults use `sslmode=require`) |
| `POSTGRES_PASSWORD` / `REDIS_PASSWORD` | Container passwords, required in `.env` (Compose fails closed without them) |
| `JMDN_DATABASE_REDIS_PASSWORD` | How `jmdn` receives the Redis password (injected from `.env`) |
| `SNAPSHOT_SHA256` | Published checksum of the bootstrap snapshot — required to install it |
| `JMDN_SECURITY_EXPLORER_API_KEY` | Forwarded into the container so the health check can authenticate |

Any `jmdn.yaml` key can also be set via environment variable using the `JMDN_` prefix with underscores as separators — for example, `JMDN_NETWORK_CHAIN_ID=7000700` sets `network.chain_id`.

For production, mount real TLS certificates instead of relying on the self-signed certs generated on first run:

```yaml
volumes:
  - ./certs:/opt/jmdn/certs:ro
```

---

## Ports Reference

| Port | Service | Default | Notes |
|---|---|---|---|
| `8545` | JSON-RPC | enabled | Primary Ethereum-compatible endpoint |
| `8546` | WebSocket RPC | enabled | Subscriptions (new blocks, logs) |
| `15052` | DID service | enabled | |
| `8090` | Explorer API | disabled | Set `ports.api: 8090` in `jmdn.yaml` to enable; supports Bearer-token auth via `security.explorer_api_key` |
| `15050` | Block generation | disabled | |
| `15055` | Block propagation gRPC | disabled | |

---

## Health Checks

The `jmdn` container's health check is two-tier: it polls the Explorer API's `/api/v1/node/version` first and falls back to JSON-RPC `eth_blockNumber` on `:8545` — so nodes running with the Explorer API disabled still report healthy while serving RPC. `docker compose ps` shows current health status.

```bash
docker compose ps
docker inspect --format='{{json .State.Health}}' jmdn
```

---

## Backup and Restore

Stop the node cleanly before backing up (the canonical log lives in `jmdn-state`;
the SQL projection lives in Postgres):

```bash
docker compose stop jmdn

# Canonical node state (ThebeDB KV log, CDC log, DB/, config, certs)
docker run --rm -v jmdn_jmdn-state:/data -v $(pwd)/backups:/backups \
  alpine tar czf /backups/jmdn-state-$(date +%Y%m%d).tar.gz -C /data .

# SQL projection (consistent dump while Postgres is running)
docker exec jmdn-postgres pg_dump -U jmdn -Fc jmdn > backups/jmdn-sql-$(date +%Y%m%d).dump

docker compose start jmdn
```

Restore the state volume by reversing the `tar` command (`xzf` into a fresh volume)
and the SQL dump with `pg_restore` before `docker compose up -d`.

> The address→transaction index (`DB/txindex.db`) is a derived index and doesn't need to be backed up — it's rebuilt automatically from the canonical log in the background if missing. See [Address Index Management →](/docs/cli#address-index-management).

---

## Upgrading

```bash
# 1. Update the pinned version in .env, e.g.:
#      JMDN_VERSION=v2.1.0

docker compose pull jmdn
docker compose up -d jmdn
```

`postgres` and `redis` can be upgraded independently by updating their image tags and running `docker compose pull <service> && docker compose up -d <service>`. Upgrade the node by changing `JMDN_VERSION` in `.env` — never by editing `docker-compose.yml`.

---

## Troubleshooting

**Bootstrap stuck or failing** — check `docker compose logs -f jmdn-bootstrap`. A "checksum verification failed" message means a retry is needed; the download is safe to re-run.

**Container reports `unhealthy`** — the health check requires the Explorer API (`ports.api: 8090`) to be enabled and, if `security.explorer_api_key` is set, a matching `JMDN_SECURITY_EXPLORER_API_KEY` in `.env`.

**Address index stuck syncing** — `eth_getTransactionsByAddress` and the Explorer address-history endpoint return `503` while the index catches up. Check status and, if needed, force a rebuild from inside the container:

```bash
docker exec -it jmdn jmdn -cmd txindexstatus
docker exec -it jmdn jmdn -cmd rebuildindex
```

See [Address Index Management →](/docs/cli#address-index-management) for the full command reference.

**Full reset** (deletes all chain data):

```bash
docker compose down -v
docker compose run --rm jmdn-bootstrap
docker compose up -d
```

---

## Related

- [Running a JMDN Node →](/docs/running-a-node) — Bare-metal build and service install
- [JMDN Node →](/docs/jmdt-node) — Architecture and FastSync internals
- [CLI Reference →](/docs/cli) — Address index management and other operator commands
