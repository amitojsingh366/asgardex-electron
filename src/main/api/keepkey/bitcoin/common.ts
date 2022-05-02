import { Network } from '@xchainjs/xchain-client'

import { HWWalletErrorId } from '../../../../shared/api/types'

// TODO(@veado) Extend`xchain-bitcoin` to get derivation path from it
// Similar to default values in `Client` of `xchain-bitcoin`
// see https://github.com/xchainjs/xchainjs-lib/blob/993c00b8bc4fc2eac302c51da1dc26bb2fa3c7b9/packages/xchain-bitcoin/src/client.ts#L52-L56
export const getDerivationPath = (walletIndex: number, network: Network): number[] => {
  const DERIVATION_PATHES = {
    [Network.Mainnet]: [0x80000000 + 84, 0x80000000 + 0, 0x80000000 + 0, 0, walletIndex],
    [Network.Testnet]: [0x80000000 + 84, 0x80000000 + 1, 0x80000000 + 0, 0, walletIndex],
    [Network.Stagenet]: [0x80000000 + 84, 0x80000000 + 0, 0x80000000 + 0, 0, walletIndex]
  }
  return DERIVATION_PATHES[network]
}

export const fromHWWalletErrorType = (error: number): HWWalletErrorId => {
  switch (error) {
    default:
      return HWWalletErrorId.UNKNOWN
  }
}
