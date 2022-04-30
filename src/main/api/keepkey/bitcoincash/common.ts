import { Network } from '@xchainjs/xchain-client'

import { HWWalletErrorId } from '../../../../shared/api/types'

// TODO(@veado) Extend`xchain-bitcoincash` to get derivation path from it
// Similar to default values in `Client` of `xchain-bitcoincash`
// see https://github.com/xchainjs/xchainjs-lib/blob/56adf1e0d6ceab0bdf93f53fe808fe45bf79930f/packages/xchain-bitcoincash/src/client.ts#L65-L69
export const getDerivationPath = (walletIndex: number, network: Network): number[] => {
  const DERIVATION_PATHES = {
    [Network.Mainnet]: [0x80000000 + 44, 0x80000000 + 145, 0x80000000 + 0, 0, walletIndex],
    [Network.Testnet]: [0x80000000 + 44, 0x80000000 + 1, 0x80000000 + 0, 0, walletIndex],
    [Network.Stagenet]: [0x80000000 + 44, 0x80000000 + 145, 0x80000000 + 0, 0, walletIndex]
  }
  return DERIVATION_PATHES[network]
}

export const fromHWWalletErrorType = (error: number): HWWalletErrorId => {
  switch (error) {
    default:
      return HWWalletErrorId.UNKNOWN
  }
}
