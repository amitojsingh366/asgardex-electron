import { Network } from '@xchainjs/xchain-client'

import { HWWalletErrorId } from '../../../../shared/api/types'

// TODO(@veado) Extend`xchain-doge` to get derivation path from it
// Similar to default values in `Client` of `xchain-doge`
// see https://github.com/xchainjs/xchainjs-lib/blob/1f892f0cbd95b39df84e5800b0396e487b20c277/packages/xchain-doge/src/client.ts#L50-L54
export const getDerivationPath = (walletIndex: number, network: Network): number[] => {
  const DERIVATION_PATHES = {
    [Network.Mainnet]: [0x80000000 + 44, 0x80000000 + 3, 0x80000000 + 0, 0, walletIndex],
    [Network.Testnet]: [0x80000000 + 44, 0x80000000 + 1, 0x80000000 + 0, 0, walletIndex],
    [Network.Stagenet]: [0x80000000 + 44, 0x80000000 + 3, 0x80000000 + 0, 0, walletIndex]
  }
  return DERIVATION_PATHES[network]
}

export const fromHWWalletErrorType = (error: number): HWWalletErrorId => {
  switch (error) {
    default:
      return HWWalletErrorId.UNKNOWN
  }
}
