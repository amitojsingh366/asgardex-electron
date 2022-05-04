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
// import { VerifyAddressHandler } from '../types'
// import { getDerivationPath } from './common'

export const getAddress = async (
  keepkey: Client,
  network: Network,
  walletIndex: number
): Promise<E.Either<HWWalletError, WalletAddress>> => {
  try {
    const resp = await keepkey.ThorchainGetAddress(null, {
      addressNList: [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, walletIndex],
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

// export const verifyAddress: VerifyAddressHandler = async ({ transport, network, walletIndex }) => {
//   const app = new THORChainApp(transport)
//   const clientNetwork = toClientNetwork(network)
//   const prefix = getPrefix(clientNetwork)
//   const path = getDerivationPath(walletIndex)
//   const _ = app.showAddressAndPubKey(path, prefix)
//   return true
// }
