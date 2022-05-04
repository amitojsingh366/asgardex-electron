import { HWWalletErrorId } from '../../../../shared/api/types'

export const fromHWWalletErrorType = (error: number): HWWalletErrorId => {
  switch (error) {
    default:
      return HWWalletErrorId.UNKNOWN
  }
}

export const getDerivationPath = (walletIndex: number): number[] => {
  return [0x80000000 + 44, 0x80000000 + 714, 0x80000000 + 0, 0, walletIndex]
}
