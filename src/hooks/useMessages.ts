import { EMessageAction, IMessage } from '@/types/messages'
import { useCallback } from 'react'

const useMessages = (port: chrome.runtime.Port) => {
  const sendMessage = useCallback(
    (action: EMessageAction, value: string, pw?: string) => {
      const msg: IMessage = {
        action,
        value,
        pw,
      }
      port.postMessage(msg)
    },
    []
  )

  const sendEncrypt = useCallback(
    (value: string, pw?: string) => {
      sendMessage(EMessageAction.ENCRYPT, value, pw)
    },
    [sendMessage]
  )

  const sendDecrypt = useCallback(
    (value: string, pw?: string) => {
      sendMessage(EMessageAction.DECRYPT, value, pw)
    },
    [sendMessage]
  )
  return {sendDecrypt, sendEncrypt}
}
export default useMessages