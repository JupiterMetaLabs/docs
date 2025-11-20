# Seed Node

A decentralized **peer directory service** for the JMDT network.  
The system maps **PeerIDs → IPs/multiaddrs + metadata**, and optionally supports **human-readable names** (`alice.node.jmdt`) as aliases.

---

## 🚀 Quick Start

### 1. Start PostgreSQL
```bash
# Using Docker (recommended)
docker run --name postgres-jmns -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:15

# Note: Database and schema are automatically created by the service
# The service will create the 'jmns' database and apply the schema automatically
```

### 2. Start the Peer Directory Service
```bash
# Build and start the JMNS service (with automatic database setup)
go build -o jmns-service cmd/jmns-service/main.go

# The service will automatically:
# - Check if PostgreSQL is running (fails if not)
# - Create the 'jmns' database if it doesn't exist
# - Apply the schema if tables don't exist
# - Start the gRPC server

# Custom configuration
./jmns-service -port 17002 -pg-dsn "postgres://user:pass@host:port/dbname?sslmode=disable"

# Using environment variables
PG_DSN="postgres://postgres:postgres@localhost:5432/jmns?sslmode=disable" ./jmns-service -port 17002

```

### 3. Start the Web UI
```bash
# Build and start the web UI
go build -o bin/peer-ui cmd/peer-ui/main.go
./bin/peer-ui
```

### 4. Access the System
- **Web UI**: http://localhost:8080
- **gRPC API**: localhost:17002
- **REST API**: http://localhost:8080/api/peers

---

## ✨ Features

- **Canonical identity**:  
  Every node is anchored to its **PeerID** (Ed25519-based).
- **Alias support**:  
  Human-friendly names like `alice.node.jmdt` mapped to PeerIDs (ENS-style).
- **Peer records**:  
  Store IPv4/IPv6, multiaddrs, neighbor connections, and binary status (`active/inactive`).
- **V, R, S signature format**:  
  Uses Ethereum-compatible V, R, S signature components for cryptographic verification.
- **Auto-generated timestamps**:  
  Timestamps are automatically generated server-side for consistency.
- **Auto-active status**:  
  New peer registrations are automatically marked as active.
- **Signed updates**:  
  Only the PeerID owner can update their record.
- **Fast lookups**:  
  PostgreSQL-based storage for fast and reliable reads.
- **Durable source of truth**:  
  PostgreSQL database stores all peer records and aliases.
- **Dynamic liveness**:  
  Heartbeat messages for real-time status tracking.
- **Auditability**:  
  Complete audit trail with timestamps and signatures.
- **Binary Status System**:  
  Simple active/inactive status with clear visual indicators.
- **🆕 Automatic Database Setup**:  
  Service automatically creates database and applies schema on startup.
- **🆕 Health Checks**:  
  Comprehensive PostgreSQL connectivity and database validation.
- **🆕 Fail-Fast Design**:  
  Service kills itself immediately if PostgreSQL is unavailable.
- **🆕 IP Geolocation**:  
  Automatic region detection from IPv4/IPv6 addresses using IP-API (free) or ipapi.co (paid).
- **🆕 Neighbor Management**:  
  Full CRUD operations for peer neighbor relationships with proper database normalization.
- **🆕 Inactive Peer Reporting**:  
  Comprehensive system for reporting and tracking inactive peers with configurable thresholds.
- **🆕 Health Check System**:  
  RPC-based health checks for individual peers with timeout and retry logic.
- **🆕 Time Window Filtering**:  
  Reports filtered by configurable time windows for better accuracy and performance.
- **🆕 Buddy Management**:  
  Recent buddy tracking with automatic limit management (39 records max) and smart cleanup.

---

## 🔄 Recent Updates

### Peer Directory v2 - Normalized Data Model (v4.0) - **MAJOR UPDATE**

The peer directory has been completely refactored with a **normalized data model** and **enhanced neighbor management capabilities**:

#### **What's New:**
- **✅ Normalized Data Model**: Neighbors moved to separate `peer_neighbors` table
- **✅ Enhanced Neighbor Management**: Full CRUD operations for neighbor relationships
- **✅ Inactive Peer Reporting**: Comprehensive system for reporting inactive neighbors
- **✅ Health Check System**: RPC-based health checks for individual peers
- **✅ Time Window Filtering**: Reports filtered by configurable time windows
- **✅ Missed Heartbeat Tracking**: Detailed tracking of consecutive missed heartbeats
- **✅ Enhanced Registration**: Peers can be registered with initial neighbors
- **✅ Improved Validation**: Comprehensive input validation and error handling
- **✅ Database Optimization**: Proper indexes and constraints for performance

#### **New gRPC Endpoints:**
- `AddNeighbor` - Add a neighbor relationship
- `RemoveNeighbor` - Remove a neighbor relationship
- `GetNeighbors` - Get all neighbors for a peer
- `ReportInactiveNeighbor` - Report an inactive neighbor
- `GetInactiveNeighborReportsForSubject` - Get reports for a specific peer
- `CheckPeerHealth` - Perform health check on a peer

#### **Data Model Changes:**
- **Before**: `PeerRecord` contained `neighbors` array field
- **After**: `PeerRecord` normalized, neighbors stored in separate `peer_neighbors` table
- **Benefits**: Better performance, proper relationships, scalable design

