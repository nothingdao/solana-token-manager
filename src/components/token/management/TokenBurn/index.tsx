// src/components/token/management/TokenBurn/index.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getMint, createBurnInstruction, getAssociatedTokenAddress, getAccount, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import { AlertCircle } from 'lucide-react';
import { showTokenNotification } from '../../../../utils/notifications';

export const TokenBurn = () => {
  const { mintId } = useParams();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decimals, setDecimals] = useState(0);
  const [maxBurn, setMaxBurn] = useState<number>(0);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!mintId || !publicKey) return;
      try {
        const mint = await getMint(
          connection,
          new PublicKey(mintId),
          undefined,
          TOKEN_2022_PROGRAM_ID
        );
        setDecimals(mint.decimals);

        const associatedToken = await getAssociatedTokenAddress(
          new PublicKey(mintId),
          publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );

        const tokenAccount = await getAccount(
          connection,
          associatedToken,
          undefined,
          TOKEN_2022_PROGRAM_ID
        );

        setMaxBurn(Number(tokenAccount.amount) / Math.pow(10, mint.decimals));
      } catch (err) {
        console.error('Error fetching token info:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token info';
        setError(errorMessage);
      }
    };

    fetchTokenInfo();
  }, [mintId, connection, publicKey]);

  const handleBurn = async (e: React.FormEvent) => {
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
        createBurnInstruction(
          associatedToken,
          mintPubkey,
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

          // Update maxBurn after successful burn
          const updatedTokenAccount = await getAccount(
            connection,
            associatedToken,
            undefined,
            TOKEN_2022_PROGRAM_ID
          );
          setMaxBurn(Number(updatedTokenAccount.amount) / Math.pow(10, decimals));

          return { signature };
        })(),
        {
          loading: 'Please sign burn transaction...',
          onSuccess: () => `Successfully burned ${amount} tokens`
        }
      );

      setAmount('');
    } catch (err) {
      console.error('Error burning tokens:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to burn tokens';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleBurn} className="space-y-6">
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="label">Amount to Burn</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="input input-bordered w-full"
              required
              min="0"
              max={maxBurn}
              step="any"
            />
            {maxBurn > 0 && (
              <p className="text-sm mt-1 opacity-70">
                Maximum amount: {maxBurn}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !amount || Number(amount) > maxBurn}
            className="btn btn-primary w-full"
          >
            {loading ? 'Burning...' : 'Burn Tokens'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TokenBurn;
