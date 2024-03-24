import SolanaWallet from '@/core/wallet'
import { IWalletContext, TWallet } from '@/types/wallet'
import { createContext, useCallback, useState } from 'react'

export const WalletContext = createContext<IWalletContext>({
  wallet: undefined,
  create: () => {},
  restore: () => {},
})

const WalletContextProvider = ({ children }: { children: JSX.Element }) => {
  const [wallet, setWallet] = useState<TWallet>()

  const create = useCallback(() => {
    setWallet(SolanaWallet.create())
  }, [])

  const restore = useCallback((mnemonic: string) => {
    setWallet(SolanaWallet.createFromMnemonic(mnemonic))
  }, [])

  return (
    <WalletContext.Provider value={{ wallet, create, restore }}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletContextProvider
