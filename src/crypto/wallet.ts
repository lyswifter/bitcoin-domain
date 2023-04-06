import { createSendBTC, createSendOrd } from '@unisat/ord-utils';
import * as bitcoin from 'bitcoinjs-lib';
import { address as PsbtAddress } from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import keyringService from "../crypto/keyring";
import openapi from "../crypto/openapi";
import { toXOnly } from "../router/util";
import { KEYRING_TYPE } from "../shared/constant";
import { Account, AddressType, NetworkType, ToSignInput, UTXO, WalletKeyring } from '../shared/types';

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

export const validator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean =>
  ECPair.fromPublicKey(pubkey).verify(msghash, signature);

export class Wallet {
    currentKeyringIndex = 0;

    networkType = NetworkType.MAINNET;

    toPsbtNetwork = function (networkType: NetworkType) {
        if (networkType === NetworkType.MAINNET) {
            return bitcoin.networks.bitcoin;
        } else {
            return bitcoin.networks.testnet;
        }
    };

    getCurrentKeyring = async (index: number, account: Account) => {
        const accounts: Account[] = [];
        accounts.push(account)

        const key = 'keyring_' + index;
        const alianName = '';
        const type = KEYRING_TYPE.WalletConnectKeyring
        const hdPath = '';
        const addressType = AddressType.P2TR;

        const keyring: WalletKeyring = {
            index,
            key,
            type,
            addressType,
            accounts,
            alianName,
            hdPath
        };

        return keyring
    };

    signTransaction = async (type: string, from: string, psbt: bitcoin.Psbt, inputs: ToSignInput[]) => {
        const keyring = await keyringService.getKeyringForAccount(from, type);
        return keyringService.signTransaction(keyring, psbt, inputs);
    };

    signPsbt = async (psbt: bitcoin.Psbt, account: Account) => {
        if (!account) throw new Error('no current account');

        const keyring = await this.getCurrentKeyring(0, account);
        const _keyring = keyringService.keyrings[keyring.index];

        const psbtNetwork = this.toPsbtNetwork(this.networkType);

        const toSignInputs: ToSignInput[] = [];
        psbt.data.inputs.forEach((v, index) => {
            let script: any = null;
            let value = 0;
            if (v.witnessUtxo) {
                script = v.witnessUtxo.script;
                value = v.witnessUtxo.value;
            } else if (v.nonWitnessUtxo) {
                const tx = bitcoin.Transaction.fromBuffer(v.nonWitnessUtxo);
                const output = tx.outs[psbt.txInputs[index].index];
                script = output.script;
                value = output.value;
            }
            const isSigned = v.finalScriptSig || v.finalScriptWitness;
            if (script && !isSigned) {
                const address = PsbtAddress.fromOutputScript(script, psbtNetwork);
                if (account.address === address) {
                    toSignInputs.push({
                        index,
                        publicKey: account.pubkey,
                        sighashTypes: v.sighashType ? [v.sighashType] : undefined
                    });
                    if (keyring.addressType === AddressType.P2TR && !v.tapInternalKey) {
                        v.tapInternalKey = toXOnly(Buffer.from(account.pubkey, 'hex'));
                    }
                }
            }
        });

        psbt = await keyringService.signTransaction(_keyring, psbt, toSignInputs);
        toSignInputs.forEach((v) => {
            psbt.validateSignaturesOfInput(v.index, validator);
            psbt.finalizeInput(v.index);
        });
        return psbt;
    };

    signMessage = async (account: Account, text: string) => {
        if (!account) throw new Error('no current account');
        return keyringService.signMessage(account.pubkey, text);
    };

    sendBTC = async ({
        to,
        amount,
        utxos,
        receiverToPayFee,
        feeRate,
        account,
    }: {
        to: string;
        amount: number;
        utxos: UTXO[];
        receiverToPayFee: boolean;
        feeRate: number;
        account: Account;
    }) => {
        if (!account) throw new Error('no current account');

        const psbtNetwork = this.toPsbtNetwork(this.networkType);

        const psbt = await createSendBTC({
            utxos: utxos.map((v) => {
                return {
                    txId: v.txId,
                    outputIndex: v.outputIndex,
                    satoshis: v.satoshis,
                    scriptPk: v.scriptPk,
                    addressType: v.addressType,
                    address: account.address,
                    ords: v.inscriptions
                };
            }),
            toAddress: to,
            toAmount: amount,
            wallet: this,
            network: psbtNetwork,
            changeAddress: account.address,
            receiverToPayFee,
            pubkey: account.pubkey,
            feeRate
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;
        return psbt.toHex();
    };

    sendInscription = async ({
        to,
        inscriptionId,
        utxos,
        feeRate,
        outputValue,
        account,
    }: {
        to: string;
        inscriptionId: string;
        utxos: UTXO[];
        feeRate: number;
        outputValue: number;
        account: Account;
    }) => {
        if (!account) throw new Error('no current account');

        const psbtNetwork = this.toPsbtNetwork(this.networkType);

        const psbt = await createSendOrd({
            utxos: utxos.map((v) => {
                return {
                    txId: v.txId,
                    outputIndex: v.outputIndex,
                    satoshis: v.satoshis,
                    scriptPk: v.scriptPk,
                    addressType: v.addressType,
                    address: account.address,
                    ords: v.inscriptions
                };
            }),
            toAddress: to,
            toOrdId: inscriptionId,
            wallet: this,
            network: psbtNetwork,
            changeAddress: account.address,
            pubkey: account.pubkey,
            feeRate,
            outputValue
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;
        return psbt.toHex();
    };

    pushTx = async (rawtx: string) => {
        const txid = await openapi.pushTx(rawtx);
        return txid;
    };
}

export default new Wallet();