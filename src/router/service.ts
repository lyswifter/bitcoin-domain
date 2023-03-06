import { Apis } from "./domain";
import axios from "axios";

import { ElMessage } from "element-plus";

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
    //queryWallet
    async queryWallet(domain: string) {
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
    async queryConfirm(domain: string, wallet: string, year: number) {
        // queryConfirm
        let ret = await axios.post(Apis.queryConfirm, {
            'domain': domain,
            'out_wallet': wallet,
            'expire_year': year,
        })

        if (ret.status == 200) {
            return ret.data   
        } else {
            ElMessage.error("Bad request[code=" + ret.status + "]")
            return
        }
    }
}