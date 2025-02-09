import React, { useCallback, useMemo, useState } from 'react'

import { Address } from '@xchainjs/xchain-client'
import { Asset, AssetAmount, assetToBase, assetToString, BaseAmount } from '@xchainjs/xchain-util'
import { Row, Col, Grid } from 'antd'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { Network } from '../../../../shared/api/types'
import { WalletType } from '../../../../shared/wallet/types'
import * as AssetHelper from '../../../helpers/assetHelper'
import { eqAsset, eqString } from '../../../helpers/fp/eq'
import { getWalletAssetAmountFromBalances } from '../../../helpers/walletHelper'
import * as walletRoutes from '../../../routes/wallet'
import { OpenExplorerTxUrl, TxsPageRD } from '../../../services/clients'
import { MAX_ITEMS_PER_PAGE } from '../../../services/const'
import { EMPTY_LOAD_TXS_HANDLER } from '../../../services/wallet/const'
import { LoadTxsHandler, NonEmptyWalletBalances, WalletBalances } from '../../../services/wallet/types'
import { AssetInfo } from '../../uielements/assets/assetInfo'
import { BackLink } from '../../uielements/backLink'
import { Button, RefreshButton } from '../../uielements/button'
import { TxsTable } from '../txs/table/TxsTable'
import * as Styled from './AssetDetails.styles'

type Props = {
  walletType: WalletType
  walletIndex: number
  txsPageRD: TxsPageRD
  balances: O.Option<NonEmptyWalletBalances>
  asset: Asset
  openExplorerTxUrl: OpenExplorerTxUrl
  openExplorerAddressUrl?: FP.Lazy<void>
  reloadBalancesHandler?: FP.Lazy<void>
  loadTxsHandler?: LoadTxsHandler
  walletAddress: Address
  disableSend: boolean
  disableUpgrade: boolean
  network: Network
}

