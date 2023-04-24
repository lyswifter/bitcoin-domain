<script setup lang="ts">
import ecc from '@bitcoinerlab/secp256k1';
import BIP32Factory from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { ElMessage } from 'element-plus';
import { ethers } from "ethers";
import { onBeforeMount, onMounted, reactive } from "vue";
import { domain } from "../router/domain";
import service from "../router/service";
import { GivingMsg, Links } from "../router/type";
import { shortenAddr, toXOnly } from "../router/util";

const defaultPath = "m/86'/0'/0'/0/0";
const subSLen = 8;

const menuIcon = domain.domainImgUrl + 'assets/icon_menu@2x.png';
const closeIcon = domain.domainImgUrl + 'assets/icon_close_nav@2x.png';
const avatarIcon = domain.domainImgUrl + 'assets/avater_def@2x.png';

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

const props = defineProps({
  avatarAddr: String,
})

let state = reactive({ isExpand: false, account: '', bitcoinAddr: '', shortAddr: '', avatar: '' })

const emit = defineEmits({
  connectParentAction(addr: string) { },
})

function doDisconnect() {
  localStorage.clear();
  state.account = '';
  state.bitcoinAddr = '';
  state.shortAddr = '';
}

defineExpose({
  doDisconnect,
  exportPrivateKey,
})

function reloadPage() {
  location.reload();
}

function expandAction() {
  state.isExpand = !state.isExpand
}

async function generateBitcoinAddr() {
  if (typeof window.ethereum === 'undefined') {
    alert("Matamask is not installed!")
    return
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  state.account = account

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

  // let isVerify = ethers.verifyMessage(GivingMsg, sig)

  const seed = ethers.toUtf8Bytes(
    ethers.keccak256(ethers.toUtf8Bytes(sig))
  );

  let root = bip32.fromSeed(Buffer.from(seed.slice(2)))

  const taprootChild = root.derivePath(defaultPath);

  const privKey = taprootChild.privateKey?.toString('hex')
  const pubKey = taprootChild.publicKey;

  const { address: taprootAddress } = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(pubKey),
  });

  if (taprootAddress) {
    state.bitcoinAddr = taprootAddress
    state.shortAddr = shortenAddr(state.bitcoinAddr, subSLen);

    localStorage.setItem('bitcoin_address', taprootAddress)
    localStorage.setItem('public_key', pubKey.toString('hex'))

    loadavatar(taprootAddress)
  } else {
    ElMessage.error("generate your bitcoin address failed, please retry.")
  }
}

async function exportPrivateKey() {
  if (typeof window.ethereum === 'undefined') {
    alert("Matamask is not installed!")
    return
  }

  let provider = new ethers.BrowserProvider(window.ethereum)

  let signer = await provider.getSigner();

  let sig = await signer.signMessage(GivingMsg);

  const seed = ethers.toUtf8Bytes(
    ethers.keccak256(ethers.toUtf8Bytes(sig))
  );

  let root = bip32.fromSeed(Buffer.from(seed.slice(2)));

  const taprootChild = root.derivePath(defaultPath);

  const privKey = taprootChild.privateKey?.toString('hex');

  return privKey
}

function connectAction() {
  if (state.bitcoinAddr) {
    emit('connectParentAction', state.bitcoinAddr)
  } else {
    generateBitcoinAddr()
  }
}

function loadavatar(addr: string) {
  service.avatarGet(addr).then(avatarRet => {
    if (avatarRet.data.length > 0) {
      state.avatar = avatarRet.data[0].content_url
    }
  });
}

onBeforeMount(() => {
  state.avatar = props.avatarAddr ? props.avatarAddr : avatarIcon
})

onMounted(() => {
  let addr = localStorage.getItem('bitcoin_address')
  if (addr) {
    state.bitcoinAddr = addr;
    state.shortAddr = shortenAddr(addr, subSLen);

    loadavatar(addr)
  }
})
</script>

<template>
  <div class="header-container">
    <nav class="navbar navbar-expand-md bg-body-tertiary">
      <button class="navbar-toggler" style="box-shadow: none;" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
        aria-label="Toggle navigation" @click="expandAction">
        <img :src="state.isExpand ? closeIcon : menuIcon" alt="" width="24" height="24">
      </button>

      <a class="navbar-brand brand-mobile" href="" @click="reloadPage">
        <img src="../assets/logo_nav@2x.png" alt="bitcoin_domain" width="150" height="30">
      </a>

      <div class="avatar-icon-view">
        <img v-if="state.bitcoinAddr" :src="state.avatar ? state.avatar : avatarIcon"
          style="margin-right: 10px;border-radius: 15px;" alt="" width="30" height="30" @click="connectAction">
        <div v-else class="connect-btn connect-btn-normal-mobile" @click="connectAction">Wallet</div>
      </div>

      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" aria-current="page" style="color: white;" :href="Links.doc" target="_blank">Document</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" style="color: white;" :href="Links.trees" target="_blank">Exchange</a>
            </li>
          </ul>

          <div class="connect-btn" :class="state.bitcoinAddr ? 'connect-btn-selected' : 'connect-btn-normal'"
            @click="connectAction">
            <img v-if="state.bitcoinAddr" :src="state.avatar ? state.avatar : avatarIcon" alt=""
              style="border-radius: 15px;" width="30" height="30">
            {{ state.shortAddr ? state.shortAddr : "Connect Wallet" }}
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.header-container {
  background-image: linear-gradient(180deg, #513eff 0%, #513eff 100%);
}

.logo-view {
  margin-top: 10px;
}

.doc-link-view {
  height: 30px;
  border-radius: 15px;
  border-color: #D8D8D8;
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 30px;
  cursor: pointer;
  margin-top: 10px;
}

.connect-btn {
  height: 40px;
  border-radius: 20px;
  padding-left: 5px;
  padding-right: 5px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
}

.connect-btn-normal-mobile {
  background: #FFFFFF;
  color: #4540D6;
}

.connect-btn-normal {
  background: #FFFFFF;
  color: #4540D6;
}

.connect-btn-selected {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #FFFFFF;
  color: #FFFFFF;
}

@media screen and (max-width: 767px) {
  .navbar-web {
    display: none;
  }
}

@media screen and (min-width: 768px) {
  .avatar-icon-view {
    display: none;
  }
}
</style>
