import * as RD from '@devexperts/remote-data-ts'
import { TxParams } from '@xchainjs/xchain-client'
import { BNBChain } from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/lib/function'
import * as Rx from 'rxjs'
import { catchError, map, startWith } from 'rxjs/operators'

import { HWWalletError, HWWalletErrorId, LedgerBNBTxParams, Network } from '../../../shared/api/types'
import { isError } from '../../../shared/utils/guard'
import { observableState } from '../../helpers/stateHelper'
import { HWWalletAddressRD, LedgerTxHashLD, LedgerTxHashRD } from '../wallet/types'
import { KeepKeyService } from './types'

const { get$: keepkeyAddress$, set: setKeepKeyAddressRD } = observableState<HWWalletAddressRD>(RD.initial)

const retrieveKeepKeyAddress = (network: Network, walletIndex: number) =>
  FP.pipe(
    Rx.from(window.apiHDWallet.getKeepKeyAddress({ chain: BNBChain, network, walletIndex })),
    map(RD.fromEither),
    startWith(RD.pending),
    catchError((error) =>
      Rx.of(
        RD.failure<HWWalletError>({
          errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
          msg: isError(error) ? error.toString() : `${error}`
        })
      )
    )
  ).subscribe((v) => setKeepKeyAddressRD(v))

const { get$: keepkeyTxRD$, set: setKeepKeyTxRD } = observableState<LedgerTxHashRD>(RD.initial)

const keepkeyTx$ = (network: Network, params: TxParams): LedgerTxHashLD =>
  Rx.of(
    RD.failure({
      errorId: HWWalletErrorId.SEND_TX_FAILED,
      msg: `Not implemented for BNB ${network} ${params}`
    })
  )

const pushKeepKeyTx = (network: Network, params: LedgerBNBTxParams): Rx.Subscription =>
  keepkeyTx$(network, params).subscribe(setKeepKeyTxRD)

export const createKeepKeyService = (): KeepKeyService => ({
  keepkeyAddress$,
  retrieveKeepKeyAddress,
  removeKeepKeyAddress: () => setKeepKeyAddressRD(RD.initial),
  keepkeyTxRD$,
  pushKeepKeyTx,
  resetKeepKeyTx: () => setKeepKeyTxRD(RD.initial)
})
