/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react'

import * as RD from '@devexperts/remote-data-ts'
import { Address, XChainClient } from '@xchainjs/xchain-client'
import {
  BCHChain,
  BNBChain,
  BTCChain,
  Chain,
  DOGEChain,
  ETHChain,
  LTCChain,
  TerraChain,
  THORChain
} from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/function'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { useObservableState } from 'observable-hooks'
import { useIntl } from 'react-intl'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'

import { Network } from '../../../shared/api/types'
import { WalletAddress } from '../../../shared/wallet/types'
import { AssetsNav } from '../../components/wallet/assets'
import { WalletSettings } from '../../components/wallet/settings/'
import { useAppContext } from '../../contexts/AppContext'
import { useBinanceContext } from '../../contexts/BinanceContext'
import { useBitcoinCashContext } from '../../contexts/BitcoinCashContext'
import { useBitcoinContext } from '../../contexts/BitcoinContext'
import { useChainContext } from '../../contexts/ChainContext'
import { useDogeContext } from '../../contexts/DogeContext'
import { useEthereumContext } from '../../contexts/EthereumContext'
import { useLitecoinContext } from '../../contexts/LitecoinContext'
import { useTerraContext } from '../../contexts/TerraContext'
import { useThorchainContext } from '../../contexts/ThorchainContext'
import { useWalletContext } from '../../contexts/WalletContext'
import {
  filterEnabledChains,
  isBchChain,
  isDogeChain,
  isBnbChain,
  isBtcChain,
  isLtcChain,
  isThorChain,
  isTerraChain
} from '../../helpers/chainHelper'
import { sequenceTOptionFromArray } from '../../helpers/fpHelpers'
import { useKeepKey } from '../../hooks/useKeepKey'
import { useLedger } from '../../hooks/useLedger'
import { DEFAULT_NETWORK } from '../../services/const'
import { WalletAddressAsync } from '../../services/wallet/types'
import { HWWalletErrorIdToI18n } from '../../services/wallet/util'
import { getPhrase } from '../../services/wallet/util'
import { walletAccount$ } from './WalletSettingsView.helper'

