// src/components/token/TokenDashboard/index.tsx
import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getMint, type Mint } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { RefreshCw, Plus } from 'lucide-react';
import { TokenCreate } from '../../creation/TokenCreateForm';
import { useNavigate } from 'react-router-dom';

const HELIUS_API_KEY = 'de157aa3-5580-4245-8190-d94722fbbec5';

const getAssetsByAuthority = async (
  connection: Connection,
  userPublicKey: PublicKey
): Promise<{ address: string; info: Mint }[]> => {
  try {
    const response = await fetch('https://devnet.helius-rpc.com/?api-key=' + HELIUS_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByAuthority',
        params: {
          authorityAddress: userPublicKey.toBase58(),
          page: 1,
          limit: 1000
        },
      }),
    });

    const { result } = await response.json();
    console.log("Assets by Authority: ", result);

    const tokens = await Promise.all(
      result.items.map(async (asset: any) => {
        const mintAddress = new PublicKey(asset.id);
        const mintInfo = await getMint(connection, mintAddress);
        return {
          address: mintAddress.toBase58(),
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
  const [mintAddress, setMintAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMintForm, setShowMintForm] = useState(false);
  const [userTokens, setUserTokens] = useState<{ address: string; info: Mint }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (publicKey && connection) {
      const fetchUserTokens = async () => {
        const tokens = await getAssetsByAuthority(connection, publicKey);
        setUserTokens(tokens);
      };

      fetchUserTokens();
    }
  }, [publicKey, connection]);

  const handleMintAddressSubmit = async (address: string) => {
    try {
      setLoading(true);
      await getMint(connection, new PublicKey(address));
      navigate(`/tokens/${address}`);
    } catch (error) {
      console.error('Error verifying token:', error);
    } finally {
      setLoading(false);
    }
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
            {showMintForm ? (
              'Cancel'
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create New Token
              </>
            )}
          </button>
        </div>

        {showMintForm ? (
          <TokenCreate
            onSuccess={(address) => {
              setShowMintForm(false);
              navigate(`/tokens/${address}`);
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
                    navigate(`/tokens/${e.target.value}`);
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
                onClick={() => mintAddress && handleMintAddressSubmit(mintAddress)}
                disabled={loading || !mintAddress}
                className="btn btn-square btn-primary"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default TokenDashboard;
