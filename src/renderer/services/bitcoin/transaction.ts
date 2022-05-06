import * as RD from '@devexperts/remote-data-ts'
import { TxHash } from '@xchainjs/xchain-client'
import { AssetBTC, BTCChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/lib/Either'
import * as FP from 'fp-ts/lib/function'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'

import { IPCLedgerSendTxParams, ipcHDWalletSendTxParamsIO } from '../../../shared/api/io'
import { HWWalletError, Network } from '../../../shared/api/types'
import { isKeepKeyWallet, isLedgerWallet } from '../../../shared/utils/guard'
import { Network$ } from '../app/types'
import * as C from '../clients'
import { TxHashLD, ErrorId } from '../wallet/types'
import { Client$, SendTxParams } from './types'
import { TransactionService } from './types'

export const createTransactionService = (client$: Client$, network$: Network$): TransactionService => {
  const common = C.createTransactionService(client$)

  const sendHWWalletTx = ({
    network,
    params,
    type
  }: {
    network: Network
    params: SendTxParams
    type: 'keepkey' | 'ledger'
  }): TxHashLD => {
    const { amount, sender, recipient, memo, walletIndex, feeRate } = params
    const sendHWWalletTxParams: IPCLedgerSendTxParams = {
      chain: BTCChain,
      asset: AssetBTC,
      feeAsset: undefined,
      network,
      amount,
      sender,
      feeRate,
      recipient,
      memo,
      walletIndex
    }
    const encoded = ipcHDWalletSendTxParamsIO.encode(sendHWWalletTxParams)

    return FP.pipe(
      Rx.from(
        type === 'keepkey' ? window.apiHDWallet.sendKeepKeyTx(encoded) : window.apiHDWallet.sendLedgerTx(encoded)
      ),
      RxOp.switchMap(
        FP.flow(
          E.fold<HWWalletError, TxHash, TxHashLD>(
            ({ msg }) =>
              Rx.of(
                RD.failure({
                  errorId: type === 'keepkey' ? ErrorId.SEND_KEEPKEY_TX : ErrorId.SEND_LEDGER_TX,
                  msg: `Sending ${type === 'keepkey' ? 'KeepKey' : 'Ledger'} BTC tx failed. (${msg})`
                })
              ),
            (txHash) => Rx.of(RD.success(txHash))
          )
        )
      ),
      RxOp.startWith(RD.pending)
    )
  }
  const sendTx = (params: SendTxParams): TxHashLD =>
    FP.pipe(
      network$,
      RxOp.switchMap((network) => {
        if (isKeepKeyWallet(params.walletType)) return sendHWWalletTx({ network, params, type: 'keepkey' })
        if (isLedgerWallet(params.walletType)) return sendHWWalletTx({ network, params, type: 'ledger' })

        return common.sendTx(params)
      })
    )

  return {
    ...common,
    sendTx
  }
}
