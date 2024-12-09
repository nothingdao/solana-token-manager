// src/components/token/TokenInfo.tsx
import React from 'react';
import { TokenInfo as TokenInfoType } from '../../../../types/token'

interface TokenInfoProps {
  tokenInfo: TokenInfoType;
}

export const TokenInfo: React.FC<TokenInfoProps> = ({ tokenInfo }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-base-300 p-4 rounded-lg">
          <h3 className="text-sm opacity-70">Supply</h3>
          <p className="text-lg font-mono">
            {(Number(tokenInfo.supply) / Math.pow(10, tokenInfo.decimals)).toLocaleString()}
          </p>
        </div>
        <div className="bg-base-300 p-4 rounded-lg">
          <h3 className="text-sm opacity-70">Decimals</h3>
          <p className="text-lg font-mono">{tokenInfo.decimals}</p>
        </div>
      </div>
    </div>
  );
};