#### **Breaking Changes:**
- `PeerRecord` no longer contains `neighbors` field
- `BatchRegister` RPC method removed (single-peer focus)
- `RegisterPeer`/`RegisterPeerWithAlias` now accept `neighbors` parameter
- Database schema updated with new tables and indexes

### Database Health Checks & Auto-Setup (v3.1) - **FEATURE**

The service now includes **comprehensive database health checks and automatic setup**:

#### **What's New:**
- **✅ Automatic Database Creation**: Service creates the `jmns` database if it doesn't exist
- **✅ Schema Auto-Application**: Automatically applies SQL schema if tables are missing
- **✅ PostgreSQL Health Checks**: Validates PostgreSQL connectivity before starting
- **✅ Fail-Fast Design**: Service kills itself immediately if PostgreSQL is unavailable
- **✅ Safe Migration**: Handles existing databases without breaking views or functions
- **✅ Comprehensive Logging**: Clear status indicators and error messages

#### **Default Configuration:**
- **Database**: `jmns` (instead of `postgres`)
- **Schema Path**: `sql/schema.sql`
- **Health Check Timeout**: 60 seconds
- **Connection Validation**: 10 seconds

#### **Service Startup Process:**
1. **PostgreSQL Check**: Verify PostgreSQL is running and accessible
2. **Database Check**: Check if `jmns` database exists, create if needed
3. **Table Check**: Verify required tables exist, apply schema if needed
4. **Service Creation**: Initialize GORM JMNS service
5. **Final Validation**: Perform comprehensive database validation
6. **Server Start**: Launch gRPC server only if everything is ready

#### **Error Handling:**
- **PostgreSQL Not Running**: Service fails immediately with clear error
- **Permission Issues**: Detailed error messages with remediation hints
- **Schema Conflicts**: Safe handling of existing views and functions
- **Connection Timeouts**: Proper timeout handling with retry logic

### GORM Migration (v3.0) - **MAJOR UPDATE**

The peer directory has been **completely migrated from direct PostgreSQL connections to GORM ORM**:

#### **What Changed:**
- **✅ ORM Integration**: Replaced raw SQL with GORM for type-safe database operations
- **✅ Automatic Migrations**: GORM AutoMigrate handles schema creation and updates
- **✅ Type Safety**: Compile-time validation for all database operations
- **✅ Better Error Handling**: Clear, actionable error messages
- **✅ Maintainable Code**: Clean repository pattern with separation of concerns
- **✅ JSON Support**: Proper JSONB handling for labels and metadata
- **✅ Array Support**: PostgreSQL array types working seamlessly
- **✅ Foreign Keys**: Proper relationship management between tables

#### **Technical Improvements:**
- **Database Layer**: `pkg/peer/gorm_repository.go` - New GORM-based repository
- **Models**: `pkg/peer/models.go` - GORM models with proper tags and relationships
- **Services**: `pkg/peer/gorm_jmns_service.go` - GORM-integrated service layer
- **Geolocation**: `pkg/peer/geolocation_*.go` - IP geolocation with multiple service providers
- **Dependencies**: Added `gorm.io/gorm`, `gorm.io/driver/postgres`, `gorm.io/datatypes`
- **Migration**: Automatic schema creation with proper dependency order

#### **Performance Benefits:**
- **Faster Development**: No more manual SQL writing and result scanning
- **Type Safety**: Compile-time validation prevents runtime errors
- **Better Maintainability**: Clean, readable code with clear separation of concerns
- **Automatic Mapping**: No manual data conversion between Go structs and database rows
- **Query Optimization**: GORM handles query optimization and connection pooling

#### **Backward Compatibility:**
- **✅ API Unchanged**: All gRPC endpoints remain the same
- **✅ Data Preserved**: Existing data is automatically migrated
- **✅ Same Performance**: No performance degradation
- **✅ Enhanced Reliability**: Better error handling and type safety

### Binary Status System (v2.0)

The peer directory uses a **simplified binary status system**:

- **✅ Active (1)**: Peer is online and responding
- **❌ Inactive (0)**: Peer is offline or unresponsive

**Benefits:**
- Cleaner UI with green/red status indicators
- Simplified database storage (integer instead of string enums)
- Better performance and reduced complexity
- Clear visual distinction between peer states

---

## 🌍 IP Geolocation (v3.2) - **NEW FEATURE**

The peer directory now includes **automatic IP geolocation** to identify regions from peer IP addresses:

### **What's New:**
- **✅ Automatic Region Detection**: Detects region from IPv4/IPv6 addresses during peer registration
- **✅ IP-API Integration**: Uses IP-API service by default (free, no API key required)
- **✅ ipapi.co Support**: Optional paid service for higher rate limits
- **✅ Fallback Strategy**: IP-API → Basic mapping → "unknown"
- **✅ Non-Intrusive**: Only adds region if not already present in labels
- **✅ Preserves Existing Data**: Won't overwrite existing region labels
- **✅ IPv4 & IPv6 Support**: Handles both address types from multiaddrs

### **Supported Services:**

#### **IP-API** (Default - Free)
- **Speed**: ~100-500ms per lookup
- **Accuracy**: Good
- **Cost**: Free (45 requests/minute)
- **Network**: Requires internet
- **Setup**: No API key required

#### **ipapi.co** (Optional - Paid)
- **Speed**: ~100-300ms per lookup
- **Accuracy**: Very good
- **Cost**: $10/month (1,000 requests)
- **Network**: Requires internet
- **Setup**: Requires API key

