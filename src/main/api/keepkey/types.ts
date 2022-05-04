import { Client } from 'keepkey-sdk/lib/client'

import { Network } from '../../../shared/api/types'

export type VerifyAddressHandler = (params: {
  keepkey: Client
  network: Network
  walletIndex: number
}) => Promise<boolean>
