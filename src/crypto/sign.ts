import ecc from '@bitcoinerlab/secp256k1';
import BIP32Factory from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { ethers } from "ethers";
import { GivingMsg } from "../router/type";
import { toXOnly } from "../router/util";

const defaultPath = "m/86'/0'/0'/0/0";

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

export async function signAsync(message: string) {
    let provider = new ethers.BrowserProvider(window.ethereum);

    let signer = await provider.getSigner();

    let sig = await signer.signMessage(GivingMsg);

    const seed = ethers.toUtf8Bytes(
        ethers.keccak256(ethers.toUtf8Bytes(sig))
    );

    let root = bip32.fromSeed(Buffer.from(seed.slice(2)));

    const taprootChild = root.derivePath(defaultPath);

    var buf = Buffer.from(message);

    var hashBuf = bitcoin.crypto.sha256(buf);

    console.log(hashBuf.toString('hex'))

    const signMsg = taprootChild.sign(hashBuf);

    const signRet = signMsg.toString('hex')

    console.log(signRet);

    return signRet
}

export async function generateBitcoinAddr() {
    if (typeof window.ethereum === 'undefined') {
      alert("Matamask is not installed!")
      return
    }
  
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    let network = new ethers.Network('Ethereum Mainnet', 1)
  
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    let provider = new ethers.BrowserProvider(window.ethereum)
    // window.provider = provider
  
    let getNetwork = await provider.getNetwork()
  
    if (getNetwork.chainId != network.chainId) {
    }
  
    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    let signer = await provider.getSigner();
    let sig = await signer.signMessage(GivingMsg);
  
    const seed = ethers.toUtf8Bytes(
      ethers.keccak256(ethers.toUtf8Bytes(sig))
    );
  
    let root = bip32.fromSeed(Buffer.from(seed.slice(2)))
  
    const taprootChild = root.derivePath(defaultPath);
  
    const privKey = taprootChild.privateKey
    const pubKey = taprootChild.publicKey;
    const { address: taprootAddress } = bitcoin.payments.p2tr({
      internalPubkey: toXOnly(pubKey),
    });
  
    if (privKey) {
      console.log("address: " + taprootAddress)
      console.log("private key:" + privKey)
      console.log("public key:" + pubKey.toString('hex'))
      
      return privKey
    }
  }