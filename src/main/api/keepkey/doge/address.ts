import { DOGEChain } from '@xchainjs/xchain-util'
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
      coin: 'Dogecoin',
      scriptType: 'p2pkh'
    })
    const address = resp.data
    return E.right({ address, chain: DOGEChain, type: 'keepkey', walletIndex })
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
      msg: `Could not get address from Ledger's DOGE app: ${
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
//     // `legacy` format with 44' paths
//     // @see https://github.com/LedgerHQ/ledgerjs/blob/master/packages/hw-app-btc/README.md#parameters-2
//     format: 'legacy',
//     verify: true // confirm address on device
//   })
//   return true
// }
