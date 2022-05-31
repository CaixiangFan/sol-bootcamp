import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class WalletService {
  wallet: ethers.Wallet;

  constructor() {
    this.setupWallet();
  }

  setupWallet() {
    // const seed = process.env.ADMIN_WALLET_SEED;
    // if (!seed || seed.length === 0) return;
    // this.wallet = ethers.Wallet.fromMnemonic(seed);
    this.wallet = process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY);
  }

  walletAddress() {
    return this.wallet.address;
  }
}
