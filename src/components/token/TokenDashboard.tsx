// src/components/token/TokenDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, getMint, type Mint } from '@solana/spl-token'; import { Connection, PublicKey } from '@solana/web3.js';
import { RefreshCw } from 'lucide-react';
import { TokenMint } from './TokenMint';
import { TokenInfo as TokenInfoDisplay } from './TokenInfo';
import { TokenActions } from './TokenActions';
import { TokenInfo } from './types';

const getUserTokens = async (
  connection: Connection,
  userPublicKey: PublicKey
): Promise<{ address: string; info: Mint }[]> => {

  try {
    // Get all token accounts owned by the user
    const accounts = await connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: [
          {
            dataSize: 82  // Size of mint account data
          },
          {
            memcmp: {
              offset: 4,  // Offset of mint authority data
              bytes: userPublicKey.toBase58()
            }
          }
        ]
      }
    );

    // Get mint info for each token
    const tokens = await Promise.all(
      accounts.map(async (account) => {
        const mintInfo = await getMint(connection, account.pubkey);
        return {
          address: account.pubkey.toBase58(),
          info: mintInfo
        };
      })
    );

    return tokens;

  } catch (error) {
    console.error('Error fetching user tokens:', error);
    return [];
  }
};

export const TokenDashboard = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [mintAddress, setMintAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMintForm, setShowMintForm] = useState(false);
  const [userTokens, setUserTokens] = useState<{ address: string; info: Mint }[]>([]);


  useEffect(() => {
    if (publicKey && connection) {
      const fetchUserTokens = async () => {
        const tokens = await getUserTokens(connection, publicKey);
        setUserTokens(tokens);
      };

      fetchUserTokens();
    }
  }, [publicKey, connection]);

  const fetchTokenInfo = async (address: string) => {
    try {
      setLoading(true);
      const mint = await getMint(connection, new PublicKey(address));

      setTokenInfo({
        address,
        decimals: mint.decimals,
        supply: mint.supply.toString(),
        mintAuthority: mint.mintAuthority?.toBase58() || null,
        freezeAuthority: mint.freezeAuthority?.toBase58() || null
      });
    } catch (error) {
      console.error('Error fetching token info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (recipient: string, amount: string) => {
    // Your existing transfer logic
  };

  const handleBurn = async (amount: string) => {
    // Your existing burn logic
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <section className="bg-base-200 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Token Dashboard</h2>
          <button
            onClick={() => setShowMintForm(!showMintForm)}
            className="btn btn-primary"
          >
            {showMintForm ? 'Cancel' : 'Create New Token'}
          </button>
        </div>

        {showMintForm ? (
          <TokenMint
            onSuccess={(address) => {
              setMintAddress(address);
              fetchTokenInfo(address);
              setShowMintForm(false);
            }}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4">
              <select
                value={mintAddress}
                onChange={(e) => {
                  setMintAddress(e.target.value);
                  if (e.target.value) {
                    fetchTokenInfo(e.target.value);
                  }
                }}
                className="select select-bordered flex-1"
              >
                <option value="">Select a token or enter address</option>
                {userTokens.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.address} (Decimals: {token.info.decimals})
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or enter token mint address"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                className="input input-bordered flex-1"
              />
              <button
                onClick={() => mintAddress && fetchTokenInfo(mintAddress)}
                disabled={loading || !mintAddress}
                className="btn btn-square btn-primary"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {tokenInfo && (
              <>
                <TokenInfoDisplay tokenInfo={tokenInfo} />
                <TokenActions
                  onTransfer={handleTransfer}
                  onBurn={handleBurn}
                />
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default TokenDashboard;
