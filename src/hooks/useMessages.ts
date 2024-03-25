import { EMessageAction, IMessage } from '@/types/messages'
import { useCallback } from 'react'

const useMessages = () => {
  const sendMessage = useCallback(
    (action: EMessageAction, value: string, pw?: string):Promise<string> =>
      new Promise((res, rej) => {
        const port = chrome.runtime.connect()
        const msg: IMessage = {
          action,
          value,
          pw,
        }
        port.postMessage(msg)
        const handleMessage = (response: IMessage) => {
          port.disconnect()
          if (response.action !== msg.action) return
          if (response.error) {
            rej(new Error('Something went wrong'))
          } else {
            res(response.value)
          }
        }
        port.onMessage.addListener(handleMessage)
        port.onDisconnect.addListener(() => {
          rej(new Error('Failed to connect to the extension'))
        })
      }),
    []
  )

  const sendEncrypt = useCallback(
    (value: string, pw?: string) =>
      sendMessage(EMessageAction.ENCRYPT, value, pw),
    [sendMessage]
  )

  const sendDecrypt = useCallback(
    (value: string, pw?: string) =>
      sendMessage(EMessageAction.DECRYPT, value, pw),
    [sendMessage]
  )
  return { sendDecrypt, sendEncrypt }
}
export default useMessages
