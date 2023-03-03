export let domain = {
    domainUrl: "http://172.16.10.26:8080/api/",
}

export let Apis = {
    upload: domain.domainUrl + 'upload',

    createWallet: domain.domainUrl + 'createWallet',

    getBal: domain.domainUrl + 'getBalance',

    receivedAddr: domain.domainUrl + 'getWalletReceiveAddress',

    recommandFee: domain.domainUrl + 'getRecommendedFee',

    queryFee: domain.domainUrl + 'createWalletAndQueryFee',
    
    mint: domain.domainUrl + 'mint',

    mintStatus: domain.domainUrl + 'queryTransferStatus',
}