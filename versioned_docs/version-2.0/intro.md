---
id: intro
title: JMDT Docs
sidebar_label: Introduction
description: Introduction to JMDT — an Ethereum Layer 2 blockchain using Zero-Knowledge Proofs, Decentralized Identity (DID), and the AVC consensus algorithm for scalable, privacy-preserving decentralized applications.
keywords: [JMDT, Jupiter Meta Data Token, Ethereum Layer 2, Zero-Knowledge Proofs, Decentralized Identity, DID, AVC, zk-rollups, L2 blockchain, JMDN]
---

# Introduction

> **JMDT is the Truth Layer for all information** — restoring authenticity in digital infrastructure by privately verifying humans and decentralising their data.

## What is Jupiter Meta Data Token (JMDT)?

**Jupiter Meta Data Token (JMDT)** is a modular, Ethereum-based **Layer 2 (L2) blockchain protocol** designed to address the scalability, privacy, and compliance limitations of traditional blockchain systems.

Built with **Zero-Knowledge Proofs (ZKPs)**, **Decentralized Identity (DID)**, and the proprietary **Asynchronous Validation Consensus (AVC)**, JMDT delivers a high-performance, privacy-preserving infrastructure tailored for both decentralized applications and enterprise-grade solutions.

JMDT ships today as a two-layer system, with a third layer on the roadmap:

- **L2 Rollup Layer** — privacy-preserving execution with AVC consensus (design target: 2,000+ TPS)
- **L1 Finality Layer** — Ethereum anchoring and global settlement
- **L3 DAG Layer** *(planned)* — enterprise-grade, high-throughput data operations (design target: 10,000+ TPS); see the [roadmap](/docs/roadmap)

## Why Choose JMDT?

Conventional blockchains struggle with performance, privacy, and real-world compliance. JMDT addresses these through a tightly integrated architecture:

- **Zero-Knowledge Proofs (ZKPs):** Enabling identity verification, private transaction validation, and strong data privacy through trustless infrastructure. JMDT uses **zk-STARKs** via the **RISC Zero zkVM**, with ZK circuits authored in Rust for auditability and reproducibility.

- **Decentralized Identity (DID):** W3C-compliant, privacy-preserving authentication that verifies PII with on-chain records without accessing any personal information. Supports self-sovereign, enterprise-managed, and service-issued DIDs.

- **Layer 2 Scaling:** High-throughput zkRollup engine built using RISC Zero zkVM for verifiable Rust-based execution. Designed for faster settlements and large-scale concurrent transactions.

- **AVC Consensus:** JMDT's **Asynchronous Validation Consensus** delivers:
- Scalable and secure block finality via quorum-based buddy voting
- Energy-efficient operation by eliminating mining
- Low-latency, fault-tolerant propagation via Gossip Protocol
- Designed for compatibility with the planned DAG-based L3 enterprise extensions

- **Ethereum Interoperability:** Full EVM compatibility — deploy existing Ethereum smart contracts on JMDT without modification. Supports DeFi, NFT marketplaces, DAOs, and enterprise solutions.

- **Immutable Storage via immudb:** Tamper-proof, append-only audit trails across all data and DAG activity.

- **Privacy-Preserving Queries:** DID-based access with zk-proofed data capture — enabling GDPR-compliant data sharing without exposing sensitive details.

- **Enterprise Mesh Model** *(planned)*: Interoperable DAGs per organisation, enabling modular private ecosystems with shared L2 accountability — part of the L3 roadmap phase.

## Core Objectives

| Objective | Description |
|---|---|
| **Scalability** | Design targets: >2,000 TPS on L2 via zkRollups; 10K+ TPS via the planned L3 DAG |
| **Privacy** | End-to-end privacy via ZKPs and DID-based access controls |
| **Security** | zkVM-based execution, AVC consensus, and reputation-weighted validator accountability |
| **Interoperability** | Fully compatible with Ethereum and Web3 SDKs |
| **Efficiency** | Bloom Filters reduce propagation redundancy; zkRollups optimise gas fees for L1 finality |
| **Utility Token** | JMDT fuels transaction fees, network validation, DID operations, and L2 commitments |

## JMDT at a Glance

JMDT cryptographically verifies humans through its ecosystem without exposing their identity — empowering users to monetise authentic data they actually own, and giving enterprises a verifiable chain of custody from human consent to predictive insight.

→ [Explore the Architecture](/docs/architecture)
→ [Understand AVC Consensus](/docs/bft)
→ [Learn about Decentralised Identity](/docs/did)
→ [Read the ZK Proof System](/docs/zk)
→ [Start Building — Smart Contracts](/docs/smart-contract)
