import type Transport from '@ledgerhq/hw-transport'
import THORChainApp, { LedgerErrorType } from '@thorchain/ledger-thorchain'
import { getPrefix } from '@xchainjs/xchain-thorchain'
import { THORChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'

import { HWWalletError, HWWalletErrorId, Network } from '../../../../shared/api/types'
import { toClientNetwork } from '../../../../shared/utils/client'
import { isError } from '../../../../shared/utils/guard'
import { WalletAddress } from '../../../../shared/wallet/types'
import { VerifyAddressHandler } from '../types'
import { fromHWWalletErrorType, getDerivationPath } from './common'

export const getAddress = async (
  transport: Transport,
  network: Network,
  walletIndex: number
): Promise<E.Either<HWWalletError, WalletAddress>> => {
  try {
    const app = new THORChainApp(transport)
    const clientNetwork = toClientNetwork(network)
    const prefix = getPrefix(clientNetwork)
    const path = getDerivationPath(walletIndex)
    const { bech32Address, returnCode } = await app.getAddressAndPubKey(path, prefix)
    if (!bech32Address || returnCode !== LedgerErrorType.NoErrors) {
      return E.left({
        errorId: fromHWWalletErrorType(returnCode),
        msg: `Getting 'bech32Address' from Ledger's THORChain App failed`
      })
    }
    return E.right({ address: bech32Address, chain: THORChain, type: 'ledger', walletIndex })
  } catch (error) {
    return E.left({
      errorId: HWWalletErrorId.GET_ADDRESS_FAILED,
      msg: isError(error) ? error?.message ?? error.toString() : `${error}`
    })
  }
}

export const verifyAddress: VerifyAddressHandler = async ({ transport, network, walletIndex }) => {
  const app = new THORChainApp(transport)
  const clientNetwork = toClientNetwork(network)
  const prefix = getPrefix(clientNetwork)
  const path = getDerivationPath(walletIndex)
  const _ = await app.showAddressAndPubKey(path, prefix)
  return true
}
