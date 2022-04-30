import { BCHChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'

import { HWWalletError, HWWalletErrorId, Network } from '../../../../shared/api/types'
import { toClientNetwork } from '../../../../shared/utils/client'
import { isError } from '../../../../shared/utils/guard'
import { WalletAddress } from '../../../../shared/wallet/types'
import { getKeepKeyClient } from '../client'
import { getDerivationPath } from './common'

export const getAddress = async (
  network: Network,
  walletIndex: number
): Promise<E.Either<HWWalletError, WalletAddress>> => {
  try {
    const keepkey = await getKeepKeyClient()
    const clientNetwork = toClientNetwork(network)
    const derivePath = getDerivationPath(walletIndex, clientNetwork)
    const resp = await keepkey.BtcGetAddress(null, {
      addressNList: derivePath,
      showDisplay: true,
      coin: 'BitcoinCash',
      scriptType: 'p2pkh'
    })
    const bchAddress = resp.data
    return E.right({ address: bchAddress, chain: BCHChain, type: 'keepkey', walletIndex })
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
      msg: `Could not get address from Ledger's BCH app: ${
        isError(error) ? error?.message ?? error.toString() : `${error}`
      }`
    })
  }
}
// export const verifyAddress: VerifyAddressHandler = async ({ transport, network, walletIndex }) => {
//   const app = new AppBTC(transport)
//   const clientNetwork = toClientNetwork(network)
//   const derivePath = getDerivationPath(walletIndex, clientNetwork)
//   const _ = await app.getWalletPublicKey(derivePath, {
//     // cashaddr in case of Bitcoin Cash
//     // @see https://github.com/LedgerHQ/ledgerjs/blob/master/packages/hw-app-btc/README.md#parameters-2
//     format: 'cashaddr',
//     verify: true // confirm the address on the device
//   })
//   return true
// }
