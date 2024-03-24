export interface ICoin {
  amount: string
  symbol: string
}

export type TWallet = {
  getAddress: () => string
  getMnemonic: () => string
  getPrivateKey: () => Uint8Array
  getNativeTokenBalance: () =>Promise<ICoin> 
}

export interface IWalletContext {
  wallet: TWallet | undefined
  create: () => void
  restore: (mnemonic: string) => void
  port: chrome.runtime.Port
  cipher: string | undefined
  shouldLogin: boolean
  shouldCreate: boolean
  login: (pw?:string) => void
}
