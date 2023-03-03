import { Apis } from "../router/domain";
import axios from "axios";

import { ElMessage } from "element-plus";

export default {
    async queryFeeAction() {
        if (localStorage.getItem("user_info")) {
            return JSON.parse(localStorage.getItem("user_info")!)
        }

        let ret = await axios.post(Apis.queryFee, {
            'wallet_id': localStorage.getItem('wallet_id')
        })

        if (ret.data.code == 0) {
            let data = ret.data.data;

            localStorage.setItem("user_info", data)

            return JSON.parse(data)
        } else {
            ElMessage.error(ret.data.msg)
            return
        }
    },

    async mintAction(mintWallet: string) {
        localStorage.setItem("target_addr", mintWallet)

        let ret = await axios.post(Apis.mint, {
            'wallet_id': localStorage.getItem('wallet_id'),
            'mint_wallet': mintWallet,
        })

        if (ret.data.code == 0) {
            let data = ret.data.data;
            return JSON.parse(data)
        } else if (ret.data.code == 300) {
            ElMessage.info(ret.data.msg)
            return ret.data.data;
        } else {
            ElMessage.error(ret.data.msg)
            return
        }
    },

    async queryMintState() {
        let ret = await axios.post(Apis.mintStatus, {
            'wallet_id': localStorage.getItem('wallet_id'),
        })

        console.log(ret)

        if (ret.data.code == 0) {
            return ret.data.data.transfer_id;
        } else if (ret.data.code == 301) {
            ElMessage.info(ret.data.data.message);
            return undefined
        } else {
            ElMessage.error(ret.data.msg)
            return
        }
    }
}