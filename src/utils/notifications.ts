// src/utils/notifications.ts
import { toast } from 'sonner'

interface TokenAmount {
  amount: string
  decimals: number
}

export const formatAmount = (amount: string, decimals: number): string => {
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export const showTokenNotification = {
  // Keep existing notification methods
  creation: (data: {
    signature: string
    mintAddress: string
    decimals: number
    initialSupply: string
  }) => {
    toast.success('Token Created Successfully', {
      description: `Created token with initial supply of ${formatAmount(
        data.initialSupply,
        data.decimals
      )}`,
      action: {
        label: 'View Transaction',
        onClick: () =>
          window.open(
            `https://solscan.io/tx/${data.signature}?cluster=devnet`,
            '_blank'
          ),
      },
    })
  },

  mint: (data: {
    signature: string
    mintAddress: string
    amount: string
    decimals: number
  }) => {
    toast.success('Tokens Minted Successfully', {
      description: `Minted ${formatAmount(data.amount, data.decimals)} tokens`,
      action: {
        label: 'View Transaction',
        onClick: () =>
          window.open(
            `https://solscan.io/tx/${data.signature}?cluster=devnet`,
            '_blank'
          ),
      },
    })
  },

  burn: (data: {
    signature: string
    mintAddress: string
    amount: string
    decimals: number
  }) => {
    toast.success('Tokens Burned Successfully', {
      description: `Burned ${formatAmount(data.amount, data.decimals)} tokens`,
      action: {
        label: 'View Transaction',
        onClick: () =>
          window.open(
            `https://solscan.io/tx/${data.signature}?cluster=devnet`,
            '_blank'
          ),
      },
    })
  },

  error: (message: string) => {
    toast.error('Transaction Failed', {
      description: message,
    })
  },

  // Add new promise-based transaction notification
  // Add to your existing notifications.ts
  transaction: async <T extends { signature: string }>(
    promise: Promise<T>,
    {
      loading = 'Please sign the transaction...',
      onSuccess,
    }: {
      loading?: string
      onSuccess?: (data: T) => string
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success: (data) =>
        onSuccess ? onSuccess(data) : 'Transaction successful',
      error: (err) =>
        err instanceof Error ? err.message : 'Transaction failed',
    })
  },
}
