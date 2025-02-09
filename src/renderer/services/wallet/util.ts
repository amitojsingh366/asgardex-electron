import { Asset, assetToString, baseAmount } from '@xchainjs/xchain-util'
import * as A from 'fp-ts/Array'
import * as FP from 'fp-ts/function'
import * as O from 'fp-ts/lib/Option'
import * as N from 'fp-ts/number'
import * as Ord from 'fp-ts/Ord'
import * as S from 'fp-ts/string'
import { IntlShape } from 'react-intl'

import { HWWalletErrorId } from '../../../shared/api/types'
import { WalletType } from '../../../shared/wallet/types'
import { eqAsset } from '../../helpers/fp/eq'
import { ordBaseAmount } from '../../helpers/fp/ord'
import { WalletBalances } from '../clients'
import { KeystoreState, KeystoreContent, Phrase, BalanceMonoid, WalletBalance } from './types'

export const getKeystoreContent = (state: KeystoreState): O.Option<KeystoreContent> =>
  FP.pipe(state, O.chain(FP.identity))

export const getPhrase = (state: KeystoreState): O.Option<Phrase> =>
  FP.pipe(
    getKeystoreContent(state),
    O.map(({ phrase }) => phrase)
  )

export const hasKeystoreContent = (state: KeystoreState): boolean => O.isSome(getKeystoreContent(state))

export const hasImportedKeystore = (state: KeystoreState): boolean => O.isSome(state)

export const isLocked = (state: KeystoreState): boolean => !hasImportedKeystore(state) || !hasKeystoreContent(state)

export const filterNullableBalances = (balances: WalletBalances) => {
  return FP.pipe(
    balances,
    A.filter(({ amount }) => Ord.gt(ordBaseAmount)(amount, baseAmount(0)))
  )
}

// We will compare asset strings and they automatically
// be grouped by their chains in alphabetic order
const byAsset = Ord.Contravariant.contramap(S.Ord, (balance: WalletBalance) => assetToString(balance.asset))

export const sortBalances = (balances: WalletBalances, orders: string[]) => {
  const getBalanceIndex = (balance: WalletBalance) => orders.findIndex((ticker) => ticker === balance.asset.ticker)
  const byTickersOrder = Ord.Contravariant.contramap(N.Ord, getBalanceIndex)
  return FP.pipe(
    balances,
    // split array for 2 parts: sortable assets and the rest
    A.reduce([[], []] as [WalletBalances, WalletBalances], (acc, cur) => {
      if (orders.includes(cur.asset.ticker)) {
        acc[0].push(cur)
      } else {
        acc[1].push(cur)
      }
      return acc
    }),
    ([left, right]) => BalanceMonoid.concat(FP.pipe(left, A.sort(byTickersOrder)), FP.pipe(right, A.sort(byAsset)))
  )
}

// TODO (asgdx-team)
// `getBalanceByAsset` is very similar to `getWalletBalanceByAsset` in `walletHelper`
// Move it to `walletHelper`
export const getBalanceByAsset =
  (asset: Asset) =>
  (balances: WalletBalances): O.Option<WalletBalance> =>
    FP.pipe(
      balances,
      A.findFirst((assetWithBalance) => eqAsset.equals(assetWithBalance.asset, asset))
    )

export const walletTypeToI18n = (type: WalletType, intl: IntlShape) => {
  switch (type) {
    case 'ledger':
      return intl.formatMessage({ id: 'ledger.title' })
    case 'keepkey':
      return 'KeepKey'
    case 'keystore':
      return intl.formatMessage({ id: 'common.keystore' })
    default:
      return `Unknown ${type}`
  }
}

export const HWWalletErrorIdToI18n = (errorId: HWWalletErrorId, intl: IntlShape) => {
  switch (errorId) {
    case HWWalletErrorId.NO_DEVICE:
      return intl.formatMessage({ id: 'ledger.error.nodevice' })
    case HWWalletErrorId.ALREADY_IN_USE:
      return intl.formatMessage({ id: 'ledger.error.inuse' })
    case HWWalletErrorId.APP_NOT_OPENED:
      return intl.formatMessage({ id: 'ledger.error.appnotopened' })
    case HWWalletErrorId.NO_APP:
      return intl.formatMessage({ id: 'ledger.error.noapp' })
    case HWWalletErrorId.GET_ADDRESS_FAILED:
      return intl.formatMessage({ id: 'ledger.error.getaddressfailed' })
    case HWWalletErrorId.SIGN_FAILED:
      return intl.formatMessage({ id: 'ledger.error.signfailed' })
    case HWWalletErrorId.SEND_TX_FAILED:
      return intl.formatMessage({ id: 'ledger.error.sendfailed' })
    case HWWalletErrorId.DEPOSIT_TX_FAILED:
      return intl.formatMessage({ id: 'ledger.error.deposit' })
    case HWWalletErrorId.DENIED:
      return intl.formatMessage({ id: 'ledger.error.denied' })
    case HWWalletErrorId.INVALID_PUBKEY:
      return intl.formatMessage({ id: 'ledger.error.invalidpubkey' })
    case HWWalletErrorId.INVALID_DATA:
      return intl.formatMessage({ id: 'ledger.error.invaliddata' })
    case HWWalletErrorId.REJECTED:
      return intl.formatMessage({ id: 'ledger.error.rejected' })
    case HWWalletErrorId.TIMEOUT:
      return intl.formatMessage({ id: 'ledger.error.timeout' })
    case HWWalletErrorId.INVALID_RESPONSE:
      return intl.formatMessage({ id: 'ledger.error.invalidresponse' })
    case HWWalletErrorId.NOT_IMPLEMENTED:
      return intl.formatMessage({ id: 'ledger.error.notimplemented' })
    // default is similar to HWWalletErrorId.UNKNOWN
    default:
      return intl.formatMessage({ id: 'ledger.error.unknown' })
  }
}
