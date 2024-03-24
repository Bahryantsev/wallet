import { VaultService } from './src/lib/vault'
import { EMessageAction } from './src/types/messages'

const actionsMap = {
  [EMessageAction.DECRYPT]: (valut: VaultService, msg) => {},
  [EMessageAction.ENCRYPT]: (valut: VaultService, msg) => {},
}
chrome.runtime.onConnect.addListener((port) => {
  const vault = new VaultService()
  port.onMessage.addListener((msg) => {
    
  })
})

chrome.alarms.create('keep-alive', {
  periodInMinutes: 0.25,
})

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log({ alarm })
})
