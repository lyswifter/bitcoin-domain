export const domain = {
    // domainUrl: "http://172.16.10.26:80",
    // domainUrl: "http://137.184.180.14:80",
    domainUrl: "https://btcdomains.io",
    domainImageUrl: "https://app.btcdomains.io/images/static-files/",
    domainImgUrl: "https://app.btcdomains.io/images/",
    extUrl: 'https://devnet.generative.xyz/generative',
}

export const Apis = {
    queryDomainUrl: domain.domainUrl + '/api/queryDomain',
    queryFee: domain.domainUrl + '/api/queryDomFee',
    queryWallet: domain.domainUrl + '/api/queryWallet',
    queryBalance: domain.domainUrl + '/api/queryBalance',
    queryConfirm: domain.domainUrl + '/api/confirm',
    lockFee: domain.domainUrl + '/api/lockFee',
    leavePage: domain.domainUrl + '/api/leavePage',
    avatarSet: domain.domainUrl + '/api/head/set',
    avatarGet: domain.domainUrl + '/api/head/get',
    queryInscriptions: domain.domainUrl + '/api/address/',
    exchange: domain.domainUrl + '/api/exchange',
}

export const ExtApi = {
    walletInfo: domain.extUrl + '/api/wallet/wallet-info?address=',
    submitTx: domain.extUrl + '/wallet/submit-tx',
    binanceApi: 'https://api.binance.com/api/v3/ticker/price?symbol=',
    coinApi: 'https://rest.coinapi.io/v1/exchangerate/BTC/USD',
    ordinalIns: 'https://ordinals.com/inscription/',
}

export const ExtKeys = {
    coinapiKey:  '0CCF7D74-25C9-451C-AD63-CB1EC1AB14F6' //'6097ECCC-363E-4CE6-9F5C-308C1BC69174' 
}

export const LoadingSvg = domain.domainImgUrl + 'loading.svg'