import AppBTC from '@ledgerhq/hw-app-btc'
import type Transport from '@ledgerhq/hw-transport'
import { DOGEChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'

import { HWWalletError, HWWalletErrorId, Network } from '../../../../shared/api/types'
import { toClientNetwork } from '../../../../shared/utils/client'
import { isError } from '../../../../shared/utils/guard'
import { WalletAddress } from '../../../../shared/wallet/types'
import { VerifyAddressHandler } from '../types'
import { getDerivationPath } from './common'

export const getAddress = async (
  transport: Transport,
  network: Network,
  walletIndex: number
): Promise<E.Either<HWWalletError, WalletAddress>> => {
  try {
    const app = new AppBTC(transport)
    const clientNetwork = toClientNetwork(network)
    const derivePath = getDerivationPath(walletIndex, clientNetwork)
    const { bitcoinAddress: address } = await app.getWalletPublicKey(derivePath, {
      // `legacy` format with 44' paths
      // @see https://github.com/LedgerHQ/ledgerjs/blob/master/packages/hw-app-btc/README.md#parameters-2
      format: 'legacy'
    })
    return E.right({ address, chain: DOGEChain, type: 'ledger', walletIndex })
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
      msg: `Could not get address from Ledger's DOGE app: ${
        isError(error) ? error?.message ?? error.toString() : `${error}`
      }`
    })
  }
}

export const verifyAddress: VerifyAddressHandler = async ({ transport, network, walletIndex }) => {
  const app = new AppBTC(transport)
  const clientNetwork = toClientNetwork(network)
  const derivePath = getDerivationPath(walletIndex, clientNetwork)
  const _ = await app.getWalletPublicKey(derivePath, {
    // `legacy` format with 44' paths
    // @see https://github.com/LedgerHQ/ledgerjs/blob/master/packages/hw-app-btc/README.md#parameters-2
    format: 'legacy',
    verify: true // confirm address on device
  })
  return true
}
