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

export const Types = {
    precision: 6,
    queryBalInterval: 10000,
};

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