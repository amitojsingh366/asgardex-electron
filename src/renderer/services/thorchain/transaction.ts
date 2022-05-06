import * as RD from '@devexperts/remote-data-ts'
import { TxHash } from '@xchainjs/xchain-client'
import { DepositParam } from '@xchainjs/xchain-thorchain'
import { THORChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/lib/Either'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'

import {
  ipcHDWalletDepositTxParams,
  ipcHDWalletDepositTxParamsIO,
  IPCLedgerSendTxParams,
  ipcHDWalletSendTxParamsIO
} from '../../../shared/api/io'
import { HWWalletError, Network } from '../../../shared/api/types'
import { isKeepKeyWallet, isLedgerWallet } from '../../../shared/utils/guard'
import { WalletType } from '../../../shared/wallet/types'
import { retryRequest } from '../../helpers/rx/retryRequest'
import { Network$ } from '../app/types'
import * as C from '../clients'
import { TxHashLD, ErrorId } from '../wallet/types'
import { Client$, SendTxParams } from './types'
import { TransactionService } from './types'

export const createTransactionService = (client$: Client$, network$: Network$): TransactionService => {
  const common = C.createTransactionService(client$)

  const depositHWWalletTx = ({
    network,
    params,
    type
  }: {
    network: Network
    params: DepositParam & { walletIndex: number /* override walletIndex of DepositParam to avoid 'undefined' */ }
    type: 'keepkey' | 'ledger'
  }) => {
    const depositHWWalletTxParams: ipcHDWalletDepositTxParams = {
      chain: THORChain,
      network,
      asset: params.asset,
      amount: params.amount,
      memo: params.memo,
      walletIndex: params.walletIndex
    }
    const encoded = ipcHDWalletDepositTxParamsIO.encode(depositHWWalletTxParams)

    return FP.pipe(
      Rx.from(
        type === 'keepkey' ? window.apiHDWallet.depositKeepKeyTx(encoded) : window.apiHDWallet.depositLedgerTx(encoded)
      ),
      RxOp.switchMap(
        FP.flow(
          E.fold<HWWalletError, TxHash, TxHashLD>(
            ({ msg }) =>
              Rx.of(
                RD.failure({
                  errorId: type === 'keepkey' ? ErrorId.DEPOSIT_KEEPKEY_TX_ERROR : ErrorId.DEPOSIT_LEDGER_TX_ERROR,
                  msg: `Deposit ${type === 'keepkey' ? 'KeepKey' : 'Ledger'} THOR tx failed. (${msg})`
                })
              ),
            (txHash) => Rx.of(RD.success(txHash))
          )
        )
      ),
      RxOp.startWith(RD.pending)
    )
  }

  /**
   * Sends a deposit request by given `DepositParam`
   */
  const depositTx = (params: DepositParam): TxHashLD =>
    client$.pipe(
      RxOp.switchMap((oClient) =>
        FP.pipe(
          oClient,
          O.fold(
            () => Rx.EMPTY,
            (client) => Rx.of(client)
          )
        )
      ),
      RxOp.switchMap((client) => Rx.from(client.deposit(params))),
      RxOp.map(RD.success),
      RxOp.retryWhen(retryRequest({ maxRetry: 3, scalingDuration: 1000 /* 1 sec. */ })),
      RxOp.catchError(
        (e): TxHashLD =>
          Rx.of(
            RD.failure({
              msg: e.toString(),
              errorId: ErrorId.SEND_TX
            })
          )
      ),
      RxOp.startWith(RD.pending)
    )

  const sendPoolTx = ({
    walletType,
    walletIndex,
    asset,
    amount,
    memo
  }: DepositParam & {
    walletType: WalletType
    walletIndex: number /* override walletIndex of DepositParam to avoid 'undefined' */
  }) =>
    FP.pipe(
      network$,
      RxOp.switchMap((network) => {
        if (isKeepKeyWallet(walletType))
          return depositHWWalletTx({ network, params: { walletIndex, asset, amount, memo }, type: 'keepkey' })
        if (isLedgerWallet(walletType))
          return depositHWWalletTx({ network, params: { walletIndex, asset, amount, memo }, type: 'ledger' })

        return depositTx({ walletIndex, asset, amount, memo })
      })
    )

  const sendHWWalletTx = ({
    network,
    params,
    type
  }: {
    network: Network
    params: SendTxParams
    type: 'keepkey' | 'ledger'
  }) => {
    const sendHWWalletTxParams: IPCLedgerSendTxParams = {
      chain: THORChain,
      network,
      asset: params.asset,
      feeAsset: undefined,
      amount: params.amount,
      sender: params.sender,
      recipient: params.recipient,
      memo: params.memo,
      walletIndex: params.walletIndex,
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
                  msg: `Sending ${type === 'keepkey' ? 'KeepKey' : 'Ledger'} THOR tx failed. (${msg})`
                })
              ),
            (txHash) => Rx.of(RD.success(txHash))
          )
        )
      ),
      RxOp.startWith(RD.pending)
    )
  }

  const sendTx = (params: SendTxParams) =>
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
    sendTx,
    sendPoolTx$: sendPoolTx
  }
}
