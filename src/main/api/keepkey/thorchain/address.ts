// import type Transport from '@ledgerhq/hw-transport'
// import THORChainApp, { HWWalletErrorType } from '@thorchain/ledger-thorchain'
// import { getPrefix } from '@xchainjs/xchain-thorchain'
import { THORChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'
import { Client } from 'keepkey-sdk/lib/client'

import { HWWalletError, HWWalletErrorId, Network } from '../../../../shared/api/types'
// import { toClientNetwork } from '../../../../shared/utils/client'
import { isError } from '../../../../shared/utils/guard'
import { WalletAddress } from '../../../../shared/wallet/types'
import { VerifyAddressHandler } from '../types'
import { getDerivationPath } from './common'
// import { VerifyAddressHandler } from '../types'
// import { getDerivationPath } from './common'

export const getAddress = async (
  keepkey: Client,
  network: Network,
  walletIndex: number
): Promise<E.Either<HWWalletError, WalletAddress>> => {
  try {
    const derivePath = getDerivationPath(walletIndex)
    const resp = await keepkey.ThorchainGetAddress(null, {
      addressNList: derivePath,
      showDisplay: true
    })

    const bech32Address = resp.data

    if (!bech32Address) {
      return E.left({
        errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
        msg: `Getting 'bech32Address' from KeepKey's THORChain App failed`
      })
    }
    return E.right({ address: bech32Address, chain: THORChain, type: 'keepkey', walletIndex })
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
    await keepkey.ThorchainGetAddress(null, {
      addressNList: derivePath,
      showDisplay: true
    })

    return true
  } catch (error) {
    return false
  }
}
