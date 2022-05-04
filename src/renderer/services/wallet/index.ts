import { network$ } from '../app/service'
import { createBalancesService } from './balances'
import { setSelectedAsset, selectedAsset$, client$ } from './common'
import { createKeepKeyService } from './keepkey'
import { keystoreService, removeKeystore } from './keystore'
import { createLedgerService } from './ledger'
import { getTxs$, loadTxs, explorerUrl$, resetTxsPage } from './transaction'

const { askLedgerAddress$, getLedgerAddress$, verifyLedgerAddress, removeLedgerAddress, ledgerAddresses$ } =
  createLedgerService({
    keystore$: keystoreService.keystore$
  })

const { keepkeyAddresses$, askKeepKeyAddress$, getKeepKeyAddress$, verifyKeepKeyAddress, removeKeepKeyAddress } =
  createKeepKeyService({
    keystore$: keystoreService.keystore$
  })

const { reloadBalances, reloadBalancesByChain, balancesState$, chainBalances$ } = createBalancesService({
  keystore$: keystoreService.keystore$,
  network$,
  getLedgerAddress$,
  getKeepKeyAddress$
})

/**
 * Exports all functions and observables needed at UI level (provided by `WalletContext`)
 */
export {
  client$,
  keystoreService,
  removeKeystore,
  setSelectedAsset,
  selectedAsset$,
  loadTxs,
  resetTxsPage,
  explorerUrl$,
  getTxs$,
  reloadBalances,
  reloadBalancesByChain,
  balancesState$,
  chainBalances$,
  ledgerAddresses$,
  askLedgerAddress$,
  getLedgerAddress$,
  verifyLedgerAddress,
  removeLedgerAddress,
  keepkeyAddresses$,
  askKeepKeyAddress$,
  getKeepKeyAddress$,
  verifyKeepKeyAddress,
  removeKeepKeyAddress
}
