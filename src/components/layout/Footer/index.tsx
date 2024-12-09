// src/components/layout/Footer/index.tsx
import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-base-content/70">
            Built for Solana token management
          </p>
          <a
            href="https://github.com/nothingdao/solana-token-manager"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-base-content/70 hover:text-primary"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer >
  );
};
