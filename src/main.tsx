// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './App'
import { WalletContextProvider } from './contexts/WalletContext'
import { StyleProvider } from './contexts/StyleContext'

// Add Buffer polyfill
import { Buffer } from 'buffer';
window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyleProvider>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </StyleProvider>
  </React.StrictMode>
)
