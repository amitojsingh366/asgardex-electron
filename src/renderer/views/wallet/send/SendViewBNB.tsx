import React, { useMemo } from 'react'

import * as RD from '@devexperts/remote-data-ts'
import { Address } from '@xchainjs/xchain-client'
import { Asset, BNBChain } from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { useObservableState } from 'observable-hooks'

import { WalletType } from '../../../../shared/wallet/types'
import { LoadingView } from '../../../components/shared/loading'
import { SendFormBNB } from '../../../components/wallet/txs/send'
import { useBinanceContext } from '../../../contexts/BinanceContext'
import { useChainContext } from '../../../contexts/ChainContext'
import { useWalletContext } from '../../../contexts/WalletContext'
import { liveData } from '../../../helpers/rx/liveData'
import { getWalletBalanceByAddressAndAsset } from '../../../helpers/walletHelper'
import { useNetwork } from '../../../hooks/useNetwork'
import { useOpenExplorerTxUrl } from '../../../hooks/useOpenExplorerTxUrl'
import { useValidateAddress } from '../../../hooks/useValidateAddress'
import { FeeRD } from '../../../services/chain/types'
import { WalletBalances } from '../../../services/clients'
import { DEFAULT_BALANCES_FILTER, INITIAL_BALANCES_STATE } from '../../../services/wallet/const'

type Props = {
  walletType: WalletType
  walletAddress: Address
  walletIndex: number
  asset: Asset
}

export const SendViewBNB: React.FC<Props> = (props): JSX.Element => {
  const { walletAddress, asset, walletType, walletIndex } = props

  const { network } = useNetwork()

  const { openExplorerTxUrl, getExplorerTxUrl } = useOpenExplorerTxUrl(O.some(BNBChain))

  const {
    balancesState$,
    keystoreService: { validatePassword$ }
  } = useWalletContext()

  const [{ balances: oBalances }] = useObservableState(
    () => balancesState$(DEFAULT_BALANCES_FILTER),
    INITIAL_BALANCES_STATE
  )

  const oWalletBalance = useMemo(
    () =>
      FP.pipe(
        oBalances,
        O.chain((balances) => getWalletBalanceByAddressAndAsset({ balances, address: walletAddress, asset }))
      ),
    [asset, oBalances, walletAddress]
  )

  const { transfer$ } = useChainContext()

  const { fees$, reloadFees } = useBinanceContext()

  const [feeRD] = useObservableState<FeeRD>(
    () =>
      FP.pipe(
        fees$(),
        liveData.map((fees) => fees.fast)
      ),
    RD.initial
  )

  const { validateAddress } = useValidateAddress(BNBChain)

  return FP.pipe(
    oWalletBalance,
    O.fold(
      () => <LoadingView size="large" />,
      (walletBalance) => (
        <SendFormBNB
          walletType={walletType}
          walletIndex={walletIndex}
          walletAddress={walletAddress}
          balances={FP.pipe(
            oBalances,
            O.getOrElse<WalletBalances>(() => [])
          )}
          balance={walletBalance}
          transfer$={transfer$}
          openExplorerTxUrl={openExplorerTxUrl}
          getExplorerTxUrl={getExplorerTxUrl}
          addressValidation={validateAddress}
          fee={feeRD}
          reloadFeesHandler={reloadFees}
          validatePassword$={validatePassword$}
          network={network}
        />
      )
    )
  )
}
