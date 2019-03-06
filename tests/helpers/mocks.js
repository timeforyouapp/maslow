export const FAKE_DOMAIN_TYPE = {
    success: 'success',
    fetching: 'fetching',
    error: 'error',
};

export const FAKE_TYPES = {
    setAll: 'setAll',
    set: 'set',
    clearState: 'clearState',
    getDetail: FAKE_DOMAIN_TYPE,
    getList: FAKE_DOMAIN_TYPE,
    save: FAKE_DOMAIN_TYPE,
    delete: FAKE_DOMAIN_TYPE,
    domainFetching: 'domainFetching',
    domainFetchSuccess: () => 'domainFetchSuccess',
    domainFetchError: 'domainFetchError',
};

export const FAKE_API = (j) => ({
    getDetail: j.fn(),
    getList: j.fn(),
    update: j.fn(),
    create: j.fn(),
    delete: j.fn(),
})