
export interface GasInfo {
    name: string;
    isAvailable: boolean;
    addr: string;
    midAddr: string;
    walletId: string;
    gasFee: string;
    registerFee: string;
    serviceFee: string;
    balance: string;
    total: string;
    years: number;
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

export interface DomainHistory {
    date: string;
    records: string[];
}

export interface PersonInfo {
    id: number;
    inscribeId: string;
    address: string;
    contentUrl: string;
    contentType: string;
    domain: string;
    createTime: string;
    updateTime: string;
}

export const Types = {
    precision: 6,
    queryBalInterval: 10000,
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

export const Links = {
    doc: "https://docs.btcdomains.io",
    openOrdex: "https://btcdomains.click/openordex-open-2f8217",
    magicEden: "https://magiceden.io/ordinals/marketplace/btcdomain",

    twitter: "http://twitter.com/btcdomain_btc",
    trees: "http://twitter.com/btcdomain_btc",
    github: "https://github.com/btcdomain",
    medium: "http://medium.com/@btcdomain",
}

export const GivingMsg = "Signing this to get a bitcoin key-pair --";