### **Configuration:**

#### **Environment Variables:**
```bash
# Choose your provider (optional - defaults to ip-api)
export GEO_PROVIDER="ip-api"  # Only IP-API is supported

# API key (if using ipapi.co)
export IPAPI_CO_KEY="your_key"
```

#### **Programmatic Configuration:**
```go
import "seedNodes/pkg/peer"

// Option 1: Use IP-API (default, free)
config := peer.GeoLocationConfig{
    Provider: "ip-api",
}

// Option 2: Use ipapi.co (paid, requires API key)
config := peer.GeoLocationConfig{
    Provider: "ip-api",
    APIKey:   "your_api_key",
}

// Option 3: Use basic mapping (no internet required)
config := peer.GeoLocationConfig{
    Provider: "basic",
}

geoService, err := peer.NewGeoLocationServiceFromConfig(config)
```

### **Region Format:**
The system returns regions in the format: `COUNTRY-REGION-CITY`

**Examples:**
- `US-VA-Ashburn` (United States, Virginia, Ashburn)
- `DE-BW-Berlin` (Germany, Baden-Württemberg, Berlin)
- `JP-13-Tokyo` (Japan, Tokyo, Tokyo)
- `GB-ENG-London` (United Kingdom, England, London)

### **Automatic Integration:**
Region detection happens automatically during peer registration:

```go
// This will automatically detect and add region information
record := &peer.SignedPeerRecord{
    PeerID:     "12D3KooW...",
    Multiaddrs: []string{"/ip4/8.8.8.8/tcp/4001/p2p/12D3KooW..."},
    Labels:     map[string]string{}, // Region will be added automatically
}

err := jmnsService.RegisterPeer(ctx, record)
// record.Labels will now contain region information
```

### **Database Storage:**
Region information is stored in the existing `labels` JSONB field:

```json
{
  "region": "US-VA-Ashburn",
  "region_detected_at": "1703123456",
  "role": "validator"
}
```

### **Setup Guide:**
For detailed setup instructions, see [GEOLOCATION_SETUP.md](GEOLOCATION_SETUP.md)

---

## ⚖️ Peer Weights System (v3.3) - **NEW FEATURE**

The peer directory now supports **peer weights** for priority-based routing and load balancing:

### **What's New:**
- **✅ Weight Assignment**: Peers can be assigned numerical weights (0.0-1.0)
- **✅ UpdatePeerWeights API**: New gRPC method to update peer weights
- **✅ Database Storage**: Weights stored as REAL type in PostgreSQL
- **✅ Signature Verification**: Weight updates require cryptographic signatures
- **✅ Sequence Management**: Proper sequence number handling for updates
- **✅ Type Safety**: Full type safety with float64 in Go, float in protobuf

### **Use Cases:**
- **Load Balancing**: Higher weights indicate more capable peers
- **Priority Routing**: Prefer peers with higher weights for operations
- **Resource Allocation**: Weights represent computational power or bandwidth
- **Consensus Participation**: Influence voting power in consensus mechanisms

### **API Usage:**
```bash
# Update peer weights via gRPC
grpcurl -plaintext -d '{
  "peerId": "12D3KooWTestPeer123456789",
  "weights": 0.95,
  "v": "0x1c",
  "r": "0x1234567890abcdef...",
  "s": "0x1234567890abcdef..."
}' localhost:17002 peerpb.PeerDirectory/UpdatePeerWeights
```

### **Weight Values:**
- **Range**: 0.0 to 1.0 (recommended)
- **Default**: 0.0 (no special weight)
- **Examples**:
  - `0.0` - Standard peer
  - `0.5` - Medium priority
  - `0.85` - High priority
  - `1.0` - Maximum priority

---

## 👥 Buddy Management (v4.1) - **NEW FEATURE**

The peer directory now includes **buddy management** functionality to maintain a list of recently interacted peers:

### **What's New:**
- **✅ Recent Buddy Tracking**: Maintains a list of recently interacted peers
- **✅ Automatic Limit Management**: Automatically maintains a maximum of 39 records
- **✅ Smart Cleanup**: Removes oldest 13 records when limit is exceeded
- **✅ Exclusion Filtering**: ListBuddy returns all peers except recent buddies
- **✅ Transaction Safety**: All operations are wrapped in database transactions
- **✅ Non-Existent Peer Handling**: Skips peers that don't exist in the system

### **How It Works:**

#### **UpdateBuddy**
- Adds new peer IDs to the recent buddy list
- Automatically maintains the 39-record limit
- Updates timestamps for existing buddies
- Returns count of added and removed records

#### **ListBuddy**
- Returns all peers in the system
- **Excludes** peers that are in the recent buddy list
- Useful for finding new peers to interact with
- Maintains full peer record information

### **Database Schema:**
```sql
-- Recent buddy table (max 39 records, oldest 13 removed when limit reached)
CREATE TABLE recent_buddy (
    id SERIAL PRIMARY KEY,
    peer_id VARCHAR(255) NOT NULL REFERENCES peer_records(peer_id) ON DELETE CASCADE,
    added_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(peer_id)
);
```

### **Use Cases:**
- **Peer Discovery**: Find new peers to connect to (exclude recent buddies)
- **Load Distribution**: Avoid repeatedly connecting to the same peers
- **Network Expansion**: Discover fresh peers for better network coverage
- **Connection Management**: Track recently used connections for optimization

