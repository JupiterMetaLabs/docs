---
id: running-a-node
title: Running a JMDN Node
sidebar_label: Running a Node
description: Complete guide to building, installing, and running a JMDT Decentralised Node (JMDN) — covering dependency setup, cross-platform binary compilation, service installation, and deployment.
keywords: [JMDN node, run JMDT node, build JMDN, JMDT validator, node setup, ThebeDB, PostgreSQL, Yggdrasil, deploy JMDN, JMDT Layer 2 node]
---

# Running a JMDN Node

> *The Truth Layer for Verifiable Information — join the JMDT network by running your own JMDN node.*

This guide covers the complete workflow for setting up a **JMDN** (JMDT Decentralised Node): installing dependencies, building the binary, installing system services, and deploying updates. All scripts are cross-platform and support Linux, macOS, and FreeBSD.

> Prefer containers? See [Running JMDN with Docker →](/docs/docker) for the `docker run` / `docker compose` path instead.

---

## Overview

The JMDN setup workflow uses four scripts in the `Scripts/` directory:

| Script | Purpose |
|---|---|
| `Scripts/setup_dependencies.sh` | Install Go, PostgreSQL + Redis (storage), Yggdrasil, and build tools |
| `Scripts/setup_postgres.sh` | Initialise PostgreSQL for ThebeDB (user, database, logical replication) |
| `Scripts/build.sh` | Compile the `jmdn` binary from source |
| `Scripts/install_services.sh` | Register `jmdn` as a system service (`--mode local` or `--mode docker`) |
| `Scripts/deploy.sh` | Full automated build + atomic swap + service restart |
| `Scripts/start_jmdn_wrapper.sh` | Runtime wrapper invoked by the init system |

---

## Supported Platforms

| Platform | Service Manager | Package Manager |
|---|---|---|
| Ubuntu / Debian | systemd | apt |
| RHEL / CentOS | systemd | dnf / yum |
| Arch Linux | systemd | pacman |
| Alpine Linux | OpenRC | apk |
| macOS | launchd | Homebrew |
| FreeBSD | rc.d | pkg |

---

## Step 1 — Install Dependencies

Run the dependency installer as root. Use `--all` to install everything in one shot:

```bash
sudo ./Scripts/setup_dependencies.sh --all
```

This installs:
- **Go** (minimum version per `GO_FALLBACK_VER` in the script) — required to compile JMDN
- **PostgreSQL 15+ and Redis** — ThebeDB's SQL projection and the account-sync queue (`--all` asks whether to install them natively or as Docker containers)
- **Yggdrasil** — encrypted mesh network used for alternative peer messaging
- **GCC / build-essential** — C toolchain required for CGO compilation

You can install individual components if needed:

```bash
sudo ./Scripts/setup_dependencies.sh --go
sudo ./Scripts/setup_dependencies.sh --storage-local    # PostgreSQL + Redis as native services
sudo ./Scripts/setup_dependencies.sh --storage-docker   # PostgreSQL + Redis in Docker
sudo ./Scripts/setup_dependencies.sh --storage-none     # you provide Postgres/Redis yourself
sudo ./Scripts/setup_dependencies.sh --yggdrasil
```

### Storage model — ThebeDB

JMDN's storage backend is **ThebeDB**. Its canonical append-only log (BadgerDB) and
CDC event log (DuckDB) are **embedded in the `jmdn` process** — there is no separate
database service to start for them. The one external dependency is **PostgreSQL**,
which holds ThebeDB's queryable SQL projection and must be up and reachable at
`thebe.sql_dsn` before `jmdn` starts. Redis (account-sync queue) is on by default
and optional: setting `database.redis.url: ""` makes account writes synchronous.

After installing dependencies, initialise Postgres with the provided script:

```bash
sudo ./Scripts/setup_postgres.sh --mode local
```

This creates the `jmdn` user and database, sets `wal_level=logical`, creates the
`thebe_pub` publication and `thebe_eventlog` replication slot (required — CDC is on
by default and the node exits if it cannot start), caps slot WAL retention at 2 GB,
and prints the DSN plus a ready-to-paste yaml snippet. Use this script rather than
creating the publication by hand — a manual `CREATE PUBLICATION` without `-d jmdn`
lands in the wrong database.

> **Note:** The script detects your platform and package manager automatically. It also checks for existing installations and only upgrades if your current version is older than the target.

---

## Step 2 — Build the Binary

After installing dependencies, build the `jmdn` binary:

```bash
./Scripts/build.sh
```

This will:
1. Run `go mod tidy` to clean up dependencies
2. Embed git metadata (commit, branch, tag, build time) into the binary via ldflags
3. Compile with `CGO_ENABLED=1` — required by go-ethereum, SQLite (`DB/gossipnode.db`), and the DuckDB CDC bindings
4. Output the binary as `./jmdn` in the current directory

To build into a specific output directory:

```bash
./Scripts/build.sh /usr/local/bin
```

### Build Requirements

- GCC must be installed (run `setup_dependencies.sh` first if unsure)
- Go must be on `PATH` — the script will remind you if it isn't

---

## Step 3 — Install System Services

Install `jmdn` as a system service so it starts automatically on boot:

```bash
sudo ./Scripts/install_services.sh --mode local    # native PostgreSQL/Redis
# or
sudo ./Scripts/install_services.sh --mode docker   # PostgreSQL/Redis via a generated compose file
```

This script:
1. Creates required directories (`data/`, `config/`, `DB/`, logs)
2. Copies the `jmdn` binary and `start_jmdn_wrapper.sh` to the system binary path
3. Installs and enables the appropriate service definitions for your platform

