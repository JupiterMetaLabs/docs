# DIDCreatorLite Service

`DIDCreatorLite.py` exposes a lightweight Flask API for creating, recovering, converting, and resolving Jupiter Meta DIDs. The sections below describe how the service works and how to integrate with each endpoint.

## Task Tracker
- [x] Document `DIDCreatorLite.py` behavior and endpoints

## Overview
- Flask API that issues and resolves Jupiter Meta DIDs.
- Depends on helper modules: `registerDID`, `ethDID`, and `grpcServices`.
- Exposes CORS with origins from `ALLOWED_ORIGINS` (defaults to `*`).
- Optional rate limit (default 5,000 requests per minute per IP) via the `rate_limit` decorator.
- Loads configuration from `.env`; `FLASK_DEBUG` controls debug mode.

## Running the Service
1. Install dependencies: `pip install -r requirements.txt`.
2. Configure environment variables (example in `.env`):
   - `ALLOWED_ORIGINS`
   - `FLASK_DEBUG`
   - Any values needed by `register_did` or `generate_eth_did`.
3. Start the API: `python DIDCreatorLite.py`. It listens on `0.0.0.0:5001`.

## Common Validations
- `validate_eth_address(address)`: ensures checksum-style `0x` prefixed 40 hex chars.
- `validate_network(network)`: must be one of `mainnet`, `testnet`, `metamask`, `superj`, `iskcon`, `iskconMayapur`, `superjMaster`, `sequencer`.
- `validate_mnemonic(mnemonic)`: checks English BIP-39 mnemonics.

## Endpoint Reference

### POST `/create_did`
Creates a brand-new DID by generating an Ethereum-style DID with `generate_eth_did`.

**Request body**
- `network` (optional, default `mainnet`): must pass `validate_network`.

**Response**
- `201` with `{ "did": "...", "eth_address": "...", "mnemonic": "...", ... }` from `generate_eth_did`.
- `400` on invalid network or missing payload.
- `500` if DID generation or registration fails (`register_did` invoked with DID and associated Ethereum address).

### POST `/recover_did`
Reconstructs the DID from a mnemonic for a given network.

**Request body**
- `mnemonic` (required): validated via `validate_mnemonic`.
- `network` (optional, default `mainnet`): validated network.

**Response**
- `201` with regenerated DID data after re-registering it.
- `400` if mnemonic or network invalid.
- `500` on internal errors.

### POST `/convertDID`
Creates a DID directly from an existing Ethereum wallet address.

**Request body**
- `wallet` (required): Ethereum address.
- `network` (optional, default `metamask`).

**Response**
- `200` with `{ "status": true, "didResponse": { ... } }` where `didResponse` is from `generate_did`.
- `400` if wallet or network invalid.
- `500` on internal errors.

### POST `/resolve_did`
Fetches on-chain/off-chain DID document data.

**Request body**
- `did` (required string).

**Response**
- `200` with lookup result from `get_did`.
- `400` if DID missing/invalid.
- `404` if `get_did` returns nothing.
- `500` on internal errors.

## Supporting Helpers
- `generate_did(network, account)`: builds `did:jmdt:{network}:{account[2:]}` then registers it with public key placeholder `"None"`. Used by `/convertDID`.
- `register_did` and `get_did` are imported from `registerDID.py` and handle persistence/lookup.

## Summary
Documented the DIDCreatorLite Flask service, covering setup requirements, validation logic, all four HTTP endpoints, and helper behavior for quick onboarding.

