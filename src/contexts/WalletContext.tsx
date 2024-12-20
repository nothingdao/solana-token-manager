import React, { FC, useMemo, ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'

interface WalletContextProviderProps {
  children: ReactNode
  network?: WalletAdapterNetwork
  endpoint?: string
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
  endpoint = clusterApiUrl(WalletAdapterNetwork.Devnet)
}) => {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect
      >
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
