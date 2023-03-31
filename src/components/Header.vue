<script setup lang="ts">
import ecc from '@bitcoinerlab/secp256k1';
import BIP32Factory from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { ethers } from "ethers";
import { reactive } from "vue";
import { GivingMsg, Links } from "../router/type";

import { ElMessage } from 'element-plus';

const defaultPath = "m/86'/0'/0'/0/0";
const subSLen = 8;

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

const toXOnly = (pubKey: Buffer) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

let state = reactive({ account: '', bitcoinAddr: '', shortAddr: '' })

function reloadPage() {
  location.reload();
}

async function connectAction() {
  if (state.bitcoinAddr) {
    return
  }

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
    state.shortAddr = state.bitcoinAddr.substring(0, subSLen) + '...' + state.bitcoinAddr.substring(state.bitcoinAddr.length - subSLen, state.bitcoinAddr.length);
  } else {
    ElMessage.error("generate your bitcoin address failed, please retry.")
  }
}
</script>

<template>
  <div class="header-container">
    <nav class="navbar navbar-expand-md bg-body-tertiary">
      <button class="navbar-toggler" style="box-shadow: none;" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
        aria-label="Toggle navigation">
        <img src="../assets/icon_menu@2x.png" alt="" width="24" height="24">
      </button>

      <a class="navbar-brand brand-mobile" href="" @click="reloadPage">
        <img src="../assets/logo_nav@2x.png" alt="bitcoin_domain" width="150" height="30">
      </a>

      <img class="avatar-icon-view" src="../assets/icon_btc@2x.png" style="margin-right: 10px;" alt="" width="30"
        height="30">

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

          <div class="connect-btn" :class="state.bitcoinAddr ? 'connect-btn-selected' : 'connect-btn-normal'" @click="connectAction">
            <img v-if="state.bitcoinAddr" src="../assets/icon_btc@2x.png" alt="" width="30" height="30">
            {{ state.shortAddr ? state.shortAddr : "Connect Wallet" }}
          </div>
        </div>
      </div>
    </nav>

    <div class="slogon-view">
      <img class="solgon-title-view" src="../assets/logo@2x.png" alt="">
      <div class="solgon-content-view">Search domain name or Register your domain name</div>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  background-image: linear-gradient(180deg, #513eff 0%, #52e5ff 100%);
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

.slogon-view {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}

.solgon-title-view {
  margin-top: 60px;
  height: 60px;
}

.solgon-content-view {
  height: 25px;
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 25px;
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

.connect-btn-normal {
  width: 132px;
  background: #FFFFFF;
  color: #4540D6;
}

.connect-btn-selected {
  width: 170px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  border: 1px solid #FFFFFF;
  color: white;
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
