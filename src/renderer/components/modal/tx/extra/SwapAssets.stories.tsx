import React from 'react'

import { Story, Meta } from '@storybook/react'
import { assetAmount, AssetBNB, AssetRuneNative, assetToBase } from '@xchainjs/xchain-util'

import { SwapAssets, Props } from './SwapAssets'

const defaultProps: Props = {
  stepDescription: 'step 1',
  source: { asset: AssetRuneNative, amount: assetToBase(assetAmount(30)) },
  target: { asset: AssetBNB, amount: assetToBase(assetAmount(1)) },
  network: 'testnet'
}
export const Default: Story = () => <SwapAssets {...defaultProps} />
Default.storyName = 'default'

const meta: Meta = {
  component: SwapAssets,
  title: 'Components/modal/extra/SwapAssets',
  decorators: [
    (S: Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '30px',
          height: '100vH'
        }}>
        <div style={{ backgroundColor: 'white' }}>
          <S />
        </div>
      </div>
    )
  ]
}

export default meta
