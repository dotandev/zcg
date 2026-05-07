# Access and Run Instructions for ZCG

## GitHub Repository
All code, including recent security fixes and cleanups, is available at:
https://github.com/dotandev/zcg

## Local Setup and Build Instructions

### 1. Smart Contract (Solana/Anchor)
Ensure you have the Solana CLI and Anchor CLI installed.

```bash
# Clone the repository
git clone https://github.com/dotandev/zcg.git
cd zcg

# Build the program
anchor build

# (Optional) Run tests to verify the protocol logic
anchor test
```

### 2. Frontend Application (Next.js)
The frontend provides a dashboard for scholars to interact with the protocol.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```
Once started, the application will be accessible at http://localhost:3000.

## Key Access Details
- Cluster: The project is currently configured for Devnet in Anchor.toml.
- Program ID: DUeqKHA2PZ3y4QBmJJstxYkWLZR15rLB9jxPNN12H3FH
- Wallet: The frontend requires a Solana browser wallet connected to Devnet to perform actions.

## What is Included
- Reputation Dashboard: View your scholarly trust score.
- Assignment Submission: Publish links to your research for peer review.
- Review Terminal: Interactive console for providing grades and comments.
- On-Chain Finalization: Secure mechanism for closing assignments once consensus is reached.
