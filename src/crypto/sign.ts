import ecc from '@bitcoinerlab/secp256k1';
import BIP32Factory from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { ethers } from "ethers";
import { GivingMsg } from "../router/type";

const defaultPath = "m/86'/0'/0'/0/0";

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

const toXOnly = (pubKey: string) =>
    pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

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