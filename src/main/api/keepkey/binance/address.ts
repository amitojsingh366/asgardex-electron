import { BNBChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'

import { HWWalletError, HWWalletErrorId, Network } from '../../../../shared/api/types'
import { isError } from '../../../../shared/utils/guard'
import { WalletAddress } from '../../../../shared/wallet/types'
import { getKeepKeyClient } from '../client'

export const getAddress = async (
  network: Network,
  walletIndex: number
): Promise<E.Either<HWWalletError, WalletAddress>> => {
  try {
    const keepkey = await getKeepKeyClient()
    const resp = await keepkey.BinanceGetAddress(null, {
      addressNList: [0x80000000 + 44, 0x80000000 + 714, 0x80000000 + 0, 0, walletIndex],
      showDisplay: true
    })

    const binanceAddress = resp.data as string

    return E.right({ address: binanceAddress, chain: BNBChain, type: 'keepkey', walletIndex })
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
      msg: isError(error) ? error?.message ?? error.toString() : `${error}`
    })
  }
}

// export const verifyAddress: VerifyAddressHandler = async ({ transport, network, walletIndex }) => {
//   const app = new AppBNB(transport)
//   const derive_path = getDerivePath(walletIndex)
//   const clientNetwork = toClientNetwork(network)
//   const prefix = getPrefix(clientNetwork)
//   const { error_message } = await app.showAddress(prefix, derive_path)
//   return error_message ? false : true
// }
