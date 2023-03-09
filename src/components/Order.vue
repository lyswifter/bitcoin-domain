<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, toRaw } from 'vue';

import service from "../router/service";
import { GasInfo } from "../router/type";

import Decimal from 'decimal.js';

const props = defineProps({
    domainName: String,
    isAvailable: Boolean,
})

const emit = defineEmits({
    continueAction(info: GasInfo) { },
})

let state = reactive({
    info: {
        name: '',
        isAvailable: false,
        addr: '',
        midAddr: '',
        gasFee: '',
        serviceFee: '',
        registerFee: '',
        balance: '',
        total: '',
        years: 1,
    } as GasInfo,
    inputYears: 1,
    isAddrVisiable: false,
})

const histories = ref<string[]>([])

function handleChange(value: number) {
    state.inputYears = value

    queryAction()
}

function continueAction() {
    if (!state.info.addr) {
        ElMessage.error("Receive address must not be empty")
        return
    }

    if (state.info.addr.indexOf(" ") != -1) {
        ElMessage.error("Receive address format is not correct")
        return
    }

    if (state.info.addr.indexOf('bc1p') != -1) {
        if (state.info.addr.length == 62) {
            state.info.years = state.inputYears
            
            emit('continueAction', state.info)
        } else {
            ElMessage.error("Check the length of your Ordinals address");
            return
        }
    } else {
        state.isAddrVisiable = true
    }
}

function queryAction() {
    service.queryDomainFee(state.info.name, state.inputYears).then((val1) => {
        state.info.gasFee = val1.data.gas_fee.toPrecision(4);
        state.info.serviceFee = val1.data.service_fee.toPrecision(4);

        let g_fee = new Decimal(state.info.gasFee);
        let s_fee = new Decimal(state.info.serviceFee)

        state.info.registerFee = Decimal.add(g_fee, s_fee).toString();
    })
}

function cancelAction() {
    state.isAddrVisiable = false
}

function confirmAction() {
    state.isAddrVisiable = false
    state.info.years = state.inputYears

    emit('continueAction', state.info)
}

