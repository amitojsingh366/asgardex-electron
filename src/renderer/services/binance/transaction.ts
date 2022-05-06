import * as RD from '@devexperts/remote-data-ts'
import { TxHash } from '@xchainjs/xchain-client'
import { AssetBNB, BNBChain } from '@xchainjs/xchain-util'
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
    const { asset, amount, sender, recipient, memo, walletIndex } = params
    const sendHWWalletTxParams: IPCLedgerSendTxParams = {
      chain: BNBChain,
      network,
      asset,
      feeAsset: undefined,
      amount,
      sender,
      recipient,
      memo,
      walletIndex,
      feeRate: NaN
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
                  msg: `Sending ${type === 'keepkey' ? 'KeepKey' : 'Ledger'} ${
                    sendHWWalletTxParams.asset?.symbol ?? AssetBNB.symbol
                  } tx failed. (${msg})`
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
