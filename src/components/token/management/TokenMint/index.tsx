// src/components/token/management/TokenMint/index.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getMint, createMintToInstruction, getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import { AlertCircle } from 'lucide-react';
import { showTokenNotification } from '../../../../utils/notifications';

export const TokenMint = () => {
  const { mintId } = useParams();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decimals, setDecimals] = useState(0);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!mintId) return;
      try {
        const mint = await getMint(connection, new PublicKey(mintId), undefined, TOKEN_2022_PROGRAM_ID);
        setDecimals(mint.decimals);
      } catch (err) {
        console.error('Error fetching token info:', err);
      }
    };

    fetchTokenInfo();
  }, [mintId, connection]);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !mintId || !amount) return;

    try {
      setLoading(true);
      setError(null);

      const mintPubkey = new PublicKey(mintId);
      const associatedToken = await getAssociatedTokenAddress(
        mintPubkey,
        publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      const transaction = new Transaction().add(
        createMintToInstruction(
          mintPubkey,
          associatedToken,
          publicKey,
          BigInt(Number(amount) * Math.pow(10, decimals)),
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

      await showTokenNotification.transaction(
        (async () => {
          const signature = await sendTransaction(transaction, connection);
          await connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          });
          return { signature };
        })(),
        {
          loading: 'Please sign mint transaction...',
          onSuccess: () => `Successfully minted ${amount} tokens`
        }
      );

      setAmount('');
    } catch (err) {
      console.error('Error minting tokens:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint tokens';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleMint} className="space-y-6">
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="label">Amount to Mint</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="input input-bordered w-full"
              required
              min="0"
              step="any"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !amount}
            className="btn btn-primary w-full"
          >
            {loading ? 'Minting...' : 'Mint Tokens'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TokenMint;
