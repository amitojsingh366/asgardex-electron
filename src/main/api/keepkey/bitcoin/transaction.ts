// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { broadcastTx, buildTx } from '@xchainjs/xchain-bitcoin'
import { Address, FeeRate, TxHash } from '@xchainjs/xchain-client'
import { BaseAmount } from '@xchainjs/xchain-util'
import axios from 'axios'
import * as E from 'fp-ts/lib/Either'
import { Client } from 'keepkey-sdk/lib/client'

import { getHaskoinBTCApiUrl } from '../../../../shared/api/haskoin'
import { getSochainUrl } from '../../../../shared/api/sochain'
import { HWWalletError, HWWalletErrorId, Network } from '../../../../shared/api/types'
import { toClientNetwork } from '../../../../shared/utils/client'
import { isError } from '../../../../shared/utils/guard'
import { getDerivationPath } from './common'

/**
 * Sends BTC tx using Ledger
 */
export const send = async ({
  keepkey,
  network,
  sender,
  recipient,
  amount,
  feeRate,
  memo,
  walletIndex
}: {
  keepkey: Client
  network: Network
  sender?: Address
  recipient: Address
  amount: BaseAmount
  feeRate: FeeRate
  memo?: string
  walletIndex: number
}): Promise<E.Either<HWWalletError, TxHash>> => {
  if (!sender) {
    return E.left({
      errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
      msg: `Getting sender address using Ledger failed`
    })
  }

  try {
    const clientNetwork = toClientNetwork(network)
    const derivePath = getDerivationPath(walletIndex, clientNetwork)

    /**
     * do not spend pending UTXOs when adding a memo
     * https://github.com/xchainjs/xchainjs-lib/issues/330
     *
     * ^ Copied from `Client` (see https://github.com/xchainjs/xchainjs-lib/blob/27929b025151e3cf631862158f3f5f85dab68768/packages/xchain-bitcoin/src/client.ts#L303)
     */
    const spendPendingUTXO = !memo

    const haskoinUrl = getHaskoinBTCApiUrl()[network]

    const { utxos, psbt } = await buildTx({
      amount,
      recipient,
      memo,
      feeRate,
      sender,
      network: clientNetwork,
      sochainUrl: getSochainUrl(),
      haskoinUrl,
      spendPendingUTXO,
      withTxHex: true
    })

    const inputs = utxos.map(async ({ txHex, hash }) => {
      const txQuery = await axios.get(`https://api.bitcoin.shapeshift.com/api/v1/transaction/${hash}`)
      return {
        addressNList: derivePath,
        scriptType: 'p2pkh',
        amount: amount.amount().toString(),
        vout: 1,
        txid: hash,
        tx: txQuery.data,
        txHex
      }
    })

    const outputs = [
      {
        address: recipient,
        addressType: 'spend',
        scriptType: 'p2pkh',
        amount: amount.minus(10000).amount().toString(),
        opReturnData: Buffer.from(memo, 'utf-8')
      }
    ]

    const signedTx = await keepkey.BtcSignTx(null, {
      coin: 'Bitcoin',
      inputs: inputs,
      outputs: outputs,
      version: 1,
      locktime: 0,
      opReturnData: memo
    })

    console.log(utxos, psbt, inputs, outputs, signedTx)

    // const txHash = await broadcastTx({ txHex: signedTx.data.serializedTx, haskoinUrl })

    // if (!txHash) {
    //   return E.left({
    //     errorId: HWWalletErrorId.INVALID_RESPONSE,
    //     msg: `Post request to send BTC transaction using Ledger failed`
    //   })
    // }
    return E.right('txHash')
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.SEND_TX_FAILED,
      msg: isError(error) ? error?.message ?? error.toString() : `${error}`
    })
  }
}
