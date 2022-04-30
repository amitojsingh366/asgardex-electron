import * as RD from '@devexperts/remote-data-ts'
import { BNBChain } from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/lib/function'
import * as Rx from 'rxjs'
import { catchError, map, startWith } from 'rxjs/operators'

import { HWWalletError, HWWalletErrorId, Network } from '../../../shared/api/types'
import { isError } from '../../../shared/utils/guard'
import { observableState } from '../../helpers/stateHelper'
import { HWWalletAddressRD } from '../wallet/types'
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

export const createKeepKeyService = (): KeepKeyService => ({
  keepkeyAddress$,
  retrieveKeepKeyAddress,
  removeKeepKeyAddress: () => setKeepKeyAddressRD(RD.initial)
})