### **API Usage:**
```bash
# Update recent buddy list
grpcurl -plaintext -d '{
  "peer_ids": ["12D3KooWTestPeer123456789", "12D3KooWAnotherPeer987654321"]
}' localhost:17002 peerpb.PeerDirectory/UpdateBuddy

# List peers excluding recent buddies
grpcurl -plaintext -d '{}' localhost:17002 peerpb.PeerDirectory/ListBuddy
```

### **Response Examples:**

#### **UpdateBuddy Response:**
```json
{
  "accepted": true,
  "message": "Successfully updated buddy list. Added: 2, Removed: 0",
  "addedCount": 2,
  "removedCount": 0
}
```

#### **ListBuddy Response:**
```json
{
  "peers": [
    {
      "peerId": "12D3KooWNewPeer123456789",
      "multiaddrs": ["/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWNewPeer123456789"],
      "currentStatus": "PEER_STATUS_ACTIVE",
      "weights": 0.5,
      "labels": {"role": "validator", "region": "US-CA"}
    }
  ],
  "totalCount": 1
}
```

### **Automatic Limit Management:**
- **Maximum Records**: 39 peers in recent buddy list
- **Cleanup Trigger**: Every UpdateBuddy call
- **Cleanup Amount**: Removes oldest 13 records when limit exceeded
- **Database Function**: `maintain_recent_buddy_limit()` handles cleanup automatically

---

## 🏗️ GORM Architecture

### Database Layer Structure

The system now uses a clean GORM-based architecture:

```
pkg/peer/
├── models.go              # GORM models with proper tags
├── gorm_repository.go     # GORM repository implementation
├── gorm_jmns_service.go   # GORM-integrated service layer
├── gorm_db.go            # Database connection utilities
├── types.go              # Internal type definitions
├── geolocation.go        # Basic geolocation service with lookup tables
├── geolocation_api.go    # HTTP API services (IP-API, ipapi.co, IPStack)
├── geolocation_config.go # Configuration management for geolocation
└── geolocation_test.go   # Unit tests for geolocation functionality
```

### GORM Models

#### PeerRecord
```go
type PeerRecord struct {
    PeerID        string         `gorm:"primaryKey;column:peer_id;type:varchar(255)"`
    Multiaddrs    pq.StringArray `gorm:"type:text[];not null"`
    Seq           uint64         `gorm:"not null;default:1"`
    FirstCreated  int64          `gorm:"not null"`
    LastUpdated   int64          `gorm:"not null"`
    ActiveFrom    int64          `gorm:"not null"`
    CurrentStatus int            `gorm:"not null;default:1"`
    Neighbors     pq.StringArray `gorm:"type:text[];default:'{}'"`
    Labels        datatypes.JSON `gorm:"type:jsonb;default:'{}'"`
    Weights       float64        `gorm:"type:real;default:0.0"`
    V             string         `gorm:"not null"`
    R             string         `gorm:"not null"`
    S             string         `gorm:"not null"`
    CreatedAt     time.Time      `gorm:"autoCreateTime"`
    UpdatedAt     time.Time      `gorm:"autoUpdateTime"`
}
```

#### GormPeerAlias
```go
type GormPeerAlias struct {
    Name        string    `gorm:"primaryKey;column:name;type:varchar(255)"`
    PeerID      string    `gorm:"not null;column:peer_id;type:varchar(255)"`
    Created     int64     `gorm:"not null"`
    LastUpdated int64     `gorm:"not null"`
    V           string    `gorm:"not null"`
    R           string    `gorm:"not null"`
    S           string    `gorm:"not null"`
    CreatedAt   time.Time `gorm:"autoCreateTime"`
    UpdatedAt   time.Time `gorm:"autoUpdateTime"`
}
```

#### Heartbeat
```go
type Heartbeat struct {
    ID         uint64         `gorm:"primaryKey;autoIncrement"`
    PeerID     string         `gorm:"not null;column:peer_id;type:varchar(255)"`
    Timestamp  int64          `gorm:"not null"`
    Status     int64          `gorm:"not null"`
    Multiaddrs pq.StringArray `gorm:"type:text[]"`
    V          string         `gorm:"not null"`
    R          string         `gorm:"not null"`
    S          string         `gorm:"not null"`
    CreatedAt  time.Time      `gorm:"autoCreateTime"`
}
```

### Key GORM Features

- **AutoMigrate**: Automatic schema creation and updates
- **Type Safety**: Compile-time validation for all operations
- **JSON Support**: Native JSONB handling with `datatypes.JSON`
- **Array Support**: PostgreSQL arrays with `pq.StringArray`
- **Timestamps**: Automatic `CreatedAt` and `UpdatedAt` management
- **Foreign Keys**: Proper relationship constraints
- **Connection Pooling**: Efficient database connection management

### Database Schema

The system uses PostgreSQL with the following key tables:

