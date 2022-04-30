import { KeepKeyClient } from 'keepkey-sdk'

export const getKeepKeyClient = async () => {
  const keepkey = await new KeepKeyClient({
    serviceName: 'ASGARDEX',
    serviceKey: 'ASGARDEX',
    serviceImageUrl: 'https://github.com/amitojsingh366/asgardex-electron/raw/develop/internals/img/asgardex-logo.png'
  }).init()

  return keepkey
}
