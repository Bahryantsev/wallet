export enum EMessageAction {
  ENCRYPT = 'encrypt',
  DECRYPT = 'decrypt',
}

export interface IMessage {
  action: EMessageAction
  value: string
  error?: boolean
  pw?: string
}

export interface IMessageContext { 
    port: chrome.runtime.Port
}