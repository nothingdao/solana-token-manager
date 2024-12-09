// src/components/token/management/TokenTransfer/index.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

export const TokenTransfer = () => {
  const { mintId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transfer Tokens</h2>
      </div>

      <div className="bg-base-200 rounded-lg p-6">
        <p className="text-base-content/70">
          Transfer interface for token: {mintId}
        </p>
      </div>
    </div>
  );
};

export default TokenTransfer;
