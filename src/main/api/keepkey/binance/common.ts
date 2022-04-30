import { HWWalletErrorId } from '../../../../shared/api/types'

export const fromHWWalletErrorType = (error: number): HWWalletErrorId => {
  switch (error) {
    default:
      return HWWalletErrorId.UNKNOWN
  }
}
