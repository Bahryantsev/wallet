import { store } from './src/lib/storage'
import { VaultService } from './src/lib/vault'
import { EMessageAction, IMessage } from './src/types/messages'

const actionsMap = {
  [EMessageAction.DECRYPT]: async (
    vault: VaultService,
    msg: IMessage,
    port: chrome.runtime.Port
  ) => {
    const decryptedData = await vault.decrypt(msg.value, msg?.pw ?? '')
    port.postMessage({...msg, value: decryptedData})
  },
  [EMessageAction.ENCRYPT]: async (
    vault: VaultService,
    msg: IMessage,
    port: chrome.runtime.Port
  ) => {
    const encryptedData = await vault.encrypt(msg.value, msg.pw ?? '')
    store(msg.key, encryptedData)
  },
}
chrome.runtime.onConnect.addListener((port) => {
  const vault = new VaultService()
  port.onMessage.addListener((msg: IMessage) => {
    actionsMap[msg.action](vault, msg, port)
  })
})

chrome.alarms.create('keep-alive', {
  periodInMinutes: 0.25,
})

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log({ alarm })
})
