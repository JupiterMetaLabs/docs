---
id: running-a-node
title: Running a JMDN Node
sidebar_label: Running a Node
description: Complete guide to building, installing, and running a JMDT Decentralised Node (JMDN) — covering dependency setup, cross-platform binary compilation, service installation, and deployment.
keywords: [JMDN node, run JMDT node, build JMDN, JMDT validator, node setup, immudb, Yggdrasil, deploy JMDN, JMDT Layer 2 node]
---

# Running a JMDN Node

> *The Truth Layer for Verifiable Information — join the JMDT network by running your own JMDN node.*

This guide covers the complete workflow for setting up a **JMDN** (JMDT Decentralised Node): installing dependencies, building the binary, installing system services, and deploying updates. All scripts are cross-platform and support Linux, macOS, and FreeBSD.

---

## Overview

The JMDN setup workflow uses four scripts in the `Scripts/` directory:

| Script | Purpose |
|---|---|
| `Scripts/setup_dependencies.sh` | Install Go, immudb, Yggdrasil, and build tools |
| `Scripts/build.sh` | Compile the `jmdn` binary from source |
| `Scripts/install_services.sh` | Register `jmdn` and `immudb` as system services |
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
- **immudb** — the tamper-proof immutable ledger used by JMDN for local chain storage
- **Yggdrasil** — encrypted mesh network used for alternative peer messaging
- **GCC / build-essential** — C toolchain required for CGO compilation

You can install individual components if needed:

```bash
sudo ./Scripts/setup_dependencies.sh --go
sudo ./Scripts/setup_dependencies.sh --immudb
sudo ./Scripts/setup_dependencies.sh --yggdrasil
```

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
3. Compile with `CGO_ENABLED=1` (required for immudb's SQLite integration)
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

Install `jmdn` and `immudb` as system services so they start automatically on boot:

```bash
sudo ./Scripts/install_services.sh
```

This script:
1. Creates required directories (`data/`, `config/`, `DB/`, logs)
2. Copies the `jmdn` binary and `start_jmdn_wrapper.sh` to the system binary path
3. Installs and enables the appropriate service definitions for your platform

### Service Definitions Installed

Two services are created:

- **`immudb`** — The immutable ledger backing JMDN's local chain state
- **`jmdn`** — The JMDT Decentralised Node (depends on immudb)

### Configuration File

Before starting, ensure your node configuration file is in place:

```bash
# Copy the default config template
cp jmdn_default.yaml /etc/jmdn/jmdn.yaml

# Edit to set your node identity, seed node address, and network parameters
nano /etc/jmdn/jmdn.yaml
```

> If `/etc/jmdn/jmdn.yaml` is missing, `start_jmdn_wrapper.sh` will automatically fall back to `./jmdn.yaml` in the working directory — useful for local development.

### Starting Services Manually

After installation, start the services using the commands for your platform:

**Linux (systemd):**
```bash
sudo systemctl start immudb
sudo systemctl start jmdn

# Check status
sudo systemctl status jmdn
```

**macOS (launchd):**
```bash
launchctl start com.jmdn.immudb
launchctl start com.jmdn.jmdn
```

**Alpine Linux (OpenRC):**
```bash
sudo rc-service immudb start
sudo rc-service jmdn start
```

**FreeBSD (rc.d):**
```bash
sudo service immudb start
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
journalctl -u immudb -f
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

**immudb fails to start:**
```bash
# Check disk space and data directory permissions
df -h
ls -la /var/lib/jmdn/
# Restart immudb manually
sudo systemctl restart immudb
```

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
- [Seednode →](/docs/seednode) — Peer discovery and bootstrap infrastructure
