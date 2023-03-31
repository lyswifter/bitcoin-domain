export let domain = {
    // domainUrl: "http://172.16.10.26:8080",
    // domainUrl: "http://137.184.180.14:80",

    domainUrl: "https://btcdomains.io",
    domainImageUrl: "https://btcdomains.io/images/static-files/",
}

export let Apis = {
    queryDomainUrl: domain.domainUrl + '/api/queryDomain',

    queryFee: domain.domainUrl + '/api/queryDomFee',

    queryWallet: domain.domainUrl + '/api/queryWallet',

    queryBalance: domain.domainUrl + '/api/queryBalance',

    queryConfirm: domain.domainUrl + '/api/confirm',

    lockFee: domain.domainUrl + '/api/lockFee',

    leavePage: domain.domainUrl + '/api/leavePage',

    avatarSet: domain.domainUrl + '/api/head/set',

    avatarGet: domain.domainUrl + '/api/head/get',
}