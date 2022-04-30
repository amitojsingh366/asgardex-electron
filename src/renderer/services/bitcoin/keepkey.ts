import * as RD from '@devexperts/remote-data-ts'
import { BTCChain } from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/lib/function'
import * as Rx from 'rxjs'
import { catchError, map, startWith } from 'rxjs/operators'

import { Network } from '../../../shared/api/types'
import { observableState } from '../../helpers/stateHelper'
import { HWWalletAddressRD } from '../wallet/types'
import { KeepKeyService } from './types'

const { get$: keepkeyAddress$, set: setKeepKeyAddressRD } = observableState<HWWalletAddressRD>(RD.initial)

const retrieveKeepKeyAddress = (network: Network, walletIndex: number) =>
  FP.pipe(
    Rx.from(window.apiHDWallet.getKeepKeyAddress({ chain: BTCChain, network, walletIndex })),
    map(RD.fromEither),
    startWith(RD.pending),
    catchError((error) => Rx.of(RD.failure(error)))
  ).subscribe(setKeepKeyAddressRD)

export const createKeepKeyService = (): KeepKeyService => ({
  keepkeyAddress$,
  retrieveKeepKeyAddress,
  removeKeepKeyAddress: () => setKeepKeyAddressRD(RD.initial)
})
