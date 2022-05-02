import { LedgerErrorType } from '@thorchain/ledger-thorchain'

import { HWWalletErrorId } from '../../../../shared/api/types'

// TODO(@veado) Get path by using `xchain-thorchain`
export const getDerivationPath = (walletIndex: number) => [44, 931, 0, 0, walletIndex]

export const fromHWWalletErrorType = (error: number): HWWalletErrorId => {
  switch (error) {
    case LedgerErrorType.DeviceIsBusy:
      return HWWalletErrorId.ALREADY_IN_USE
    case LedgerErrorType.SignVerifyError:
      return HWWalletErrorId.SIGN_FAILED
    case LedgerErrorType.AppDoesNotSeemToBeOpen:
      return HWWalletErrorId.NO_APP
    case LedgerErrorType.DataIsInvalid:
    case LedgerErrorType.EmptyBuffer:
    case LedgerErrorType.WrongLength:
    case LedgerErrorType.OutputBufferTooSmall:
      return HWWalletErrorId.INVALID_DATA
    case LedgerErrorType.TransactionRejected:
      return HWWalletErrorId.REJECTED
    case LedgerErrorType.BadKeyHandle:
      return HWWalletErrorId.INVALID_PUBKEY
    case LedgerErrorType.UnknownResponse:
      return HWWalletErrorId.INVALID_RESPONSE
    case LedgerErrorType.U2FTimeout:
    case LedgerErrorType.Timeout:
      return HWWalletErrorId.TIMEOUT
    default:
      return HWWalletErrorId.UNKNOWN
  }
}