export const AssetDetails: React.FC<Props> = (props): JSX.Element => {
  const {
    walletType,
    walletIndex,
    txsPageRD,
    balances: oBalances,
    asset,
    reloadBalancesHandler = FP.constVoid,
    loadTxsHandler = EMPTY_LOAD_TXS_HANDLER,
    openExplorerTxUrl,
    openExplorerAddressUrl,
    walletAddress,
    disableSend,
    disableUpgrade,
    network
  } = props

  const [currentPage, setCurrentPage] = useState(1)

  const isDesktopView = Grid.useBreakpoint()?.lg ?? false
  const navigate = useNavigate()
  const intl = useIntl()

  const walletActionSendClick = useCallback(() => {
    const routeParams = {
      asset: assetToString(asset),
      walletAddress,
      walletType,
      walletIndex: walletIndex.toString()
    }
    navigate(walletRoutes.send.path(routeParams))
  }, [asset, navigate, walletAddress, walletIndex, walletType])

  const walletActionDepositClick = useCallback(() => {
    const path = walletRoutes.interact.path({
      interactType: 'bond',
      walletType,
      walletAddress,
      walletIndex: walletIndex.toString()
    })
    navigate(path)
  }, [walletType, walletAddress, walletIndex, navigate])

  const isNonNativeRuneAsset: boolean = useMemo(
    () => AssetHelper.isNonNativeRuneAsset(asset, network),
    [asset, network]
  )

  const walletActionUpgradeNonNativeRuneClick = useCallback(() => {
    const path = walletRoutes.upgradeRune.path({
      asset: assetToString(asset),
      walletAddress,
      network,
      walletType,
      walletIndex: walletIndex.toString()
    })
    navigate(path)
  }, [asset, walletAddress, network, walletType, walletIndex, navigate])

  const refreshHandler = useCallback(() => {
    loadTxsHandler({ limit: MAX_ITEMS_PER_PAGE, offset: (currentPage - 1) * MAX_ITEMS_PER_PAGE })
    reloadBalancesHandler()
  }, [currentPage, loadTxsHandler, reloadBalancesHandler])

  const onChangePagination = useCallback(
    (pageNo: number) => {
      loadTxsHandler({ limit: MAX_ITEMS_PER_PAGE, offset: (pageNo - 1) * MAX_ITEMS_PER_PAGE })
      setCurrentPage(pageNo)
    },
    [loadTxsHandler]
  )

  const oNoneNativeRuneAsset: O.Option<Asset> = useMemo(
    () =>
      FP.pipe(
        asset,
        O.fromPredicate((asset) => AssetHelper.isNonNativeRuneAsset(asset, network))
      ),
    [asset, network]
  )

  const getNonNativeRuneBalance: O.Option<(balances: WalletBalances) => O.Option<AssetAmount>> = useMemo(
    () =>
      FP.pipe(
        oNoneNativeRuneAsset,
        O.map((asset) =>
          getWalletAssetAmountFromBalances(
            (balance) => eqString.equals(balance.walletAddress, walletAddress) && eqAsset.equals(balance.asset, asset)
          )
        )
      ),
    [oNoneNativeRuneAsset, walletAddress]
  )

  const oNonNativeRuneAmount: O.Option<BaseAmount> = useMemo(
    () => FP.pipe(getNonNativeRuneBalance, O.ap(oBalances), O.flatten, O.map(assetToBase)),
    [getNonNativeRuneBalance, oBalances]
  )

  const actionColSpanDesktop = 12
  const actionColSpanMobile = 24

  const runeUpgradeDisabled: boolean = useMemo(() => {
    return (
      disableUpgrade &&
      FP.pipe(
        oNonNativeRuneAmount,
        O.map((amount) => amount.lt(0)),
        O.getOrElse<boolean>(() => true)
      )
    )
  }, [disableUpgrade, oNonNativeRuneAmount])

  return (
    <>
      <Row justify="space-between">
        <Col>
          <BackLink path={walletRoutes.assets.path()} />
        </Col>
        <Col>
          <RefreshButton clickHandler={refreshHandler} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <AssetInfo
            walletInfo={O.some({
              address: walletAddress,
              network,
              walletType
            })}
            asset={O.some(asset)}
            assetsWB={oBalances}
            network={network}
          />
        </Col>

        <Styled.Divider />

        <Styled.ActionRow>
          <Styled.ActionCol sm={{ span: actionColSpanMobile }} md={{ span: actionColSpanDesktop }}>
            <Styled.ActionWrapper>
              <Row justify="center">
                <Button
                  type="primary"
                  round="true"
                  sizevalue="xnormal"
                  onClick={disableSend ? undefined : walletActionSendClick}
                  disabled={disableSend}>
                  {intl.formatMessage({ id: 'wallet.action.send' })}
                </Button>
              </Row>
            </Styled.ActionWrapper>
          </Styled.ActionCol>
          {isNonNativeRuneAsset && (
            <Styled.ActionCol sm={{ span: actionColSpanMobile }} md={{ span: actionColSpanDesktop }}>
              <Styled.ActionWrapper>
                <Row justify="center">
                  <Button
                    type="primary"
                    round="true"
                    sizevalue="xnormal"
                    color="warning"
                    onClick={runeUpgradeDisabled ? undefined : walletActionUpgradeNonNativeRuneClick}
                    disabled={runeUpgradeDisabled}>
                    {intl.formatMessage({ id: 'wallet.action.upgrade' })}
                  </Button>
                </Row>
              </Styled.ActionWrapper>
            </Styled.ActionCol>
          )}
          {AssetHelper.isRuneNativeAsset(asset) && (
            <Styled.ActionCol sm={{ span: actionColSpanMobile }} md={{ span: actionColSpanDesktop }}>
              <Styled.ActionWrapper>
                <Row justify="center">
                  <Button
                    typevalue="outline"
                    round="true"
                    sizevalue="xnormal"
                    onClick={disableSend ? undefined : walletActionDepositClick}
                    disabled={disableSend}>
                    {intl.formatMessage({ id: 'wallet.action.deposit' })}
                  </Button>
                </Row>
              </Styled.ActionWrapper>
            </Styled.ActionCol>
          )}
        </Styled.ActionRow>
        <Styled.Divider />
      </Row>
      <Row>
        <Col span={24}>
          <Styled.TableHeadline isDesktop={isDesktopView}>
            {intl.formatMessage({ id: 'wallet.txs.history' })}{' '}
            <Styled.TableHeadlineLinkIcon onClick={openExplorerAddressUrl} />
          </Styled.TableHeadline>
        </Col>
        <Col span={24}>
          <TxsTable
            txsPageRD={txsPageRD}
            clickTxLinkHandler={openExplorerTxUrl}
            changePaginationHandler={onChangePagination}
            chain={asset.chain}
            network={network}
            walletAddress={walletAddress}
          />
        </Col>
      </Row>
    </>
  )
}
