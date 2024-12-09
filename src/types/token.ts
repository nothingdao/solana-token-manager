// src/components/token/types.ts
export interface TokenInfo {
  address: string
  decimals: number
  supply: string
  mintAuthority: string | null
  freezeAuthority: string | null
}
