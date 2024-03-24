import { VaultService } from './src/lib/vault'
import { EMessageAction, IMessage } from './src/types/messages'

const vault = new VaultService()

const actionsMap = {
  [EMessageAction.DECRYPT]: async (
    msg: IMessage,
    port: chrome.runtime.Port
  ) => {
    const decryptedData = await vault.decrypt(msg.value, msg?.pw)
    port.postMessage({ ...msg, value: decryptedData })
  },
  [EMessageAction.ENCRYPT]: async (
    msg: IMessage,
    port: chrome.runtime.Port
  ) => {
    const encryptedData = await vault.encrypt(msg.value, msg.pw)
    port.postMessage({ ...msg, value: encryptedData })
  },
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg: IMessage) => {
    actionsMap[msg.action](msg, port)
  })
})

chrome.alarms.create('keep-alive', {
  periodInMinutes: 0.25,
})

chrome.alarms.onAlarm.addListener((alarm) => {})
