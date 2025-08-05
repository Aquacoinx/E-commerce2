import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'viem/chains'

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// 2. Create wagmiConfig
const metadata = {
  name: 'AquaStore',
  description: 'Decentralized E-commerce Platform',
  url: 'https://aquastore.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, polygon, arbitrum]
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains
})

// Utility functions for Web3 operations
export const web3Utils = {
  formatAddress: (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },

  formatEther: (value) => {
    // Convert wei to ether and format
    const ether = parseFloat(value) / 1e18
    return ether.toFixed(4)
  },

  validateAddress: (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }
}