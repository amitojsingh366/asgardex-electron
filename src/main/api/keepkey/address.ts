import { BCHChain, BNBChain, BTCChain, DOGEChain, LTCChain, THORChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'

import { IPCLedgerAdddressParams, HWWalletError, HWWalletErrorId } from '../../../shared/api/types'
import { isError } from '../../../shared/utils/guard'
import { WalletAddress } from '../../../shared/wallet/types'
import { getAddress as getBNBAddress, verifyAddress as verifyBNBAddress } from './binance/address'
import { getAddress as getBTCAddress, verifyAddress as verifyBTCAddress } from './bitcoin/address'
import { getAddress as getBCHAddress, verifyAddress as verifyBCHAddress } from './bitcoincash/address'
import { getKeepKeyClient } from './client'
import { getAddress as getDOGEAddress, verifyAddress as verifyDOGEAddress } from './doge/address'
import { getAddress as getLTCAddress, verifyAddress as verifyLTCAddress } from './litecoin/address'
import { getAddress as getTHORAddress, verifyAddress as verifyTHORAddress } from './thorchain/address'

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

export const verifyKeepKeyAddress = async ({ chain, network, walletIndex }: IPCLedgerAdddressParams) => {
  const keepkey = await getKeepKeyClient()
  let result = false
  switch (chain) {
    case THORChain:
      result = await verifyTHORAddress({ keepkey, network, walletIndex })
      break
    case BNBChain:
      result = await verifyBNBAddress({ keepkey, network, walletIndex })
      break
    case BTCChain:
      result = await verifyBTCAddress({ keepkey, network, walletIndex })
      break
    case LTCChain:
      result = await verifyLTCAddress({ keepkey, network, walletIndex })
      break
    case BCHChain:
      result = await verifyBCHAddress({ keepkey, network, walletIndex })
      break
    case DOGEChain:
      result = await verifyDOGEAddress({ keepkey, network, walletIndex })
      break
    default:
      throw Error(`verifyAddress for ${chain} has not been implemented`)
  }
  return result
}
