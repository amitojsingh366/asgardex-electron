import React, { useCallback, useMemo, useRef, useEffect } from 'react'

import { SyncOutlined } from '@ant-design/icons'
import * as RD from '@devexperts/remote-data-ts'
import { Address } from '@xchainjs/xchain-client'
import { Asset, Chain, THORChain } from '@xchainjs/xchain-util'
import { Row } from 'antd'
import * as A from 'fp-ts/Array'
import * as FP from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { useObservableState } from 'observable-hooks'
import { useIntl } from 'react-intl'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'

import { Network } from '../../../shared/api/types'
import { PoolShares as PoolSharesTable } from '../../components/PoolShares'
import { PoolShareTableRowData } from '../../components/PoolShares/PoolShares.types'
import { ErrorView } from '../../components/shared/error'
import { Button, RefreshButton } from '../../components/uielements/button'
import { AssetsNav, TotalValue } from '../../components/wallet/assets'
import { useChainContext } from '../../contexts/ChainContext'
import { useMidgardContext } from '../../contexts/MidgardContext'
import { useWalletContext } from '../../contexts/WalletContext'
import { isTerraChain, isThorChain } from '../../helpers/chainHelper'
import { sequenceTOption } from '../../helpers/fpHelpers'
import { RUNE_PRICE_POOL } from '../../helpers/poolHelper'
import { addressFromOptionalWalletAddress, addressFromWalletAddress } from '../../helpers/walletHelper'
import { useMimirHalt } from '../../hooks/useMimirHalt'
import { useNetwork } from '../../hooks/useNetwork'
import { WalletAddress$ } from '../../services/clients/types'
import { ENABLED_CHAINS } from '../../services/const'
import { PoolSharesRD } from '../../services/midgard/types'
import { BaseAmountRD } from '../../types'
import * as H from './PoolShareView.helper'

