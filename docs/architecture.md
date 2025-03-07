---
id: architecture
title: Three-Layer Architecture
sidebar_label: Architecture
---
# Architecture

## **JupiterMetaZK Architecture Overview**

ZKJM's architecture is structured around key components that ensure **scalability, security, and privacy**:


```mermaid
graph TD
    %% Layer 1 Ethereum
     subgraph L1["**Layer 1 - Ethereum**"]
     class L1 blueBox;
     A1["Ethereum Mainnet"]
	   A2["Ethereum Smart Contracts"]
	   A2 -->|Commits ZK Proofs| A1
	   end
	   style L1 fill:#ADD8EA,stroke:#000,stroke-width:2px;
	   

    %% Layer 2 ZKJM
    subgraph L2["**JupiterMetaZK**"]
    B1["JupiterMetaZK Core"]
    B2["ZK-Rollups"]
    B3["NNSS Consensus"]
    B4["DID Authentication"]
    B5["Immutable Ledger"]
    B6["Mining"]
    B7["ZKJM Token Accounts"]
    end
    style L2 fill:#FFEEFF,stroke:#000,stroke-width:2px;
    

    B1 ---->|Layer 2 Roll Ups| L1
    B1 <--> B2
    B2 <--> B3
    B4 <--> B3
    B1 <--> B4
    B1 <--> B5
    B5 <-->|Validation| B3
    B5 --> |New Block| B6
    B6 --> |New Tokens| B7

    %% Layer 3 Enterprise DAG
    subgraph L3["**L3 Enterprise Private DAG**"]
    C1["Enterprise DAG"]
    C2["Private DAG Transactions"]
    C3["ZK-Proof Generation"]
    C4["L2 Commitment of ZK State Changes"]
    C5["Enterprise dApp"]
    end
    style L3 fill:#C0FFC0,stroke:#000,stroke-width:2px;

    C1 --> C2
    C2 --> C3
    C3 -->|State Proofs| C4
    C4 --->|Commits to L2| L2
    C5 <--> C1

    %% Additional Interactions
    subgraph L4["**Use Cases**"]
    D1["L2 Web3 dApps <br> & Services"]
    D2["DeFi"]
    D3["Marketplaces"]
    D4["Identity <br>Solutions"]
    D5["Web3 Gaming"]
    D6["Agentic AI <br>Solutions"]
    D7["Telecom"]
		end
		style L4 fill:#FFEE90,stroke:#000,stroke-width:2px;
    
    L4 <---> B1
    ```
  
### **Key Layers**

#### 1️⃣ **Enterprise Layer**
- **Handles User & Client Interactions**
- Provides Decentralized Identity (DID)-based Authentication
- Secure Onboarding for Enterprises and dApps

#### 2️⃣ **Chain Layer**
- Processes **ZK-Rollups for scalability**
- Implements **NNSS Consensus** for synchronization
- Generates **Zero-Knowledge Proofs (ZKPs)** for privacy

#### 3️⃣ **Bridge Layer**
- Commits transactions to **Ethereum (L1)** for finality
- Ensures seamless **cross-chain interoperability**
- Supports **multi-chain extensions** for Rubix, Solana, and other L1s

<!-- [Explore Layer 2 Scaling →](./zk-rollups.md)  -->
    
    