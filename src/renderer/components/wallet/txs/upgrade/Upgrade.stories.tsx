import React from 'react'

import * as RD from '@devexperts/remote-data-ts'
import { Story, Meta } from '@storybook/react'
import { TxHash, TxParams } from '@xchainjs/xchain-client'
import {
  assetAmount,
  AssetBNB,
  AssetRune67C,
  assetToBase,
  BaseAmount,
  baseAmount,
  BNBChain
} from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/lib/function'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'

import { getMockRDValueFactory, RDStatus } from '../../../../../shared/mock/rdByStatus'
import { mockValidatePassword$ } from '../../../../../shared/mock/wallet'
import { WalletType } from '../../../../../shared/wallet/types'
import { BNB_DECIMAL } from '../../../../helpers/assetHelper'
import { mockWalletBalance } from '../../../../helpers/test/testWalletHelper'
import { INITIAL_UPGRADE_RUNE_STATE } from '../../../../services/chain/const'
import { FeeRD, UpgradeRuneParams, UpgradeRuneTxState, UpgradeRuneTxState$ } from '../../../../services/chain/types'
import { ApiError, ErrorId } from '../../../../services/wallet/types'
import { WalletBalances, WalletBalance } from '../../../../services/wallet/types'
import { Upgrade as Component } from './Upgrade'

const mockTxState$ = (states: UpgradeRuneTxState[]): UpgradeRuneTxState$ =>
  Rx.interval(1000).pipe(
    // stop interval stream if we don't have state in states anymore
    RxOp.takeWhile((value) => !!states[value]),
    RxOp.map((value) => states[value]),
    RxOp.startWith(INITIAL_UPGRADE_RUNE_STATE)
  )

const getBalances = (balances: WalletBalances) => NEA.fromArray<WalletBalance>(balances)

type Args = {
  txRDStatus: RDStatus & 'animated'
  feeRDStatus: RDStatus
  balance: number
  hasLedger: boolean
  validAddress: boolean
  walletType: WalletType
}

const Template: Story<Args> = ({ txRDStatus, feeRDStatus, balance, hasLedger, walletType, validAddress }) => {
  const bnbBalance: WalletBalance = mockWalletBalance({
    asset: AssetBNB,
    amount: assetToBase(assetAmount(balance)),
    walletAddress: 'BNB address'
  })

  const runeBnbBalance: WalletBalance = mockWalletBalance({
    asset: AssetRune67C,
    amount: assetToBase(assetAmount(2002)),
    walletAddress: 'BNB.Rune address'
  })

  const runeNativeBalance: WalletBalance = mockWalletBalance({
    amount: assetToBase(assetAmount(0))
  })

  const feeRD: FeeRD = FP.pipe(
    feeRDStatus,
    getMockRDValueFactory<Error, BaseAmount>(
      () => baseAmount(3750000),
      () => Error('getting fees failed')
    )
  )

  const upgrade$ = (p: UpgradeRuneParams): UpgradeRuneTxState$ => {
    console.log('upgrade$:', p)

    const total = 3
    if (txRDStatus === 'animated')
      return mockTxState$([
        { steps: { current: 1, total }, status: RD.pending },
        { steps: { current: 2, total }, status: RD.pending },
        { steps: { current: 3, total }, status: RD.pending },
        { steps: { current: 3, total }, status: RD.success('tx-hash') }
      ])

    return Rx.of({
      steps: { current: txRDStatus === 'initial' ? 0 : 3, total },
      status: FP.pipe(
        txRDStatus,
        getMockRDValueFactory<ApiError, TxHash>(
          () => 'tx-hash',
          () => ({ errorId: ErrorId.VALIDATE_POOL, msg: 'invalid pool address' })
        )
      )
    })
  }

  return (
    <Component
      runeAsset={{
        asset: AssetRune67C,
        decimal: BNB_DECIMAL
      }}
      runeNativeAddress="rune-native-address"
      runeNativeLedgerAddress={hasLedger ? O.some('rune-native-ledger-address') : O.none}
      walletAddress="bnb-address"
      addressValidation={(_: string) => validAddress}
      walletType={walletType}
      walletIndex={0}
      targetPoolAddressRD={RD.success({ chain: BNBChain, address: 'bnb-pool-address', router: O.none, halted: false })}
      validatePassword$={mockValidatePassword$}
      fee={feeRD}
      upgrade$={upgrade$}
      balances={getBalances([bnbBalance, runeBnbBalance, runeNativeBalance])}
      reloadFeeHandler={(p: TxParams) => console.log('reload fees ', p)}
      getExplorerTxUrl={(txHash: TxHash) => O.some(`url/asset-${txHash}`)}
      reloadBalancesHandler={() => console.log(`reload balances`)}
      openExplorerTxUrl={(txHash: TxHash) => {
        console.log(`Open explorer - tx hash ${txHash}`)
        return Promise.resolve(true)
      }}
      network="testnet"
    />
  )
}

export const Default = Template.bind({})

const meta: Meta = {
  component: Component,
  title: 'Wallet/Upgrade',
  argTypes: {
    txRDStatus: {
      name: 'txRDStatus',
      control: { type: 'select', options: ['pending', 'error', 'success', 'animated'] },
      defaultValue: 'success'
    },
    feeRDStatus: {
      name: 'feeRD',
      control: { type: 'select', options: ['initial', 'pending', 'error', 'success'] },
      defaultValue: 'success'
    },
    walletType: {
      name: 'wallet type',
      control: { type: 'select', options: ['keystore', 'ledger'] },
      defaultValue: 'keystore'
    },
    balance: {
      name: 'BNB.RUNE Balance',
      control: { type: 'text' },
      defaultValue: '1001'
    },
    hasLedger: {
      name: 'has Ledger connected',
      control: { type: 'boolean' },
      defaultValue: true
    },
    validAddress: {
      name: 'valid address',
      control: { type: 'boolean' },
      defaultValue: true
    }
  }
}

export default meta