export const WalletSettingsView: React.FC = (): JSX.Element => {
  const intl = useIntl()
  const { keystoreService } = useWalletContext()
  const { keystore$, lock, removeKeystore, exportKeystore, validatePassword$ } = keystoreService

  const { network$ } = useAppContext()
  const network = useObservableState<Network>(network$, DEFAULT_NETWORK)

  const { address$: thorAddressUI$ } = useThorchainContext()
  const { addressUI$: bnbAddressUI$ } = useBinanceContext()
  const { addressUI$: ethAddressUI$ } = useEthereumContext()
  const { addressUI$: btcAddressUI$ } = useBitcoinContext()
  const { addressUI$: ltcAddressUI$ } = useLitecoinContext()
  const { addressUI$: bchAddressUI$ } = useBitcoinCashContext()
  const { addressUI$: dogeAddressUI$ } = useDogeContext()
  const { addressUI$: terraAddressUI$ } = useTerraContext()
  const oRuneNativeAddress: O.Option<WalletAddress> = useObservableState(thorAddressUI$, O.none)
  const runeNativeAddress = FP.pipe(
    oRuneNativeAddress,
    O.fold(
      () => '',
      ({ address }) => address
    )
  )

  const phrase$ = useMemo(() => FP.pipe(keystore$, RxOp.map(getPhrase)), [keystore$])
  const phrase = useObservableState(phrase$, O.none)

  const {
    askAddress: askLedgerThorAddress,
    verifyAddress: verifyLedgerThorAddress,
    address: thorLedgerAddressRD,
    removeAddress: removeLedgerThorAddress
  } = useLedger(THORChain)

  const {
    askAddress: askLedgerBnbAddress,
    verifyAddress: verifyLedgerBnbAddress,
    address: bnbLedgerAddressRD,
    removeAddress: removeLedgerBnbAddress
  } = useLedger(BNBChain)

  const {
    askAddress: askLedgerBtcAddress,
    verifyAddress: verifyLedgerBtcAddress,
    address: btcLedgerAddressRD,
    removeAddress: removeLedgerBtcAddress
  } = useLedger(BTCChain)

  const {
    askAddress: askLedgerLtcAddress,
    verifyAddress: verifyLedgerLtcAddress,
    address: ltcLedgerAddressRD,
    removeAddress: removeLedgerLtcAddress
  } = useLedger(LTCChain)

  const {
    askAddress: askLedgerBchAddress,
    verifyAddress: verifyLedgerBchAddress,
    address: bchLedgerAddressRD,
    removeAddress: removeLedgerBchAddress
  } = useLedger(BCHChain)

  const {
    askAddress: askLedgerDOGEAddress,
    verifyAddress: verifyLedgerDOGEAddress,
    address: dogeLedgerAddressRD,
    removeAddress: removeLedgerDOGEAddress
  } = useLedger(DOGEChain)

  const {
    askAddress: askLedgerTerraAddress,
    verifyAddress: verifyLedgerTerraAddress,
    address: terraLedgerAddressRD,
    removeAddress: removeLedgerTerraAddress
  } = useLedger(TerraChain)

  const {
    askAddress: askKeepKeyThorAddress,
    address: thorKeepKeyAddressRD,
    verifyAddress: verifyKeepKeyThorAddress,
    removeAddress: removeKeepKeyThorAddress
  } = useKeepKey(THORChain)

  const {
    askAddress: askKeepKeyBnbAddress,
    address: bnbKeepKeyAddressRD,
    verifyAddress: verifyKeepKeyBnbAddress,
    removeAddress: removeKeepKeyBnbAddress
  } = useKeepKey(BNBChain)

  const {
    askAddress: askKeepKeyBtcAddress,
    address: btcKeepKeyAddressRD,
    verifyAddress: verifyKeepKeyBtcAddress,
    removeAddress: removeKeepKeyBtcAddress
  } = useKeepKey(BTCChain)

  const {
    askAddress: askKeepKeyLtcAddress,
    address: ltcKeepKeyAddressRD,
    verifyAddress: verifyKeepKeyLtcAddress,
    removeAddress: removeKeepKeyLtcAddress
  } = useKeepKey(LTCChain)

  const {
    askAddress: askKeepKeyBchAddress,
    address: bchKeepKeyAddressRD,
    verifyAddress: verifyKeepKeyBchAddress,
    removeAddress: removeKeepKeyBchAddress
  } = useKeepKey(BCHChain)

  const {
    askAddress: askKeepKeyDOGEAddress,
    address: dogeKeepKeyAddressRD,
    verifyAddress: verifyKeepKeyDOGEAddress,
    removeAddress: removeKeepKeyDOGEAddress
  } = useKeepKey(DOGEChain)

  const addLedgerAddressHandler = (chain: Chain, walletIndex: number) => {
    if (isThorChain(chain)) return askLedgerThorAddress(walletIndex)
    if (isBnbChain(chain)) return askLedgerBnbAddress(walletIndex)
    if (isBtcChain(chain)) return askLedgerBtcAddress(walletIndex)
    if (isLtcChain(chain)) return askLedgerLtcAddress(walletIndex)
    if (isBchChain(chain)) return askLedgerBchAddress(walletIndex)
    if (isDogeChain(chain)) return askLedgerDOGEAddress(walletIndex)
    if (isTerraChain(chain)) return askLedgerTerraAddress(walletIndex)

    return FP.constVoid
  }

  const verifyLedgerAddressHandler = async (chain: Chain, walletIndex: number) => {
    if (isThorChain(chain)) return verifyLedgerThorAddress(walletIndex)
    if (isBnbChain(chain)) return verifyLedgerBnbAddress(walletIndex)
    if (isBtcChain(chain)) return verifyLedgerBtcAddress(walletIndex)
    if (isLtcChain(chain)) return verifyLedgerLtcAddress(walletIndex)
    if (isBchChain(chain)) return verifyLedgerBchAddress(walletIndex)
    if (isDogeChain(chain)) return verifyLedgerDOGEAddress(walletIndex)
    if (isTerraChain(chain)) return verifyLedgerTerraAddress(walletIndex)

    return false
  }

  const removeLedgerAddressHandler = (chain: Chain) => {
    if (isThorChain(chain)) return removeLedgerThorAddress()
    if (isBnbChain(chain)) return removeLedgerBnbAddress()
    if (isBtcChain(chain)) return removeLedgerBtcAddress()
    if (isLtcChain(chain)) return removeLedgerLtcAddress()
    if (isBchChain(chain)) return removeLedgerBchAddress()
    if (isDogeChain(chain)) return removeLedgerDOGEAddress()
    if (isTerraChain(chain)) return removeLedgerTerraAddress()

    return FP.constVoid
  }

  const addKeepKeyAddressHandler = (chain: Chain, walletIndex: number) => {
    if (isThorChain(chain)) return askKeepKeyThorAddress(walletIndex)
    if (isBnbChain(chain)) return askKeepKeyBnbAddress(walletIndex)
    if (isBtcChain(chain)) return askKeepKeyBtcAddress(walletIndex)
    if (isLtcChain(chain)) return askKeepKeyLtcAddress(walletIndex)
    if (isBchChain(chain)) return askKeepKeyBchAddress(walletIndex)
    if (isDogeChain(chain)) return askKeepKeyDOGEAddress(walletIndex)

    return FP.constVoid
  }

  const verifyKeepKeyAddressHandler = async (chain: Chain, walletIndex: number) => {
    if (isThorChain(chain)) return verifyKeepKeyThorAddress(walletIndex)
    if (isBnbChain(chain)) return verifyKeepKeyBnbAddress(walletIndex)
    if (isBtcChain(chain)) return verifyKeepKeyBtcAddress(walletIndex)
    if (isLtcChain(chain)) return verifyKeepKeyLtcAddress(walletIndex)
    if (isBchChain(chain)) return verifyKeepKeyBchAddress(walletIndex)
    if (isDogeChain(chain)) return verifyKeepKeyDOGEAddress(walletIndex)

    return false
  }

  const removeKeepKeyAddressHandler = (chain: Chain) => {
    if (isThorChain(chain)) return removeKeepKeyThorAddress()
    if (isBnbChain(chain)) return removeKeepKeyBnbAddress()
    if (isBtcChain(chain)) return removeKeepKeyBtcAddress()
    if (isLtcChain(chain)) return removeKeepKeyLtcAddress()
    if (isBchChain(chain)) return removeKeepKeyBchAddress()
    if (isDogeChain(chain)) return removeKeepKeyDOGEAddress()

    return FP.constVoid
  }

  const { clientByChain$ } = useChainContext()

  const oBNBClient = useObservableState(clientByChain$(BNBChain), O.none)
  const oETHClient = useObservableState(clientByChain$(ETHChain), O.none)
  const oBTCClient = useObservableState(clientByChain$(BTCChain), O.none)
  const oBCHClient = useObservableState(clientByChain$(BCHChain), O.none)
  const oTHORClient = useObservableState(clientByChain$(THORChain), O.none)
  const oLTCClient = useObservableState(clientByChain$(LTCChain), O.none)
  const oDOGEClient = useObservableState(clientByChain$(DOGEChain), O.none)
  const oTerraClient = useObservableState(clientByChain$(TerraChain), O.none)

  const clickAddressLinkHandler = (chain: Chain, address: Address) => {
    const openExplorerAddressUrl = (client: XChainClient) => {
      const url = client.getExplorerAddressUrl(address)
      window.apiUrl.openExternal(url)
    }

    switch (chain) {
      case BNBChain:
        FP.pipe(oBNBClient, O.map(openExplorerAddressUrl))
        break
      case BTCChain:
        FP.pipe(oBTCClient, O.map(openExplorerAddressUrl))
        break
      case BCHChain:
        FP.pipe(oBCHClient, O.map(openExplorerAddressUrl))
        break
      case ETHChain:
        FP.pipe(oETHClient, O.map(openExplorerAddressUrl))
        break
      case THORChain:
        FP.pipe(oTHORClient, O.map(openExplorerAddressUrl))
        break
      case LTCChain:
        FP.pipe(oLTCClient, O.map(openExplorerAddressUrl))
        break
      case DOGEChain:
        FP.pipe(oDOGEClient, O.map(openExplorerAddressUrl))
        break
      case TerraChain:
        FP.pipe(oTerraClient, O.map(openExplorerAddressUrl))
        break
      default:
        console.warn(`Chain ${chain} has not been implemented`)
    }
  }

  const thorLedgerWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'ledger',
      address: FP.pipe(
        thorLedgerAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, thorLedgerAddressRD]
  )

  const bnbLedgerWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'ledger',
      address: FP.pipe(
        bnbLedgerAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, bnbLedgerAddressRD]
  )

  const btcLedgerWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'ledger',
      address: FP.pipe(
        btcLedgerAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, btcLedgerAddressRD]
  )

  const ltcLedgerWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'ledger',
      address: FP.pipe(
        ltcLedgerAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, ltcLedgerAddressRD]
  )

  const bchLedgerWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'ledger',
      address: FP.pipe(
        bchLedgerAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, bchLedgerAddressRD]
  )

  const dogeLedgerWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'ledger',
      address: FP.pipe(
        dogeLedgerAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, dogeLedgerAddressRD]
  )

  const terraLedgerWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'ledger',
      address: FP.pipe(
        terraLedgerAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, terraLedgerAddressRD]
  )

  const thorKeepKeyWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'keepkey',
      address: FP.pipe(
        thorKeepKeyAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, thorKeepKeyAddressRD]
  )

  const bnbKeepKeyWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'keepkey',
      address: FP.pipe(
        bnbKeepKeyAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, bnbKeepKeyAddressRD]
  )

  const btcKeepKeyWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'keepkey',
      address: FP.pipe(
        btcKeepKeyAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, btcKeepKeyAddressRD]
  )

  const ltcKeepKeyWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'keepkey',
      address: FP.pipe(
        ltcKeepKeyAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, ltcKeepKeyAddressRD]
  )

  const bchKeepKeyWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'keepkey',
      address: FP.pipe(
        bchKeepKeyAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, bchKeepKeyAddressRD]
  )

  const dogeKeepKeyWalletAddress: WalletAddressAsync = useMemo(
    () => ({
      type: 'keepkey',
      address: FP.pipe(
        dogeKeepKeyAddressRD,
        RD.mapLeft(({ errorId, msg }) => Error(`${HWWalletErrorIdToI18n(errorId, intl)} (${msg})`))
      )
    }),
    [intl, dogeKeepKeyAddressRD]
  )

  const walletAccounts$ = useMemo(() => {
    const thorWalletAccount$ = walletAccount$({
      addressUI$: thorAddressUI$,
      ledgerAddress: thorLedgerWalletAddress,
      keepkeyAddress: thorKeepKeyWalletAddress,
      chain: THORChain
    })
    const btcWalletAccount$ = walletAccount$({
      addressUI$: btcAddressUI$,
      ledgerAddress: btcLedgerWalletAddress,
      keepkeyAddress: btcKeepKeyWalletAddress,
      chain: BTCChain
    })
    const ethWalletAccount$ = walletAccount$({ addressUI$: ethAddressUI$, chain: ETHChain })
    const bnbWalletAccount$ = walletAccount$({
      addressUI$: bnbAddressUI$,
      ledgerAddress: bnbLedgerWalletAddress,
      keepkeyAddress: bnbKeepKeyWalletAddress,
      chain: BNBChain
    })
    const bchWalletAccount$ = walletAccount$({
      addressUI$: bchAddressUI$,
      ledgerAddress: bchLedgerWalletAddress,
      keepkeyAddress: bchKeepKeyWalletAddress,
      chain: BCHChain
    })
    const ltcWalletAccount$ = walletAccount$({
      addressUI$: ltcAddressUI$,
      ledgerAddress: ltcLedgerWalletAddress,
      keepkeyAddress: ltcKeepKeyWalletAddress,
      chain: LTCChain
    })
    const dogeWalletAccount$ = walletAccount$({
      addressUI$: dogeAddressUI$,
      ledgerAddress: dogeLedgerWalletAddress,
      keepkeyAddress: dogeKeepKeyWalletAddress,
      chain: DOGEChain
    })
    const terraWalletAccount$ = walletAccount$({
      addressUI$: terraAddressUI$,
      ledgerAddress: terraLedgerWalletAddress,
      chain: TerraChain
    })

    return FP.pipe(
      // combineLatest is for the future additional accounts
      Rx.combineLatest(
        filterEnabledChains({
          THOR: [thorWalletAccount$],
          BTC: [btcWalletAccount$],
          ETH: [ethWalletAccount$],
          BNB: [bnbWalletAccount$],
          BCH: [bchWalletAccount$],
          LTC: [ltcWalletAccount$],
          DOGE: [dogeWalletAccount$],
          TERRA: [terraWalletAccount$]
        })
      ),
      RxOp.map(A.filter(O.isSome)),
      RxOp.map(sequenceTOptionFromArray)
    )
  }, [
    thorAddressUI$,
    thorLedgerWalletAddress,
    thorKeepKeyWalletAddress,
    btcAddressUI$,
    btcLedgerWalletAddress,
    btcKeepKeyWalletAddress,
    ethAddressUI$,
    bnbAddressUI$,
    bnbLedgerWalletAddress,
    bnbKeepKeyWalletAddress,
    bchAddressUI$,
    bchLedgerWalletAddress,
    bchKeepKeyWalletAddress,
    ltcAddressUI$,
    ltcLedgerWalletAddress,
    ltcKeepKeyWalletAddress,
    dogeAddressUI$,
    dogeLedgerWalletAddress,
    dogeKeepKeyWalletAddress,
    terraAddressUI$,
    terraLedgerWalletAddress
  ])
  const walletAccounts = useObservableState(walletAccounts$, O.none)

  return (
    <div style={{ marginTop: '50px' }}>
      <AssetsNav />
      <WalletSettings
        network={network}
        runeNativeAddress={runeNativeAddress}
        lockWallet={lock}
        removeKeystore={removeKeystore}
        exportKeystore={exportKeystore}
        addLedgerAddress={addLedgerAddressHandler}
        verifyLedgerAddress={verifyLedgerAddressHandler}
        removeLedgerAddress={removeLedgerAddressHandler}
        addKeepKeyAddress={addKeepKeyAddressHandler}
        verifyKeepKeyAddress={verifyKeepKeyAddressHandler}
        removeKeepKeyAddress={removeKeepKeyAddressHandler}
        phrase={phrase}
        walletAccounts={walletAccounts}
        clickAddressLinkHandler={clickAddressLinkHandler}
        validatePassword$={validatePassword$}
      />
    </div>
  )
}
