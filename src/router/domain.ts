export let domain = {
    // domainUrl: "http://172.16.10.26:8080/api/",
    // domainUrl: "http://18.232.119.81:8080/api/",
    domainUrl: "https://btcdomains.io",
}

export let Apis = {
    queryDomainUrl: domain.domainUrl + '/api/queryDomain',
    queryFee: domain.domainUrl + '/api/queryDomFee',
    queryWallet: domain.domainUrl + '/api/queryWallet',
    queryBalance: domain.domainUrl + '/api/queryBalance',
    queryConfirm: domain.domainUrl + '/api/confirm',
}