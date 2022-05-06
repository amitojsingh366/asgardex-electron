/* eslint-disable @typescript-eslint/no-unused-vars */
import { TxHash } from '@xchainjs/xchain-client'
import * as E from 'fp-ts/Either'

import { ipcHDWalletDepositTxParams, IPCLedgerSendTxParams } from '../../../shared/api/io'
import { HWWalletError, HWWalletErrorId } from '../../../shared/api/types'
import { isError } from '../../../shared/utils/guard'
import { getKeepKeyClient } from './client'

export const sendTx = async ({
  chain,
  network,
  sender,
  recipient,
  amount,
  asset,
  feeAsset,
  memo,
  feeRate,
  walletIndex
}: IPCLedgerSendTxParams): Promise<E.Either<HWWalletError, TxHash>> => {
  try {
    const keepkey = await getKeepKeyClient()
    let res: E.Either<HWWalletError, string>
    switch (chain) {
      default:
        res = E.left({
          errorId: HWWalletErrorId.NOT_IMPLEMENTED,
          msg: `'sendTx' for ${chain} has not been implemented`
        })
    }
    return res
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.SEND_TX_FAILED,
      msg: isError(error) ? error?.message ?? error.toString() : `${error}`
    })
  }
}

export const deposit = async ({
  chain,
  network,
  amount,
  memo,
  walletIndex
}: ipcHDWalletDepositTxParams): Promise<E.Either<HWWalletError, TxHash>> => {
  try {
    const keepkey = await getKeepKeyClient()
    let res: E.Either<HWWalletError, string>
    switch (chain) {
      default:
        res = E.left({
          errorId: HWWalletErrorId.NOT_IMPLEMENTED,
          msg: `'deposit' for ${chain} has not been implemented`
        })
    }
    return res
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.SEND_TX_FAILED,
      msg: isError(error) ? error?.message ?? error.toString() : `${error}`
    })
  }
}
