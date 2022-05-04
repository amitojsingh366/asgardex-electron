export const getDerivationPath = (walletIndex: number): number[] => {
  return [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, walletIndex]
}