### Service Definitions Installed

One `jmdn` service is created (there is no separate database unit — ThebeDB is embedded):

- **`--mode local`** — the `jmdn` unit declares `Requires=postgresql.service redis.service`, and the installer enables the distro's PostgreSQL and Redis units
- **`--mode docker`** — the `jmdn` unit brings the Postgres/Redis containers up via `docker compose` before starting the node (`ExecStartPre`)

Node state lives under the working directory (`/opt/jmdn` by default): `storage/thebe-kv/`
(canonical log), `data/eventlog.duckdb` (CDC log), `DB/gossipnode.db`, `config/`, `certs/`.

### Configuration File

Before starting, ensure your node configuration file is in place:

```bash
# Copy the default config template
cp jmdn_default.yaml /etc/jmdn/jmdn.yaml

# Edit to set your node identity, seed node address, and network parameters
nano /etc/jmdn/jmdn.yaml
```

Set `thebe.sql_dsn` to your Postgres DSN (or export `THEBE_SQL_DSN`). The shipped
default uses `sslmode=require`; for a local Postgres without TLS, use
`sslmode=disable` in the DSN. No password ships in the template — put it in the DSN.

> If `/etc/jmdn/jmdn.yaml` is missing, `start_jmdn_wrapper.sh` will automatically fall back to `./jmdn.yaml` in the working directory — useful for local development.

### Starting Services Manually

After installation, start the services using the commands for your platform:

**Linux (systemd):**
```bash
sudo systemctl start jmdn   # Postgres/Redis start automatically (Requires=/ExecStartPre=)

# Check status
sudo systemctl status jmdn
```

**macOS (launchd):**
```bash
launchctl start com.jmdn.jmdn
```

**Alpine Linux (OpenRC):**
```bash
sudo rc-service jmdn start
```

**FreeBSD (rc.d):**
```bash
sudo service jmdn start
```

---

## Step 4 — Deploy Updates

To rebuild and redeploy a new version of JMDN with zero manual steps:

```bash
sudo ./Scripts/deploy.sh
```

The deploy script performs a fully automated pipeline:

1. **Dependency check** — Runs `setup_dependencies.sh --all` to ensure environment is current
2. **Build** — Calls `build.sh` to compile the new binary
3. **Atomic swap** — Backs up the current binary, then atomically replaces it
4. **Service restart** — Restarts the `jmdn` service using the platform-appropriate service manager
5. **Health check** — Polls service status up to 10 times (3-second intervals) to confirm the node is running
6. **Rollback** — If the health check fails, automatically restores the previous binary and restarts

### Environment Path

The deploy script ensures Go is on `PATH`:

```bash
export PATH="/usr/local/go/bin:${PATH}"
```

This is set automatically — no manual profile changes needed when running via Ansible or CI.

---

## Runtime Wrapper

The `start_jmdn_wrapper.sh` script is the entry point used by the init system (systemd, launchd, rc.d, OpenRC). It is self-contained by design — it does not depend on any library or external script, so it remains functional after being copied to the system binary directory at install time.

It resolves paths in the following order:

1. Environment variables (`BIN_PATH`, `CONFIG_PATH`, `JMDN_BIN`, `JMDN_ETC`)
2. Platform-appropriate defaults (e.g., `/usr/local/bin` on Linux, Homebrew prefix on macOS)
3. Local fallback: `./jmdn.yaml` in the working directory (development convenience)

Override at runtime if needed:

```bash
BIN_PATH=/custom/path/jmdn CONFIG_PATH=/custom/jmdn.yaml ./start_jmdn_wrapper.sh
```

---

## Logs

View node logs using your platform's log viewer:

**Linux (systemd):**
```bash
journalctl -u jmdn -f
journalctl -u postgresql -f   # SQL projection (unit name varies by distro)
```

**macOS (launchd):**
```bash
tail -f /usr/local/var/log/jmdn/jmdn.log
```

**Alpine / FreeBSD:**
```bash
tail -f /var/log/jmdn/jmdn.log
```

---

## Troubleshooting

**Node won't start — binary not found:**
```bash
# Verify the binary is installed and executable
ls -la /usr/local/bin/jmdn
# Rebuild if missing
./Scripts/build.sh && sudo ./Scripts/install_services.sh
```

**jmdn exits at boot — storage errors:**
```bash
# Postgres must be up and reachable at thebe.sql_dsn before jmdn starts
pg_isready -h 127.0.0.1 -p 5430 -U jmdn

# CDC is on by default and the node exits if it cannot start. Verify the
# publication and slot exist IN THE jmdn DATABASE:
sudo -u postgres psql -d jmdn -c "SELECT pubname FROM pg_publication;"
sudo -u postgres psql -d jmdn -c "SELECT slot_name, active FROM pg_replication_slots;"

# If missing, (re)run the setup script — it creates both in the right database:
sudo ./Scripts/setup_postgres.sh --mode local
```
- A DSN with `sslmode=require` against a non-TLS Postgres fails — use `sslmode=disable` locally
- If the CDC consumer stalls, Postgres invalidates the slot once its WAL exceeds the 2 GB cap; jmdn warns at boot about an inactive, lagging, or invalidated slot

**Go not found during build:**
```bash
# Add Go to PATH for the current session
export PATH="/usr/local/go/bin:${PATH}"
# Or run the dependency installer again
sudo ./Scripts/setup_dependencies.sh --go
```

---

## Related

- [JMDN Node →](/docs/jmdt-node) — Architecture and technical reference
- [AVC Module →](/docs/avc) — Consensus internals
- [Sequencer →](/docs/sequencer) — Transaction ordering