const createFilter = (queryString: string) => {
  return (history: string) => {
    return (
        history.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? histories.value.filter(createFilter(queryString))
    : histories.value
    
  // call callback function to return suggestions

  console.log(results)
  
  cb(toRaw(results))
}

function handleSelect(item: string) {
    console.log(item)
}

onMounted(() => {
    state.info.name = props.domainName!
    state.info.isAvailable = props.isAvailable!

    let history = localStorage.getItem('receive_address_history')
    if (history) {
        histories.value = history.split(',')
    }

    queryAction()
})
</script>

<template>
    <div class="order-container">
        <div class="state-view">
            <el-row justify="space-between">
                <el-col :span="2"><span class="s-name">NAME</span></el-col>
                <el-col :span="2"><span class="s-name">STATE</span></el-col>
            </el-row>

            <el-row justify="space-between">
                <el-col :span="3"><span class="t-name">{{ state.info.name }}</span></el-col>
                <el-col :span="2"><span class="t-name">{{ state.info.isAvailable ? 'Available' : 'Unavailable'
                }}</span></el-col>
            </el-row>
        </div>

        <br>

        <div class="re-content-view">
            <el-row justify="space-between" style="height: 60px;">
                <el-col :span="3">
                    <div class="domain-name-view">{{ state.info.name }}</div>
                </el-col>
                <el-col :span="3">
                    <div class="detail-view">
                        Register
                    </div>
                </el-col>
            </el-row>

            <!-- STEP 1 -->
            <div class="step-title-view">STEP 1: Receive address</div>
            <div style="width: 1120px;margin: 0 auto;">
                <div class="step-desc-view">Type your address to receive nft here (Note: this is an <a
                        href="https://ordinals.com" target="_blank">Ordinals</a> address)</div>

                <el-autocomplete class="addr-input-view" v-model="state.info.addr" :fetch-suggestions="querySearch" trigger-on-focus="true"
                    clearable placeholder="Type your address to receive the nft here, like: bc1p..."
                    @select="handleSelect" />
                    
            </div>

            <!-- STEP 2 -->
            <div class="step-title-view">STEP 2: Register fee</div>
            <div style="width: 1120px;margin: 0 auto;">
                <div class="step-desc-view">Registration Period (In years)</div>

                <el-input-number v-model="state.inputYears" :min="1" :max="5" @change="handleChange" />
                <span class="tip-view"> Maximum 5 years</span>

                <div class="fee-view">
                    <el-row justify="space-between">
                        <el-col :span="4">
                            <div class="list-t-view">Gas Fee</div>
                        </el-col>
                        <el-col :span="5">
                            <div class="owner-view">{{ state.info.gasFee + " BTC" }}</div>
                        </el-col>
                    </el-row>

                    <el-row justify="space-between">
                        <el-col :span="4">
                            <div class="list-t-view">Service Fee</div>
                        </el-col>
                        <el-col :span="5">
                            <div class="owner-view">{{ state.info.serviceFee + " BTC" }}</div>
                        </el-col>
                    </el-row>

                    <div class="line-view"></div>

                    <el-row justify="space-between">
                        <el-col :span="6">
                            <div class="total-list-t-view" style="padding-left: 20px;">Total Register Fee</div>
                        </el-col>
                        <el-col :span="5">
                            <div class="total-fee-view">{{ state.info.registerFee + " BTC" }}</div>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div style="margin: 0 auto;margin-top: 40px;width: 100%;margin-bottom: 50px;cursor: pointer;">
                <div class="continue-view" @click="continueAction">Next Step</div>
            </div>

        </div>

        <el-dialog v-model="state.isAddrVisiable" :show-close="true" align-center="true" :width="440">
            <div style="text-align: center;">
                <div style="font-size: 18px;font-weight: 600;color: #A7A9BE;line-height: 25px;text-align: left;">This seems
                    not an Ordinals NFT address, do you want to continue?</div>
                <br>
                <el-row gutter="20">
                    <el-col :span="12">
                        <div style="height: 49px;background: white;border-radius: 8px;border: 1px solid blueviolet; font-size: 16px;font-weight: 600;color: blueviolet;line-height: 50px;text-align: center;cursor: pointer;"
                            @click="cancelAction">Cancel</div>
                    </el-col>
                    <el-col :span="12">
                        <div style="height: 50px;background: #2E2F3E;border-radius: 8px;font-size: 16px;border: 1px solid #2E2F3E;font-weight: 600;color: white;line-height: 50px;text-align: center;cursor: pointer;"
                            @click="confirmAction">OK</div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.order-container {
    width: 1200px;
    margin: 0 auto;
    margin-top: 40px;
}

.state-view {
    padding-top: 5px;
    padding-bottom: 5px;
}

.domain-name-view {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 28px;
}

.detail-view {
    height: 40px;
    background: #4540D6;
    color: white;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 600;
    line-height: 40px;
    text-align: center;
}

.line-view {
    margin-top: 25px;
    margin-bottom: 25px;
    border-bottom: 1px dashed #A7A9BE;
}

.addr-input-view {
    margin-top: 5px;
}

.step-title-view {
    margin-top: 20px;
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 22px;
}

.step-desc-view {
    margin-top: 20px;
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #A7A9BE;
    line-height: 20px;
}

.tip-view {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 20px;
}

.fee-view {
    margin: 0 auto;
    margin-top: 20px;
    padding-bottom: 20px;
    background: #FFFFFF;
    box-shadow: 0px 10px 24px 0px rgba(16, 38, 92, 0.1);
    border-radius: 8px;
    border: 1px solid #4540D6;
}

.list-t-view {
    padding: 20px;
    color: #2E2F3E;
}

.total-list-t-view {
    color: #2E2F3E;
}

.owner-view {
    display: block;
    padding: 20px;
    color: #2E2F3E;
}

.total-fee-view {
    height: 33px;
    font-size: 24px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 33px;
}

.continue-view {
    width: 380px;
    height: 50px;
    background: #4540D6;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 50px;
}
</style>

<style scoped>
:deep(.el-input__wrapper) {
    width: 1120px;
}
</style>
