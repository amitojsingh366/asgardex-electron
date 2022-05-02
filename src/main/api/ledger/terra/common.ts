import { ERROR_DESCRIPTION } from '@terra-money/ledger-terra-js'
import { Network } from '@xchainjs/xchain-client'
import { getDefaultRootDerivationPaths } from '@xchainjs/xchain-terra'

import { HWWalletErrorId } from '../../../../shared/api/types'
import { toDerivationPathArray } from '../../../../shared/utils/wallet'

export const getDerivationPath = (walletIndex: number) => {
  const path = getDefaultRootDerivationPaths()[Network.Mainnet]
  return toDerivationPathArray(path, walletIndex)
}

/**
 * Type for keys of `ERROR_DESCRIPTION` (defined in `ledger-terra-js`)
 * Needed to transform errors in `fromLedgerErrorType' in a type safety way
 */
type LedgerErrorType = keyof typeof ERROR_DESCRIPTION

/**
 * Type guard for `LedgerErrorType
 */
const isLedgerErrorType = (value: unknown): value is LedgerErrorType =>
  Object.keys(ERROR_DESCRIPTION).includes(String(value))

/**
 * Transforms errors defined in `ledger-terra-js` to `LedgerErrorId`
 *
 * Very similar to error handling for Ledger THORChain (see src/main/api/ledger/thorchain/common.ts)
 */
export const fromLedgerErrorType = (error: number): HWWalletErrorId => {
  if (!isLedgerErrorType(error)) return HWWalletErrorId.UNKNOWN

  switch (error) {
    case 36865: // 0x9001
      return HWWalletErrorId.ALREADY_IN_USE
    case 28417: // 0x6f01
      return HWWalletErrorId.SIGN_FAILED
    case 28160: // 0x6e00
      return HWWalletErrorId.NO_APP
    case 27012: // 0x6984
    case 27010: // 0x6982
    case 26368: // 0x6700
    case 27011: // 0x6983
      return HWWalletErrorId.INVALID_DATA
    case 27014: // 0x6986
      return HWWalletErrorId.REJECTED
    case 27264: // 0x6a80
      return HWWalletErrorId.INVALID_PUBKEY
    case 14:
    case 5:
      return HWWalletErrorId.TIMEOUT
    default:
      return HWWalletErrorId.UNKNOWN
  }
}
