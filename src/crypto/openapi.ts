import {
  AppSummary,
  BitcoinBalance,
  FeeSummary,
  Inscription,
  InscriptionSummary,
  TxHistoryItem,
  UTXO
} from '../shared/types';

export const OPENAPI_URL_MAINNET = 'https://unisat.io/api';

interface OpenApiStore {
  host: string;
}

const maxRPS = 100;

enum API_STATUS {
  FAILED = '0',
  SUCCESS = '1'
}

export class OpenApiService {
  store!: OpenApiStore;
  setHost = async (host: string) => {
    this.store.host = host;
    this.init();
  };

  getHost = () => {
    return this.store.host;
  };

  constructor() {
    this.init();
  }

  init = () => {
    this.store = {
      host: OPENAPI_URL_MAINNET,
    };

    if ([OPENAPI_URL_MAINNET].includes(this.store.host) === false) {
      this.store.host = OPENAPI_URL_MAINNET;
    }
  };

  httpGet = async (route: string, params: any) => {
    let url = this.getHost() + route;
    let c = 0;
    for (const id in params) {
      if (c == 0) {
        url += '?';
      } else {
        url += '&';
      }
      url += `${id}=${params[id]}`;
      c++;
    }
    const headers = new Headers();
    headers.append('X-Client', 'UniSat Wallet');
    // headers.append('X-Version', process.env.release!);
    const res = await fetch(new Request(url), { method: 'GET', headers, mode: 'cors', cache: 'default' });
    const data = await res.json();
    return data;
  };

  httpPost = async (route: string, params: any) => {
    const url = this.getHost() + route;
    const headers = new Headers();
    headers.append('X-Client', 'UniSat Wallet');
    // headers.append('X-Version', process.env.release!);
    headers.append('Content-Type', 'application/json;charset=utf-8');
    const res = await fetch(new Request(url), {
      method: 'POST',
      headers,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(params)
    });
    const data = await res.json();
    return data;
  };

  async getWalletConfig(): Promise<any> {
    const data = await this.httpGet('/v1/wallet/config', {});
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async getAddressBalance(address: string): Promise<BitcoinBalance> {
    const data = await this.httpGet('/v2/address/balance', {
      address
    });
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async getMultiAddressBalance(addresses: string): Promise<BitcoinBalance> {
    const data = await this.httpGet('/v2/address/multi-balance', {
      addresses
    });
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async getAddressUtxo(address: string): Promise<UTXO[]> {
    const data = await this.httpGet('/v2/address/utxo', {
      address
    });
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async getAddressInscriptions(address: string): Promise<Inscription[]> {
    const data = await this.httpGet('/v2/address/inscriptions', {
      address
    });
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async getAddressRecentHistory(address: string): Promise<TxHistoryItem[]> {
    const data = await this.httpGet('/v1/address/recent-history', {
      address
    });
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async getInscriptionSummary(): Promise<InscriptionSummary> {
    const data = await this.httpGet('/v1/inscription-summary', {});
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async getAppSummary(): Promise<AppSummary> {
    const data = await this.httpGet('/v1/app-summary', {});
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async pushTx(rawtx: string): Promise<string> {
    const data = await this.httpPost('/v1/tx/broadcast', {
      rawtx
    });
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async getFeeSummary(): Promise<FeeSummary> {
    const data = await this.httpGet('/v1/fee-summary', {});
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }

  async getDomainInfo(domain: string) {
    const data = await this.httpGet('/v1/address/search', { domain });
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message);
    }
    return data.result;
  }
}

export default new OpenApiService();
