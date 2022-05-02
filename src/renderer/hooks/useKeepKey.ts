import { useCallback } from 'react'

import * as RD from '@devexperts/remote-data-ts'
import { Chain } from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/function'
import { useObservableState } from 'observable-hooks'
import * as RxOp from 'rxjs/operators'

import { useWalletContext } from '../contexts/WalletContext'
import { HWWalletAddressRD } from '../services/wallet/types'
import { useNetwork } from './useNetwork'

export const useKeepKey = (chain: Chain) => {
  const { network } = useNetwork()

  const { askKeepKeyAddress$, getKeepKeyAddress$, removeKeepKeyAddress } = useWalletContext()

  const removeAddress = useCallback(() => removeKeepKeyAddress(chain, network), [chain, removeKeepKeyAddress, network])

  const address = useObservableState<HWWalletAddressRD>(
    FP.pipe(getKeepKeyAddress$(chain, network), RxOp.shareReplay(1)),
    RD.initial
  )

  const askAddress = useCallback(
    (walletIndex: number) => {
      // Note: Subscription is needed to get all values
      // and to let `askKeepKeyAddressByChain` update state of `HWWalletAddressRD`
      // Check implementation of `askKeepKeyAddressByChain` in `src/renderer/services/wallet/keepkey.ts`
      const sub = askKeepKeyAddress$(chain, network, walletIndex).subscribe()
      return () => sub.unsubscribe()
    },
    [askKeepKeyAddress$, chain, network]
  )

  return {
    askAddress,
    removeAddress,
    address
  }
}
