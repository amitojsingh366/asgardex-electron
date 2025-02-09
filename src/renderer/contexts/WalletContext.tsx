import React, { createContext, useContext } from 'react'

import * as O from 'fp-ts/lib/Option'
import { none, Option, some } from 'fp-ts/lib/Option'

import {
  client$,
  reloadBalances,
  balancesState$,
  chainBalances$,
  reloadBalancesByChain,
  keystoreService,
  selectedAsset$,
  loadTxs,
  getTxs$,
  setSelectedAsset,
  resetTxsPage,
  askLedgerAddress$,
  getLedgerAddress$,
  removeLedgerAddress,
  verifyLedgerAddress,
  ledgerAddresses$,
  askKeepKeyAddress$,
  getKeepKeyAddress$,
  removeKeepKeyAddress,
  verifyKeepKeyAddress,
  keepkeyAddresses$
} from '../services/wallet'

type WalletContextValue = {
  client$: typeof client$
  keystoreService: typeof keystoreService
  reloadBalances: typeof reloadBalances
  balancesState$: typeof balancesState$
  chainBalances$: typeof chainBalances$
  loadTxs: typeof loadTxs
  reloadBalancesByChain: typeof reloadBalancesByChain
  selectedAsset$: typeof selectedAsset$
  getTxs$: typeof getTxs$
  setSelectedAsset: typeof setSelectedAsset
  resetTxsPage: typeof resetTxsPage
  ledgerAddresses$: typeof ledgerAddresses$
  askLedgerAddress$: typeof askLedgerAddress$
  getLedgerAddress$: typeof getLedgerAddress$
  verifyLedgerAddress: typeof verifyLedgerAddress
  removeLedgerAddress: typeof removeLedgerAddress
  keepkeyAddresses$: typeof keepkeyAddresses$
  askKeepKeyAddress$: typeof askKeepKeyAddress$
  getKeepKeyAddress$: typeof getKeepKeyAddress$
  verifyKeepKeyAddress: typeof verifyKeepKeyAddress
  removeKeepKeyAddress: typeof removeKeepKeyAddress
}

const initialContext: WalletContextValue = {
  client$,
  keystoreService,
  reloadBalances,
  reloadBalancesByChain,
  loadTxs,
  balancesState$,
  chainBalances$,
  selectedAsset$,
  getTxs$,
  setSelectedAsset,
  resetTxsPage,
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
const WalletContext = createContext<Option<WalletContextValue>>(none)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => (
  <WalletContext.Provider value={some(initialContext)}>{children}</WalletContext.Provider>
)

export const useWalletContext = () => {
  const context = O.toNullable(useContext(WalletContext))
  if (!context) {
    throw new Error('Context must be used within a WalletProvider.')
  }
  return context
}
