<script setup lang="ts">
import ecc from '@bitcoinerlab/secp256k1';
import BIP32Factory from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { ElMessage } from 'element-plus';
import { ethers } from "ethers";
import { onMounted, reactive } from "vue";
import { GivingMsg, Links } from "../router/type";

const defaultPath = "m/86'/0'/0'/0/0";
const subSLen = 8;

const menuIcon = '../../src/assets/icon_menu@2x.png';
const closeIcon = '../../src/assets/icon_close_nav@2x.png';

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

const toXOnly = (pubKey: Buffer) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

const shortenAddr = (addr: string) =>
addr.substring(0, subSLen) + '...' + addr.substring(addr.length - subSLen, addr.length)

let state = reactive({ isExpand: false, account: '', bitcoinAddr: '', shortAddr: '' })

const emit = defineEmits({
  connectParentAction(addr: string) { },
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
  console.log(account)

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

  console.log(sig)

  let isVerify = ethers.verifyMessage(GivingMsg, sig)

  console.log(isVerify)

  const seed = ethers.toUtf8Bytes(
    ethers.keccak256(ethers.toUtf8Bytes(sig))
  );

  let root = bip32.fromSeed(Buffer.from(seed.slice(2)))

  const taprootChild = root.derivePath(defaultPath);

  const { address: taprootAddress } = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(taprootChild.publicKey),
  });

  if (taprootAddress) {
    console.log("taprootChild: " + taprootChild)
    console.log("address: " + taprootAddress)

    state.bitcoinAddr = taprootAddress
    state.shortAddr = shortenAddr(state.bitcoinAddr);

    localStorage.setItem('bitcoin_address', taprootAddress)
  } else {
    ElMessage.error("generate your bitcoin address failed, please retry.")
  }
}

function connectAction() {
  if (state.bitcoinAddr) {
    emit('connectParentAction', state.bitcoinAddr)
  } else {
    generateBitcoinAddr()
  }
}

onMounted(() => {
  if (localStorage.getItem('bitcoin_address')) {
    let localAddr = localStorage.getItem('bitcoin_address')!;
    state.bitcoinAddr = localAddr;
    state.shortAddr = shortenAddr(localAddr);
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
        <img v-if="state.bitcoinAddr" src="../assets/icon_btc@2x.png" style="margin-right: 10px;" alt="" width="30"
          height="30" @click="connectAction">
        <div v-else class="connect-btn connect-btn-normal-mobile" @click="connectAction">Wallet</div>
      </div>

      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" aria-current="page" style="color: white;" :href="Links.doc">Document</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" style="color: white;" :href="Links.magicEden">Exchange</a>
            </li>
          </ul>

          <div class="connect-btn" :class="state.bitcoinAddr ? 'connect-btn-selected' : 'connect-btn-normal'"
            @click="connectAction">
            <img v-if="state.bitcoinAddr" src="../assets/icon_btc@2x.png" alt="" width="30" height="30">
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
  /* 52e5ff */
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
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
}

.connect-btn-normal-mobile {
  width: 66px;
  background: #FFFFFF;
  color: #4540D6;
}

.connect-btn-normal {
  width: 132px;
  background: #FFFFFF;
  color: #4540D6;
}

.connect-btn-selected {
  width: 170px;
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
