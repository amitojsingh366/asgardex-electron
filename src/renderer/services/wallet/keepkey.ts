import * as RD from '@devexperts/remote-data-ts'
import { Chain } from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/lib/function'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'

import { HWWalletErrorId, Network } from '../../../shared/api/types'
import { isError } from '../../../shared/utils/guard'
import { eqHWWalletAddressMap } from '../../helpers/fp/eq'
import { observableState } from '../../helpers/stateHelper'
import { INITIAL_LEDGER_ADDRESSES_MAP } from './const'
import {
  GetHWWalletAddressHandler,
  KeystoreState,
  KeystoreState$,
  HWWalletAddressesMap,
  HWWalletAddressLD,
  HWWalletAddressRD,
  KeepKeyService,
  VerifyHWWalletAddressHandler
} from './types'
import { hasImportedKeystore } from './util'

export const createKeepKeyService = ({ keystore$ }: { keystore$: KeystoreState$ }): KeepKeyService => {
  // State of all added KeepKey addresses
  const {
    get$: keepkeyAddresses$,
    get: keepkeyAddresses,
    set: setKeepKeyAddresses
  } = observableState<HWWalletAddressesMap>(INITIAL_LEDGER_ADDRESSES_MAP)

  const setHWWalletAddressRD = ({
    addressRD,
    chain,
    network
  }: {
    addressRD: HWWalletAddressRD
    chain: Chain
    network: Network
  }) => {
    const addresses = keepkeyAddresses()
    // TODO(@asgdx-team) Let's think about to use `immer` or similar library for deep, immutable state changes
    return setKeepKeyAddresses({ ...addresses, [chain]: { ...addresses[chain], [network]: addressRD } })
  }

  /**
   * Get keepkey address from memory
   */
  const getKeepKeyAddress$: GetHWWalletAddressHandler = (chain, network) =>
    FP.pipe(
      keepkeyAddresses$,
      RxOp.map((addressesMap) => addressesMap[chain]),
      RxOp.distinctUntilChanged(eqHWWalletAddressMap.equals),
      RxOp.map((addressMap) => addressMap[network])
    )

  const verifyKeepKeyAddress: VerifyHWWalletAddressHandler = async ({ chain, network, walletIndex }) =>
    window.apiHDWallet.verifyLedgerAddress({ chain, network, walletIndex })

  /**
   * Removes keepkey address from memory
   */
  const removeKeepKeyAddress = (chain: Chain, network: Network): void =>
    setHWWalletAddressRD({
      addressRD: RD.initial,
      chain,
      network
    })

  /**
   * Sets keepkey address in `pending` state
   */
  const setPendingKeepKeyAddress = (chain: Chain, network: Network): void =>
    setHWWalletAddressRD({
      addressRD: RD.pending,
      chain,
      network
    })

  /**
   * Ask Keepkey to get address from it
   */
  const askKeepKeyAddress$ = (chain: Chain, network: Network, walletIndex: number): HWWalletAddressLD =>
    FP.pipe(
      // remove address from memory
      removeKeepKeyAddress(chain, network),
      // set pending
      () => setPendingKeepKeyAddress(chain, network),
      // ask for keepkey address
      () => Rx.from(window.apiHDWallet.getKeepKeyAddress({ chain, network, walletIndex })),
      RxOp.map(RD.fromEither),
      // store address in memory
      RxOp.tap((addressRD: HWWalletAddressRD) => setHWWalletAddressRD({ chain, addressRD, network })),
      RxOp.catchError((error) =>
        Rx.of(
          RD.failure({
            errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
            msg: isError(error) ? error.toString() : `${error}`
          })
        )
      ),
      RxOp.startWith(RD.pending)
    )

  // Whenever keystore has been removed, reset all stored keepkey addresses
  const keystoreSub = keystore$.subscribe((keystoreState: KeystoreState) => {
    if (!hasImportedKeystore(keystoreState)) {
      setKeepKeyAddresses(INITIAL_LEDGER_ADDRESSES_MAP)
    }
  })

  const dispose = () => {
    keystoreSub.unsubscribe()
    setKeepKeyAddresses(INITIAL_LEDGER_ADDRESSES_MAP)
  }

  return {
    keepkeyAddresses$,
    askKeepKeyAddress$,
    getKeepKeyAddress$,
    verifyKeepKeyAddress,
    removeKeepKeyAddress,
    dispose
  }
}