#### peer_records
```sql
CREATE TABLE peer_records (
    peer_id VARCHAR(255) PRIMARY KEY,
    multiaddrs TEXT[] NOT NULL,
    seq BIGINT NOT NULL DEFAULT 1,
    first_created BIGINT NOT NULL,
    last_updated BIGINT NOT NULL,
    active_from BIGINT NOT NULL,
    current_status INTEGER NOT NULL DEFAULT 1,
    neighbors TEXT[] DEFAULT '{}',
    labels JSONB DEFAULT '{}',
    weights REAL DEFAULT 0.0,           -- NEW: Peer weight field
    v TEXT NOT NULL,
    r TEXT NOT NULL,
    s TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Fields**:
- `weights`: Float value (0.0-1.0) representing peer priority/weight
- `labels`: JSONB field for metadata (region, role, etc.)
- `neighbors`: Array of connected peer IDs
- `current_status`: Binary status (1=active, 0=inactive)

## 📦 Data Models

### Signed Peer Record v3 (GORM)
```json
{
  "peer_id": "12D3KooW...",
  "multiaddrs": ["/ip4/1.2.3.4/tcp/4001/p2p/12D3KooW..."],
  "seq": 42,
  "first_created": 1735689600,
  "last_updated": 1735689600,
  "active_from": 1735689600,
  "current_status": "PEER_STATUS_ACTIVE",
  "neighbors": ["12D3KooX...", "12D3KooY..."],
  "labels": {"role": "fullnode", "region": "apac"},
  "weights": 0.85,
  "v": "0x00",
  "r": "0x1234567890abcdef...",
  "s": "0xabcdef1234567890..."
}
```

---

# seedNodes

## One-shot Dependency Install

Run this once to install protoc plugins, download Go deps, and generate stubs:

```
cd seedNodes
./scripts/install_deps.sh
```

This performs:
- Installs `protoc-gen-go` and `protoc-gen-go-grpc`
- Runs `go mod tidy` + `go mod download`
- Generates gRPC code from `api/proto/redis_streams.proto`

## Build Binaries

```
go build ./cmd/pg-cud-consumer
go build ./cmd/hrw-exporter
go build ./cmd/seednode-grpc
go build ./cmd/jmns-service
```

## Run

Ensure the Redis Streams gRPC microservice is running (`../Redis-Streams/./RDS.sh run-microservice`) and Postgres is reachable.

Example env and run commands:

```
# CUD Consumer (applies to Postgres)
PG_DSN=postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable \
RS_ADDR=0.0.0.0:16001 \
RS_TOPIC_CUD=seednode.cud \
RS_CONSUMER_GROUP=seednode-cud-group \
RS_CONSUMER_NAME=seednode-cud-consumer-1 \
./pg-cud-consumer

# Exporter (publishes table pages)
PG_DSN=postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable \
RS_ADDR=0.0.0.0:16001 \
RS_TOPIC_READ=seednode.read \
./hrw-exporter

## SeedNode gRPC Orchestrator

Start the SeedNode gRPC server (publishes CUD to Redis Streams and serves reads from Postgres):

```
PG_DSN=postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable \
RS_ADDR=0.0.0.0:16001 \
RS_TOPIC_CUD=seednode.cud \
./seednode-grpc --port 17001
```

Test with grpcurl (install via `brew install grpcurl` on macOS):

#### BatchUpsert (queues to Redis Streams; processed by the pg-cud-consumer)

```bash
grpcurl -plaintext -d '{
  "items": [{
    "tx_hash": "0xtest001",
    "epoch": 123,
    "primary_shard_id": 5,
    "replica_shard_ids": [6,7],
    "routing_engine_id": "local-dev-1"
  }]
}' localhost:17001 seednodepb.SeedNode/BatchUpsert
```

#### BatchDelete

```bash
grpcurl -plaintext -d '{"tx_hashes":["0xtest001"]}' localhost:17001 seednodepb.SeedNode/BatchDelete
```

#### Get (reads directly from Postgres)

```bash
grpcurl -plaintext -d '{"tx_hash":"0xtest001"}' localhost:17001 seednodepb.SeedNode/Get
```

#### List (keyset pagination)

```bash
grpcurl -plaintext -d '{"after_tx_hash":"","limit":10}' localhost:17001 seednodepb.SeedNode/List
```

Note: Keep `pg-cud-consumer` running to apply CUD messages to Postgres.

## Peer Directory Service (JMNS)

### Option 1: Using Docker PostgreSQL

```bash
# Start PostgreSQL (using Docker)
docker run --name postgres-jmns -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:15

# Create database schema
docker exec -i postgres-jmns psql -U postgres -d postgres < sql/schema.sql

# Start the peer directory service
PG_DSN="postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable" ./jmns-service --port 17002
```

### Option 2: Using Native PostgreSQL (Ubuntu/Debian)

**Quick Setup (Recommended):**
```bash
# Run the automated setup script
./scripts/setup_postgres_ubuntu.sh

# Start the peer directory service
PG_DSN="postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable" ./jmns-service --port 17002
```

**Manual Setup:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE postgres;"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;"

# Create database schema
psql -h localhost -U postgres -d postgres < sql/schema.sql

# Start the peer directory service
PG_DSN="postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable" ./jmns-service --port 17002
```

### Testing

Test the peer directory service:

```bash
# Run the comprehensive test suite
./test/test_jmns_service.sh

# Run other tests
```

## 🌐 Web UI

The peer directory includes a modern web interface for viewing and managing peers.

### Start the Web UI

```bash
# Build the peer UI service
go build -o bin/peer-ui cmd/peer-ui/main.go

