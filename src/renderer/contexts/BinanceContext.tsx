import React, { createContext, useContext } from 'react'

import {
  client$,
  clientState$,
  subscribeTransfers,
  miniTickers$,
  txs$,
  resetTx,
  subscribeTx,
  sendTx,
  txRD$,
  address$,
  addressUI$,
  explorerUrl$,
  fees$,
  reloadFees,
  ledgerAddress$,
  ledgerTxRD$,
  pushLedgerTx,
  resetLedgerTx,
  keepkeyTxRD$,
  keepkeyAddress$,
  pushKeepKeyTx,
  resetKeepKeyTx
} from '../services/binance'

export type BinanceContextValue = {
  client$: typeof client$
  clientState$: typeof clientState$
  subscribeTransfers: typeof subscribeTransfers
  miniTickers$: typeof miniTickers$
  txs$: typeof txs$
  resetTx: typeof resetTx
  subscribeTx: typeof subscribeTx
  sendTx: typeof sendTx
  txRD$: typeof txRD$
  address$: typeof address$
  addressUI$: typeof addressUI$
  explorerUrl$: typeof explorerUrl$
  fees$: typeof fees$
  reloadFees: typeof reloadFees
  ledgerAddress$: typeof ledgerAddress$
  ledgerTxRD$: typeof ledgerTxRD$
  pushLedgerTx: typeof pushLedgerTx
  resetLedgerTx: typeof resetLedgerTx
  keepkeyAddress$: typeof keepkeyAddress$
  keepkeyTxRD$: typeof keepkeyTxRD$
  pushKeepKeyTx: typeof pushKeepKeyTx
  resetKeepKeyTx: typeof resetKeepKeyTx
}

const initialContext: BinanceContextValue = {
  client$,
  clientState$,
  subscribeTransfers,
  miniTickers$,
  txs$,
  resetTx,
  subscribeTx,
  sendTx,
  txRD$,
  address$,
  addressUI$,
  explorerUrl$,
  fees$,
  reloadFees,
  ledgerAddress$,
  ledgerTxRD$,
  pushLedgerTx,
  resetLedgerTx,
  keepkeyAddress$,
  keepkeyTxRD$,
  pushKeepKeyTx,
  resetKeepKeyTx
}

const BinanceContext = createContext<BinanceContextValue | null>(null)

export const BinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
  return <BinanceContext.Provider value={initialContext}>{children}</BinanceContext.Provider>
}

export const useBinanceContext = () => {
  const context = useContext(BinanceContext)
  if (!context) {
    throw new Error('Context must be used within a BinanceProvider.')
  }
  return context
}
