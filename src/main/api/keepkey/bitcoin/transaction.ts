// import { broadcastTx, buildTx } from '@xchainjs/xchain-bitcoin'
// import { Address, FeeRate, TxHash } from '@xchainjs/xchain-client'
// import { BaseAmount } from '@xchainjs/xchain-util'
// import * as Bitcoin from 'bitcoinjs-lib'
// import * as E from 'fp-ts/lib/Either'

// import { getHaskoinBTCApiUrl } from '../../../../shared/api/haskoin'
// import { getSochainUrl } from '../../../../shared/api/sochain'
// import { HWWalletError, HWWalletErrorId, Network } from '../../../../shared/api/types'
// import { toClientNetwork } from '../../../../shared/utils/client'
// import { isError } from '../../../../shared/utils/guard'
// import { Client } from 'keepkey-sdk/lib/client'

// import { getDerivationPath } from './common'

// /**
//  * Sends BTC tx using Ledger
//  */
// export const send = async ({
//   network,
//   sender,
//   recipient,
//   amount,
//   feeRate,
//   memo,
//   walletIndex
// }: {
//   network: Network
//   sender?: Address
//   recipient: Address
//   amount: BaseAmount
//   feeRate: FeeRate
//   memo?: string
//   walletIndex: number
// }): Promise<E.Either<HWWalletError, TxHash>> => {
//   if (!sender) {
//     return E.left({
//       errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
//       msg: `Getting sender address using Ledger failed`
//     })
//   }

//   try {
//
//     const clientNetwork = toClientNetwork(network)
//     const derivePath = getDerivationPath(walletIndex, clientNetwork)

//     /**
//      * do not spend pending UTXOs when adding a memo
//      * https://github.com/xchainjs/xchainjs-lib/issues/330
//      *
//      * ^ Copied from `Client` (see https://github.com/xchainjs/xchainjs-lib/blob/27929b025151e3cf631862158f3f5f85dab68768/packages/xchain-bitcoin/src/client.ts#L303)
//      */
//     const spendPendingUTXO = !memo

//     const haskoinUrl = getHaskoinBTCApiUrl()[network]

//     const { psbt, utxos } = await buildTx({
//       amount,
//       recipient,
//       memo,
//       feeRate,
//       sender,
//       network: clientNetwork,
//       sochainUrl: getSochainUrl(),
//       haskoinUrl,
//       spendPendingUTXO,
//       withTxHex: true
//     })

//     const inputs: Array<[Bitcoin.Transaction, number, string | null, number | null]> = utxos.map(
//       ({ txHex, hash, index }) => {
//         if (!txHex) {
//           throw Error(`Missing 'txHex' for UTXO (txHash ${hash})`)
//         }
//         const utxoTx = Bitcoin.Transaction.fromHex(txHex)

//         return [utxoTx, index, null, null]
//       }
//     )

//     const associatedKeysets = inputs.map((_) => derivePath)

//     const newTxHex = psbt.data.globalMap.unsignedTx.toBuffer().toString('hex')

//     const outputScriptHex = serializeTransactionOutputs(newTx).toString('hex')

//     const txHex = await app.createPaymentTransactionNew({
//       inputs,
//       associatedKeysets,
//       outputScriptHex,
//       segwit: true,
//       useTrustedInputForSegwit: true,
//       additionals: ['bech32']
//     })
//     // const signedTx = await keepkey.BtcSignTx(null, {
//     //   inputs:[]
//     // })

//     const txHash = await broadcastTx({ txHex, haskoinUrl })

//     if (!txHash) {
//       return E.left({
//         errorId: HWWalletErrorId.INVALID_RESPONSE,
//         msg: `Post request to send BTC transaction using Ledger failed`
//       })
//     }
//     return E.right(txHash)
//   } catch (error) {
//     return E.left({
//       errorId: HWWalletErrorId.SEND_TX_FAILED,
//       msg: isError(error) ? error?.message ?? error.toString() : `${error}`
//     })
//   }
// }
