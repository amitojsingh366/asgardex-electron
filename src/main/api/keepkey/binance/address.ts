import { BNBChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'
import { Client } from 'keepkey-sdk/lib/client'

import { HWWalletError, HWWalletErrorId, Network } from '../../../../shared/api/types'
import { isError } from '../../../../shared/utils/guard'
import { WalletAddress } from '../../../../shared/wallet/types'
import { VerifyAddressHandler } from '../types'
import { getDerivationPath } from './common'

export const getAddress = async (
  keepkey: Client,
  network: Network,
  walletIndex: number
): Promise<E.Either<HWWalletError, WalletAddress>> => {
  try {
    const derivePath = getDerivationPath(walletIndex)
    const resp = await keepkey.BinanceGetAddress(null, {
      addressNList: derivePath,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const verifyAddress: VerifyAddressHandler = async ({ keepkey, network, walletIndex }) => {
  try {
    const derivePath = getDerivationPath(walletIndex)
    await keepkey.BinanceGetAddress(null, {
      addressNList: derivePath,
      showDisplay: true
    })
    return true
  } catch (error) {
    return false
  }
}
