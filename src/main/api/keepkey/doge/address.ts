import { DOGEChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'
import { Client } from 'keepkey-sdk/lib/client'

import { HWWalletError, HWWalletErrorId, Network } from '../../../../shared/api/types'
import { toClientNetwork } from '../../../../shared/utils/client'
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

export const verifyAddress: VerifyAddressHandler = async ({ keepkey, network, walletIndex }) => {
  try {
    const clientNetwork = toClientNetwork(network)
    const derivePath = getDerivationPath(walletIndex, clientNetwork)
    await keepkey.BtcGetAddress(null, {
      addressNList: derivePath,
      showDisplay: true,
      coin: 'Dogecoin',
      scriptType: 'p2pkh'
    })

    return true
  } catch (error) {
    return false
  }
}
