// src/components/token/TokenActions.tsx
import React, { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';

interface TokenActionsProps {
  onTransfer: (recipient: string, amount: string) => Promise<void>;
  onBurn: (amount: string) => Promise<void>;
}

export const TokenActions: React.FC<TokenActionsProps> = ({ onTransfer, onBurn }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  return (
    <div className="space-y-4">
      <div className="bg-base-300 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Transfer Tokens</h3>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
        <button
          onClick={() => onTransfer(recipient, amount)}
          className="btn btn-primary w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Transfer
        </button>
      </div>

      <div className="bg-base-300 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Burn Tokens</h3>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
        <button
          onClick={() => onBurn(amount)}
          className="btn btn-error w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Burn
        </button>
      </div>
    </div>
  );
};
