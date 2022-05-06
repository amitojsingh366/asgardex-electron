import { ipcRenderer } from 'electron'

import { IPCLedgerAdddressParams } from '../../shared/api/types'
import { ApiHDWallet } from '../../shared/api/types'
import IPCMessages from '../ipc/messages'

export const apiHDWallet: ApiHDWallet = {
  getLedgerAddress: (params: IPCLedgerAdddressParams) => ipcRenderer.invoke(IPCMessages.GET_LEDGER_ADDRESS, params),
  verifyLedgerAddress: (params: IPCLedgerAdddressParams) =>
    ipcRenderer.invoke(IPCMessages.VERIFY_LEDGER_ADDRESS, params),
  // Note: `params` need to be encoded by `ipcHDWalletSendTxParamsIO` before calling `sendLedgerTx`  */
  sendLedgerTx: (params: unknown) => ipcRenderer.invoke(IPCMessages.SEND_LEDGER_TX, params),
  // Note: `params` need to be encoded by `ipcHDWalletDepositTxParams` before calling `depositLedgerTx`  */
  depositLedgerTx: (params: unknown) => ipcRenderer.invoke(IPCMessages.DEPOSIT_LEDGER_TX, params),
  getKeepKeyAddress: (params: IPCLedgerAdddressParams) => ipcRenderer.invoke(IPCMessages.GET_KEEPKEY_ADDRESS, params),
  verifyKeepKeyAddress: (params: IPCLedgerAdddressParams) =>
    ipcRenderer.invoke(IPCMessages.VERIFY_KEEPKEY_ADDRESS, params),
  // Note: `params` need to be encoded by `ipcHDWalletSendTxParamsIO` before calling `sendLedgerTx`  */
  sendKeepKeyTx: (params: unknown) => ipcRenderer.invoke(IPCMessages.SEND_KEEPKEY_TX, params),
  // Note: `params` need to be encoded by `ipcHDWalletDepositTxParams` before calling `depositLedgerTx`  */
  depositKeepKeyTx: (params: unknown) => ipcRenderer.invoke(IPCMessages.DEPOSIT_KEEPKEY_TX, params)
}
