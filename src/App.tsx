// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

import { MainLayout } from './components/layout/MainLayout'
import TokenDashboard from './components/token/management/TokenDashboard'
import { useWallet } from '@solana/wallet-adapter-react'
import * as React from 'react'
import { ExternalLink } from 'lucide-react'

// Token Components
import { TokenDetails } from './components/token/management/TokenDetails'
import { TokenMint } from './components/token/management/TokenMint'
import { TokenBurn } from './components/token/management/TokenBurn'
import { TokenTransfer } from './components/token/management/TokenTransfer'
import { AccountList } from './components/token/accounts/AccountList'
import TokenMetadata from './components/token/management/TokenMetadata'
import { TokenExtensions } from './components/token/extensions/TokenExtensions'


const HomePage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">spl-token</h1>
        <p className="text-lg">
          bla bla bla explain what this site/app is all about...
        </p>
      </section>

      <section className="bg-base-200 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Try It Out</h2>
        <p>
          Connect your wallet and visit the <a className="link" href="/dashboard">Dashboard</a> to start working on your spl-token.
        </p>
      </section>

      <section className="text-sm text-base-content/70">
        <p>
          View the full source code and documentation on{' '}
          <a
            href="https://github.com/nothingdao"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </section>
    </div >
  )
}

const AuthenticatedContent = () => {
  const { publicKey, connecting, disconnecting } = useWallet()

  if (connecting) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-200 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Connecting to Wallet...</h2>
          <p>Please approve the connection request in your wallet.</p>
        </div>
      </div>
    )
  }

  if (disconnecting) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-200 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Disconnecting...</h2>
          <p>Cleaning up your session.</p>
        </div>
      </div>
    )
  }

  if (!publicKey) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Wallet Required</h2>
          <p className="mb-4">
            Please connect your wallet using the button in the top right corner.
          </p>
          <p className="text-sm text-base-content/70">
            Don't have a Solana wallet?{' '}
            <a
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Get started with Phantom <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div >
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-base-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Welcome to the Dashboard!</h2>
        <p className="mb-4">
          Your wallet address is: <code className="bg-base-300 px-2 py-1 rounded">{publicKey.toBase58()}</code>
        </p>
        <div className="text-sm text-base-content/70">
          <p>
            Let's create an spl-token. Or, let's manage one. We need to look in your wallet to select the token if you already have one and want to manage it. Or, use the new token button to create a new token!
          </p>
        </div>
      </div>
    </div>
  )
}

export const App: React.FC = () => {
  const { publicKey } = useWallet()

  return (
    <Router>
      <Toaster
        position="bottom-left"      // position on screen
        expand={false}           // expand to show multiple toasts
        duration={6000}      // stays until dismissed
        closeButton             // adds a close button
        pauseWhenPageIsHidden   // pauses duration when tab is hidden
      />
      <Routes>
        <Route element={<MainLayout />}>  {/* Use MainLayout as wrapper route */}

          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<AuthenticatedContent />} />
          <Route path="/manage-token" element={<TokenDashboard />} />

          {/* New Token Routes */}
          <Route path="/tokens">
            <Route index element={<TokenDashboard />} />
            <Route path=":mintId">
              <Route index element={<TokenDetails />} />
              <Route path="mint" element={<TokenMint />} />
              <Route path="burn" element={<TokenBurn />} />
              <Route path="transfer" element={<TokenTransfer />} />
              <Route path="accounts" element={<AccountList />} />
              <Route path="metadata" element={<TokenMetadata />} /> {/* New route */}
              <Route path="extensions" element={<TokenExtensions />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
