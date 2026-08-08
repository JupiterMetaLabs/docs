---
id: docker
title: Running JMDN with Docker
sidebar_label: Docker
description: Run a JMDN node with Docker or Docker Compose — quick start, configuration, ports, health checks, backups, and upgrades.
keywords: [JMDN docker, docker compose, run JMDT node, JMDN container, immudb docker, JMDT node deployment]
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

- **`jmdn`** — the node process. Listens on the JSON-RPC, WebSocket, and DID service ports.
- **`immudb`** — the tamper-proof append-only ledger, run as its own container. `jmdn` connects to it over gRPC.
- **`redis`** — an account-sync worker queue. Because immudb's commit latency is on the order of seconds, account writes are enqueued to Redis and drained by a background worker instead of blocking on every write.

Running immudb and Redis as separate containers means each can restart, upgrade, and be backed up independently of the node process.

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

### Step 2 — Set container passwords

`immudb` and `redis` run as separate containers and read their passwords from environment variables rather than `jmdn.yaml`. Create a `.env` file next to `docker-compose.yml`:

```bash
cat > .env << 'EOF'
IMMUDB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
JMDN_SECURITY_EXPLORER_API_KEY=$(openssl rand -base64 32)
EOF
```

These must match `database.password`, `database.redis.password`, and `security.explorer_api_key` in `jmdn.yaml` — leave those fields blank in `jmdn.yaml` when using Compose, since Compose injects them automatically.

### Step 3 — Bootstrap the chain snapshot (first time only)

```bash
docker compose run --rm jmdn-bootstrap
```

This downloads a chain snapshot into the `immudb-data` volume so the node doesn't have to sync from genesis. It writes a sentinel file when done, so it's safe to run again — it will just skip if already bootstrapped.

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

For quick tests or a minimal single-container setup with embedded ImmuDB (no separate `immudb`/`redis` containers):

```bash
docker run -d \
  --name jmdn \
  -v $(pwd)/jmdn.yaml:/etc/jmdn/jmdn.yaml:ro \
  -v jmdn-data:/opt/jmdn \
  -p 8545:8545 \
  -p 8546:8546 \
  -p 15052:15052 \
  ghcr.io/jupitermetalabs/jmdn:latest
```

On first start, the container bootstraps its chain snapshot automatically before starting the node — this can take a while depending on bandwidth. Subsequent starts skip this once the snapshot is in place.

To enable the Explorer API, add `-p 8090:8090 -e JMDN_PORTS_API=8090`.

Stop and remove the container with `docker stop jmdn && docker rm jmdn` — the `jmdn-data` volume is preserved, so re-running with the same `-v` flag resumes where you left off. To fully reset, also run `docker volume rm jmdn-data`.

---

## Configuration

Most configuration lives in `jmdn.yaml`, mounted read-only into the container. A small set of Docker-specific environment variables handle the differences between a bare-metal install and a containerized one:

| Variable | Purpose |
|---|---|
| `IMMUDB_EXTERNAL` | Set `true` when using Compose (separate immudb container) |
| `JMDN_DATABASE_ADDRESS` / `JMDN_DATABASE_PORT` | Where to reach immudb — Compose sets this to the `immudb` service automatically |
| `IMMUDB_PASSWORD` / `REDIS_PASSWORD` | Container passwords, injected from `.env` |
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

The `jmdn` container's health check polls the Explorer API's `/api/v1/node/version` endpoint, so the Explorer API port must be enabled for the container to report as `healthy`. `docker compose ps` shows current health status.

```bash
docker compose ps
docker inspect --format='{{json .State.Health}}' jmdn
```

---

## Backup and Restore

Stop the node cleanly before backing up its volumes:

```bash
docker compose stop jmdn immudb

docker run --rm -v jmdn_immudb-data:/data -v $(pwd)/backups:/backups \
  alpine tar czf /backups/immudb-data-$(date +%Y%m%d).tar.gz -C /data .

docker run --rm -v jmdn_jmdn-state:/data -v $(pwd)/backups:/backups \
  alpine tar czf /backups/jmdn-state-$(date +%Y%m%d).tar.gz -C /data .

docker compose start immudb jmdn
```

Restore by reversing the `tar` commands (`xzf` instead of `czf`) into fresh volumes before `docker compose up -d`.

> The address→transaction index (`DB/txindex.db`) is a derived index and doesn't need to be backed up — it's rebuilt automatically from ImmuDB in the background if missing. See [Address Index Management →](/docs/cli#address-index-management).

---

## Upgrading

```bash
# 1. Update the image tag in docker-compose.yml, e.g.:
#      image: ghcr.io/jupitermetalabs/jmdn:v1.3.0

docker compose pull jmdn
docker compose up -d jmdn
```

`immudb` and `redis` can be upgraded independently by updating their image tags and running `docker compose pull <service> && docker compose up -d <service>`.

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
