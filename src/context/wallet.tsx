import { MNEMONIC_KEY } from '@/constants/storage'
import SolanaWallet from '@/core/wallet'
import useLocalStorage from '@/hooks/useLocalStorage'
import useMessages from '@/hooks/useMessages'
import { IWalletContext, TWallet } from '@/types/wallet'
import { createContext, useCallback, useEffect, useState } from 'react'

export const WalletContext = createContext<IWalletContext>({
  wallet: undefined,
  create: () => {},
  restore: () => {},
  cipher: undefined,
  shouldCreate: false,
  shouldLogin: false,
  login: () => {},
  createPw: () => {},
})

const WalletContextProvider = ({ children }: { children: JSX.Element }) => {
  const [wallet, setWallet] = useState<TWallet>()
  const [cipher, setCipher] = useLocalStorage<string>(MNEMONIC_KEY)
  const [shouldLogin, setShouldLogin] = useState<boolean>(false)
  const [shouldCreate, setShouldCreate] = useState<boolean>(false)
  const { sendDecrypt, sendEncrypt } = useMessages()
  const create = useCallback(() => {
    setWallet(SolanaWallet.create())
  }, [])

  const restore = useCallback((mnemonic: string) => {
    setWallet(SolanaWallet.createFromMnemonic(mnemonic))
  }, [])

  const login = useCallback(
    async (pw?: string) => {
      if (!cipher) return
      const res = await sendDecrypt(cipher, pw)
      restore(res)
      setShouldLogin(false)
    },
    [cipher]
  )
  const createPw = useCallback(
    async (pw: string) => {
      if (!wallet) return
      const mnemonic = wallet.getMnemonic()
      const cipher = await sendEncrypt(mnemonic, pw)
      setCipher(cipher)
    },
    [setCipher, wallet]
  )

  useEffect(() => {
    login().catch(() => setShouldLogin(true))
  }, [cipher])

  useEffect(() => {
    setShouldCreate(!cipher && !wallet)
  }, [cipher, wallet])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        create,
        restore,
        cipher,
        shouldCreate,
        shouldLogin,
        login,
        createPw,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export default WalletContextProvider
