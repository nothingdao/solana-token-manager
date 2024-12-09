// src/components/token/management/TokenMetadata/index.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  getMint,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID
} from '@solana/spl-token';
import {
  PublicKey,
  Transaction
} from '@solana/web3.js';
import { AlertCircle } from 'lucide-react';
import { showTokenNotification } from '../../../../utils/notifications';
// import {
//   createCreateMetadataInstruction,
//   createUpdateMetadataInstruction,
//   findMetadataPda,
//   METADATA_PROGRAM_ID
// } from '../../../../utils/metaplex';

interface TokenMetadata {
  name?: string;
  symbol?: string;
  uri?: string;
  updateAuthority?: string;
}

interface MetadataFormData {
  name: string;
  symbol: string;
  uri: string;
}

export const TokenMetadata = () => {
  const { mintId } = useParams();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isToken2022, setIsToken2022] = useState(false);
  const [formData, setFormData] = useState<MetadataFormData>({
    name: '',
    symbol: '',
    uri: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // const fetchMetadata = async () => {
  //   if (!mintId) return;

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const mintPubkey = new PublicKey(mintId);

  //     // Check token program type
  //     try {
  //       await getMint(connection, mintPubkey, undefined, TOKEN_2022_PROGRAM_ID);
  //       setIsToken2022(true);
  //     } catch {
  //       await getMint(connection, mintPubkey, undefined, TOKEN_PROGRAM_ID);
  //       setIsToken2022(false);
  //     }

  //     // Get Metaplex metadata
  //     const metadataPda = findMetadataPda(mintPubkey);
  //     const accountInfo = await connection.getAccountInfo(metadataPda);

  //     if (accountInfo?.data) {
  //       // Skip the metadata prefix (first byte is version)
  //       let offset = 1;

  //       // Get update authority
  //       const updateAuthority = new PublicKey(accountInfo.data.slice(offset, offset + 32)).toBase58();
  //       offset += 32;

  //       // Skip mint (we already have it)
  //       offset += 32;

  //       // Read name length and name
  //       const nameLength = accountInfo.data[offset];
  //       offset += 4;
  //       const name = accountInfo.data.slice(offset, offset + nameLength).toString('utf8').replace(/\0/g, '');
  //       offset += nameLength;

  //       // Read symbol length and symbol
  //       const symbolLength = accountInfo.data[offset];
  //       offset += 4;
  //       const symbol = accountInfo.data.slice(offset, offset + symbolLength).toString('utf8').replace(/\0/g, '');
  //       offset += symbolLength;

  //       // Read uri length and uri
  //       const uriLength = accountInfo.data[offset];
  //       offset += 4;
  //       const uri = accountInfo.data.slice(offset, offset + uriLength).toString('utf8').replace(/\0/g, '');

  //       const decodedMetadata = {
  //         name,
  //         symbol,
  //         uri,
  //         updateAuthority
  //       };

  //       setMetadata(decodedMetadata);
  //       setFormData({
  //         name: decodedMetadata.name || '',
  //         symbol: decodedMetadata.symbol || '',
  //         uri: decodedMetadata.uri || ''
  //       });
  //     }

  //   } catch (err) {
  //     console.error('Error fetching metadata:', err);
  //     setError(err instanceof Error ? err.message : 'Failed to fetch metadata');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchMetadata();
  // }, [mintId, connection]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!publicKey || !mintId) return;

  //   try {
  //     setLoading(true);
  //     const mintPubkey = new PublicKey(mintId);
  //     const metadataPda = findMetadataPda(mintPubkey);

  //     console.log('Creating transaction for:', {
  //       mintPubkey: mintPubkey.toBase58(),
  //       metadataPda: metadataPda.toBase58(),
  //       publicKey: publicKey.toBase58()
  //     });

  //     const transaction = new Transaction();

  //     // Get recent blockhash
  //     const latestBlockhash = await connection.getLatestBlockhash();
  //     transaction.recentBlockhash = latestBlockhash.blockhash;
  //     transaction.feePayer = publicKey;

  //     if (metadata) {
  //       // Update existing metadata
  //       console.log('Updating existing metadata');
  //       transaction.add(
  //         createUpdateMetadataInstruction(
  //           metadataPda,
  //           publicKey,
  //           formData.name,
  //           formData.symbol,
  //           formData.uri
  //         )
  //       );
  //     } else {
  //       // Create new metadata
  //       console.log('Creating new metadata');
  //       transaction.add(
  //         createCreateMetadataInstruction(
  //           metadataPda,
  //           mintPubkey,
  //           publicKey,
  //           publicKey,
  //           publicKey,
  //           formData.name,
  //           formData.symbol,
  //           formData.uri
  //         )
  //       );
  //     }

  //     console.log('Sending transaction...');
  //     await showTokenNotification.transaction(
  //       (async () => {
  //         const signature = await sendTransaction(transaction, connection);
  //         console.log('Transaction sent:', signature);

  //         const confirmation = await connection.confirmTransaction({
  //           signature,
  //           blockhash: latestBlockhash.blockhash,
  //           lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
  //         });
  //         console.log('Transaction confirmed:', confirmation);

  //         return { signature };
  //       })(),
  //       {
  //         loading: 'Creating metadata...',
  //         onSuccess: () => `Successfully ${metadata ? 'updated' : 'created'} metadata`
  //       }
  //     );

  //     setShowUpdateModal(false);
  //     fetchMetadata();
  //   } catch (err) {
  //     console.error('Error updating metadata:', err);
  //     showTokenNotification.error(err instanceof Error ? err.message : 'Failed to update metadata');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-base-200 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Token Metadata</h2>
            <p className="text-sm opacity-70">
              {isToken2022 ? 'Token-2022 Program' : 'SPL Token Program'}
            </p>
          </div>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="btn btn-primary"
          >
            {metadata ? 'Update Metadata' : 'Add Metadata'}
          </button>
        </div>

        {error ? (
          <div className="alert alert-error">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : metadata ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm opacity-70">Name</label>
              <p className="font-medium">{metadata.name}</p>
            </div>
            <div>
              <label className="text-sm opacity-70">Symbol</label>
              <p className="font-medium">{metadata.symbol}</p>
            </div>
            <div>
              <label className="text-sm opacity-70">URI</label>
              <p className="font-mono text-sm break-all">{metadata.uri}</p>
            </div>
            <div>
              <label className="text-sm opacity-70">Update Authority</label>
              <p className="font-mono text-sm break-all">{metadata.updateAuthority}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content/70">No metadata found for this token</p>
            <p className="text-sm mt-2 text-base-content/50">
              Click the button above to add metadata
            </p>
          </div>
        )}
      </div>

      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-200 p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {metadata ? 'Update Metadata' : 'Add Metadata'}
              </h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="btn btn-sm btn-ghost"
              >
                ×
              </button>
            </div>

            {/* <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Token Name"
                />
              </div>
              <div>
                <label className="label">Symbol</label>
                <input
                  name="symbol"
                  type="text"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="TKN"
                />
              </div>
              <div>
                <label className="label">URI</label>
                <input
                  name="uri"
                  type="text"
                  value={formData.uri}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://..."
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Save Metadata
              </button>
            </form> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenMetadata;
