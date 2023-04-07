import axios from 'axios';
import BigNumber from 'bignumber.js';
import * as GENERATIVE_SDK from 'generative-sdk';
import {
  ICreateTxBuyResp,
  ICreateTxResp,
  UTXO
} from 'generative-sdk';
import openapi from '../openapi';

export interface IInscriptionByOutput {
  [key: string]: GENERATIVE_SDK.Inscription[];
}

export { };

// Send Inscription
export type ISendInsResp = ICreateTxResp;
export type ISendInsReq = {
  privateKey: Buffer;
  utxos: UTXO[];
  inscriptions: IInscriptionByOutput;
  inscriptionID: string;
  receiver: string;
  amount?: string;
  feeRate: number;
};

// Send BTC
export type ISendBTCResp = ICreateTxResp;
export interface ISendBTCReq {
  privateKey: Buffer;
  utxos: UTXO[];
  inscriptions: IInscriptionByOutput;
  receiver: string;
  amount: string | number;
  feeRate: number;
}

// Buy Inscription
type IBuyInsBTCResp = ICreateTxBuyResp;
interface IBuyInsBTCReq {
  psbtB64: string;
  privateKey: Buffer;
  receiver: string;
  price: string | number;
  utxos: UTXO[];
  inscriptions: IInscriptionByOutput;
  feeRate: number;
}

interface Vin {
  txid: string;
  vout: number;
}
interface Vout {
  scriptpubkey_address: string;
  value: string;
}
export interface Status {
  confirmed: boolean;
}
export interface IPendingUTXO {
  vin: Vin[];
  vout: Vout[];
  status: Status;
}

export interface ICollectedUTXOResp {
  address: string;
  inscription_id: string;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  txrefs: GENERATIVE_SDK.UTXO[];
  inscriptions_by_outputs: IInscriptionByOutput;
}

// const LOG_PREFIX = 'COLLECTED_NFT';

// Collected UTXO
// export const getCollectedUTXO = async (
//   btcAddress: string
// ): Promise<ICollectedUTXOResp | undefined> => {
//   try {
//     const res = await axios.get(
//       `https://blockstream.info/api/address/${btcAddress}/utxo`
//     );

//     collectedUTXOs = (res.data || []).filter(
//         (item: )
//     )

//     return res;
//     // const pendingUTXOs = await getPendingUTXOs(btcAddress);
//     //
//     // return filterCurrentAssets(res, pendingUTXOs);
//   } catch (err: unknown) {
//     // log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
//     throw err;
//   }
// };

export const getPendingUTXOs = async (
  btcAddress: string
): Promise<IPendingUTXO[]> => {
  let pendingUTXOs = [];
  if (!btcAddress) return [];
  try {
    const res = await axios.get(
      `https://blockstream.info/api/address/${btcAddress}/txs`
    );
    pendingUTXOs = (res.data || []).filter(
      (item: IPendingUTXO) => !item.status.confirmed
    );
  } catch (err) {
    // throw new Error('Request pending UTXOs error');
  }
  return pendingUTXOs;
};

class GenerativeSDK {
  sendInsTransaction = async (payload: ISendInsReq): Promise<ISendInsResp> => {
    const { amount } = payload;
    const sendAmount = new BigNumber(amount || '0');
    const utxos = this.formatUTXOs(payload.utxos);
    const inscriptions = this.formatInscriptions(payload.inscriptions);
    return GENERATIVE_SDK.createTx(
      payload.privateKey,
      utxos,
      inscriptions,
      payload.inscriptionID,
      payload.receiver,
      sendAmount,
      payload.feeRate,
      true
    );
  };

  sendBTCTransaction = async (payload: ISendBTCReq): Promise<ISendBTCResp> => {
    const { amount } = payload;
    const sendAmount = new BigNumber(amount || '0');
    const utxos = this.formatUTXOs(payload.utxos);
    const inscriptions = this.formatInscriptions(payload.inscriptions);
    return GENERATIVE_SDK.createTx(
      payload.privateKey,
      utxos,
      inscriptions,
      '',
      payload.receiver,
      sendAmount,
      payload.feeRate,
      true
    );
  };

  buyInsBTCTransaction = async (
    payload: IBuyInsBTCReq
  ): Promise<IBuyInsBTCResp> => {
    const itemPrice = new BigNumber(payload.price || '0');
    const utxos = this.formatUTXOs(payload.utxos);
    const inscriptions = this.formatInscriptions(payload.inscriptions);
    return GENERATIVE_SDK.reqBuyInscription({
      buyerPrivateKey: payload.privateKey,
      feeRatePerByte: payload.feeRate,
      inscriptions: inscriptions,
      receiverInscriptionAddress: payload.receiver,
      sellerSignedPsbtB64: payload.psbtB64,
      utxos: utxos,
      price: itemPrice,
    });
  };

  currentAssetsBuilder = ({
    current,
    pending,
  }: {
    current: ICollectedUTXOResp | undefined;
    pending: IPendingUTXO[];
  }): ICollectedUTXOResp | undefined => {
    if (!pending || !pending.length || !current) return current;

    const utxos = current.txrefs.filter(({ tx_hash, tx_output_n }) => {
      const isExist = pending.some(item =>
        item.vin.some(vin => vin.txid === tx_hash && vin.vout === tx_output_n)
      );
      return !isExist;
    });

    return {
      ...current,
      txrefs: utxos,
    };
  };

  getCurrentAssetsForCreateTx = async (address: string) => {
    const [assets, pendingUTXOs] = await Promise.all([
      await openapi.getAddressUtxo(address),
      await getPendingUTXOs(address),
    ]);

    if (!assets) {
      throw new Error(
        GENERATIVE_SDK.ERROR_MESSAGE[
          GENERATIVE_SDK.ERROR_CODE.NOT_ENOUGH_BTC_TO_SEND
        ].message
      );
    }

    let collectedUtxos = {

    } as ICollectedUTXOResp;
    const currenAssets = this.currentAssetsBuilder({
      current: collectedUtxos,
      pending: pendingUTXOs,
    });
    // Current assets
    if (!currenAssets) {
      throw new Error(
        GENERATIVE_SDK.ERROR_MESSAGE[
          GENERATIVE_SDK.ERROR_CODE.NOT_ENOUGH_BTC_TO_SEND
        ].message
      );
    }
    return currenAssets;
  };

  formatUTXOs = (txrefs: GENERATIVE_SDK.UTXO[]) => {
    const utxos: GENERATIVE_SDK.UTXO[] = (txrefs || []).map(utxo => ({
      tx_hash: utxo.tx_hash,
      tx_output_n: new BigNumber(utxo.tx_output_n).toNumber(),
      value: new BigNumber(utxo.value),
    }));
    return utxos;
  };
  formatInscriptions = (inscriptions: IInscriptionByOutput) => {
    const _inscriptions: IInscriptionByOutput = {};
    Object.keys(inscriptions).forEach(key => {
      const utxos = inscriptions[key];
      if (!!utxos && !!utxos.length) {
        _inscriptions[key] = utxos?.map(utxo => ({
          ...utxo,
          offset: new BigNumber(utxo.offset),
        }));
      }
    });
    return _inscriptions;
  };
}

const SDK = new GenerativeSDK();

export default SDK;