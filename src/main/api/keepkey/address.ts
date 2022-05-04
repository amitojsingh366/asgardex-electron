import { BCHChain, BNBChain, BTCChain, DOGEChain, LTCChain, THORChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'

import { IPCLedgerAdddressParams, HWWalletError, HWWalletErrorId } from '../../../shared/api/types'
import { isError } from '../../../shared/utils/guard'
import { WalletAddress } from '../../../shared/wallet/types'
import { getAddress as getBNBAddress } from './binance/address'
import { getAddress as getBTCAddress } from './bitcoin/address'
import { getAddress as getBCHAddress } from './bitcoincash/address'
import { getKeepKeyClient } from './client'
import { getAddress as getDOGEAddress } from './doge/address'
import { getAddress as getLTCAddress } from './litecoin/address'
import { getAddress as getTHORAddress } from './thorchain/address'

export const getAddress = async ({
  chain,
  network,
  walletIndex
}: IPCLedgerAdddressParams): Promise<E.Either<HWWalletError, WalletAddress>> => {
  try {
    let res: E.Either<HWWalletError, WalletAddress>
    const keepkey = await getKeepKeyClient()
    switch (chain) {
      case THORChain:
        res = await getTHORAddress(keepkey, network, walletIndex)
        break
      case BNBChain:
        res = await getBNBAddress(keepkey, network, walletIndex)
        break
      case BTCChain:
        res = await getBTCAddress(keepkey, network, walletIndex)
        break
      case LTCChain:
        res = await getLTCAddress(keepkey, network, walletIndex)
        break
      case BCHChain:
        res = await getBCHAddress(keepkey, network, walletIndex)
        break
      case DOGEChain:
        res = await getDOGEAddress(keepkey, network, walletIndex)
        break
      default:
        res = E.left({
          errorId: HWWalletErrorId.NOT_IMPLEMENTED,
          msg: `getAddress for ${chain} has not been implemented`
        })
    }
    console.log(res)
    return res
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
      msg: isError(error) ? error?.message ?? error.toString() : `${error}`
    })
  }
}

// export const verifyLedgerAddress = async ({ chain, network, walletIndex }: IPCLedgerAdddressParams) => {
//   const transport = await TransportNodeHidSingleton.open()
//   let result = false
//   switch (chain) {
//     case THORChain:
//       result = await verifyTHORAddress({ transport, network, walletIndex })
//       break
//     case BNBChain:
//       result = await verifyBNBAddress({ transport, network, walletIndex })
//       break
//     case BTCChain:
//       result = await verifyBTCAddress({ transport, network, walletIndex })
//       break
//     case LTCChain:
//       result = await verifyLTCAddress({ transport, network, walletIndex })
//       break
//     case BCHChain:
//       result = await verifyBCHAddress({ transport, network, walletIndex })
//       break
//     case DOGEChain:
//       result = await verifyDOGEAddress({ transport, network, walletIndex })
//       break
//     default:
//       throw Error(`verifyAddress for ${chain} has not been implemented`)
//   }
//   await transport.close()

//   return result
// }
