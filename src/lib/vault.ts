import { NONCE_KEY, SALT_KEY } from '@/constants/storage'
import { retrieve, store } from './storage'

export class VaultService {
  private derivedKey: CryptoKey | null = null
  private nonce: Uint8Array | null = null
  private salt: Uint8Array | null = null

  constructor() {}

  private async deriveKeyFromPassword(password: string): Promise<void> {
    this.salt = this.generateAndStoreSalt()
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    )

    this.derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-CTR', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  private generateAndStoreNonce(): Uint8Array {
    if (this.nonce) return this.nonce
    this.nonce = crypto.getRandomValues(new Uint8Array(16))
    store(
      NONCE_KEY,
      btoa(String.fromCharCode.apply(null, Array.from(this.nonce)))
    )
    return this.nonce
  }

  private generateAndStoreSalt(): Uint8Array {
    console.log({ salt: this.salt })
    if (this.salt) return this.salt
    this.salt = crypto.getRandomValues(new Uint8Array(16))
    store(
      SALT_KEY,
      btoa(String.fromCharCode.apply(null, Array.from(this.salt)))
    )
    return this.salt
  }

  private retrieveNonce(): Uint8Array {
    console.log({ nonce: this.nonce })
    if (this.nonce) return this.nonce
    const storedNonce = retrieve(NONCE_KEY)
    if (!storedNonce) {
      throw new Error('Nonce not found in local storage.')
    }
    return Uint8Array.from(atob(storedNonce), (c) => c.charCodeAt(0))
  }

  private retrieveSalt(): Uint8Array {
    if (this.salt) return this.salt
    const storedSalt = retrieve(SALT_KEY)
    if (!storedSalt) {
      throw new Error('Nonce not found in local storage.')
    }
    return Uint8Array.from(atob(storedSalt), (c) => c.charCodeAt(0))
  }

  async encrypt(plaintext: string, password: string): Promise<string> {
    if (!this.derivedKey) await this.deriveKeyFromPassword(password)
    this.nonce = this.generateAndStoreNonce()
    console.log({ nonce: this.nonce, salt: this.salt })
    const encoder = new TextEncoder()
    const data = encoder.encode(plaintext)

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-CTR',
        counter: this.nonce,
        length: 128,
      },
      this.derivedKey!,
      data
    )

    return btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedData)))
    )
  }

  async decrypt(ciphertext: string, password: string): Promise<string> {
    this.salt = this.retrieveSalt()
    if (!this.derivedKey) await this.deriveKeyFromPassword(password)

    this.nonce = this.retrieveNonce()
    const encryptedData = Uint8Array.from(atob(ciphertext), (c) =>
      c.charCodeAt(0)
    )

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-CTR',
        counter: this.nonce,
        length: 128,
      },
      this.derivedKey!,
      encryptedData
    )

    const decoder = new TextDecoder()
    return decoder.decode(decryptedData)
  }
}
