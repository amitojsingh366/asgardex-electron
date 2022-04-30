import { LTCChain } from '@xchainjs/xchain-util'
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
      coin: 'Litecoin',
      scriptType: 'p2pkh'
    })
    const ltcAddress = resp.data
    return E.right({ address: ltcAddress, chain: LTCChain, type: 'keepkey', walletIndex })
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
      msg: `Could not get address from Ledger's LTC app: ${
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
//     format: 'bech32', // bech32 format with 84' paths
//     verify: true // confirm the address on the device
//   })
//   return true
// }
