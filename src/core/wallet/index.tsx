import { divide } from '@/lib/math'
import { ICoin } from '@/types/wallet'
import * as web3 from '@solana/web3.js'
import * as bip39 from 'bip39'
import { derivePath } from 'ed25519-hd-key'

abstract class Wallet {
  constructor(
    private readonly mnemonic: string,
    private readonly privateKey: Uint8Array,
    private readonly address: string
  ) {}
  getAddress(): string {
    return this.address
  }

  getMnemonic(): string {
    return this.mnemonic
  }

  getPrivateKey(): Uint8Array {
    return this.privateKey
  }
}

class SolanaWallet extends Wallet {
  constructor(mnemonic: string, privateKey: Uint8Array, address: string) {
    super(mnemonic, privateKey, address)
  }
  static createFromMnemonic(mnemonic: string) {
    const isValid = bip39.validateMnemonic(mnemonic)
    if (!isValid) throw new Error('Mnemonic is not valid')
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key
    const keypair = web3.Keypair.fromSeed(derivedSeed.slice(0, 32))
    return new SolanaWallet(
      mnemonic,
      keypair.secretKey,
      keypair.publicKey.toString()
    )
  }

  static create() {
    const mnemonic = bip39.generateMnemonic()
    return this.createFromMnemonic(mnemonic)
  }

  async getNativeTokenBalance(): Promise<ICoin> {
    const connection = new web3.Connection(
      web3.clusterApiUrl('devnet'),
      'confirmed'
    )
    const publicKey = new web3.PublicKey(this.getAddress())
    const balance = await connection.getBalance(publicKey)
    return { amount: divide(balance, web3.LAMPORTS_PER_SOL), symbol: 'SOL' }
  }
}

export default SolanaWallet