# Start the web UI (requires JMNS service running on port 17002)
./bin/peer-ui
```

The web UI will be available at: **http://localhost:8080**

### Features

- **📊 Dashboard**: View peer statistics and status overview
- **🔍 Peer Browser**: Browse all registered peers with filtering
- **📈 Real-time Status**: Live updates of peer status (active/inactive)
- **🎨 Simple UI**: Clean, responsive interface with status indicators
- **🔎 Search & Filter**: Filter peers by status, labels, and more

### API Endpoints

The web UI exposes REST API endpoints:

- `GET /api/peers` - List all peers with optional filtering
- `GET /api/peers/{peer_id}` - Get specific peer details
- `GET /api/peers/by-alias/{alias}` - Get peer by alias

Example API usage:
```bash
# List all peers
curl http://localhost:8080/api/peers

# Filter by status
curl "http://localhost:8080/api/peers?status=active"

# Get specific peer
curl http://localhost:8080/api/peers/12D3KooWTestPeer123456789
```

## 🔌 gRPC API Reference

The peer directory service exposes the following gRPC endpoints:

### Core Operations

| Method | Description | Request | Response |
|--------|-------------|---------|----------|
| `RegisterPeer` | Register a new peer | `RegisterPeerRequest` | `RegisterPeerResponse` |
| `RegisterPeerWithAlias` | Register peer with alias in one operation | `RegisterPeerWithAliasRequest` | `RegisterPeerWithAliasResponse` |
| `UpdatePeer` | Update existing peer | `UpdatePeerRequest` | `UpdatePeerResponse` |
| `UpdatePeerWeights` | Update peer weights | `UpdatePeerWeightsRequest` | `UpdatePeerWeightsResponse` |
| `GetPeer` | Get peer by ID | `GetPeerRequest` | `GetPeerResponse` |
| `DeletePeer` | Delete peer | `DeletePeerRequest` | `DeletePeerResponse` |
| `ListPeers` | List peers with filtering | `PeerListRequest` | `PeerListResponse` |

### Alias Operations

| Method | Description | Request | Response |
|--------|-------------|---------|----------|
| `CreateAlias` | Create peer alias | `CreateAliasRequest` | `CreateAliasResponse` |
| `GetPeerByAlias` | Get peer by alias | `GetPeerByAliasRequest` | `GetPeerByAliasResponse` |
| `DeleteAlias` | Delete alias | `DeleteAliasRequest` | `DeleteAliasResponse` |

### Neighbor Management (NEW)

| Method | Description | Request | Response |
|--------|-------------|---------|----------|
| `AddNeighbor` | Add a neighbor relationship | `AddNeighborRequest` | `AddNeighborResponse` |
| `RemoveNeighbor` | Remove a neighbor relationship | `RemoveNeighborRequest` | `RemoveNeighborResponse` |
| `GetNeighbors` | Get all neighbors for a peer | `GetNeighborsRequest` | `GetNeighborsResponse` |

### Inactive Peer Reporting (NEW)

| Method | Description | Request | Response |
|--------|-------------|---------|----------|
| `ReportInactiveNeighbor` | Report an inactive neighbor | `ReportInactiveNeighborRequest` | `ReportInactiveNeighborResponse` |
| `GetInactiveNeighborReportsForSubject` | Get reports for a specific peer | `GetInactiveNeighborReportsForSubjectRequest` | `GetInactiveNeighborReportsForSubjectResponse` |

### Health Checks (NEW)

| Method | Description | Request | Response |
|--------|-------------|---------|----------|
| `CheckPeerHealth` | Perform health check on a peer | `HealthCheckRequest` | `HealthCheckResponse` |

### Heartbeat & Service Operations

| Method | Description | Request | Response |
|--------|-------------|---------|----------|
| `SendHeartbeat` | Send peer heartbeat | `SendHeartbeatRequest` | `SendHeartbeatResponse` |
| `HealthCheck` | Service health check | `Empty` | `Empty` |

### Status Values

The system uses a **binary status system**:
- `PEER_STATUS_ACTIVE` (1) - Peer is online and active
- `PEER_STATUS_INACTIVE` (0) - Peer is offline or inactive

### Weights System

The **weights field** allows peers to be assigned numerical weights for various purposes:
- **Load Balancing**: Higher weights can indicate more capable peers
- **Priority Routing**: Peers with higher weights may be preferred for certain operations
- **Resource Allocation**: Weights can represent computational power, bandwidth, or reliability
- **Consensus Participation**: Weights can influence voting power in consensus mechanisms

**Weight Values**:
- Range: `0.0` to `1.0` (recommended)
- Default: `0.0` (no special weight)
- Type: `float64` in Go, `float` in protobuf, `REAL` in PostgreSQL

**Usage Examples**:
- `0.0` - Standard peer with no special weight
- `0.5` - Medium priority peer
- `0.85` - High priority peer
- `1.0` - Maximum priority peer

### Example gRPC Calls

```bash
# List all peers
grpcurl -plaintext -d '{}' localhost:17002 peerpb.PeerDirectory/ListPeers

# Register a new peer with neighbors (NEW)
grpcurl -plaintext -d '{
  "peerRecord": {
    "peerId": "12D3KooWTestPeer123456789",
    "multiaddrs": ["/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWTestPeer123456789"],
    "seq": 1,
    "currentStatus": "PEER_STATUS_ACTIVE",
    "labels": {"region": "local", "role": "testnode"},
    "v": "0x00",
    "r": "0x1234567890abcdef...",
    "s": "0xabcdef1234567890..."
  },
  "neighbors": ["12D3KooWNeighbor1", "12D3KooWNeighbor2"]
}' localhost:17002 peerpb.PeerDirectory/RegisterPeer

