
export interface GasInfo {
    name: string;
    isAvailable: boolean;
    addr: string;
    midAddr: string;
    walletId: string;
    gasFee: string;
    registerFee: string;
    serviceFee: string;
    origin_service_fee: string;
    balance: string;
    total: string;
    years: number;
    switchCurr: string;
    switchAddr: string;
}

export interface DomainInfo {
    name: string;
    owner: string;
    create: string;
    registration: string;
    expire: string;
    inscriptionId: string;
    isAvailable: boolean;
}

export interface Domain {
    cost_fee: string;
    create_time: string;
    dom_name: string;
    dom_state: number;
    dom_type: string;
    expire_time: string;
    fee_rate: number;
    img_url: string;
    inscribe_id: string;
    out_wallet: string;
    owner_address: string;
    tx_hash: string;
    update_time: string;
    wallet_id: string;
    is_available: boolean;
    short_ins_id: string;
    short_owner_addr: string;
}

export interface DomainHistory {
    date: string;
    records: string[];
}

export interface PersonInfo {
    s_id: number;
    address: string;
    short_addr: string;
    content_type: string;
    content_url: string;
    domain: string;
    inscribe_id: string;
    create_time: string;
    update_time: string;
}

export const Types = {
    precision: 6,
    queryBalInterval: 10000,
    resetRatioInterval: 10000, //1200000
    countDownInterval: 1000,
};

export interface InscriptionDetail {
    address: string;
    content: string;
    content_body: string;
    content_length: number;
    content_type: string;
    genesis_transaction: string;
    location: string;
    offset: number;
    output: string;
    output_value: number;
    preview: string;
    timestamp: string;
}

export interface InscriptionItem {
    id: string;
    domain: string;
    domain_img: string;
    num: number;
    number: number;
    state: string;
    type: InsType;
    detail: InscriptionDetail;
}

export interface SettingItem {
    id: number;
    title: string;
    subtitle: string;
    isSelected: boolean;
}

export enum InsType {
    TEXT,
    IMAGE,
    GIF,
    AUDIO,
    VIDEO,
    DOMAIN,
    OTHER,
}

export interface Ratio {
    price: string;
    symbol: string;
}

export interface History {
    address: string;
    amount: string;
    date: string;
    symbol: string;
    time: number;
    txid: string;
}

export interface PaymentMethod {
    name: string;
    icon: string;
    desc: string;
    bal: string;
}

export interface PayParams {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: string;
    toAmount: string;
    fromNetwork: string;
    toNetwork: string;
    receive_address: string;
}

export interface PayinParams {
    flow: string;
    fromAmount: string;
    fromCurrency: string;
    fromNetwork: string;
    id: string;
    payinAddress: string;
    payoutAddress: string;
    payoutExtraId: string;
    refundAddress: string;
    refundExtraId: string;
    toAmount: string;
    toCurrency: string;
    toNetwork: string;
    type: string;
    validUntil: string;
}

export interface DomainLink {
    type: string;
    domain: string;
    obj_ins_id: string;
    public_key: string;
    sig: string;
}

export const Links = {
    doc: "https://docs.btcdomains.io",
    openOrdex: "https://btcdomains.click/openordex-open-2f8217",
    magicEden: "https://magiceden.io/ordinals/marketplace/btcdomain",

    twitter: "http://twitter.com/btcdomain_btc",
    trees: "https://linktr.ee/btcdomain",
    github: "https://github.com/btcdomain",
    discord: 'https://www.discord.gg/btcdomain',
    medium: "http://medium.com/@btcdomain",
}

export const GivingMsg = "Welcome to the secure sites, btcdomains.io and btcwallet.network! Please ensure you are visiting the correct URLs: btcdomains.io and btcwallet.network. Engaging in transactions or signing activities outside of these official sites may expose your private key and put your security at risk.";

export const MinSats = 1000;

export const rate = 100000000;