import axios from 'axios';

export const AxiosWrapper = ({
  baseUri,
  preFetch = (_, opts) => Promise.resolve(opts),
  postFetch = (...response) => Promise.resolve(...response),
}) => {
  const axiosClient = axios.create({
    baseURL: baseUri,
    validateStatus(status) {
      return status >= 200 && status < 300; // default
    },
  });

  axiosClient.preFetch = preFetch;
  axiosClient.postFetch = postFetch;

  const request = method => (uri, body) => {
    const prefetchFunc = axiosClient.preFetch(axiosClient, { method, uri, body });
    const execution = (opts = {}) => axiosClient[opts.method || method](
      opts.uri || uri, opts.body || body,
    ).then(axiosClient.postFetch);

    return prefetchFunc && prefetchFunc.then
      ? preFetch(axiosClient).then(execution)
      : execution(prefetchFunc);
  };

  return {
    axiosClient,
    statusHandler: {},
    setPreFetch: (newPreFetch) => {
      axiosClient.preFetch = newPreFetch;
      return newPreFetch;
    },
    setPostFetch: (newPostFetch) => {
      axiosClient.postFetch = newPostFetch;
      return newPostFetch;
    },
    get: request('get'),
    post: request('post'),
    delete: request('delete'),
    put: request('put'),
  };
};

export default AxiosWrapper;
