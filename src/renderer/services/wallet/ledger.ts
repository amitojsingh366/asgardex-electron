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
  LedgerService,
  VerifyHWWalletAddressHandler
} from './types'
import { hasImportedKeystore } from './util'

export const createLedgerService = ({ keystore$ }: { keystore$: KeystoreState$ }): LedgerService => {
  // State of all added Ledger addresses
  const {
    get$: ledgerAddresses$,
    get: ledgerAddresses,
    set: setLedgerAddresses
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
    const addresses = ledgerAddresses()
    // TODO(@asgdx-team) Let's think about to use `immer` or similar library for deep, immutable state changes
    return setLedgerAddresses({ ...addresses, [chain]: { ...addresses[chain], [network]: addressRD } })
  }

  /**
   * Get ledger address from memory
   */
  const getLedgerAddress$: GetHWWalletAddressHandler = (chain, network) =>
    FP.pipe(
      ledgerAddresses$,
      RxOp.map((addressesMap) => addressesMap[chain]),
      RxOp.distinctUntilChanged(eqHWWalletAddressMap.equals),
      RxOp.map((addressMap) => addressMap[network])
    )

  const verifyLedgerAddress: VerifyHWWalletAddressHandler = async ({ chain, network, walletIndex }) =>
    window.apiHDWallet.verifyLedgerAddress({ chain, network, walletIndex })

  /**
   * Removes ledger address from memory
   */
  const removeLedgerAddress = (chain: Chain, network: Network): void =>
    setHWWalletAddressRD({
      addressRD: RD.initial,
      chain,
      network
    })

  /**
   * Sets ledger address in `pending` state
   */
  const setPendingLedgerAddress = (chain: Chain, network: Network): void =>
    setHWWalletAddressRD({
      addressRD: RD.pending,
      chain,
      network
    })

  /**
   * Ask Ledger to get address from it
   */
  const askLedgerAddress$ = (chain: Chain, network: Network, walletIndex: number): HWWalletAddressLD =>
    FP.pipe(
      // remove address from memory
      removeLedgerAddress(chain, network),
      // set pending
      () => setPendingLedgerAddress(chain, network),
      // ask for ledger address
      () => Rx.from(window.apiHDWallet.getLedgerAddress({ chain, network, walletIndex })),
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

  // Whenever keystore has been removed, reset all stored ledger addresses
  const keystoreSub = keystore$.subscribe((keystoreState: KeystoreState) => {
    if (!hasImportedKeystore(keystoreState)) {
      setLedgerAddresses(INITIAL_LEDGER_ADDRESSES_MAP)
    }
  })

  const dispose = () => {
    keystoreSub.unsubscribe()
    setLedgerAddresses(INITIAL_LEDGER_ADDRESSES_MAP)
  }

  return {
    ledgerAddresses$,
    askLedgerAddress$,
    getLedgerAddress$,
    verifyLedgerAddress,
    removeLedgerAddress,
    dispose
  }
}
