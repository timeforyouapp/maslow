import axios from 'axios';

export const AxiosWrapper = ({
    baseUri,
    preFetch = (_, opts) => Promise.resolve(opts),
    postFetch = (...response) => Promise.resolve(...response),
}) => {
    const axiosClient = axios.create({
        baseURL: baseUri
    });

    const request = (method) => (uri, body) => {
        const _preFetch = preFetch(axiosClient, { method, uri, body });
        const execution = (opts = {}) => {
            return axiosClient[opts.method || method](opts.uri || uri, opts.body || body).then(postFetch);
        };

        return _preFetch && _preFetch.then ? preFetch(axiosClient).then(execution) : execution(_preFetch);
    };

    return {
        __axios__: axiosClient,
        get: request('get'),
        post: request('post'),
        delete: request('delete'),
        put: request('put'),
    };
};

export default AxiosWrapper;