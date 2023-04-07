export const domain = {
    domainUrl: "http://172.16.10.26:80",
    // domainUrl: "http://137.184.180.14:80",

    // domainUrl: "https://btcdomains.io",
    domainImageUrl: "https://btcdomains.io/images/static-files/",

    extUrl: 'https://devnet.generative.xyz/generative',

    // https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
    // bc1puv6k8ht73ddwze0dmm9m8m6k44cnre7lzyxq84qlw9hkcjr5qv6sjqdjnc
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
}

export const ExtApi = {
    walletInfo: domain.extUrl + '/api/wallet/wallet-info?address=',
}