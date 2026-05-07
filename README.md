# ZAYNAB Consensus Grading (ZCG)

A decentralized peer-review and reputation protocol built on Solana.

## Overview

ZAYNAB provides a trustless framework for academic and scholarly assessment. It leverages the speed and security of Solana to record assignments, peer reviews, and reputation scores in an immutable and transparent manner.

## Key Features

- **On-Chain Reputation**: Verified scholar identities and contribution history.
- **Peer Review Engine**: Automated consensus logic for assignment finalization.
- **Collaborative Research**: On-chain channels and invitations for scholarly cooperation.
- **Incentivized Accuracy**: Reputation rewards for consistent and high-quality peer reviews.

## Tech Stack

- **Smart Contract**: Rust / Anchor (Solana)
- **Frontend**: Next.js / TypeScript / Tailwind CSS (Brutalist Design)
- **State Management**: React Context + Anchor Client

## Getting Started

### Prerequisites

- Solana CLI
- Anchor CLI
- Node.js / pnpm

### Build & Test

```bash
# Build the program
anchor build

# Run tests
anchor test
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Security

The protocol implements strict authority checks and data validation to ensure the integrity of the grading process. Only authorized students can finalize their own assignments once consensus is reached.

## License

MIT