# Add a neighbor (NEW)
grpcurl -plaintext -d '{
  "peerId": "12D3KooWTestPeer123456789",
  "neighborId": "12D3KooWNewNeighbor",
  "v": "0x00",
  "r": "0x1111111111111111...",
  "s": "0x2222222222222222..."
}' localhost:17002 peerpb.PeerDirectory/AddNeighbor

# Get neighbors for a peer (NEW)
grpcurl -plaintext -d '{
  "peerId": "12D3KooWTestPeer123456789"
}' localhost:17002 peerpb.PeerDirectory/GetNeighbors

# Report inactive neighbor (NEW)
grpcurl -plaintext -d '{
  "report": {
    "reporterPeerId": "12D3KooWReporterPeer",
    "subjectPeerId": "12D3KooWTestPeer123456789",
    "lastSeenTimestamp": 1735689600,
    "reason": "missed_heartbeats",
    "reportedAt": 1735689700,
    "missedHeartbeatCount": 3,
    "v": "0x00",
    "r": "0x5555555555555555...",
    "s": "0x6666666666666666..."
  }
}' localhost:17002 peerpb.PeerDirectory/ReportInactiveNeighbor

# Check peer health (NEW)
grpcurl -plaintext -d '{
  "peerId": "12D3KooWTestPeer123456789"
}' localhost:17002 peerpb.PeerDirectory/CheckPeerHealth

# Register a peer with alias in one operation
grpcurl -plaintext -d '{
  "peerRecord": {
    "peerId": "12D3KooWTestPeer123456789",
    "multiaddrs": ["/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWTestPeer123456789"],
    "seq": 1,
    "currentStatus": "PEER_STATUS_ACTIVE",
    "labels": {"region": "local", "role": "testnode"},
    "v": "0x00",
    "r": "0x1234567890abcdef...",
    "s": "0xabcdef1234567890..."
  },
  "alias": {
    "name": "alice.node.jmdt",
    "peerId": "12D3KooWTestPeer123456789",
    "v": "0x00",
    "r": "0x9876543210fedcba...",
    "s": "0xfedcba9876543210..."
  }
}' localhost:17002 peerpb.PeerDirectory/RegisterPeerWithAlias

# Get peer by ID
grpcurl -plaintext -d '{"peerId": "12D3KooWTestPeer123456789"}' localhost:17002 peerpb.PeerDirectory/GetPeer

# Update peer weights
grpcurl -plaintext -d '{
  "peerId": "12D3KooWTestPeer123456789",
  "weights": 0.95,
  "v": "0x1c",
  "r": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "s": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}' localhost:17002 peerpb.PeerDirectory/UpdatePeerWeights

# Update recent buddy list
grpcurl -plaintext -d '{
  "peer_ids": ["12D3KooWTestPeer123456789", "12D3KooWAnotherPeer987654321"]
}' localhost:17002 peerpb.PeerDirectory/UpdateBuddy

# List peers excluding recent buddies
grpcurl -plaintext -d '{}' localhost:17002 peerpb.PeerDirectory/ListBuddy

