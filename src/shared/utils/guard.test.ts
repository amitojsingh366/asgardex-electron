import { AssetRuneNative, baseAmount, bn } from '@xchainjs/xchain-util'

import {
  isAsset,
  isBaseAmount,
  isChain,
  isError,
  isKeystoreWallet,
  isLedgerWallet,
  isNetwork,
  isWalletType
} from './guard'

describe('shared/utils/guard', () => {
  describe('isAsset', () => {
    it('true for "THOR.RUNE"', () => {
      expect(isAsset('THOR.RUNE')).toBeTruthy()
    })
    it('true for AssetRuneNative', () => {
      expect(isAsset(AssetRuneNative)).toBeTruthy()
    })
    it('false for invalid chain ', () => {
      expect(isAsset({ symbol: 'THOR', chain: 'INVALID', ticker: 'RUNE' })).toBeFalsy()
    })
    it('false for invalid string ', () => {
      expect(isAsset('invalid')).toBeFalsy()
    })
  })

  describe('isChain', () => {
    it('true for "THOR"', () => {
      expect(isChain('THOR')).toBeTruthy()
    })
    it('true for ETH', () => {
      expect(isChain('ETH')).toBeTruthy()
    })
    it('false for invalid chain ', () => {
      expect(isChain('INVALID')).toBeFalsy()
    })
  })

  describe('isNetwork', () => {
    it('true for "mainnet"', () => {
      expect(isNetwork('mainnet')).toBeTruthy()
    })
    it('true for "stagenet"', () => {
      expect(isNetwork('stagenet')).toBeTruthy()
    })
    it('true for testnet', () => {
      expect(isNetwork('testnet')).toBeTruthy()
    })
    it('false for invalid network ', () => {
      expect(isNetwork('network')).toBeFalsy()
    })
  })

  describe('isBaseAmount', () => {
    it('true for "THOR"', () => {
      expect(isBaseAmount(baseAmount(1))).toBeTruthy()
    })
    it('false for BigNumber', () => {
      expect(isBaseAmount(bn('123'))).toBeFalsy()
    })
    it('false for string', () => {
      expect(isBaseAmount('123')).toBeFalsy()
    })
    it('false for number', () => {
      expect(isBaseAmount(2)).toBeFalsy()
    })
  })

  describe('isWalletType', () => {
    it('true for "ledger"', () => {
      expect(isWalletType('ledger')).toBeTruthy()
    })
    it('true for "keystore"', () => {
      expect(isWalletType('keystore')).toBeTruthy()
    })
    it('false for invalid string', () => {
      expect(isWalletType('invalid')).toBeFalsy()
    })
  })

  describe('isLedgerWallet', () => {
    it('false for "keystore"', () => {
      expect(isLedgerWallet('keystore')).toBeFalsy()
    })
    it('true for "ledger"', () => {
      expect(isLedgerWallet('ledger')).toBeTruthy()
    })
  })

  describe('isKeystoreWallet', () => {
    it('false for "ledger"', () => {
      expect(isKeystoreWallet('ledger')).toBeFalsy()
    })
    it('true for "keystore"', () => {
      expect(isKeystoreWallet('keystore')).toBeTruthy()
    })
  })

  describe('isError', () => {
    it('true for object with message key', () => {
      expect(isError(new Error('foo'))).toBeTruthy()
    })
    it('false for string', () => {
      expect(isError('foo')).toBeFalsy()
    })

    it('false for object with message key', () => {
      expect(isError({ message: 'message' })).toBeFalsy()
    })

    it('false for empty object', () => {
      expect(isError({})).toBeFalsy()
    })
  })
})
