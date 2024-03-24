import { VaultService } from './src/lib/vault'
import { EMessageAction, IMessage } from './src/types/messages'

const actionsMap = {
  [EMessageAction.DECRYPT]: (valut: VaultService, msg: IMessage) => {},
  [EMessageAction.ENCRYPT]: (valut: VaultService, msg: IMessage) => {},
}
chrome.runtime.onConnect.addListener((port) => {
  const vault = new VaultService()
  port.onMessage.addListener((msg) => {})
})

chrome.alarms.create('keep-alive', {
  periodInMinutes: 0.25,
})

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log({ alarm })
})