# Send heartbeat
grpcurl -plaintext -d '{
  "heartbeat": {
    "peerId": "12D3KooWTestPeer123456789",
    "timestamp": 1735689600,
    "status": "PEER_STATUS_ACTIVE",
    "multiaddrs": ["/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWTestPeer123456789"],
    "signature": "heartbeat-signature"
  }
}' localhost:17002 peerpb.PeerDirectory/SendHeartbeat
```

## 📁 Project Structure

```
seedNodes/
├── cmd/                          # Application entry points
│   ├── jmns-service/            # Main peer directory service
│   ├── peer-ui/                 # Web UI for peer management
│   ├── hrw-exporter/            # HRW exporter service
│   ├── pg-cud-consumer/         # PostgreSQL CUD consumer
│   └── seednode-grpc/           # Seed node gRPC service
├── pkg/                         # Core packages
│   ├── peer/                    # Peer directory implementation
│   │   ├── models.go            # GORM database models
│   │   ├── gorm_repository.go   # GORM repository layer
│   │   ├── gorm_jmns_service.go # Main service implementation
│   │   ├── peer_neighbor_repository.go # Neighbor management repository
│   │   ├── inactive_neighbor_report_repository.go # Inactive reporting repository
│   │   ├── inactive_neighbor_service.go # Inactive neighbor business logic
│   │   ├── inactive_neighbor_config.go # Configuration for inactive reporting
│   │   ├── peer_health_checker.go # Health check system
│   │   ├── utils.go             # Utility functions
│   │   ├── peer_directory_v2_test.go # Unit tests for v2 features
│   │   ├── geolocation.go       # Basic geolocation service
│   │   ├── geolocation_api.go   # HTTP API services
│   │   ├── geolocation_config.go # Configuration management
│   │   └── geolocation_test.go  # Unit tests
│   ├── config/                  # Configuration management
│   ├── hrw/                     # HRW (Hash Ring Weight) implementation
│   ├── pgrepo/                  # PostgreSQL repository utilities
│   └── rsclient/                # Redis Streams client
├── api/                         # Protocol definitions
│   ├── peer/                    # Peer directory gRPC API
│   └── proto/                   # Redis Streams gRPC API
├── sql/                         # Database schema
│   └── schema.sql               # PostgreSQL schema definition
├── test/                        # Test scripts and utilities
│   ├── test_peer_directory_v2.sh # Peer Directory v2 comprehensive tests
│   ├── test_schema_migration.sh  # Database schema migration tests
│   ├── test_region_detection.sh # IP geolocation tests
│   ├── test_register_peer.sh    # Peer registration tests
│   ├── test_jmns_service.sh     # Service integration tests
│   ├── test_db_health.sh        # Database health tests
│   └── test_results_v2.md       # Test results documentation
├── examples/                    # Example code and demos
│   └── geolocation_demo.go      # IP geolocation demo
├── scripts/                     # Setup and utility scripts
├── bin/                         # Built binaries
├── go.mod                       # Go module definition
├── go.sum                       # Go module checksums
├── README.md                    # This file
└── GEOLOCATION_SETUP.md         # IP geolocation setup guide
```

## 🧪 Testing

### Test Organization

All test files have been organized in the `test/` folder:

```
test/
├── test_db_health.sh      # Database health checks and auto-setup tests
├── test_jmns_service.sh   # Comprehensive JMNS service tests
├── test_register_peer.sh  # Peer registration tests
└── test_results.md        # Test results and documentation
```

### Running Tests

- **Database Health Check Tests** (NEW):
  ```bash
  # Test database health checks and automatic setup
  ./test/test_db_health.sh
  ```
  Tests:
  - PostgreSQL connection validation
  - Automatic database creation
  - Schema application
  - Table existence validation
  - Error scenarios and fail-fast behavior

- **JMNS Service Tests** (GORM-based):

```bash
./test/test_jmns_service.sh  # Comprehensive test suite
```



- **Peer Registration**:

```bash
./test/test_register_peer.sh
```

- **IP Geolocation** (NEW):

```bash
./test/test_region_detection.sh  # Test IP geolocation functionality
```

- **Peer Directory v2** (NEW):

```bash
./test/test_peer_directory_v2.sh  # Test new normalized data model and features
./test/test_schema_migration.sh  # Test database schema migration
```

### Test Coverage

The JMNS service test suite covers:
- ✅ Health checks
- ✅ Peer registration and updates
- ✅ Alias creation and management
- ✅ IP geolocation and region detection
- ✅ Heartbeat functionality
- ✅ Batch operations
- ✅ Label filtering and pagination
- ✅ Error handling and validation
- ✅ **Neighbor management (NEW)**
- ✅ **Inactive peer reporting (NEW)**
- ✅ **Health check system (NEW)**
- ✅ **Data model normalization (NEW)**
- ✅ **Time window filtering (NEW)**
- ✅ **Database schema migration (NEW)**

## 🔧 Troubleshooting

### Common Issues & Solutions

#### **PostgreSQL Not Running**
```
ERROR: PostgreSQL is not running or not accessible
```
**Solution**: Start PostgreSQL service
```bash
# macOS with Homebrew
brew services start postgresql

# Linux with systemd
sudo systemctl start postgresql

# Docker
docker run --name postgres-jmns -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:15
```

#### **Database Permission Issues**
```
ERROR: failed to create database 'jmns': permission denied
```
**Solution**: Grant database creation privileges
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Grant privileges to your user
ALTER USER your_username CREATEDB;
```

#### **Schema Application Failed**
```
ERROR: failed to apply schema: syntax error in SQL
```
**Solution**: Check schema file syntax and permissions
```bash
# Verify schema file exists and is readable
ls -la sql/schema.sql

# Check file permissions
chmod 644 sql/schema.sql
```

#### **Service Won't Start**
```
ERROR: Database initialization failed
```
**Solution**: Check logs for specific error details
```bash
# Run with verbose logging
./jmns-service -pg-dsn="postgres://postgres:postgres@localhost:5432/jmns?sslmode=disable"
```

#### **Protobuf Field Errors**
```
ERROR: message type peerpb.DeleteAliasRequest has no known field named alias_name
```
**Solution**: Use correct field names in gRPC calls
```json
// Correct
{"alias": "alice.node.jmdt"}

// Incorrect
{"alias_name": "alice.node.jmdt"}
```

### Service Configuration

#### **Environment Variables**
```bash
# PostgreSQL connection
export PG_DSN="postgres://user:pass@host:port/dbname?sslmode=disable"

# Schema file path
export SCHEMA_PATH="/path/to/schema.sql"

# Start service
./jmns-service
```

#### **Command Line Options**
```bash
# Custom port
./jmns-service -port 8080

# Custom database
./jmns-service -pg-dsn "postgres://user:pass@host:port/custom_db?sslmode=disable"

# Custom schema path
./jmns-service -schema-path "/path/to/custom/schema.sql"
```

### Logging & Monitoring

The service provides detailed logging with status indicators:

```
Starting JMNS Service...
PostgreSQL DSN: postgres://postgres:postgres@localhost:5432/jmns?sslmode=disable
Schema path: sql/schema.sql
Performing database health checks...
✓ PostgreSQL connection successful
✓ Database 'jmns' exists
✓ Required tables exist
✓ Database initialization completed successfully
Creating GORM JMNS service...
Performing final database validation...
✓ Database validation successful
✓ Simple Peer Directory gRPC server starting on port 17002
✓ Local PeerID: 12D3KooW...
✓ Service ready to accept connections
```

## Local Redis Streams and Postgres

- Start Redis Streams microservice (in ../Redis-Streams):

```
./RDS.sh start
./RDS.sh run-microservice
```

- Ensure Postgres is reachable and PG_DSN is set before running consumers/exporters.
```