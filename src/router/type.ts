export interface GasInfo {
    name: string;
    isAvailable: boolean;
    addr: string;
    gasFee: string;
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