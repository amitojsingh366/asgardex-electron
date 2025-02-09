import { network$ } from '../app/service'
import { balances$, reloadBalances, getBalanceByAddress$, reloadBalances$, resetReloadBalances } from './balances'
import { client$, clientState$, address$, addressUI$, explorerUrl$ } from './common'
import { createFeesService } from './fees'
import { createKeepKeyService } from './keepkey'
import { createLedgerService } from './ledger'
import { createTransactionService } from './transaction'

const { subscribeTx, txRD$, resetTx, sendTx, txs$, tx$, txStatus$ } = createTransactionService(client$, network$)
const { fees$, reloadFees, feesWithRates$, reloadFeesWithRates } = createFeesService(client$)
const { ledgerAddress$, retrieveLedgerAddress, removeLedgerAddress, pushLedgerTx, ledgerTxRD$, resetLedgerTx } =
  createLedgerService()
const { keepkeyAddress$, removeKeepKeyAddress, retrieveKeepKeyAddress, pushKeepKeyTx, keepkeyTxRD$, resetKeepKeyTx } =
  createKeepKeyService()

export {
  client$,
  clientState$,
  explorerUrl$,
  address$,
  addressUI$,
  reloadBalances,
  reloadBalances$,
  resetReloadBalances,
  balances$,
  getBalanceByAddress$,
  reloadFees,
  fees$,
  reloadFeesWithRates,
  feesWithRates$,
  subscribeTx,
  sendTx,
  txRD$,
  resetTx,
  txs$,
  tx$,
  txStatus$,
  ledgerAddress$,
  retrieveLedgerAddress,
  removeLedgerAddress,
  pushLedgerTx,
  ledgerTxRD$,
  resetLedgerTx,
  keepkeyAddress$,
  removeKeepKeyAddress,
  retrieveKeepKeyAddress,
  pushKeepKeyTx,
  keepkeyTxRD$,
  resetKeepKeyTx
}
