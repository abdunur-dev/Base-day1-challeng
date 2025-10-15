# BaseHealth - Decentralized Health Records on Base

A decentralized health data locker that allows users to store encrypted medical record hashes securely on the Base blockchain and share access with healthcare providers.

## Features

- **Wallet Connection**: Connect with MetaMask or other Web3 wallets via ConnectKit
- **File Hashing**: Generate SHA-256 hashes of medical documents using Web Crypto API
- **Blockchain Storage**: Store record hashes on Base Sepolia testnet
- **Access Control**: Share and revoke access to records with healthcare providers
- **Transaction Tracking**: View all transactions on BaseScan explorer
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Web3**: wagmi, viem, ConnectKit
- **Blockchain**: Base Sepolia Testnet
- **Smart Contract**: Solidity ^0.8.0

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MetaMask or compatible Web3 wallet
- Base Sepolia testnet ETH (get from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### Installation

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## Smart Contract Deployment

### Deploy to Base Sepolia

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `BaseHealth.sol` and paste the contract code from `contracts/BaseHealth.sol`
3. Compile the contract (Solidity 0.8.0+)
4. Connect MetaMask to Base Sepolia network:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.basescan.org

5. Deploy the contract using "Injected Provider - MetaMask"
6. Copy the deployed contract address
7. Update `lib/contract.ts` with your contract address:

\`\`\`typescript
export const BASE_HEALTH_CONTRACT = {
  address: "0xYourContractAddressHere" as `0x${string}`,
  // ... rest of the config
}
\`\`\`

### Get Testnet ETH

Visit the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet) to get free testnet ETH for deployment and transactions.

## How It Works

1. **Connect Wallet**: Users connect their Web3 wallet to the dApp
2. **Upload File**: Select a medical document (PDF, image, etc.)
3. **Generate Hash**: The app generates a SHA-256 hash of the file locally
4. **Save to Blockchain**: The hash is stored on Base blockchain via smart contract
5. **Share Access**: Users can grant healthcare providers access to their records
6. **View Records**: All records are displayed with transaction links to BaseScan

## Smart Contract Functions

- `saveRecord(string _hash)`: Store a new health record hash
- `shareAccess(address _doctor)`: Grant access to a healthcare provider
- `revokeAccess(address _doctor)`: Revoke access from a provider
- `getRecords(address _patient)`: Retrieve all records (requires access)
- `hasAccess(address _patient, address _doctor)`: Check access status

## Environment Variables

Optional: Add a WalletConnect Project ID for better wallet support

\`\`\`env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
\`\`\`

Get your Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

## Demo Mode

The app works in demo mode without a deployed contract. To enable full blockchain functionality:

1. Deploy the smart contract to Base Sepolia
2. Update the contract address in `lib/contract.ts`
3. Ensure you have testnet ETH in your wallet

## Base Challenge Submission

**Project Name**: BaseHealth

**Category**: HealthTech / Web3 Data Privacy

**Description**: BaseHealth is a decentralized health record locker that allows users to store encrypted medical record hashes securely on the Base blockchain and share access with doctors. It empowers patients with full control over their health data while ensuring transparency and trust.

**Key Features**:
- Decentralized storage of medical record hashes
- Patient-controlled access management
- Transparent on-chain verification
- Privacy-preserving (only hashes stored, not actual data)
- Cross-border medical data portability

**Impact**: Solves the problem of medical data fragmentation and lack of patient control, especially important for patients traveling internationally or switching healthcare providers.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ on Base blockchain