export const PoolShareView: React.FC = (): JSX.Element => {
  const intl = useIntl()

  const { network } = useNetwork()

  const {
    service: {
      pools: {
        allPoolDetails$,
        poolsState$,
        selectedPricePool$,
        selectedPricePoolAsset$,
        reloadAllPools,
        haltedChains$
      },
      reloadNetworkInfo,
      shares: { allSharesByAddresses$, reloadAllSharesByAddresses }
    }
  } = useMidgardContext()

  const selectedPricePool = useObservableState(selectedPricePool$, RUNE_PRICE_POOL)

  const poolsRD = useObservableState(poolsState$, RD.pending)

  const { addressByChain$ } = useChainContext()

  const { getLedgerAddress$, getKeepKeyAddress$ } = useWalletContext()

  useEffect(() => {
    reloadAllPools()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [oRuneNativeAddress] = useObservableState<O.Option<Address>>(
    () => FP.pipe(addressByChain$(THORChain), RxOp.map(addressFromOptionalWalletAddress)),
    O.none
  )

  const [allSharesRD]: [PoolSharesRD, unknown] = useObservableState(() => {
    // keystore addresses
    const addresses$: WalletAddress$[] = FP.pipe(
      ENABLED_CHAINS,
      A.filter((chain) => !isThorChain(chain)),
      A.map(addressByChain$)
    )

    // ledger addresses
    const ledgerAddresses$: WalletAddress$[] = FP.pipe(
      ENABLED_CHAINS,
      A.filter((chain) => !isThorChain(chain)),
      A.map((chain) => getLedgerAddress$(chain, network)),
      // Transform `LedgerAddress` -> `Option<WalletAddress>`
      A.map(RxOp.map(RD.toOption))
    )

    // ledger addresses
    const keepkeyAddresses$: WalletAddress$[] = FP.pipe(
      ENABLED_CHAINS,
      A.filter((chain) => !isThorChain(chain) && !isTerraChain(chain)),
      A.map((chain) => getKeepKeyAddress$(chain, network)),
      // Transform `KeepKeyAddress` -> `Option<WalletAddress>`
      A.map(RxOp.map(RD.toOption))
    )

    return FP.pipe(
      Rx.combineLatest([...addresses$, ...ledgerAddresses$, ...keepkeyAddresses$]),
      RxOp.map((v) => v),
      RxOp.switchMap(
        FP.flow(
          /**
           *
           * At previous step we have Array<O.Option<Address>>.
           * During the development not every chain address is O.some('stringAddress') but there
           * might be O.none which so we can not use sequencing here as whole sequence might fail
           * which is unacceptable. With filterMap(FP.identity) we filter up O.none values and
           * unwrap values to the plain Array<Address> at a single place
           */
          A.filterMap(FP.identity),
          // grab `address` from `WalletAddress`
          A.map(addressFromWalletAddress),
          /**
           * We have to get a new stake-stream for every new asset
           * @description /src/renderer/services/midgard/shares.ts
           */
          allSharesByAddresses$
        )
      )
    )
  }, RD.initial)

  const [haltedChains] = useObservableState(() => FP.pipe(haltedChains$, RxOp.map(RD.getOrElse((): Chain[] => []))), [])
  const { mimirHalt } = useMimirHalt()
  const poolDetailsRD = useObservableState(allPoolDetails$, RD.pending)
  const { poolData: pricePoolData } = useObservableState(selectedPricePool$, RUNE_PRICE_POOL)
  const oPriceAsset = useObservableState<O.Option<Asset>>(selectedPricePoolAsset$, O.none)
  const priceAsset = FP.pipe(oPriceAsset, O.toUndefined)

  // store previous data of pools to render these while reloading
  const previousPoolShares = useRef<O.Option<PoolShareTableRowData[]>>(O.none)

  const openExternalShareInfo = useCallback(() => {
    // `thoryield.com` does not support testnet, we ignore it here
    const oMainnet = O.fromPredicate<Network>(() => network === 'mainnet')(network)
    return FP.pipe(
      sequenceTOption(oRuneNativeAddress, oMainnet),
      O.map(([thorAddress, _]) => `https://app.thoryield.com/accounts?thor=${thorAddress}`),
      O.map(window.apiUrl.openExternal)
    )
  }, [network, oRuneNativeAddress])

  const renderPoolSharesTable = useCallback(
    (data: PoolShareTableRowData[], loading: boolean) => {
      previousPoolShares.current = O.some(data)
      return (
        <PoolSharesTable
          haltedChains={haltedChains}
          mimirHalt={mimirHalt}
          loading={loading}
          data={data}
          priceAsset={priceAsset}
          openShareInfo={openExternalShareInfo}
          network={network}
        />
      )
    },
    [haltedChains, mimirHalt, priceAsset, openExternalShareInfo, network]
  )

  const clickRefreshHandler = useCallback(() => {
    reloadAllPools()
    reloadNetworkInfo()
  }, [reloadNetworkInfo, reloadAllPools])

  const renderRefreshBtn = useMemo(
    () => (
      <Button onClick={clickRefreshHandler} typevalue="outline">
        <SyncOutlined />
        {intl.formatMessage({ id: 'common.refresh' })}
      </Button>
    ),
    [clickRefreshHandler, intl]
  )

  const renderSharesTotal = useMemo(() => {
    const sharesTotalRD: BaseAmountRD = FP.pipe(
      RD.combine(allSharesRD, poolDetailsRD),
      RD.map(([poolShares, poolDetails]) => H.getSharesTotal(poolShares, poolDetails, pricePoolData))
    )
    return (
      <TotalValue
        total={sharesTotalRD}
        pricePool={selectedPricePool}
        title={intl.formatMessage({ id: 'wallet.shares.total' })}
      />
    )
  }, [allSharesRD, intl, poolDetailsRD, pricePoolData, selectedPricePool])

  const renderShares = useMemo(
    () =>
      FP.pipe(
        RD.combine(allSharesRD, poolDetailsRD),
        RD.fold(
          // initial state
          () => renderPoolSharesTable([], false),
          // loading state
          () => {
            const data: PoolShareTableRowData[] = FP.pipe(
              previousPoolShares.current,
              O.getOrElse<PoolShareTableRowData[]>(() => [])
            )
            return renderPoolSharesTable(data, true)
          },
          // error state
          (error: Error) => {
            const msg = error?.toString() ?? ''
            return <ErrorView title={msg} extra={renderRefreshBtn} />
          },
          // success state
          ([poolShares, poolDetails]) => {
            const data = H.getPoolShareTableData(poolShares, poolDetails, pricePoolData)
            previousPoolShares.current = O.some(data)
            return renderPoolSharesTable(data, false)
          }
        )
      ),
    [allSharesRD, poolDetailsRD, renderPoolSharesTable, renderRefreshBtn, pricePoolData]
  )

  const disableRefresh = useMemo(() => RD.isPending(poolsRD) || RD.isPending(allSharesRD), [allSharesRD, poolsRD])

  const refreshHandler = useCallback(() => {
    reloadAllPools()
    reloadAllSharesByAddresses()
  }, [reloadAllPools, reloadAllSharesByAddresses])

  return (
    <>
      <Row justify="end" style={{ marginBottom: '20px' }}>
        <RefreshButton clickHandler={refreshHandler} disabled={disableRefresh} />
      </Row>
      <AssetsNav />
      {renderSharesTotal}
      {renderShares}
    </>
  )
}
