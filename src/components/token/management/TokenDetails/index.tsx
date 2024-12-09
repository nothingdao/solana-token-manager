// src/components/token/management/TokenDetails/index.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection } from '@solana/wallet-adapter-react';
import {
  getMint,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID
} from '@solana/spl-token';
import {
  PublicKey,
  TokenAccountBalancePair
} from '@solana/web3.js';
import { AlertCircle } from 'lucide-react';

const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

interface TokenMetadata {
  name?: string;
  symbol?: string;
  uri?: string;
  updateAuthority?: string;
}

interface TokenInfo {
  address: string;
  programId: PublicKey;
  supply: bigint;
  decimals: number;
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
  isInitialized: boolean;
  metadata?: TokenMetadata;
  largestAccounts?: TokenAccountBalancePair[];
}

const findMetadataPda = async (mint: PublicKey): Promise<PublicKey> => {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );
  return pda;
};

export const TokenDetails = () => {
  const { mintId } = useParams();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!mintId) return;

      try {
        setLoading(true);
        setError(null);
        const mintPubkey = new PublicKey(mintId);

        // Try Token-2022 first, fall back to regular SPL Token
        let mint;
        let programId = TOKEN_2022_PROGRAM_ID;
        try {
          mint = await getMint(connection, mintPubkey, undefined, TOKEN_2022_PROGRAM_ID);
        } catch {
          programId = TOKEN_PROGRAM_ID;
          mint = await getMint(connection, mintPubkey, undefined, TOKEN_PROGRAM_ID);
        }

        // Get largest token accounts
        const largestAccounts = await connection.getTokenLargestAccounts(mintPubkey);

        // Try to get metadata
        let metadata: TokenMetadata | undefined;
        try {
          const metadataPda = await findMetadataPda(mintPubkey);
          console.log('Metadata PDA:', metadataPda.toBase58());

          const accountInfo = await connection.getAccountInfo(metadataPda);
          console.log('Account Info:', accountInfo);

          if (accountInfo && accountInfo.data) {
            console.log('Metadata account data:', accountInfo.data);

            // Skip the metadata prefix (first byte is version)
            let offset = 1;

            // Get update authority
            const updateAuthority = new PublicKey(accountInfo.data.slice(offset, offset + 32)).toBase58();
            offset += 32;

            // Skip mint (we already have it)
            offset += 32;

            // Read name length and name
            const nameLength = accountInfo.data[offset];
            offset += 4;
            const name = accountInfo.data.slice(offset, offset + nameLength).toString('utf8').replace(/\0/g, '');
            offset += nameLength;

            // Read symbol length and symbol
            const symbolLength = accountInfo.data[offset];
            offset += 4;
            const symbol = accountInfo.data.slice(offset, offset + symbolLength).toString('utf8').replace(/\0/g, '');
            offset += symbolLength;

            // Read uri length and uri
            const uriLength = accountInfo.data[offset];
            offset += 4;
            const uri = accountInfo.data.slice(offset, offset + uriLength).toString('utf8').replace(/\0/g, '');

            metadata = {
              name,
              symbol,
              uri,
              updateAuthority
            };
          }
        } catch (e) {
          console.log('No metadata found:', e);
        }

        setTokenInfo({
          address: mintId,
          programId,
          supply: mint.supply,
          decimals: mint.decimals,
          mintAuthority: mint.mintAuthority,
          freezeAuthority: mint.freezeAuthority,
          isInitialized: mint.isInitialized,
          metadata,
          largestAccounts: largestAccounts.value,
        });

      } catch (err) {
        console.error('Error fetching token info:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch token info');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenInfo();
  }, [mintId, connection]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  if (error || !tokenInfo) {
    return (
      <div className="alert alert-error">
        <AlertCircle className="w-4 h-4" />
        <span>{error || 'Failed to load token information'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Program Type */}
      <div className="bg-base-200 p-4 rounded-lg">
        <h3 className="text-sm opacity-70">Token Program</h3>
        <p className="font-mono text-sm">
          {tokenInfo.programId.equals(TOKEN_2022_PROGRAM_ID) ? 'Token-2022' : 'SPL Token'}
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-sm opacity-70">Supply</h3>
          <p className="font-mono text-sm">
            {(Number(tokenInfo.supply) / Math.pow(10, tokenInfo.decimals)).toLocaleString()}
          </p>
        </div>

        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-sm opacity-70">Decimals</h3>
          <p className="font-mono text-sm">{tokenInfo.decimals}</p>
        </div>
      </div>

      {/* Metadata Section - Always Show */}
      <div className="bg-base-200 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="">Metadata</h3>
          <button className="btn btn-sm btn-primary">
            {tokenInfo.metadata ? 'Update Metadata' : 'Add Metadata'}
          </button>
        </div>

        {tokenInfo.metadata ? (
          <div className="space-y-2">
            {tokenInfo.metadata.name && (
              <div>
                <span className="text-sm opacity-70">Name:</span>
                <p>{tokenInfo.metadata.name}</p>
              </div>
            )}
            {tokenInfo.metadata.symbol && (
              <div>
                <span className="text-sm opacity-70">Symbol:</span>
                <p>{tokenInfo.metadata.symbol}</p>
              </div>
            )}
            {tokenInfo.metadata.updateAuthority && (
              <div>
                <span className="text-sm opacity-70">Update Authority:</span>
                <p className="font-mono break-all">{tokenInfo.metadata.updateAuthority}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-base-content/70">No metadata found</p>
        )}
      </div>

      {/* Authorities */}
      <div className="bg-base-200 p-4 rounded-lg space-y-4">
        <h3 className="mb-4">Authority</h3>
        <div>
          <h3 className="text-sm opacity-70">Mint Authority</h3>
          <p className="font-mono text-sm break-all">
            {tokenInfo.mintAuthority?.toBase58() || 'Disabled'}
          </p>
        </div>

        <div>
          <h3 className="text-sm opacity-70">Freeze Authority</h3>
          <p className="text-sm font-mono break-all">
            {tokenInfo.freezeAuthority?.toBase58() || 'Disabled'}
          </p>
        </div>
      </div>

      {/* Largest Holders */}
      {tokenInfo.largestAccounts && tokenInfo.largestAccounts.length > 0 && (
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="mb-4">Largest Holders</h3>
          <div className="space-y-2">
            {tokenInfo.largestAccounts.map((account) => (
              <div key={account.address.toBase58()} className="flex justify-between items-center">
                <span className="font-mono text-sm">{account.address.toBase58()}</span>
                <span className="font-mono text-sm">
                  {(Number(account.amount) / Math.pow(10, tokenInfo.decimals)).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token Address */}
      <div className="bg-base-200 p-4 rounded-lg">
        <h3 className="text-sm opacity-70">Token Address</h3>
        <p className="text-sm font-mono break-all">{tokenInfo.address}</p>
      </div>
    </div>
  );
};

export default TokenDetails;
