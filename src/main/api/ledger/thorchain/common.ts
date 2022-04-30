import { HWWalletErrorType } from '@thorchain/ledger-thorchain'

import { HWWalletErrorId } from '../../../../shared/api/types'

// TODO(@veado) Get path by using `xchain-thorchain`
export const getDerivationPath = (walletIndex: number) => [44, 931, 0, 0, walletIndex]

export const fromHWWalletErrorType = (error: number): HWWalletErrorId => {
  switch (error) {
    case HWWalletErrorType.DeviceIsBusy:
      return HWWalletErrorId.ALREADY_IN_USE
    case HWWalletErrorType.SignVerifyError:
      return HWWalletErrorId.SIGN_FAILED
    case HWWalletErrorType.AppDoesNotSeemToBeOpen:
      return HWWalletErrorId.NO_APP
    case HWWalletErrorType.DataIsInvalid:
    case HWWalletErrorType.EmptyBuffer:
    case HWWalletErrorType.WrongLength:
    case HWWalletErrorType.OutputBufferTooSmall:
      return HWWalletErrorId.INVALID_DATA
    case HWWalletErrorType.TransactionRejected:
      return HWWalletErrorId.REJECTED
    case HWWalletErrorType.BadKeyHandle:
      return HWWalletErrorId.INVALID_PUBKEY
    case HWWalletErrorType.UnknownResponse:
      return HWWalletErrorId.INVALID_RESPONSE
    case HWWalletErrorType.U2FTimeout:
    case HWWalletErrorType.Timeout:
      return HWWalletErrorId.TIMEOUT
    default:
      return HWWalletErrorId.UNKNOWN
  }
}
