import { BNBChain } from '@xchainjs/xchain-util'

import { network$ } from '../app/service'
import { balances$, reloadBalances, reloadBalances$, resetReloadBalances, getBalanceByAddress$ } from './balances'
import { client$, clientState$, address$, explorerUrl$, addressUI$ } from './common'
import { createFeesService } from './fees'
import { createKeepKeyService } from './keepkey'
import { createLedgerService } from './ledger'
import { createTransactionService } from './transaction'
import { subscribeTransfers, miniTickers$ } from './ws'

const { txs$, tx$, txStatus$, subscribeTx, resetTx, txRD$, sendTx } = createTransactionService(client$, network$)
const { reloadFees, fees$ } = createFeesService({ client$, chain: BNBChain })
const { ledgerAddress$, retrieveLedgerAddress, removeLedgerAddress, ledgerTxRD$, pushLedgerTx, resetLedgerTx } =
  createLedgerService()
const { keepkeyAddress$, removeKeepKeyAddress, retrieveKeepKeyAddress, keepkeyTxRD$, pushKeepKeyTx, resetKeepKeyTx } =
  createKeepKeyService()

export {
  client$,
  clientState$,
  address$,
  addressUI$,
  reloadBalances,
  reloadBalances$,
  resetReloadBalances,
  explorerUrl$,
  subscribeTransfers,
  miniTickers$,
  balances$,
  txs$,
  tx$,
  txStatus$,
  sendTx,
  subscribeTx,
  resetTx,
  txRD$,
  reloadFees,
  fees$,
  ledgerAddress$,
  retrieveLedgerAddress,
  removeLedgerAddress,
  ledgerTxRD$,
  pushLedgerTx,
  resetLedgerTx,
  keepkeyAddress$,
  removeKeepKeyAddress,
  retrieveKeepKeyAddress,
  keepkeyTxRD$,
  pushKeepKeyTx,
  resetKeepKeyTx,
  getBalanceByAddress$
}
