import { MNEMONIC_KEY } from '@/constants/storage'
import SolanaWallet from '@/core/wallet'
import useLocalStorage from '@/hooks/useLocalStorage'
import useMessages from '@/hooks/useMessages'
import { EMessageAction, IMessage } from '@/types/messages'
import { IWalletContext, TWallet } from '@/types/wallet'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export const WalletContext = createContext<IWalletContext>({
  wallet: undefined,
  create: () => {},
  restore: () => {},
  port: chrome.runtime.connect(),
  cipher: undefined,
  shouldCreate: false,
  shouldLogin: false,
  login: ()=> {}
})

const WalletContextProvider = ({ children }: { children: JSX.Element }) => {
  const [wallet, setWallet] = useState<TWallet>()
  const [cipher, setCipher] = useLocalStorage<string>(MNEMONIC_KEY)
  const [shouldLogin, setShouldLogin] = useState<boolean>(false)
  const [shouldCreate, setShouldCreate] = useState<boolean>(false)
  const port = useMemo(() => chrome.runtime.connect(), [])
  const { sendDecrypt } = useMessages(port)
  const create = useCallback(() => {
    setWallet(SolanaWallet.create())
  }, [])

  const restore = useCallback((mnemonic: string) => {
    try {
      setWallet(SolanaWallet.createFromMnemonic(mnemonic))
      setShouldLogin(false)
    } catch (e) {
      setShouldLogin(true)
    }
  }, [])

  const login = useCallback(
    (pw?: string) => {
      if (!cipher) return
      sendDecrypt(cipher, pw)
      setShouldLogin(false)
    },
    [cipher]
  )

  useEffect(() => {
    login()
  }, [cipher])

  useEffect(() => {
    setShouldCreate(!cipher && !wallet)
  }, [cipher, wallet])

  useEffect(() => {
    port.onMessage.addListener((msg: IMessage) => {
      switch (msg.action) {
        case EMessageAction.DECRYPT:
          return msg.error ? setShouldLogin(true) : restore(msg.value)
        case EMessageAction.ENCRYPT:
          return setCipher(msg.value)
        default:
          throw new Error('Not implemented')
      }
    })
  }, [setCipher, port])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        create,
        restore,
        port,
        cipher,
        shouldCreate,
        shouldLogin,
        login
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export default WalletContextProvider
