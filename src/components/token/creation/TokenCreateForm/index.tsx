// src/components/token/creation/TokenCreateForm/index.tsx
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as token from '@solana/spl-token';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl
} from '@solana/web3.js';
import { AlertCircle } from 'lucide-react';
import { showTokenNotification } from '../../../../utils/notifications';

interface TokenCreateProps {
  onSuccess: (mintAddress: string) => void;
}

interface MintFormData {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  mintAuthority: 'self' | 'custom' | 'disable';
  customMintAuthority: string;
  freezeAuthority: 'self' | 'custom' | 'disable';
  customFreezeAuthority: string;
}

export const TokenCreate: React.FC<TokenCreateProps> = ({ onSuccess }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enforce devnet
  React.useEffect(() => {
    if (connection.rpcEndpoint !== clusterApiUrl('devnet')) {
      setError('Please connect to Devnet to use this application');
    } else {
      setError(null);
    }
  }, [connection.rpcEndpoint]);

  const [formData, setFormData] = useState<MintFormData>({
    name: '',
    symbol: '',
    decimals: 9,
    initialSupply: '0',
    mintAuthority: 'self',
    customMintAuthority: '',
    freezeAuthority: 'self',
    customFreezeAuthority: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMintAuthority = (): PublicKey | null => {
    if (!publicKey) return null;
    switch (formData.mintAuthority) {
      case 'self':
        return publicKey;
      case 'custom':
        try {
          return new PublicKey(formData.customMintAuthority);
        } catch {
          throw new Error('Invalid mint authority address');
        }
      case 'disable':
        return null;
      default:
        return publicKey;
    }
  };

  const getFreezeAuthority = (): PublicKey | null => {
    if (!publicKey) return null;
    switch (formData.freezeAuthority) {
      case 'self':
        return publicKey;
      case 'custom':
        try {
          return new PublicKey(formData.customFreezeAuthority);
        } catch {
          throw new Error('Invalid freeze authority address');
        }
      case 'disable':
        return null;
      default:
        return publicKey;
    }
  };

  const createToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formData.name.trim()) throw new Error('Token name is required');
      if (!formData.symbol.trim()) throw new Error('Token symbol is required');
      if (formData.decimals < 0 || formData.decimals > 9) throw new Error('Decimals must be between 0 and 9');

      // Create mint account
      const mintKeypair = Keypair.generate();
      console.log('Creating mint:', mintKeypair.publicKey.toBase58());

      const mintAuthority = getMintAuthority();
      const freezeAuthority = getFreezeAuthority();

      const mintRent = await token.getMinimumBalanceForRentExemptMint(connection);

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: token.MINT_SIZE,
          lamports: mintRent,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        token.createInitializeMint2Instruction(
          mintKeypair.publicKey,
          formData.decimals,
          mintAuthority || publicKey,
          freezeAuthority,
          TOKEN_2022_PROGRAM_ID // Pass the token-2022 program ID
        )
      );

      // If initial supply > 0, ensure ATAs are created using the 2022 methods
      if (Number(formData.initialSupply) > 0) {
        const associatedToken = await token.getAssociatedTokenAddress(
          mintKeypair.publicKey,
          publicKey,
          false, // Don't force legacy
          TOKEN_2022_PROGRAM_ID // Specify token-2022 program
        );

        transaction.add(
          token.createAssociatedTokenAccountInstruction(
            publicKey,
            associatedToken,
            publicKey,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID
          ),
          token.createMintToInstruction(
            mintKeypair.publicKey,
            associatedToken,
            mintAuthority || publicKey,
            BigInt(Number(formData.initialSupply) * Math.pow(10, formData.decimals)),
            [],
            TOKEN_2022_PROGRAM_ID // Pass the token-2022 program ID
          )
        );
      }

      const signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });
      console.log('Token Creation Transaction:', {
        signature,
        mintAddress: mintKeypair.publicKey.toBase58(),
        decimals: formData.decimals,
        initialSupply: formData.initialSupply
      });

      await connection.confirmTransaction({
        signature,
        blockhash: (await connection.getLatestBlockhash()).blockhash,
        lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
      });

      showTokenNotification.creation({
        signature,
        mintAddress: mintKeypair.publicKey.toBase58(),
        decimals: formData.decimals,
        initialSupply: formData.initialSupply
      });

      onSuccess(mintKeypair.publicKey.toBase58());
    } catch (err) {
      console.error('Error creating token:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create token';
      showTokenNotification.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={createToken} className="space-y-6">
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-base-200 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-bold">Token Details</h2>

        <div className="space-y-4">
          <div>
            <label className="label">Token Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="My Token"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              placeholder="TKN"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">Decimals</label>
            <input
              type="number"
              name="decimals"
              value={formData.decimals}
              onChange={handleInputChange}
              min="0"
              max="9"
              className="input input-bordered w-full"
              required
            />
            <p className="text-sm opacity-70 mt-1">
              Number of decimal places (0-9). Standard tokens use 9.
            </p>
          </div>

          <div>
            <label className="label">Initial Supply</label>
            <input
              type="text"
              name="initialSupply"
              value={formData.initialSupply}
              onChange={handleInputChange}
              placeholder="0"
              className="input input-bordered w-full"
            />
            <p className="text-sm opacity-70 mt-1">
              Initial amount to mint. You can mint more later if mint authority is enabled.
            </p>
          </div>
        </div>
      </div>

      {/* Authority Settings */}
      <div className="bg-base-200 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-bold">Authority Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="label">Mint Authority</label>
            <select
              name="mintAuthority"
              value={formData.mintAuthority}
              onChange={handleInputChange}
              className="select select-bordered w-full"
            >
              <option value="self">Keep mint authority (recommended)</option>
              <option value="custom">Use custom address</option>
              <option value="disable">Disable mint authority</option>
            </select>

            {formData.mintAuthority === 'custom' && (
              <input
                type="text"
                name="customMintAuthority"
                value={formData.customMintAuthority}
                onChange={handleInputChange}
                placeholder="Custom mint authority address"
                className="input input-bordered w-full mt-2"
              />
            )}
          </div>

          <div>
            <label className="label">Freeze Authority</label>
            <select
              name="freezeAuthority"
              value={formData.freezeAuthority}
              onChange={handleInputChange}
              className="select select-bordered w-full"
            >
              <option value="self">Keep freeze authority</option>
              <option value="custom">Use custom address</option>
              <option value="disable">Disable freeze authority</option>
            </select>

            {formData.freezeAuthority === 'custom' && (
              <input
                type="text"
                name="customFreezeAuthority"
                value={formData.customFreezeAuthority}
                onChange={handleInputChange}
                placeholder="Custom freeze authority address"
                className="input input-bordered w-full mt-2"
              />
            )}
          </div>
        </div>
      </div>

      {/* Token Metadata */}
      {/* <div className="bg-base-200 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-bold">Token Metadata</h2>

        <div className="space-y-4">
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter token description"
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div>
            <label className="label">Logo URL</label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">External URL</label>
            <input
              type="url"
              name="externalUrl"
              value={formData.externalUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/token"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">Metadata Storage</label>
            <select
              name="metadataStorage"
              value={formData.metadataStorage}
              onChange={handleInputChange}
              className="select select-bordered w-full"
            >
              <option value="on-chain">On-chain</option>
              <option value="arweave">Arweave</option>
            </select>
          </div>
        </div>
      </div> */}

      <button
        type="submit"
        disabled={loading || !publicKey || !!error}
        className="btn btn-primary w-full"
      >
        {loading ? 'Creating Token...' : 'Create Token'}
      </button>
    </form>
  );
};
