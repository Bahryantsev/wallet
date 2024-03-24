export enum EMessageAction {
  ENCRYPT = 'encrypt',
  DECRYPT = 'decrypt',
}

export interface IMessage {
  action: EMessageAction
  value: string
  key: string
  error?: boolean
  pw?: string
}
