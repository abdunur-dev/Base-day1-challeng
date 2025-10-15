# BaseHealth Deployment Guide

Complete guide to deploy BaseHealth smart contract and dApp to production.

## Part 1: Smart Contract Deployment

### Step 1: Prepare Your Wallet

1. Install MetaMask browser extension
2. Create or import a wallet
3. Switch to Base Sepolia testnet:
   - Network Name: **Base Sepolia**
   - RPC URL: **https://sepolia.base.org**
   - Chain ID: **84532**
   - Currency Symbol: **ETH**
   - Block Explorer: **https://sepolia.basescan.org**

### Step 2: Get Testnet ETH

1. Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Connect your wallet
3. Request testnet ETH (you'll need ~0.01 ETH for deployment)

### Step 3: Deploy Contract via Remix

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `BaseHealth.sol`
3. Copy contract code from `contracts/BaseHealth.sol`
4. Go to "Solidity Compiler" tab:
   - Select compiler version: **0.8.0** or higher
   - Click "Compile BaseHealth.sol"
5. Go to "Deploy & Run Transactions" tab:
   - Environment: **Injected Provider - MetaMask**
   - Confirm MetaMask is connected to Base Sepolia
   - Click **Deploy**
   - Confirm transaction in MetaMask
6. Wait for deployment confirmation
7. **Copy the contract address** from the deployed contract

### Step 4: Verify Contract (Optional but Recommended)

1. Go to [BaseScan Sepolia](https://sepolia.basescan.org/)
2. Search for your contract address
3. Click "Contract" tab → "Verify and Publish"
4. Fill in:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: Match your Remix version
   - License: MIT
5. Paste your contract code
6. Click "Verify and Publish"

## Part 2: Configure dApp

### Step 1: Update Contract Address

Edit `lib/contract.ts`:

\`\`\`typescript
export const BASE_HEALTH_CONTRACT = {
  address: "0xYOUR_DEPLOYED_CONTRACT_ADDRESS" as `0x${string}`,
  // ... rest stays the same
}
\`\`\`

### Step 2: Test Locally

\`\`\`bash
npm run dev
\`\`\`

1. Open http://localhost:3000
2. Connect your wallet
3. Upload a test file
4. Verify transaction on BaseScan

### Step 3: Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variable (optional):
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
6. Click **Deploy**

## Part 3: Production Deployment (Mainnet)

### When Ready for Mainnet

1. Switch to **Base Mainnet**:
   - Network Name: **Base**
   - RPC URL: **https://mainnet.base.org**
   - Chain ID: **8453**
   - Currency Symbol: **ETH**
   - Block Explorer: **https://basescan.org**

2. Get real ETH on Base:
   - Bridge from Ethereum mainnet via [Base Bridge](https://bridge.base.org/)
   - Or buy directly on exchanges that support Base

3. Deploy contract to Base Mainnet (same steps as testnet)

4. Update `lib/contract.ts` with mainnet address

5. Update `app/providers.tsx`:
\`\`\`typescript
import { base } from "wagmi/chains" // Change from baseSepolia

const config = createConfig(
  getDefaultConfig({
    chains: [base], // Use mainnet
    // ... rest of config
  })
)
\`\`\`

6. Update `app/page.tsx` - replace all `baseSepolia` with `base`

## Testing Checklist

- [ ] Wallet connects successfully
- [ ] File upload generates hash
- [ ] Transaction sends to blockchain
- [ ] Record appears in "Stored Records"
- [ ] Transaction link opens BaseScan
- [ ] Share access function works
- [ ] Records persist after page refresh (from blockchain)
- [ ] Mobile responsive design works

## Troubleshooting

### "Transaction Failed"
- Check you have enough ETH for gas
- Verify contract address is correct
- Ensure you're on the right network

### "Cannot Read Contract"
- Contract address might be wrong
- Network mismatch (check you're on Base Sepolia)
- Contract not deployed yet

### "Wallet Won't Connect"
- Clear browser cache
- Try different wallet
- Check MetaMask is unlocked

## Cost Estimates

### Base Sepolia (Testnet)
- Deployment: ~0.005 ETH (FREE testnet ETH)
- Save Record: ~0.0001 ETH per transaction
- Share Access: ~0.00008 ETH per transaction

### Base Mainnet (Production)
- Deployment: ~$2-5 USD
- Save Record: ~$0.10-0.30 per transaction
- Share Access: ~$0.08-0.25 per transaction

*Costs vary based on network congestion*

## Security Notes

1. **Never store actual medical data on-chain** - only hashes
2. **Encrypt files before hashing** for additional security
3. **Use HTTPS** in production
4. **Audit smart contract** before mainnet deployment
5. **Implement rate limiting** to prevent spam
6. **Add access logs** for compliance

## Next Steps

1. Deploy to testnet and test thoroughly
2. Get feedback from beta users
3. Audit smart contract
4. Deploy to mainnet
5. Submit to Base Challenge
6. Market to healthcare providers

---

Need help? Open an issue on GitHub or reach out to the Base community on Discord.
