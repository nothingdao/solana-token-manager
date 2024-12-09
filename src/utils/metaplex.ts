// src/utils/metaplex.ts
// import {
//   createCreateMetadataAccountV3Instruction,
//   createUpdateMetadataAccountV2Instruction,
//   DataV2,
//   PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
// } from '@metaplex-foundation/mpl-token-metadata'
import { PublicKey } from '@solana/web3.js'

export const findMetadataPda = (mint: PublicKey): PublicKey => {
//   const [pda] = PublicKey.findProgramAddressSync(
//     [
//       Buffer.from('metadata'),
//       TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//       mint.toBuffer(),
//     ],
//     TOKEN_METADATA_PROGRAM_ID
//   )
//   return pda
// }

// export {
//   createCreateMetadataAccountV3Instruction,
//   createUpdateMetadataAccountV2Instruction,
//   DataV2,
//   TOKEN_METADATA_PROGRAM_ID,
// }
