import axios from "axios";
import { ElMessage } from "element-plus";
import { PayParams } from "../router/type";
import { Apis, ExtApi, ExtKeys } from "./domain";

export interface IReqSubmitTxs {
    [key: string]: string;
  }

export default {
    async queryDomain(domain: string) {
        let ret = await axios.post(Apis.queryDomainUrl, {
            'domain': domain,
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },
    async queryDomainFee(domain: string, years: number) {
        let ret = await axios.post(Apis.queryFee, {
            'domain': domain,
            'expire_year': years,
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },
    async queryWallet(domain: string) {
        //queryWallet
        //
        let ret = await axios.post(Apis.queryWallet, {
            'domain': domain,
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },
    async queryBalance(walletId: string) {
        let ret = await axios.post(Apis.queryBalance, {
            'wallet_id': walletId,
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },
    async queryConfirm(domain: string, wallet: string, year: number, walletId: string, exchangeId: string) {
        // queryConfirm
        //
        let ret = await axios.post(Apis.queryConfirm, {
            'domain': domain,
            'out_wallet': wallet,
            'expire_year': year,
            'wallet_id': walletId,
            'exchange_id': exchangeId,
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },
    async lockFee(domain: string, year: number, walletId: string) {
        // lockFee
        //
        let ret = await axios.post(Apis.lockFee, {
            'domain': domain,
            'expire_year': year,
            'wallet_id': walletId,
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },
    async leavePage(walletId: string) {
        // lockFee
        //
        let ret = await axios.post(Apis.leavePage, {
            'wallet_id': walletId,
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },

    async avatarSet(inscriptId: string, address: string, domain: string, signature: string, pubKey: string) {
        // avatarSet
        //
        //
        let ret = await axios.post(Apis.avatarSet, {
            inscribe_id: inscriptId,
            address: address,
            domain: domain,
            signature: signature,
            public_key: pubKey,
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },

    async avatarGet(address: string) {
        // avatarGet
        //
        let ret = await axios.post(Apis.avatarGet, {
            address: address,
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },

    async queryInsWith(address: string) {
        // queryInsWith
        //
        let ret = await axios.get(Apis.queryInscriptions + address)

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },

    async exchangeWith(params: PayParams) {
        // exchange
        //
        let ret = await axios.post(Apis.exchange, params)

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },
    

    async queryExtIns(address: string) {
        // walletInfo
        //
        let ret = await axios.get(ExtApi.walletInfo + address)

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },

    async submitTx(tx: IReqSubmitTxs) {
        // submitTx
        //
        let ret = await axios.post(ExtApi.submitTx, JSON.stringify(tx))

        console.log(ret)

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },

    async queryRatio(symbol: string) {
        // binanceApi
        let ret = await axios.get(ExtApi.binanceApi + symbol)

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    },

    async queryCoinRatio() {
        // coinApi
        let ret = await axios.get(ExtApi.coinApi, {
            headers: {
                'X-CoinAPI-Key': ExtKeys.coinapiKey
            }
        })

        if (ret.status == 200) {
            return ret.data
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    }
}