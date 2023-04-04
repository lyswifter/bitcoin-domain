<script setup lang="ts">
import { onBeforeMount, onMounted, reactive } from "vue";
import { signAsync } from "../crypto/sign";
import service from "../router/service";
import { InsType, InscriptionItem, SettingItem } from "../router/type";

const props = defineProps({
    address: String,
})

let state = reactive({ count: 0, items: [] as InscriptionItem[], addr: '', isSetVisiable: false, selectedItem: {} as InscriptionItem, setItems: [] as SettingItem[] })

function load() {
    service.queryInsWith(state.addr).then((val) => {
        console.log(val.data.result)

        val.data.result.forEach(element => {
            if (element.domain) {
                element.type = InsType.DOMAIN; // MAINDOMAIN
            } else {
                switch (element.detail.content_type) {
                    case 'image/png' || 'image/webp' || 'image/jpeg' || 'image/jpg': // AVATAR
                        element.type = InsType.IMAGE
                        break;

                    case 'image/gif':
                        element.type = InsType.GIF
                        break;

                    case 'text/plain' || 'application/json':
                        element.type = InsType.TEXT;
                        break;

                    case 'mp3':
                        element.type = InsType.AUDIO;
                        break;

                    case 'mp4':
                        element.type = InsType.VIDEO;
                        break;

                    default:
                        element.type = InsType.OTHER;
                        break;
                }
            }
        });

        state.items = val.data.result;
    })
}

function sendAction(item: InscriptionItem) {
}

function setAction(item: InscriptionItem) {
    state.selectedItem = item
    switch (state.selectedItem.type) {
        case InsType.DOMAIN:
            state.setItems[1].isSelected = true
            state.setItems[0].isSelected = false
            break;

        case InsType.IMAGE:
            state.setItems[0].isSelected = true
            state.setItems[1].isSelected = false
            break;

        default:
            break;
    }
    state.isSetVisiable = true
}

function settingOkAction() {
    let selectAddr = state.selectedItem.detail.address
    signAsync(selectAddr).then(val => {
        service.avatarSet(state.selectedItem.number.toString(), selectAddr, state.selectedItem.domain, val).then(ret => {
            console.log(ret)
        })
    })
}

onBeforeMount(() => {
    state.addr = props.address ? props.address : '';
})

onMounted(() => {
    let localAddr = localStorage.getItem('bitcoin_address');
    // localAddr = 'bc1phcsyla7gd2jjgtkj5rz2e3j0m8xunppnx5ff8tqhmm92gy54u7dsu4h478';// //bc1phcsyla7gd2jjgtkj5rz2e3j0m8xunppnx5ff8tqhmm92gy54u7dsu4h478 //bc1pghl3vvk6ln7zl2u46gn8jvgghpkm93y837fclk3putmf3lrmf87sld3ehl
    if (localAddr) {
        state.addr = localAddr
    }

    state.setItems = [{
        id: 0,
        title: 'Set as avatar',
        subtitle: 'After setting, your avatar will display as this image.',
        isSelected: false,
    }, {
        id: 1,
        title: 'Set as primary domain name',
        subtitle: 'After setting up, your name will appear as your primary domain name instead of your wallet address.',
        isSelected: false,
    }]
})
</script>

<template>
    <div class="ins-container-view">
        <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
            <li v-for="(item, i) in state.items" :key="i" class="infinite-list-item">
                <div class="card-item">

                    <img class="pic-view" v-if="item.type == InsType.IMAGE" :src="item.detail.content" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.TEXT" src="../assets/pic_txt@2x.png" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.AUDIO" src="../assets/pic_mp3@2x.png" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.VIDEO" src="../assets/pic_mp4@2x.png" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.DOMAIN" :src="item.domain_img" alt=""
                        loading="lazy">
                    <img class="pic-view" v-else-if="item.type == InsType.OTHER" src="" alt="" loading="lazy">

                    <div class="flex-view">
                        <div class="name-view">{{ item.domain }}</div>
                        <div class="id-view">INS #{{ item.number }}</div>
                    </div>

                    <div class="flex-view">
                        <div class="send-view" @click="sendAction(item)">Send</div>
                        <div class="set-view" v-if="item.type == InsType.DOMAIN || item.type == InsType.IMAGE"
                            @click="setAction(item)">
                            <img src="../assets/icon_set@2x.png" alt="" width="16" height="16"> Set
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <el-dialog v-model="state.isSetVisiable" :show-close="true" :align-center="true" :width="500">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    <h4 :id="titleId" :class="titleClass">Setting</h4>
                </div>
            </template>

            <div>
                <div class="dia-id-view">Inscription #{{ state.selectedItem.number }}</div>
                <div class="set-as-view" v-for="(item, index) in state.setItems" :key="index"
                    :class="item.isSelected ? 'isSelect-view' : 'normal-view'">
                    <div>
                        <div class="dia-til-view">{{ item.title }}</div>
                        <div class="dia-sub-view">{{ item.subtitle }}</div>
                    </div>
                    <img v-if="item.isSelected" src="../assets/icon_check_full@2x.png" alt="" width="16" height="16">
                </div>
                <br>
                <div class="ok-btn" @click="settingOkAction">OK</div>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.ins-container-view {}

.infinite-list {
    margin: 0 auto;
    width: 100%;
    height: 1000px;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 3;
    padding: 5px;
    margin: 0;
    list-style: none;
}

.flex-view {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.pic-view {
    margin: 0 auto;
    width: 100%;
    min-width: 258px;
    min-height: 258px;
}

.id-view {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 17px;
    cursor: pointer;
    text-decoration: underline;
}

.send-view {
    width: 120px;
    height: 36px;
    background: #090C1D;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
}

.set-view {
    width: 54px;
    height: 36px;
    color: #090C1D;
    background: rgb(9, 12, 29, 0.1);
    border-radius: 24px;
    font-size: 12px;
    font-weight: 400;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
}

@media screen and (max-width: 767px) {
    .infinite-list-item {
        margin: 0 auto;
        width: 95%;
    }

    .card-item {
        width: 315px;
        padding: 10px;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 20px;
        background: #FFFFFF;
        border-radius: 10px;
        border: 1px solid #E4E4E4;
    }
}

@media screen and (min-width: 768px) {
    .card-item {
        width: 280px;
        padding: 10px;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 20px;
        background: #FFFFFF;
        border-radius: 10px;
        border: 1px solid #E4E4E4;
    }
}
</style>

<style scoped>
.dia-id-view {
    width: 153px;
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #090C1D;
    line-height: 22px;
}

.set-as-view {
    display: flex;
    justify-content: space-between;
    text-align: left;
    padding: 10px 20px;
    margin-top: 10px;
    background: #F6F6FC;
    border-radius: 4px;
    /* cursor: pointer; */
}

.dia-til-view {
    width: 376px;
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #2E2F3E;
    line-height: 20px;
}

.dia-sub-view {
    width: 410px;
    font-size: 12px;
    font-weight: 400;
    color: #A7A9BE;
    line-height: 17px;
}

.isSelect-view {
    border: 1px solid #4540D6;
}

.normal-view {
    border: 1px solid #A7A9BE;
}

.ok-btn {
    margin: 0 auto;
    width: 440px;
    height: 50px;
    background: #2E2F3E;
    border-radius: 4px;
    border: 1px solid #2E2F3E;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
}
</style>
